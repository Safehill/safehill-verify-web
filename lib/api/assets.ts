import type { AuthedSession } from '@/lib/auth/auth-context';
import type {
  AssetOutputDTO,
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
  // Get asset by global identifier
  getAsset: async (
    globalIdentifier: string,
    authedSession: AuthedSession
  ): Promise<AssetOutputDTO> => {
    try {
      const searchData: AssetSearchCriteriaDTO = {
        globalIdentifiers: [globalIdentifier],
      };

      const response = await createAuthenticatedRequest<AssetOutputDTO[]>(
        'post',
        '/assets/retrieve',
        authedSession,
        searchData
      );

      if (response && response.length > 0) {
        const asset = response[0];

        // Replace presigned URLs with picsum URLs when in mock mode
        if (USE_MOCK_UPLOAD && asset.versions) {
          asset.versions = asset.versions.map((version) => ({
            ...version,
            presignedURL: `https://picsum.photos/seed/${globalIdentifier}-${version.versionName}/800/600`,
          }));
        }

        return asset;
      }

      throw new Error(
        `Asset with global identifier ${globalIdentifier} not found`
      );
    } catch (error) {
      throw new Error(`Failed to fetch asset: ${error}`);
    }
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
