import { generateSymmetricKey } from './keys';
import {
  createShareablePayload,
  decryptShareablePayload,
  type ShareablePayload,
} from './encryption';
import type { AssetVersionInputDTO } from '@/lib/api/models/dto/Asset';

export interface EncryptedAssetVersion {
  versionName: string;
  encryptedData: ArrayBuffer;
  selfEncryption: AssetVersionInputDTO;
  serverEncryption: AssetVersionInputDTO;
}

/**
 * AssetEncryption - encrypt asset data and generate encryption metadata
 */
export class AssetEncryption {
  /**
   * Encrypt multiple versions of an asset using a shared symmetric key
   * All versions of the same asset will use the same symmetric key
   *
   * @param versions - Array of file versions with their names
   * @param userPublicKey - User's public key (base64 string, SPKI format from current session)
   * @param userPrivateSignature - User's signature private key (CryptoKey) for signing
   * @param userPublicSignature - User's public signature key (base64 string, SPKI format from current session)
   * @param serverPublicKey - Server's public key (base64 string) for server-side decryption
   * @param protocolSalt - Protocol salt from server (base64 string)
   */
  static async encryptAssetVersions(
    versions: { file: File; versionName: string }[],
    userPublicKey: string,
    userPrivateSignature: CryptoKey,
    userPublicSignature: string,
    serverPublicKey: string,
    protocolSalt: string
  ): Promise<EncryptedAssetVersion[]> {
    console.debug('AssetEncryption.encryptAssetVersions called', {
      versionCount: versions.length,
      versionNames: versions.map((v) => v.versionName),
    });

    // Generate a single symmetric key for all versions of this asset
    const symmetricKey = await generateSymmetricKey();

    // Export the symmetric key to log its value for debugging
    const symmetricKeyRaw = await crypto.subtle.exportKey('raw', symmetricKey);
    const symmetricKeyBytes = new Uint8Array(symmetricKeyRaw);
    console.debug(
      'AssetEncryption.encryptAssetVersions symmetric key generated (shared for all versions)',
      {
        keyLength: symmetricKeyBytes.length,
        keyPreview: Array.from(symmetricKeyBytes.slice(0, 8))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(' '),
      }
    );

    const encryptedVersions: EncryptedAssetVersion[] = [];

    // Encrypt each version with the same symmetric key
    for (const version of versions) {
      console.debug('AssetEncryption.encryptAssetVersions processing version', {
        fileName: version.file.name,
        versionName: version.versionName,
        fileSize: version.file.size,
      });

      const fileData = await this.readFileAsArrayBuffer(version.file);
      console.debug(
        'AssetEncryption.encryptAssetVersions file read complete, size:',
        fileData.byteLength
      );

      const encryptedData = await this.encryptFileData(fileData, symmetricKey);
      console.debug(
        'AssetEncryption.encryptAssetVersions file encryption complete, encrypted size:',
        encryptedData.byteLength
      );

      const selfEncryption = await this.createEncryptionDetails(
        symmetricKey,
        version.versionName,
        userPublicKey,
        userPrivateSignature,
        userPublicSignature,
        protocolSalt
      );
      const serverEncryption = await this.createEncryptionDetails(
        symmetricKey,
        version.versionName,
        serverPublicKey,
        userPrivateSignature,
        userPublicSignature,
        protocolSalt
      );

      console.debug(
        'AssetEncryption.encryptAssetVersions encryption details created',
        {
          versionName: version.versionName,
          selfEncryption:
            selfEncryption.senderEncryptedSecret.substring(0, 20) + '...',
          serverEncryption:
            serverEncryption.senderEncryptedSecret.substring(0, 20) + '...',
        }
      );

      encryptedVersions.push({
        versionName: version.versionName,
        encryptedData,
        selfEncryption,
        serverEncryption,
      });
    }

    console.debug('AssetEncryption.encryptAssetVersions completed', {
      totalVersions: encryptedVersions.length,
    });

    return encryptedVersions;
  }

  static generateGlobalIdentifier(): string {
    return crypto.randomUUID();
  }

  // Private helpers
  private static async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static async encryptFileData(
    fileData: ArrayBuffer,
    symmetricKey: CryptoKey
  ): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      symmetricKey,
      fileData
    );

    // Combine IV and encrypted data
    const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
    combinedData.set(iv);
    combinedData.set(new Uint8Array(encryptedData), iv.length);

    return combinedData.buffer;
  }

  private static async createEncryptionDetails(
    symmetricKey: CryptoKey,
    versionName: string,
    targetPublicKey: string,
    senderPrivateSignature: CryptoKey,
    senderPublicSignature: string,
    protocolSalt: string
  ): Promise<AssetVersionInputDTO> {
    // Export the symmetric key to raw bytes
    const symmetricKeyBytes = await crypto.subtle.exportKey(
      'raw',
      symmetricKey
    );

    // Create shareable payload using ECDH encryption with protocol salt
    const payload = await createShareablePayload(
      new Uint8Array(symmetricKeyBytes),
      targetPublicKey,
      senderPrivateSignature,
      senderPublicSignature,
      protocolSalt
    );

    return {
      versionName,
      senderEncryptedSecret: payload.ciphertext,
      ephemeralPublicKey: payload.ephemeralPublicKey,
      publicSignature: payload.signature,
    };
  }

  /**
   * Decrypt an encrypted secret to retrieve the raw symmetric key
   *
   * This method takes the encryption metadata from an asset version and decrypts
   * the symmetric key that was used to encrypt the asset data.
   *
   * @param encryptedSecret - The encrypted symmetric key (base64 string, ciphertext)
   * @param ephemeralPublicKey - The ephemeral public key used in encryption (base64 string)
   * @param publicSignature - The signature (base64 string)
   * @param senderPublicSignature - The sender's public signature key (base64 string, SPKI format)
   * @param receiverPrivateKey - Receiver's private key (CryptoKey) for decryption
   * @param receiverPublicKey - Receiver's public key (base64 string, SPKI format)
   * @param protocolSalt - Protocol salt (base64 string)
   * @returns The decrypted symmetric key as Uint8Array
   */
  static async decryptSecret(
    encryptedSecret: string,
    ephemeralPublicKey: string,
    publicSignature: string,
    senderPublicSignature: string,
    receiverPrivateKey: CryptoKey,
    receiverPublicKey: string,
    protocolSalt: string
  ): Promise<Uint8Array> {
    console.debug('AssetEncryption.decryptSecret called');

    // Build the shareable payload from the encryption metadata
    const payload: ShareablePayload = {
      ephemeralPublicKey,
      ciphertext: encryptedSecret,
      signature: publicSignature,
    };

    // Decrypt using the primitive
    const symmetricKeyBytes = await decryptShareablePayload(
      payload,
      receiverPrivateKey,
      receiverPublicKey,
      senderPublicSignature,
      protocolSalt
    );

    console.debug('AssetEncryption.decryptSecret completed', {
      symmetricKeyLength: symmetricKeyBytes.length,
      keyPreview: Array.from(symmetricKeyBytes.slice(0, 8))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' '),
    });

    return symmetricKeyBytes;
  }

  /**
   * Decrypt asset data using the symmetric key
   *
   * @param encryptedData - The encrypted asset data (with IV prepended)
   * @param symmetricKey - The decrypted symmetric key bytes
   * @returns The decrypted asset data as ArrayBuffer
   */
  static async decryptData(
    encryptedData: Uint8Array,
    symmetricKey: Uint8Array
  ): Promise<ArrayBuffer> {
    console.debug('AssetEncryption.decryptData called', {
      encryptedDataLength: encryptedData.length,
      symmetricKeyLength: symmetricKey.length,
    });

    // Extract IV (first 12 bytes)
    const iv = encryptedData.slice(0, 12);

    // Extract ciphertext (remaining bytes)
    const ciphertext = encryptedData.slice(12);

    console.debug('AssetEncryption.decryptData extracted IV and ciphertext', {
      ivLength: iv.length,
      ciphertextLength: ciphertext.length,
    });

    try {
      // Import the symmetric key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        symmetricKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        ciphertext
      );

      console.debug('AssetEncryption.decryptData completed', {
        decryptedLength: decrypted.byteLength,
      });

      return decrypted;
    } catch (error) {
      console.error('AssetEncryption.decryptData failed', {
        error,
        errorName: (error as Error)?.name,
        errorMessage: (error as Error)?.message,
        ivLength: iv.length,
        ciphertextLength: ciphertext.length,
        symmetricKeyLength: symmetricKey.length,
      });
      throw new Error(
        `Asset data decryption failed: ${(error as Error)?.message || error}`
      );
    }
  }
}
