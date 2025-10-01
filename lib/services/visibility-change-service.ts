import type {
  CollectionOutputDTO,
  CollectionChangeVisibilityDTO,
  CollectionAssetDecryptionDTO,
  CollectionAssetDTO,
  Visibility,
} from '@/lib/api/models/dto/Collection';
import type {
  AssetVersionInputDTO,
  AssetVersionOutputDTO,
} from '@/lib/api/models/dto/Asset';
import { AssetEncryption } from '@/lib/crypto/asset-encryption';
import { createShareablePayload } from '@/lib/crypto/encryption';

/**
 * VisibilityChangeService - handles changing collection visibility
 *
 * This service is responsible for re-encrypting asset decryption keys with the server's
 * public key when changing a collection's visibility. Unlike AssetUploadService, this
 * service does NOT upload any data - it only re-encrypts existing decryption keys.
 *
 * Flow:
 * 1. Asset was uploaded with symmetric key encrypted for user (encryptedSecret)
 * 2. To change visibility, we decrypt that symmetric key using user's private key
 * 3. We re-encrypt the same symmetric key with server's public key
 * 4. Server can now decrypt and serve the asset when needed
 */
export class VisibilityChangeService {
  /**
   * Prepare visibility change request for a collection
   *
   * Takes a collection and prepares the encrypted asset keys for the server.
   * This allows the server to decrypt and serve assets when the collection
   * visibility changes to confidential or public.
   *
   * @param collection - The collection with all its assets
   * @param newVisibility - The new visibility setting ('confidential' or 'public')
   * @param userPrivateKey - User's private key (CryptoKey) for decryption
   * @param userPrivateSignature - User's private signature key (CryptoKey) for signing
   * @param serverPublicKey - Server's public key for encryption (base64 string)
   * @param protocolSalt - Protocol salt from server (base64 string)
   * @returns The request DTO ready to send to the change-visibility API
   */
  static async prepareVisibilityChange(
    collection: CollectionOutputDTO,
    newVisibility: Visibility,
    userPrivateKey: CryptoKey,
    userPrivateSignature: CryptoKey,
    serverPublicKey: string,
    protocolSalt: string
  ): Promise<CollectionChangeVisibilityDTO> {
    console.debug('VisibilityChangeService.prepareVisibilityChange started', {
      collectionId: collection.id,
      collectionName: collection.name,
      currentVisibility: collection.visibility,
      newVisibility,
      assetCount: collection.assets.length,
    });

    // Re-encrypt all asset decryption keys for the server
    const assetDecryptionDetails = await this.encryptAssetKeysForServer(
      collection.assets,
      userPrivateKey,
      userPrivateSignature,
      serverPublicKey,
      protocolSalt
    );

    console.debug('VisibilityChangeService.prepareVisibilityChange completed', {
      assetDecryptionDetailsCount: assetDecryptionDetails.length,
    });

    return {
      visibility: newVisibility,
      assetDecryptionDetails,
      deleteOrphanedVersions: false,
    };
  }

  /**
   * Re-encrypt asset decryption keys for the server
   *
   * Orchestrates the re-encryption of all asset versions in the collection.
   * For each asset and each of its versions:
   * 1. Decrypt the symmetric key using user's private key
   * 2. Re-encrypt it with server's public key
   *
   * @param assets - The assets in the collection
   * @param userPrivateKey - User's private key (CryptoKey) for decryption
   * @param userPrivateSignature - User's private signature key (CryptoKey) for signing
   * @param serverPublicKey - Server's public key (base64 string)
   * @param protocolSalt - Protocol salt (base64 string)
   * @returns Array of asset decryption details for the API
   */
  private static async encryptAssetKeysForServer(
    assets: CollectionAssetDTO[],
    userPrivateKey: CryptoKey,
    userPrivateSignature: CryptoKey,
    serverPublicKey: string,
    protocolSalt: string
  ): Promise<CollectionAssetDecryptionDTO[]> {
    console.debug('VisibilityChangeService.encryptAssetKeysForServer started', {
      assetCount: assets.length,
    });

    const decryptionDetails: CollectionAssetDecryptionDTO[] = [];

    for (const asset of assets) {
      console.debug(
        'VisibilityChangeService.encryptAssetKeysForServer processing asset',
        {
          globalIdentifier: asset.globalIdentifier,
          name: asset.name,
        }
      );

      // Process all versions of this asset
      // Note: CollectionAssetDTO only includes lowResolutionVersion
      // TODO: If we need all versions, we'll need to fetch full asset details
      const versionDecryptionDetails: AssetVersionInputDTO[] = [];

      if (asset.lowResolutionVersion) {
        const serverEncryptedKey = await this.reEncryptKeyForServer(
          asset.lowResolutionVersion,
          userPrivateKey,
          userPrivateSignature,
          serverPublicKey,
          protocolSalt
        );

        versionDecryptionDetails.push(serverEncryptedKey);
      }

      decryptionDetails.push({
        assetGlobalIdentifier: asset.globalIdentifier,
        versionDecryptionDetails,
      });
    }

    console.debug(
      'VisibilityChangeService.encryptAssetKeysForServer completed',
      {
        decryptionDetailsCount: decryptionDetails.length,
      }
    );

    return decryptionDetails;
  }

  /**
   * Re-encrypt a single asset version's decryption key for the server
   *
   * This method handles one asset version:
   * 1. Decrypts the symmetric key using AssetEncryption.decryptSecret
   * 2. Re-encrypts it for the server using createShareablePayload
   *
   * The result is new encryption metadata (ephemeralPublicKey, ciphertext, signature)
   * that the server can use to decrypt the symmetric key.
   *
   * @param version - The asset version with encryption metadata
   * @param userPrivateKey - User's private key (CryptoKey) for decryption
   * @param userPrivateSignature - User's private signature key (CryptoKey) for signing
   * @param serverPublicKey - Server's public key (base64 string)
   * @param protocolSalt - Protocol salt (base64 string)
   * @returns New version input DTO with server-encrypted key
   */
  private static async reEncryptKeyForServer(
    version: AssetVersionOutputDTO,
    userPrivateKey: CryptoKey,
    userPrivateSignature: CryptoKey,
    serverPublicKey: string,
    protocolSalt: string
  ): Promise<AssetVersionInputDTO> {
    console.debug('VisibilityChangeService.reEncryptKeyForServer started', {
      versionName: version.versionName,
    });

    // Step 1: Decrypt the symmetric key from the version's encryptedSecret
    // The encryptedSecret was encrypted with the original uploader's public key
    const symmetricKeyBytes = await AssetEncryption.decryptSecret(
      version.encryptedSecret,
      version.ephemeralPublicKey,
      version.publicSignature,
      version.senderPublicSignature,
      userPrivateKey,
      protocolSalt
    );

    console.debug(
      'VisibilityChangeService.reEncryptKeyForServer decrypted symmetric key',
      {
        symmetricKeyLength: symmetricKeyBytes.length,
      }
    );

    // Step 2: Re-encrypt the symmetric key for the server
    // Now the current user becomes the sender, signing with their private signature
    const serverPayload = await createShareablePayload(
      symmetricKeyBytes,
      serverPublicKey,
      userPrivateSignature,
      protocolSalt
    );

    console.debug('VisibilityChangeService.reEncryptKeyForServer completed', {
      versionName: version.versionName,
    });

    return {
      versionName: version.versionName,
      senderEncryptedSecret: serverPayload.ciphertext,
      ephemeralPublicKey: serverPayload.ephemeralPublicKey,
      publicSignature: serverPayload.signature,
    };
  }
}
