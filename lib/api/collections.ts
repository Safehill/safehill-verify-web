import type { AuthenticatedUser } from '@/lib/api/models/AuthenticatedUser';
import { mockCollections } from '@/lib/api/mock/mock-collections';
import { mockCollectionDetails } from '@/lib/api/mock/mock-collections';
import { mockUsers } from '@/lib/api/mock/mock-users';
import { mockImages } from '@/lib/api/mock/mock-images';

// Mock sharing data - tracks which collections are shared with which users
const mockSharedCollections: Record<string, string[]> = {
  'dev-user-123': ['9'], // Collection 9 is shared with dev-user-123
};

// Types
export type Visibility = 'public' | 'confidential' | 'not-shared';

export type AccessStatus = 'granted' | 'paywall' | 'denied' | 'loading';

export interface AccessCheckResult {
  status: AccessStatus;
  message?: string;
  price?: number;
  collectionName?: string;
  ownerName?: string;
  visibility?: Visibility;
  createdBy?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  visibility: Visibility;
  pricing: number;
  lastUpdated: string; // ISO string timestamp
  createdBy: string;
  thumbnailUrl?: string;
  previewAssets?: Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    thumbnailUrl?: string;
  }>;
}

export interface ImageData {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface CollectionDetail extends Collection {
  assets: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploaded: string; // ISO string timestamp
  }>;
}

// Utility function to generate collection link
export const generateCollectionLink = (collectionId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/authed/collections/${collectionId}`;
};

// API functions
export const collectionsApi = {
  // Check access to a collection
  checkAccess: async (
    collectionId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<AccessCheckResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const collection =
      mockCollectionDetails[collectionId as keyof typeof mockCollectionDetails];
    if (!collection) {
      return {
        status: 'denied',
        message: 'Collection not found',
      };
    }

    const userId = authenticatedUser.user.identifier;
    const isOwner = collection.createdBy === userId;
    const isShared = (
      mockSharedCollections[userId as keyof typeof mockSharedCollections] || []
    ).includes(collectionId);

    // If user owns the collection, access is granted
    if (isOwner) {
      return { status: 'granted' };
    }

    // If collection is not-shared and user doesn't own it, access is denied
    if (collection.visibility === 'not-shared') {
      return {
        status: 'denied',
        message: 'This collection is private and not shared with you',
      };
    }

    // If collection is public, access is always granted (regardless of pricing)
    if (collection.visibility === 'public') {
      return { status: 'granted' };
    }

    // If collection is shared with user, access is granted
    if (isShared) {
      return { status: 'granted' };
    }

    // For confidential collections, show paywall (regardless of pricing)
    if (collection.visibility === 'confidential') {
      const owner = mockUsers[collection.createdBy as keyof typeof mockUsers];
      return {
        status: 'paywall',
        price: collection.pricing,
        collectionName: collection.name,
        ownerName: owner?.name || 'Unknown',
        visibility: collection.visibility,
        createdBy: collection.createdBy,
        message:
          collection.pricing > 0
            ? `This collection requires payment to access`
            : `This collection is confidential and requires permission to access`,
      };
    }

    // Default: access denied
    return {
      status: 'denied',
      message: 'Access denied',
    };
  },

  // Create payment intent for collection purchase
  createPaymentIntent: async (
    collectionId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<PaymentIntent> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const collection =
      mockCollectionDetails[collectionId as keyof typeof mockCollectionDetails];
    if (!collection) {
      throw new Error('Collection not found');
    }

    if (collection.pricing <= 0) {
      throw new Error('Collection is free to access');
    }

    // In a real implementation, this would create a Stripe payment intent
    // For now, we'll return a mock payment intent
    return {
      clientSecret: `pi_mock_${collectionId}_${Date.now()}`,
      amount: collection.pricing * 100, // Convert to cents
      currency: 'usd',
    };
  },

  // Confirm payment and grant access
  confirmPayment: async (
    collectionId: string,
    paymentIntentId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<{ success: boolean; message?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real implementation, this would verify the payment with Stripe
    // and grant access to the collection
    const userId = authenticatedUser.user.identifier;

    // Add the collection to the user's shared collections
    if (!mockSharedCollections[userId]) {
      mockSharedCollections[userId] = [];
    }
    if (!mockSharedCollections[userId].includes(collectionId)) {
      mockSharedCollections[userId].push(collectionId);
    }

    return {
      success: true,
      message: 'Payment successful! You now have access to this collection.',
    };
  },

  // Get all collections for a specific user (owned + shared + accessed public)
  getCollections: async (
    authenticatedUser: AuthenticatedUser
  ): Promise<Collection[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simulate potential error (uncomment to test error handling)
    // if (Math.random() > 0.9) throw new Error('Failed to fetch collections');

    const userId = authenticatedUser.user.identifier;

    // Get collections owned by the user
    const ownedCollections = mockCollections.filter(
      (collection) => collection.createdBy === userId
    );

    // Get collections shared with the user (includes accessed public collections)
    const sharedCollectionIds =
      mockSharedCollections[userId as keyof typeof mockSharedCollections] || [];
    const sharedCollections = mockCollections.filter((collection) =>
      sharedCollectionIds.includes(collection.id)
    );

    // Combine owned and shared collections
    return [...ownedCollections, ...sharedCollections];
  },

  // Get single collection by ID (accessible to owners, shared users, or public collections)
  getCollection: async (
    id: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionDetail> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const collection =
      mockCollectionDetails[id as keyof typeof mockCollectionDetails];

    if (!collection) {
      throw new Error(`Collection with id ${id} not found`);
    }

    const userId = authenticatedUser.user.identifier;

    // Check ownership or sharing
    const isOwner = collection.createdBy === userId;
    const isShared = (
      mockSharedCollections[userId as keyof typeof mockSharedCollections] || []
    ).includes(id);

    // Public collections are accessible to everyone
    if (collection.visibility === 'public') {
      // Track that user has accessed this collection
      await collectionsApi.trackCollectionAccess(id, authenticatedUser);
      return collection;
    }

    // For non-public collections, check ownership or sharing
    if (!isOwner && !isShared) {
      throw new Error(
        'Access denied - you do not have access to this collection'
      );
    }

    return collection;
  },

  // Track when a user accesses a collection (for collections they don't own)
  trackCollectionAccess: async (
    collectionId: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const userId = authenticatedUser.user.identifier;
    const collection =
      mockCollectionDetails[collectionId as keyof typeof mockCollectionDetails];

    if (!collection) {
      return; // Collection doesn't exist
    }

    // Only track access for collections the user doesn't own
    if (collection.createdBy === userId) {
      return; // User owns this collection, no need to track
    }

    // Add the collection to the user's accessed collections
    if (!mockSharedCollections[userId]) {
      mockSharedCollections[userId] = [];
    }
    if (!mockSharedCollections[userId].includes(collectionId)) {
      mockSharedCollections[userId].push(collectionId);
    }
  },

  // Update collection (only if owned by user)
  updateCollection: async (
    id: string,
    updates: { visibility?: Visibility; pricing?: number },
    authenticatedUser: AuthenticatedUser
  ): Promise<CollectionDetail> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const collection =
      mockCollectionDetails[id as keyof typeof mockCollectionDetails];

    if (!collection) {
      throw new Error(`Collection with id ${id} not found`);
    }

    const userId = authenticatedUser.user.identifier;

    // Only owners can update collections
    if (collection.createdBy !== userId) {
      throw new Error(
        'Access denied - only collection owners can update collections'
      );
    }

    // Update the collection in memory
    const updatedCollection = {
      ...collection,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    // Update both mock data structures
    mockCollectionDetails[id as keyof typeof mockCollectionDetails] =
      updatedCollection;

    // Find and update in mockCollections array
    const collectionIndex = mockCollections.findIndex((c) => c.id === id);
    if (collectionIndex !== -1) {
      mockCollections[collectionIndex] = {
        ...mockCollections[collectionIndex],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
    }

    return updatedCollection;
  },

  // Search collections (only user's own collections + shared collections)
  searchCollections: async (
    query: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<Collection[]> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const userId = authenticatedUser.user.identifier;

    // Get collections owned by the user
    const ownedCollections = mockCollections.filter(
      (collection) => collection.createdBy === userId
    );

    // Get collections shared with the user
    const sharedCollectionIds =
      mockSharedCollections[userId as keyof typeof mockSharedCollections] || [];
    const sharedCollections = mockCollections.filter((collection) =>
      sharedCollectionIds.includes(collection.id)
    );

    // Combine and filter
    const userCollections = [...ownedCollections, ...sharedCollections];

    const filtered = userCollections.filter(
      (collection) =>
        collection.name.toLowerCase().includes(query.toLowerCase()) ||
        collection.description.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  },

  // Search all collections for adding to user's list (excludes user's own and private collections)
  searchAllCollections: async (
    query: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<Collection[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const userId = authenticatedUser.user.identifier;
    const userOwnedIds = mockCollections
      .filter((collection) => collection.createdBy === userId)
      .map((collection) => collection.id);

    const userSharedIds =
      mockSharedCollections[userId as keyof typeof mockSharedCollections] || [];
    const userAccessibleIds = [...userOwnedIds, ...userSharedIds];

    // Filter collections that user doesn't already have access to AND are public only
    // Confidential collections should only be accessible via exact ID/URL, not searchable by name
    const availableCollections = mockCollections.filter((collection) => {
      const isNotAccessible = !userAccessibleIds.includes(collection.id);
      const isPublic = collection.visibility === 'public';

      return isNotAccessible && isPublic;
    });

    // Extract collection ID from URL if it's a full URL
    let searchTerm = query.trim();
    if (query.includes('/collections/')) {
      const match = query.match(/\/collections\/([^\/\?]+)/);
      searchTerm = match ? match[1] : query;
    }

    const lowerQuery = searchTerm.toLowerCase();

    const searchResults = availableCollections.filter(
      (collection) =>
        collection.id.toLowerCase().includes(lowerQuery) ||
        collection.name.toLowerCase().includes(lowerQuery) ||
        collection.description.toLowerCase().includes(lowerQuery)
    );

    return searchResults;
  },

  // Get user info by ID
  getUser: async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockUsers[userId as keyof typeof mockUsers];
  },

  // Get image data by ID
  getImage: async (imageId: string): Promise<ImageData> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const image = mockImages[imageId as keyof typeof mockImages];

    if (!image) {
      throw new Error(`Image with id ${imageId} not found`);
    }

    return image;
  },
};
