import type { AuthedSession } from '@/lib/auth/auth-context';
import type {
  AssetOutputDTO,
  AssetInputDTO,
  AssetSearchCriteriaDTO,
  AssetDescriptorDTO,
  AssetSimilarMatchDTO,
  AssetSimilarMatchRequestDTO,
  AssetFingerprintDTO,
} from '@/lib/api/models/dto/Asset';
import { createAuthenticatedRequest, USE_MOCK_UPLOAD } from './api';
import { toast } from 'sonner';

// API functions for assets
export const assetsApi = {
  // Create a single asset (automatically added to user's Dropbox collection)
  createAsset: async (
    asset: AssetInputDTO,
    authedSession: AuthedSession
  ): Promise<AssetOutputDTO> => {
    console.debug('assetsApi.createAsset called', {
      globalIdentifier: asset.globalIdentifier,
      versionCount: asset.versions.length,
    });

    try {
      const result = await createAuthenticatedRequest<AssetOutputDTO>(
        'post',
        '/assets/create',
        authedSession,
        asset
      );

      console.debug('assetsApi.createAsset successful', {
        globalIdentifier: result.globalIdentifier,
        versionCount: result.versions.length,
        uploadState: result.uploadState,
      });

      return result;
    } catch (error) {
      console.error('assetsApi.createAsset failed', error);
      throw new Error(
        `Failed to create asset: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  // Get multiple assets by global identifiers (batch fetch)
  getAssets: async (
    globalIdentifiers: string[],
    authedSession: AuthedSession,
    versionNames?: string[]
  ): Promise<AssetOutputDTO[]> => {
    try {
      const searchData: AssetSearchCriteriaDTO = {
        globalIdentifiers,
        versionNames,
      };

      const response = await createAuthenticatedRequest<AssetOutputDTO[]>(
        'post',
        '/assets/retrieve',
        authedSession,
        searchData
      );

      // Replace presigned URLs with picsum URLs when in mock mode
      if (USE_MOCK_UPLOAD) {
        return response.map((asset) => ({
          ...asset,
          versions: asset.versions.map((version) => ({
            ...version,
            presignedURL: `https://picsum.photos/seed/${asset.globalIdentifier}-${version.versionName}/800/600`,
          })),
        }));
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to fetch assets: ${error}`);
    }
  },

  // Get single asset by global identifier (convenience wrapper around getAssets)
  getAsset: async (
    globalIdentifier: string,
    authedSession: AuthedSession
  ): Promise<AssetOutputDTO> => {
    const assets = await assetsApi.getAssets([globalIdentifier], authedSession);

    if (assets && assets.length > 0) {
      return assets[0];
    }

    throw new Error(
      `Asset with global identifier ${globalIdentifier} not found`
    );
  },

  // Get asset descriptors
  getAssetDescriptors: async (
    authedSession: AuthedSession
  ): Promise<AssetDescriptorDTO[]> => {
    try {
      return await createAuthenticatedRequest<AssetDescriptorDTO[]>(
        'post',
        '/assets/descriptors/retrieve',
        authedSession,
        {}
      );
    } catch (error) {
      console.error('Failed to fetch asset descriptors:', error);
      toast.error('Failed to load asset descriptors');
      return [];
    }
  },

  // Find similar assets
  findSimilarAssets: async (
    request: AssetSimilarMatchRequestDTO,
    authedSession: AuthedSession
  ): Promise<AssetSimilarMatchDTO[]> => {
    try {
      return await createAuthenticatedRequest<AssetSimilarMatchDTO[]>(
        'post',
        '/fingerprint/retrieve-similar',
        authedSession,
        request
      );
    } catch (error) {
      console.error('Failed to find similar assets:', error);
      toast.error('Failed to find similar assets');
      return [];
    }
  },

  // Update asset fingerprint
  updateAssetFingerprint: async (
    globalIdentifier: string,
    fingerprint: AssetFingerprintDTO,
    authedSession: AuthedSession
  ): Promise<void> => {
    try {
      await createAuthenticatedRequest<void>(
        'post',
        `/fingerprint/update/ref/${globalIdentifier}`,
        authedSession,
        fingerprint
      );
    } catch (error) {
      console.error('Failed to update asset fingerprint:', error);
      toast.error('Failed to update asset fingerprint');
      throw error;
    }
  },

  // Mark an asset version as uploaded after S3 upload completes
  markAssetUploaded: async (
    globalIdentifier: string,
    versionName: string,
    authedSession: AuthedSession
  ): Promise<void> => {
    console.debug('assetsApi.markAssetUploaded called', {
      globalIdentifier,
      versionName,
    });

    try {
      await createAuthenticatedRequest<void>(
        'post',
        `/assets/${globalIdentifier}/versions/${versionName}/uploaded`,
        authedSession,
        {}
      );

      console.debug('assetsApi.markAssetUploaded successful', {
        globalIdentifier,
        versionName,
      });
    } catch (error) {
      console.error('assetsApi.markAssetUploaded failed', {
        globalIdentifier,
        versionName,
        error,
      });
      throw new Error(
        `Failed to mark asset as uploaded: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  // Mock implementation for testing
  markAssetUploadedMock: async (
    globalIdentifier: string,
    versionName: string,
    authedSession: AuthedSession
  ): Promise<void> => {
    console.debug('assetsApi.markAssetUploadedMock called', {
      globalIdentifier,
      versionName,
    });

    // Mock implementation with timeout
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.debug('assetsApi.markAssetUploadedMock successful', {
      globalIdentifier,
      versionName,
    });
  },
};
