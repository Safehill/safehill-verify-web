import type { AuthedSession } from '@/lib/auth/auth-context';
import type {
  CollectionOutputDTO,
  CollectionCreateDTO,
  CollectionUpdateDTO,
  CollectionSearchDTO,
  AccessCheckResultDTO,
  PaymentIntentDTO,
  PaymentConfirmationDTO,
  CollectionAssetAddRequestDTO,
  CollectionAssetAddResultDTO,
} from '@/lib/api/models/dto/Collection';
import { createAuthenticatedRequest } from './api';
import { toast } from 'sonner';

// Utility function to generate collection link
export const generateCollectionLink = (collectionId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/authed/collections/${collectionId}`;
};

// API functions
export const collectionsApi = {
  // Create a new collection
  createCollection: async (
    collectionData: CollectionCreateDTO,
    authedSession: AuthedSession
  ): Promise<CollectionOutputDTO> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO>(
        'post',
        '/collections/create',
        authedSession,
        collectionData
      );
    } catch (_error) {
      throw new Error(`Failed to create collection: ${_error}`);
    }
  },

  // Check access to a collection
  checkAccess: async (
    collectionId: string,
    authedSession: AuthedSession
  ): Promise<AccessCheckResultDTO> => {
    try {
      return await createAuthenticatedRequest<AccessCheckResultDTO>(
        'get',
        `/collections/check-access/${collectionId}`,
        authedSession
      );
    } catch (_error) {
      throw new Error('Access denied');
    }
  },

  // Create payment intent for collection purchase
  createPaymentIntent: async (
    collectionId: string,
    authedSession: AuthedSession
  ): Promise<PaymentIntentDTO> => {
    try {
      return await createAuthenticatedRequest<PaymentIntentDTO>(
        'post',
        `/collections/payment-intent/${collectionId}`,
        authedSession,
        {}
      );
    } catch (_error) {
      throw new Error('Failed to create payment intent');
    }
  },

  // Confirm payment and grant access
  confirmPayment: async (
    collectionId: string,
    paymentIntentId: string,
    authedSession: AuthedSession
  ): Promise<PaymentConfirmationDTO> => {
    try {
      return await createAuthenticatedRequest<PaymentConfirmationDTO>(
        'post',
        `/collections/confirm-payment/${collectionId}`,
        authedSession,
        {}
      );
    } catch (_error) {
      throw new Error('Payment confirmation failed');
    }
  },

  // Get all collections for a specific user (owned + shared + accessed public)
  getCollections: async (
    authedSession: AuthedSession
  ): Promise<CollectionOutputDTO[]> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO[]>(
        'post',
        '/collections/retrieve',
        authedSession,
        {}
      );
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      toast.error('Failed to load your collections');
      return [];
    }
  },

  // Get single collection by ID (accessible to owners, shared users, or public collections)
  getCollection: async (
    id: string,
    authedSession: AuthedSession
  ): Promise<CollectionOutputDTO> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO>(
        'post',
        `/collections/retrieve/${id}`,
        authedSession,
        {}
      );
    } catch (_error) {
      throw new Error(`Failed to fetch collection: ${_error}`);
    }
  },

  // Track when a user accesses a collection (for collections they don't own)
  trackCollectionAccess: async (
    collectionId: string,
    authedSession: AuthedSession
  ): Promise<void> => {
    try {
      await createAuthenticatedRequest<void>(
        'post',
        `/collections/track-access/${collectionId}`,
        authedSession,
        {}
      );
    } catch (_error) {
      // console.error('Failed to track collection access:', _error);
    }
  },

  // Update collection (only if owned by user)
  updateCollection: async (
    id: string,
    updates: CollectionUpdateDTO,
    authedSession: AuthedSession
  ): Promise<CollectionOutputDTO> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO>(
        'post',
        `/collections/update/${id}`,
        authedSession,
        updates
      );
    } catch (_error) {
      throw new Error(`Failed to update collection: ${_error}`);
    }
  },

  // Delete collection (only if owned by user)
  deleteCollection: async (
    id: string,
    authedSession: AuthedSession
  ): Promise<void> => {
    try {
      await createAuthenticatedRequest<void>(
        'delete',
        `/collections/delete/${id}`,
        authedSession
      );
    } catch (_error) {
      throw new Error(`Failed to delete collection: ${_error}`);
    }
  },

  // Search collections (only user's own collections + shared collections)
  searchCollections: async (
    query: string,
    authedSession: AuthedSession
  ): Promise<CollectionOutputDTO[]> => {
    try {
      const searchData: CollectionSearchDTO = {
        searchScope: 'owned',
        query,
      };

      return await createAuthenticatedRequest<CollectionOutputDTO[]>(
        'post',
        '/collections/search',
        authedSession,
        searchData
      );
    } catch (error) {
      console.error('Failed to search collections:', error);
      toast.error('Failed to search collections');
      return [];
    }
  },

  // Search all collections for adding to user's list (excludes user's own and private collections)
  searchAllCollections: async (
    query: string,
    authedSession: AuthedSession
  ): Promise<CollectionOutputDTO[]> => {
    try {
      const searchData: CollectionSearchDTO = {
        searchScope: 'public',
        query,
      };

      return await createAuthenticatedRequest<CollectionOutputDTO[]>(
        'post',
        '/collections/search',
        authedSession,
        searchData
      );
    } catch (error) {
      console.error('Failed to search all collections:', error);
      toast.error('Failed to search collections');
      return [];
    }
  },

  // Add assets to collection
  addAssetsToCollection: async (
    collectionId: string,
    request: CollectionAssetAddRequestDTO,
    authedSession: AuthedSession
  ): Promise<CollectionAssetAddResultDTO> => {
    console.debug('collectionsApi.addAssetsToCollection called', {
      collectionId,
      assetCount: request.assets.length,
      hasServerDecryptionDetails: !!request.serverDecryptionDetails,
      serverDecryptionDetailsCount:
        request.serverDecryptionDetails?.length || 0,
    });

    try {
      const result =
        await createAuthenticatedRequest<CollectionAssetAddResultDTO>(
          'post',
          `/collections/add-assets/${collectionId}`,
          authedSession,
          request
        );

      console.debug('collectionsApi.addAssetsToCollection successful', {
        success: result.success,
        addedCount: result.addedCount,
        skippedCount: result.skippedCount,
        hasAssets: !!result.assets,
        assetsCount: result.assets?.length || 0,
      });

      return result;
    } catch (error) {
      console.error('collectionsApi.addAssetsToCollection failed', error);
      throw new Error(
        `Failed to add assets to collection: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  // Mock implementation for testing
  addAssetsToCollectionMock: async (
    collectionId: string,
    request: CollectionAssetAddRequestDTO,
    authedSession: AuthedSession
  ): Promise<CollectionAssetAddResultDTO> => {
    console.debug('collectionsApi.addAssetsToCollectionMock called', {
      collectionId,
      assetCount: request.assets.length,
      hasServerDecryptionDetails: !!request.serverDecryptionDetails,
      serverDecryptionDetailsCount:
        request.serverDecryptionDetails?.length || 0,
    });

    // Mock implementation with timeout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockAssets = request.assets.map((asset) => ({
      globalIdentifier: asset.globalIdentifier,
      localIdentifier: asset.localIdentifier,
      createdBy: authedSession.user.identifier,
      creationDate: asset.creationDate,
      versions: asset.versions.map((version) => ({
        versionName: version.versionName,
        ephemeralPublicKey: version.ephemeralPublicKey,
        publicSignature: version.publicSignature,
        encryptedSecret: version.senderEncryptedSecret,
        senderPublicSignature: 'mock_sender_signature',
        presignedURL: `https://mock-s3-bucket.s3.amazonaws.com/${asset.globalIdentifier}/${version.versionName}?mock=true`,
        presignedURLExpiresInMinutes: 15,
      })),
    }));

    const result: CollectionAssetAddResultDTO = {
      success: true,
      message: 'Assets added successfully (mocked)',
      addedCount: request.assets.length,
      skippedCount: 0,
      assets: mockAssets,
    };

    console.debug('collectionsApi.addAssetsToCollectionMock successful', {
      success: result.success,
      addedCount: result.addedCount,
      skippedCount: result.skippedCount,
      hasAssets: !!result.assets,
      assetsCount: result.assets?.length || 0,
    });

    return result;
  },
};
