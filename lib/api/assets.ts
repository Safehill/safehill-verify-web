import type { AuthenticatedUser } from '@/lib/api/models/AuthenticatedUser';
import type {
  AssetOutputDTO,
  AssetSearchCriteriaDTO,
  AssetDescriptorDTO,
  AssetSimilarMatchDTO,
  AssetSimilarMatchRequestDTO,
  AssetFingerprintDTO,
} from '@/lib/api/models/dto/Asset';
import {
  createAuthenticatedRequest,
  createUnauthenticatedRequest,
} from './api';
import { toast } from 'sonner';

// API functions for assets
export const assetsApi = {
  // Get asset by ID
  getAsset: async (imageId: string): Promise<AssetOutputDTO> => {
    try {
      const searchData: AssetSearchCriteriaDTO = {
        globalIdentifiers: [imageId],
      };

      const response = await createUnauthenticatedRequest<AssetOutputDTO[]>(
        'post',
        '/assets/retrieve',
        searchData
      );

      if (response && response.length > 0) {
        return response[0];
      }

      throw new Error(`Asset with id ${imageId} not found`);
    } catch (error) {
      throw new Error(`Failed to fetch asset: ${error}`);
    }
  },

  // Get asset descriptors
  getAssetDescriptors: async (
    authenticatedUser: AuthenticatedUser
  ): Promise<AssetDescriptorDTO[]> => {
    try {
      return await createAuthenticatedRequest<AssetDescriptorDTO[]>(
        'post',
        '/assets/descriptors/retrieve',
        authenticatedUser,
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
    authenticatedUser: AuthenticatedUser
  ): Promise<AssetSimilarMatchDTO[]> => {
    try {
      return await createAuthenticatedRequest<AssetSimilarMatchDTO[]>(
        'post',
        '/fingerprint/retrieve-similar',
        authenticatedUser,
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
    authenticatedUser: AuthenticatedUser
  ): Promise<void> => {
    try {
      await createAuthenticatedRequest<void>(
        'post',
        `/fingerprint/update/ref/${globalIdentifier}`,
        authenticatedUser,
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
    authenticatedUser: AuthenticatedUser
  ): Promise<void> => {
    console.debug('assetsApi.markAssetUploaded called', {
      globalIdentifier,
      versionName,
    });

    try {
      await createAuthenticatedRequest<void>(
        'post',
        `/assets/${globalIdentifier}/versions/${versionName}/uploaded`,
        authenticatedUser,
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
    authenticatedUser: AuthenticatedUser
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
