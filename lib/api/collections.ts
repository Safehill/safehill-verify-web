import type { AuthenticatedUser } from '@/lib/api/models/AuthenticatedUser';
import type {
  CollectionOutputDTO,
  CollectionCreateDTO,
  CollectionUpdateDTO,
  CollectionSearchDTO,
  AccessCheckResultDTO,
  PaymentIntentDTO,
  PaymentConfirmationDTO,
} from '@/lib/api/models/dto/Collection';
import { createAuthenticatedRequest } from './api';

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
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionOutputDTO> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO>(
        'post',
        '/collections/create',
        authenticatedUser,
        collectionData
      );
    } catch (_error) {
      throw new Error(`Failed to create collection: ${_error}`);
    }
  },

  // Check access to a collection
  checkAccess: async (
    collectionId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<AccessCheckResultDTO> => {
    try {
      return await createAuthenticatedRequest<AccessCheckResultDTO>(
        'get',
        `/collections/check-access/${collectionId}`,
        authenticatedUser
      );
    } catch (_error) {
      throw new Error('Access denied');
    }
  },

  // Create payment intent for collection purchase
  createPaymentIntent: async (
    collectionId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<PaymentIntentDTO> => {
    try {
      return await createAuthenticatedRequest<PaymentIntentDTO>(
        'post',
        `/collections/payment-intent/${collectionId}`,
        authenticatedUser,
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
    authenticatedUser: AuthenticatedUser
  ): Promise<PaymentConfirmationDTO> => {
    try {
      return await createAuthenticatedRequest<PaymentConfirmationDTO>(
        'post',
        `/collections/confirm-payment/${collectionId}`,
        authenticatedUser,
        {}
      );
    } catch (_error) {
      throw new Error('Payment confirmation failed');
    }
  },

  // Get all collections for a specific user (owned + shared + accessed public)
  getCollections: async (
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionOutputDTO[]> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO[]>(
        'post',
        '/collections/retrieve',
        authenticatedUser,
        {}
      );
    } catch (_error) {
      // console.error('Failed to fetch collections:', _error);
      return [];
    }
  },

  // Get single collection by ID (accessible to owners, shared users, or public collections)
  getCollection: async (
    id: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionOutputDTO> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO>(
        'post',
        `/collections/retrieve/${id}`,
        authenticatedUser,
        {}
      );
    } catch (_error) {
      throw new Error(`Failed to fetch collection: ${_error}`);
    }
  },

  // Track when a user accesses a collection (for collections they don't own)
  trackCollectionAccess: async (
    collectionId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<void> => {
    try {
      await createAuthenticatedRequest<void>(
        'post',
        `/collections/track-access/${collectionId}`,
        authenticatedUser,
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
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionOutputDTO> => {
    try {
      return await createAuthenticatedRequest<CollectionOutputDTO>(
        'post',
        `/collections/update/${id}`,
        authenticatedUser,
        updates
      );
    } catch (_error) {
      throw new Error(`Failed to update collection: ${_error}`);
    }
  },

  // Delete collection (only if owned by user)
  deleteCollection: async (
    id: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<void> => {
    try {
      await createAuthenticatedRequest<void>(
        'delete',
        `/collections/delete/${id}`,
        authenticatedUser
      );
    } catch (_error) {
      throw new Error(`Failed to delete collection: ${_error}`);
    }
  },

  // Search collections (only user's own collections + shared collections)
  searchCollections: async (
    query: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionOutputDTO[]> => {
    try {
      const searchData: CollectionSearchDTO = {
        searchScope: 'owned',
        query,
      };

      return await createAuthenticatedRequest<CollectionOutputDTO[]>(
        'post',
        '/collections/search',
        authenticatedUser,
        searchData
      );
    } catch (_error) {
      // console.error('Failed to search collections:', _error);
      return [];
    }
  },

  // Search all collections for adding to user's list (excludes user's own and private collections)
  searchAllCollections: async (
    query: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionOutputDTO[]> => {
    try {
      const searchData: CollectionSearchDTO = {
        searchScope: 'public',
        query,
      };

      return await createAuthenticatedRequest<CollectionOutputDTO[]>(
        'post',
        '/collections/search',
        authenticatedUser,
        searchData
      );
    } catch (_error) {
      // console.error('Failed to search all collections:', _error);
      return [];
    }
  },
};
