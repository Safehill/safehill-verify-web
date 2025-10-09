import { generateSymmetricKey, derivePublicKeyFromPrivate } from './keys';
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
   * Encrypt a file for collection storage
   * Always encrypts - conditional logic will be added later
   *
   * @param file - The file to encrypt
   * @param userPrivateKey - User's private key (CryptoKey) for ECDH key agreement
   * @param userSignaturePrivateKey - User's signature private key (CryptoKey) for signing
   * @param serverPublicKey - Server's public key (base64 string) for server-side decryption
   * @param protocolSalt - Protocol salt from server (base64 string)
   */
  static async encryptAsset(
    file: File,
    userPrivateKey: CryptoKey,
    userSignaturePrivateKey: CryptoKey,
    serverPublicKey: string,
    protocolSalt: string
  ): Promise<EncryptedAssetVersion[]> {
    console.debug('AssetEncryption.encryptAsset called', {
      fileName: file.name,
      fileSize: file.size,
    });

    // Derive user's public key from private key for self-encryption
    const userPublicKey = await derivePublicKeyFromPrivate(userPrivateKey);
    console.debug('AssetEncryption.encryptAsset user public key derived');

    const fileData = await this.readFileAsArrayBuffer(file);
    console.debug(
      'AssetEncryption.encryptAsset file read complete, size:',
      fileData.byteLength
    );

    const versionName = 'original'; // Only generate "original" version for now

    // Always encrypt
    const symmetricKey = await generateSymmetricKey();

    // Export the symmetric key to log its value for debugging
    const symmetricKeyRaw = await crypto.subtle.exportKey('raw', symmetricKey);
    const symmetricKeyBytes = new Uint8Array(symmetricKeyRaw);
    console.debug('AssetEncryption.encryptAsset symmetric key generated', {
      keyLength: symmetricKeyBytes.length,
      keyPreview: Array.from(symmetricKeyBytes.slice(0, 8))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' '),
    });

    const encryptedData = await this.encryptFileData(fileData, symmetricKey);
    console.debug(
      'AssetEncryption.encryptAsset file encryption complete, encrypted size:',
      encryptedData.byteLength
    );

    const selfEncryption = await this.createEncryptionDetails(
      symmetricKey,
      versionName,
      userPublicKey,
      userSignaturePrivateKey,
      protocolSalt
    );
    const serverEncryption = await this.createEncryptionDetails(
      symmetricKey,
      versionName,
      serverPublicKey,
      userSignaturePrivateKey,
      protocolSalt
    );

    console.debug('AssetEncryption.encryptAsset encryption details created', {
      versionName,
      selfEncryption:
        selfEncryption.senderEncryptedSecret.substring(0, 20) + '...',
      serverEncryption:
        serverEncryption.senderEncryptedSecret.substring(0, 20) + '...',
    });

    return [
      {
        versionName,
        encryptedData,
        selfEncryption,
        serverEncryption,
      },
    ];
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
    senderSignaturePrivateKey: CryptoKey,
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
      senderSignaturePrivateKey,
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
   * @param senderPublicSignature - The sender's public signature key (base64 string)
   * @param receiverPrivateKey - Receiver's private key (CryptoKey) for decryption
   * @param protocolSalt - Protocol salt (base64 string)
   * @returns The decrypted symmetric key as Uint8Array
   */
  static async decryptSecret(
    encryptedSecret: string,
    ephemeralPublicKey: string,
    publicSignature: string,
    senderPublicSignature: string,
    receiverPrivateKey: CryptoKey,
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
