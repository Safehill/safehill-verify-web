import { generateSymmetricKey, cryptoKeyToBase64 } from './keys';
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
   */
  static async encryptAsset(
    file: File,
    userPublicKey: string,
    serverPublicKey: string
  ): Promise<EncryptedAssetVersion[]> {
    console.debug('AssetEncryption.encryptAsset called', {
      fileName: file.name,
      fileSize: file.size,
      userPublicKey: userPublicKey.substring(0, 20) + '...',
      serverPublicKey: serverPublicKey.substring(0, 20) + '...',
    });

    const fileData = await this.readFileAsArrayBuffer(file);
    console.debug(
      'AssetEncryption.encryptAsset file read complete, size:',
      fileData.byteLength
    );

    const versionName = 'original'; // Only generate "original" version for now

    // Always encrypt
    const symmetricKey = await generateSymmetricKey();
    console.debug('AssetEncryption.encryptAsset symmetric key generated');

    const encryptedData = await this.encryptFileData(fileData, symmetricKey);
    console.debug(
      'AssetEncryption.encryptAsset file encryption complete, encrypted size:',
      encryptedData.byteLength
    );

    const selfEncryption = await this.createEncryptionDetails(
      symmetricKey,
      versionName,
      userPublicKey,
      'self'
    );
    const serverEncryption = await this.createEncryptionDetails(
      symmetricKey,
      versionName,
      serverPublicKey,
      'server'
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
    keyPrefix: string
  ): Promise<AssetVersionInputDTO> {
    const symmetricKeyBase64 = await cryptoKeyToBase64(symmetricKey);

    // TODO: Implement ECDH encryption with target's public key
    return {
      versionName,
      senderEncryptedSecret: `${keyPrefix}_encrypted_${symmetricKeyBase64.substring(
        0,
        20
      )}`,
      ephemeralPublicKey: `${keyPrefix}_ephemeral_key`,
      publicSignature: `${keyPrefix}_signature`,
    };
  }
}
