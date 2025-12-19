import axios from 'axios';
import type {
  CollectionOutputDTO,
  CollectionAssetAddRequestDTO,
  CollectionAssetAddResultDTO,
} from '@/lib/api/models/dto/Collection';
import type { AssetInputDTO, AssetOutputDTO } from '@/lib/api/models/dto/Asset';
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
import {
  generateEmbeddingFromImageData,
  serializeEmbeddingToBase64,
} from '@/lib/embeddings/tinyclip-embeddings';
import { EmbeddingsSingleton } from '@/lib/hooks/use-image-embedding';
import { EmbeddingModelError } from '@/lib/errors/upload-errors';

export interface UploadProgress {
  stage:
    | 'resizing'
    | 'fingerprinting'
    | 'encrypting'
    | 'creating'
    | 'uploading'
    | 'confirming'
    | 'completed'
    | 'error';
  progress: number;
  message?: string;
  error?: Error;
}

export interface UploadResult {
  success: boolean;
  globalIdentifier: string;
  error?: string;
}

/**
 * Wait for the embedding model to be ready, with timeout
 * @param timeoutMs Maximum time to wait in milliseconds (default: 60 seconds)
 * @returns Promise that resolves when model is loaded, rejects on timeout or failure
 */
async function waitForEmbeddingModel(timeoutMs: number = 60000): Promise<void> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkState = () => {
      const state = EmbeddingsSingleton.state;

      if (state === 'loaded') {
        resolve();
        return;
      }

      if (state === 'failed_twice') {
        reject(
          new EmbeddingModelError(
            'Fingerprint model failed to load. Please retry the upload.',
            true
          )
        );
        return;
      }

      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        reject(
          new EmbeddingModelError(
            'Timeout waiting for fingerprint model to load',
            true
          )
        );
        return;
      }

      // Check again in 500ms
      setTimeout(checkState, 500);
    };

    checkState();
  });
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
        collection,
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
      const errorObject =
        error instanceof Error ? error : new Error('Upload failed');
      return files.map((file, index) => {
        // Report error for all versions (we use 'all' as a placeholder since we don't know which versions were created)
        this.updateProgress(globalIdentifiers[index], 'all', {
          stage: 'error',
          progress: 0,
          error: errorObject,
        });
        return {
          success: false,
          globalIdentifier: globalIdentifiers[index],
          error: errorObject.message,
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
      embeddings: string;
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

      // Report progress for all versions during resizing stage
      resizedVersions.forEach((v) => {
        this.updateProgress(globalIdentifier, v.quality, {
          stage: 'resizing',
          progress: 10,
          message: 'Creating image versions...',
        });
      });

      // Step 2: Calculate embeddings from original image (REQUIRED)
      resizedVersions.forEach((v) => {
        this.updateProgress(globalIdentifier, v.quality, {
          stage: 'fingerprinting',
          progress: 15,
          message: 'Generating asset fingerprint...',
        });
      });

      let embeddings: string;
      try {
        // Wait for embedding model to be ready (with 60s timeout)
        if (EmbeddingsSingleton.state !== 'loaded') {
          console.debug(
            `AssetUploadService.encryptAllFiles waiting for embedding model`,
            {
              globalIdentifier,
              currentState: EmbeddingsSingleton.state,
            }
          );

          // Update progress to show we're waiting
          resizedVersions.forEach((v) => {
            this.updateProgress(globalIdentifier, v.quality, {
              stage: 'fingerprinting',
              progress: 15,
              message: 'Waiting for fingerprint model to load...',
            });
          });

          await waitForEmbeddingModel(60000);

          // Update progress after model is ready
          resizedVersions.forEach((v) => {
            this.updateProgress(globalIdentifier, v.quality, {
              stage: 'fingerprinting',
              progress: 15,
              message: 'Generating asset fingerprint...',
            });
          });
        }

        // Create ImageData from the original file for embedding calculation
        const imageData = await this.createImageDataFromFile(file);
        const embedding = await generateEmbeddingFromImageData(imageData);
        embeddings = serializeEmbeddingToBase64(embedding);

        console.debug(
          'AssetUploadService.encryptAllFiles embeddings calculated',
          {
            globalIdentifier,
            embeddingsLength: embeddings.length,
          }
        );
      } catch (error) {
        const errorObject =
          error instanceof Error
            ? error
            : new Error('Failed to generate fingerprint');
        console.error(`Fingerprinting failed for ${globalIdentifier}:`, error);

        // Report error and stop processing this file
        resizedVersions.forEach((v) => {
          this.updateProgress(globalIdentifier, v.quality, {
            stage: 'error',
            progress: 0,
            error: errorObject,
          });
        });

        // Throw error to stop the upload for this file
        throw errorObject;
      }

      // Step 3: Encrypt all versions with shared symmetric key
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
        embeddings,
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
      embeddings: string;
    }[],
    collection: CollectionOutputDTO,
    authedSession: AuthedSession
  ): Promise<CollectionAssetAddResultDTO> {
    console.debug('AssetUploadService.createAssetsOnServer started', {
      assetCount: encryptedAssets.length,
      collectionId: collection.id,
      isSystemCollection: collection.isSystemCollection,
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

    // Build asset input objects
    const assets: AssetInputDTO[] = encryptedAssets.map((asset) => ({
      globalIdentifier: asset.globalIdentifier,
      localIdentifier: undefined,
      perceptualHash: undefined,
      embeddings: asset.embeddings,
      creationDate: new Date().toISOString(),
      groupId: undefined,
      versions: asset.encryptedVersions.map((v) => v.selfEncryption),
      force: false,
    }));

    // Step 1: Always create assets first (this adds them to Dropbox automatically)
    console.debug(
      'AssetUploadService.createAssetsOnServer creating assets via /assets/create'
    );

    const createdOrExistingAssets: AssetOutputDTO[] = [];
    const failedAssets: { globalIdentifier: string; error: Error }[] = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      try {
        const result = await assetsApi.createAsset(asset, authedSession);
        createdOrExistingAssets.push(result);
      } catch (error) {
        const errorObject =
          error instanceof Error ? error : new Error('Unknown error');
        console.error(
          `Failed to create asset ${asset.globalIdentifier}:`,
          error
        );
        failedAssets.push({
          globalIdentifier: asset.globalIdentifier,
          error: errorObject,
        });

        // Update progress to show error for this asset's versions
        const encryptedAsset = encryptedAssets[i];
        if (encryptedAsset) {
          encryptedAsset.encryptedVersions.forEach((version) => {
            this.updateProgress(asset.globalIdentifier, version.versionName, {
              stage: 'error',
              progress: 0,
              error: errorObject,
            });
          });
        }
      }
    }

    console.debug(
      'AssetUploadService.createAssetsOnServer asset creation completed',
      {
        totalAttempted: assets.length,
        successCount: createdOrExistingAssets.length,
        failedCount: failedAssets.length,
      }
    );

    // If all assets failed, throw the first error to preserve error type
    if (createdOrExistingAssets.length === 0) {
      console.error(
        `Failed to create any assets. ${failedAssets.length} error(s)`
      );
      // Throw the first error to preserve its type (AssetClaimedError, etc.)
      throw failedAssets[0].error;
    }

    // If some assets failed, log warning but continue
    if (failedAssets.length > 0) {
      console.warn(
        `${failedAssets.length} asset(s) could not be created:`,
        failedAssets
      );
    }

    if (collection.isSystemCollection) {
      // For system collection (Dropbox), assets are already added automatically
      return {
        success: true,
        message:
          failedAssets.length > 0
            ? `${createdOrExistingAssets.length} assets added to Dropbox (${failedAssets.length} failed)`
            : 'Assets created and added to Dropbox',
        addedCount: createdOrExistingAssets.length,
        skippedCount: failedAssets.length,
        assets: createdOrExistingAssets,
      };
    }

    // Step 2: Add successfully created/existing assets to non-system collection
    console.debug(
      'AssetUploadService.createAssetsOnServer adding assets to non-system collection',
      {
        collectionId: collection.id,
        collectionName: collection.name,
        assetsToAdd: createdOrExistingAssets.length,
      }
    );

    // Filter encrypted assets and server decryption details to match only successfully created/existing assets
    const successfulIdentifiers = new Set(
      createdOrExistingAssets.map((a) => a.globalIdentifier)
    );
    const assetsToAdd = assets.filter((a) =>
      successfulIdentifiers.has(a.globalIdentifier)
    );
    const serverDecryptionDetails = encryptedAssets
      .filter((asset) => successfulIdentifiers.has(asset.globalIdentifier))
      .map((asset) => ({
        assetGlobalIdentifier: asset.globalIdentifier,
        versionDecryptionDetails: asset.encryptedVersions.map(
          (v) => v.serverEncryption
        ),
      }));

    const request: CollectionAssetAddRequestDTO = {
      assets: assetsToAdd,
      serverDecryptionDetails,
    };

    try {
      const addResult = await collectionsApi.addAssetsToCollection(
        collection.id,
        request,
        authedSession
      );

      console.debug(
        'AssetUploadService.createAssetsOnServer add-to-collection successful',
        {
          success: addResult.success,
          addedCount: addResult.addedCount,
          skippedCount: addResult.skippedCount,
        }
      );

      return {
        success: true,
        message:
          failedAssets.length > 0
            ? `${addResult.addedCount} assets added to ${collection.name} (${failedAssets.length} failed)`
            : `${addResult.addedCount} assets added to ${collection.name}`,
        addedCount: addResult.addedCount,
        skippedCount: addResult.skippedCount + failedAssets.length,
        assets: createdOrExistingAssets,
      };
    } catch (error) {
      console.error(
        'AssetUploadService.createAssetsOnServer add-to-collection failed',
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
      embeddings: string;
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
    createdAsset: AssetOutputDTO,
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
      const errorObject =
        error instanceof Error ? error : new Error('Upload failed');

      asset.encryptedVersions.forEach((version) => {
        this.updateProgress(asset.globalIdentifier, version.versionName, {
          stage: 'error',
          progress: 0,
          error: errorObject,
        });
      });

      // Notify that this item finished with an error
      onFinishedProcessingItem?.(asset.globalIdentifier, errorObject);

      return {
        success: false,
        globalIdentifier: asset.globalIdentifier,
        error: errorObject.message,
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

  /**
   * Create ImageData from a File object for embedding calculation
   */
  private async createImageDataFromFile(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
