import axios from 'axios';
import type {
  CollectionOutputDTO,
  CollectionAssetAddRequestDTO,
  CollectionAssetAddResultDTO,
} from '@/lib/api/models/dto/Collection';
import type { AssetInputDTO } from '@/lib/api/models/dto/Asset';
import {
  AssetEncryption,
  type EncryptedAssetVersion,
} from '@/lib/crypto/asset-encryption';
import { collectionsApi } from '@/lib/api/collections';
import { assetsApi } from '@/lib/api/assets';
import { USE_MOCK_UPLOAD } from '@/lib/api/api';
import { getServerEncryptionKeys } from '@/lib/hooks/useServerEncryptionKeys';
import { AuthedSession } from '@/lib/auth/auth-context';
import { AssetResizingService } from './asset-resizing-service';

export interface UploadProgress {
  stage:
    | 'resizing'
    | 'encrypting'
    | 'creating'
    | 'uploading'
    | 'confirming'
    | 'completed'
    | 'error';
  progress: number;
  message?: string;
  error?: string;
}

export interface UploadResult {
  success: boolean;
  globalIdentifier: string;
  error?: string;
}

/**
 * AssetUploadService - orchestrate the 3-stage upload pipeline
 * 1. Resize images to create multiple quality versions
 * 2. Create assets on server (get presigned URLs)
 * 3. Upload encrypted data to S3
 * 4. Mark assets as uploaded
 */
export class AssetUploadService {
  private onProgress?: (
    uploadId: string,
    versionName: string,
    progress: UploadProgress
  ) => void;
  private maxConcurrentUploads: number;

  constructor(
    onProgress?: (
      uploadId: string,
      versionName: string,
      progress: UploadProgress
    ) => void,
    maxConcurrentUploads: number = 5
  ) {
    this.onProgress = onProgress;
    this.maxConcurrentUploads = maxConcurrentUploads;
  }

  /**
   * Upload multiple files to a collection
   */
  async uploadFiles(
    files: File[],
    collection: CollectionOutputDTO,
    authedSession: AuthedSession,
    getGlobalIdentifier: (file: File) => string,
    onFinishedProcessingItem?: (
      globalIdentifier: string,
      error: Error | null
    ) => void
  ): Promise<UploadResult[]> {
    console.debug('AssetUploadService.uploadFiles started', {
      fileCount: files.length,
      collectionId: collection.id,
      collectionName: collection.name,
      userId: authedSession.user.identifier,
    });

    const globalIdentifiers = files.map((file) => getGlobalIdentifier(file));
    console.debug(
      'AssetUploadService.uploadFiles globalIdentifiers mapped',
      globalIdentifiers
    );

    try {
      // Stage 1: Encrypt all files
      console.debug('AssetUploadService.uploadFiles starting encryption stage');
      const encryptedAssets = await this.encryptAllFiles(
        files,
        globalIdentifiers,
        authedSession
      );

      // Stage 2: Create all assets on server in one batch
      console.debug(
        'AssetUploadService.uploadFiles starting server creation stage'
      );
      const creationResult = await this.createAssetsOnServer(
        encryptedAssets,
        collection.id,
        authedSession
      );

      // Stage 3: Upload each file to S3 and confirm (in batches)
      console.debug(
        'AssetUploadService.uploadFiles starting upload and confirm stage'
      );
      return await this.uploadAndConfirm(
        encryptedAssets,
        creationResult,
        authedSession,
        onFinishedProcessingItem
      );
    } catch (error) {
      console.error('AssetUploadService.uploadFiles failed', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      return files.map((file, index) => {
        // Report error for all versions (we use 'all' as a placeholder since we don't know which versions were created)
        this.updateProgress(globalIdentifiers[index], 'all', {
          stage: 'error',
          progress: 0,
          error: errorMessage,
        });
        return {
          success: false,
          globalIdentifier: globalIdentifiers[index],
          error: errorMessage,
        };
      });
    }
  }

  private updateProgress(
    uploadId: string,
    versionName: string,
    progress: UploadProgress
  ) {
    if (this.onProgress) {
      this.onProgress(uploadId, versionName, progress);
    }
  }

  private async encryptAllFiles(
    files: File[],
    globalIdentifiers: string[],
    authedSession: AuthedSession
  ): Promise<
    {
      file: File;
      globalIdentifier: string;
      encryptedVersions: EncryptedAssetVersion[];
    }[]
  > {
    console.debug('AssetUploadService.encryptAllFiles started', {
      fileCount: files.length,
    });

    // Get server encryption keys (public key, signature, protocol salt)
    console.debug(
      'AssetUploadService.encryptAllFiles fetching server encryption keys'
    );
    const serverKeys = await getServerEncryptionKeys();
    const serverPublicKey = serverKeys.publicKey;
    const protocolSalt = serverKeys.encryptionProtocolSalt;

    console.debug('AssetUploadService.encryptAllFiles server keys received', {
      publicKeyLength: serverPublicKey?.length || 0,
      protocolSaltLength: protocolSalt?.length || 0,
      publicKeyPreview: serverPublicKey?.substring(0, 20) + '...',
    });

    const resizingService = new AssetResizingService();
    const encryptedAssets = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const globalIdentifier = globalIdentifiers[i];

      console.debug('AssetUploadService.encryptAllFiles processing file', {
        index: i,
        fileName: file.name,
        globalIdentifier,
      });

      // Step 1: Resize to create versions
      const resizedVersions = await resizingService.createVersions(file);
      console.debug('AssetUploadService.encryptAllFiles versions created', {
        fileName: file.name,
        versionCount: resizedVersions.length,
        versions: resizedVersions.map((v) => ({
          quality: v.quality,
          size: v.file.size,
          dimensions: `${v.width}x${v.height}`,
        })),
      });

      // Report progress for all versions during resizing/encrypting stages
      resizedVersions.forEach((v) => {
        this.updateProgress(globalIdentifier, v.quality, {
          stage: 'resizing',
          progress: 10,
          message: 'Creating image versions...',
        });
      });

      // Step 2: Encrypt all versions with shared symmetric key
      resizedVersions.forEach((v) => {
        this.updateProgress(globalIdentifier, v.quality, {
          stage: 'encrypting',
          progress: 20,
          message: 'Encrypting asset versions...',
        });
      });

      const versionInputs = resizedVersions.map((v) => ({
        file: v.file,
        versionName: v.quality,
      }));

      const encryptedVersions = await AssetEncryption.encryptAssetVersions(
        versionInputs,
        authedSession.user.publicKey,
        authedSession.privateSignature,
        authedSession.user.publicSignature,
        serverPublicKey,
        protocolSalt
      );

      encryptedAssets.push({
        file,
        globalIdentifier,
        encryptedVersions,
      });
    }

    console.debug('AssetUploadService.encryptAllFiles completed', {
      encryptedCount: encryptedAssets.length,
    });
    return encryptedAssets;
  }

  private async createAssetsOnServer(
    encryptedAssets: {
      globalIdentifier: string;
      encryptedVersions: EncryptedAssetVersion[];
    }[],
    collectionId: string,
    authedSession: AuthedSession
  ): Promise<CollectionAssetAddResultDTO> {
    console.debug('AssetUploadService.createAssetsOnServer started', {
      assetCount: encryptedAssets.length,
      collectionId,
    });

    encryptedAssets.forEach((asset) => {
      asset.encryptedVersions.forEach((version) => {
        this.updateProgress(asset.globalIdentifier, version.versionName, {
          stage: 'creating',
          progress: 40,
          message: 'Creating assets on server...',
        });
      });
    });

    // Build request for batch asset creation
    const assets: AssetInputDTO[] = encryptedAssets.map((asset) => ({
      globalIdentifier: asset.globalIdentifier,
      localIdentifier: undefined,
      fingerprint: undefined,
      perceptualHash: undefined,
      embeddings: undefined,
      creationDate: new Date().toISOString(),
      groupId: undefined,
      versions: asset.encryptedVersions.map((v) => v.selfEncryption),
      force: false,
    }));

    const serverDecryptionDetails = encryptedAssets.map((asset) => ({
      assetGlobalIdentifier: asset.globalIdentifier,
      versionDecryptionDetails: asset.encryptedVersions.map(
        (v) => v.serverEncryption
      ),
    }));

    const request: CollectionAssetAddRequestDTO = {
      assets,
      serverDecryptionDetails,
    };

    console.debug('AssetUploadService.createAssetsOnServer calling API', {
      assetsCount: assets.length,
      serverDecryptionDetailsCount: serverDecryptionDetails.length,
    });

    try {
      const result = await collectionsApi.addAssetsToCollection(
        collectionId,
        request,
        authedSession
      );
      console.debug(
        'AssetUploadService.createAssetsOnServer API call successful',
        {
          success: result.success,
          addedCount: result.addedCount,
          skippedCount: result.skippedCount,
        }
      );
      return result;
    } catch (error) {
      console.error(
        'AssetUploadService.createAssetsOnServer API call failed',
        error
      );
      throw error;
    }
  }

  private async uploadAndConfirm(
    encryptedAssets: {
      file: File;
      globalIdentifier: string;
      encryptedVersions: EncryptedAssetVersion[];
    }[],
    creationResult: CollectionAssetAddResultDTO,
    authedSession: AuthedSession,
    onFinishedProcessingItem?: (
      globalIdentifier: string,
      error: Error | null
    ) => void
  ): Promise<UploadResult[]> {
    console.debug('AssetUploadService.uploadAndConfirm started', {
      assetCount: encryptedAssets.length,
      maxConcurrentUploads: this.maxConcurrentUploads,
    });

    if (!creationResult.success || !creationResult.assets) {
      const error = new Error(
        creationResult.message || 'Failed to create assets on server'
      );
      console.error(
        'AssetUploadService.uploadAndConfirm creation result invalid',
        error
      );
      throw error;
    }

    // Process uploads in batches
    const results: UploadResult[] = [];
    const totalBatches = Math.ceil(
      encryptedAssets.length / this.maxConcurrentUploads
    );

    for (
      let i = 0;
      i < encryptedAssets.length;
      i += this.maxConcurrentUploads
    ) {
      const batchNumber = Math.floor(i / this.maxConcurrentUploads) + 1;
      const batch = encryptedAssets.slice(i, i + this.maxConcurrentUploads);

      console.debug('AssetUploadService.uploadAndConfirm processing batch', {
        batchNumber,
        totalBatches,
        batchSize: batch.length,
      });

      const batchPromises = batch.map(async (asset, batchIndex) => {
        const globalIndex = i + batchIndex;
        const createdAsset = creationResult.assets![globalIndex];

        return this.uploadSingleAsset(
          asset,
          createdAsset,
          authedSession,
          onFinishedProcessingItem
        );
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      console.debug('AssetUploadService.uploadAndConfirm batch completed', {
        batchNumber,
        successCount: batchResults.filter((r) => r.success).length,
        errorCount: batchResults.filter((r) => !r.success).length,
      });
    }

    console.debug('AssetUploadService.uploadAndConfirm all batches completed', {
      totalResults: results.length,
      totalSuccess: results.filter((r) => r.success).length,
      totalErrors: results.filter((r) => !r.success).length,
    });

    return results;
  }

  private async uploadSingleAsset(
    asset: {
      file: File;
      globalIdentifier: string;
      encryptedVersions: EncryptedAssetVersion[];
    },
    createdAsset: any,
    authedSession: AuthedSession,
    onFinishedProcessingItem?: (
      globalIdentifier: string,
      error: Error | null
    ) => void
  ): Promise<UploadResult> {
    try {
      const versions = asset.encryptedVersions;
      const totalVersions = versions.length;

      // Upload each version separately
      for (let versionIndex = 0; versionIndex < totalVersions; versionIndex++) {
        const version = versions[versionIndex];
        const createdVersion = createdAsset.versions[versionIndex];
        const presignedUrl = createdVersion?.presignedURL;

        if (!presignedUrl) {
          throw new Error(
            `No presigned URL received for version ${version.versionName}`
          );
        }

        // Calculate progress range for this version (60-90% split across all versions)
        const versionProgressStart = 60 + (versionIndex * 30) / totalVersions;
        const versionProgressEnd =
          60 + ((versionIndex + 1) * 30) / totalVersions;

        // Upload this version to S3
        this.updateProgress(asset.globalIdentifier, version.versionName, {
          stage: 'uploading',
          progress: Math.round(versionProgressStart),
          message: `Uploading ${version.versionName} version...`,
        });

        if (USE_MOCK_UPLOAD) {
          await this.mockUploadVersionToS3(
            version.encryptedData,
            presignedUrl,
            asset.globalIdentifier,
            version.versionName,
            versionProgressStart,
            versionProgressEnd
          );
        } else {
          await this.uploadVersionToS3(
            version.encryptedData,
            presignedUrl,
            asset.globalIdentifier,
            version.versionName,
            versionProgressStart,
            versionProgressEnd
          );
        }

        // Mark this version as uploaded
        await assetsApi.markAssetUploaded(
          asset.globalIdentifier,
          version.versionName,
          authedSession
        );
      }

      // All versions uploaded - mark as completed
      asset.encryptedVersions.forEach((version) => {
        this.updateProgress(asset.globalIdentifier, version.versionName, {
          stage: 'completed',
          progress: 100,
          message: 'All versions uploaded successfully',
        });
      });

      // Notify that this item finished successfully
      onFinishedProcessingItem?.(asset.globalIdentifier, null);

      return {
        success: true,
        globalIdentifier: asset.globalIdentifier,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      const errorObject =
        error instanceof Error ? error : new Error(errorMessage);

      asset.encryptedVersions.forEach((version) => {
        this.updateProgress(asset.globalIdentifier, version.versionName, {
          stage: 'error',
          progress: 0,
          error: errorMessage,
        });
      });

      // Notify that this item finished with an error
      onFinishedProcessingItem?.(asset.globalIdentifier, errorObject);

      return {
        success: false,
        globalIdentifier: asset.globalIdentifier,
        error: errorMessage,
      };
    }
  }

  private async mockUploadVersionToS3(
    data: ArrayBuffer,
    presignedUrl: string,
    globalIdentifier: string,
    versionName: string,
    progressStart: number,
    progressEnd: number
  ): Promise<void> {
    console.debug('AssetUploadService.mockUploadVersionToS3 starting', {
      globalIdentifier,
      versionName,
      dataSize: data.byteLength,
    });

    const totalDuration = 2000; // 2 seconds
    const progressSteps = 10;
    const stepDuration = totalDuration / progressSteps;

    for (let step = 1; step <= progressSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));

      const uploadProgress = (step / progressSteps) * 100;
      const overallProgress =
        progressStart + (uploadProgress * (progressEnd - progressStart)) / 100;

      this.updateProgress(globalIdentifier, versionName, {
        stage: 'uploading',
        progress: Math.round(overallProgress),
        message: `Uploading ${versionName}... ${Math.round(uploadProgress)}%`,
      });
    }

    console.debug('AssetUploadService.mockUploadVersionToS3 completed', {
      globalIdentifier,
      versionName,
    });
  }

  private async uploadVersionToS3(
    data: ArrayBuffer,
    presignedUrl: string,
    globalIdentifier: string,
    versionName: string,
    progressStart: number,
    progressEnd: number
  ): Promise<void> {
    try {
      await axios.put(presignedUrl, data, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploadProgress =
              (progressEvent.loaded / progressEvent.total) * 100;
            // Map upload progress to the allocated range for this version
            const overallProgress =
              progressStart +
              (uploadProgress * (progressEnd - progressStart)) / 100;

            this.updateProgress(globalIdentifier, versionName, {
              stage: 'uploading',
              progress: Math.round(overallProgress),
              message: `Uploading ${versionName}... ${Math.round(
                uploadProgress
              )}%`,
            });
          }
        },
      });
    } catch (error) {
      throw new Error(
        `S3 upload failed for ${versionName}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
