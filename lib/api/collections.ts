import type { AuthenticatedUser } from '@/lib/api/models/AuthenticatedUser';

// Mock data for collections
const mockCollections = [
  {
    id: '1',
    name: 'Nature Photography',
    description:
      'A collection of stunning nature photographs from around the world, featuring landscapes, wildlife, and botanical subjects.',
    assetCount: 24,
    visibility: 'public' as Visibility,
    pricing: 20,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdBy: 'user1',
    previewAssets: [
      { id: '1', name: 'Mountain Lake', type: 'image' as const },
      { id: '2', name: 'Forest Path', type: 'image' as const },
      { id: '3', name: 'Sunset Valley', type: 'image' as const },
      { id: '4', name: 'Wildlife Portrait', type: 'image' as const },
      { id: '5', name: 'Botanical Close-up', type: 'image' as const },
      { id: '6', name: 'Landscape Panorama', type: 'image' as const },
    ],
  },
  {
    id: '2',
    name: 'Urban Architecture',
    description:
      'Modern and classic architectural photography showcasing cityscapes, buildings, and urban design elements.',
    assetCount: 18,
    visibility: 'confidential' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    createdBy: 'user1',
    previewAssets: [
      { id: '7', name: 'Modern Skyscraper', type: 'image' as const },
      { id: '8', name: 'Historic Building', type: 'image' as const },
      { id: '9', name: 'City Street', type: 'image' as const },
      { id: '10', name: 'Architectural Detail', type: 'image' as const },
      { id: '11', name: 'Urban Landscape', type: 'image' as const },
      { id: '12', name: 'Building Interior', type: 'image' as const },
    ],
  },
  {
    id: '3',
    name: 'Portrait Series',
    description:
      'Professional portrait photography featuring diverse subjects in various lighting and style approaches.',
    assetCount: 12,
    visibility: 'not-shared' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    createdBy: 'user1',
    previewAssets: [
      { id: '13', name: 'Professional Headshot', type: 'image' as const },
      { id: '14', name: 'Environmental Portrait', type: 'image' as const },
      { id: '15', name: 'Studio Portrait', type: 'image' as const },
      { id: '16', name: 'Candid Portrait', type: 'image' as const },
      { id: '17', name: 'Group Portrait', type: 'image' as const },
      { id: '18', name: 'Artistic Portrait', type: 'image' as const },
    ],
  },
  {
    id: '4',
    name: 'Abstract Art',
    description:
      'Experimental and abstract photography exploring patterns, textures, and creative compositions.',
    assetCount: 31,
    visibility: 'public' as Visibility,
    pricing: 15,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    createdBy: 'user2',
    previewAssets: [
      { id: '19', name: 'Abstract Pattern', type: 'image' as const },
      { id: '20', name: 'Texture Study', type: 'image' as const },
      { id: '21', name: 'Color Composition', type: 'image' as const },
      { id: '22', name: 'Geometric Form', type: 'image' as const },
      { id: '23', name: 'Light Play', type: 'image' as const },
      { id: '24', name: 'Abstract Motion', type: 'image' as const },
    ],
  },
  {
    id: '5',
    name: 'Travel Diary',
    description:
      'Personal travel photography documenting journeys, cultures, and experiences from various destinations.',
    assetCount: 45,
    visibility: 'confidential' as Visibility,
    pricing: 25,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdBy: 'user2',
    previewAssets: [
      { id: '25', name: 'Travel Video', type: 'video' as const },
      { id: '26', name: 'Cultural Event', type: 'image' as const },
      { id: '27', name: 'Local Market', type: 'image' as const },
      { id: '28', name: 'Landmark Photo', type: 'image' as const },
      { id: '29', name: 'Street Scene', type: 'image' as const },
      { id: '30', name: 'Travel Document', type: 'document' as const },
    ],
  },
  {
    id: '6',
    name: 'Product Photography',
    description:
      'High-quality product shots for commercial use, featuring various items in professional studio settings.',
    assetCount: 8,
    visibility: 'not-shared' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    createdBy: 'user3',
    previewAssets: [
      { id: '31', name: 'Product Shot 1', type: 'image' as const },
      { id: '32', name: 'Product Shot 2', type: 'image' as const },
      { id: '33', name: 'Product Shot 3', type: 'image' as const },
      { id: '34', name: 'Product Shot 4', type: 'image' as const },
      { id: '35', name: 'Product Shot 5', type: 'image' as const },
      { id: '36', name: 'Product Shot 6', type: 'image' as const },
    ],
  },
  {
    id: '7',
    name: 'Public Development Collection',
    description: 'A test collection for development and testing purposes.',
    assetCount: 5,
    visibility: 'public' as Visibility,
    pricing: 10,
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    createdBy: 'dev-user-123',
    previewAssets: [
      { id: '37', name: 'Test Image 1', type: 'image' as const },
      { id: '38', name: 'Test Image 2', type: 'image' as const },
      { id: '39', name: 'Test Document', type: 'document' as const },
    ],
  },
  {
    id: '8',
    name: 'Private Development Collection',
    description: 'A private collection for testing not-shared visibility.',
    assetCount: 3,
    visibility: 'not-shared' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdBy: 'dev-user-123',
    previewAssets: [
      { id: '40', name: 'Private Image 1', type: 'image' as const },
      { id: '41', name: 'Private Image 2', type: 'image' as const },
    ],
  },
  {
    id: '9',
    name: 'Shared Confidential Collection',
    description:
      'A confidential collection shared with the development user by Alice Johnson.',
    assetCount: 12,
    visibility: 'confidential' as Visibility,
    pricing: 30,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    createdBy: 'user1',
    previewAssets: [
      { id: '42', name: 'Shared Image 1', type: 'image' as const },
      { id: '43', name: 'Shared Image 2', type: 'image' as const },
      { id: '44', name: 'Shared Document', type: 'document' as const },
    ],
  },
];

// Mock collection detail data
const mockCollectionDetails = {
  '1': {
    id: '1',
    name: 'Nature Photography',
    description:
      'A collection of stunning nature photographs from around the world, featuring landscapes, wildlife, and botanical subjects.',
    assetCount: 24,
    visibility: 'public' as Visibility,
    pricing: 20,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdBy: 'user1',
    assets: [
      {
        id: '1',
        name: 'Mountain Lake',
        type: 'image',
        size: '2.4 MB',
        uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Forest Path',
        type: 'image',
        size: '1.8 MB',
        uploaded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'Sunset Valley',
        type: 'image',
        size: '3.1 MB',
        uploaded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Urban Architecture',
    description:
      'Modern and classic architectural photography showcasing cityscapes, buildings, and urban design elements.',
    assetCount: 18,
    visibility: 'confidential' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    createdBy: 'user1',
    assets: [
      {
        id: '4',
        name: 'Modern Skyscraper',
        type: 'image',
        size: '1.9 MB',
        uploaded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        name: 'Historic Building',
        type: 'image',
        size: '2.2 MB',
        uploaded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Portrait Series',
    description:
      'Professional portrait photography featuring diverse subjects in various lighting and style approaches.',
    assetCount: 12,
    visibility: 'not-shared' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    createdBy: 'user1',
    assets: [
      {
        id: '6',
        name: 'Professional Headshot',
        type: 'image',
        size: '1.5 MB',
        uploaded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '7',
        name: 'Environmental Portrait',
        type: 'image',
        size: '2.8 MB',
        uploaded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Abstract Art',
    description:
      'Experimental and abstract photography exploring patterns, textures, and creative compositions.',
    assetCount: 31,
    visibility: 'public' as Visibility,
    pricing: 15,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    createdBy: 'user2',
    assets: [
      {
        id: '8',
        name: 'Abstract Pattern',
        type: 'image',
        size: '3.2 MB',
        uploaded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '9',
        name: 'Texture Study',
        type: 'image',
        size: '2.1 MB',
        uploaded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '5': {
    id: '5',
    name: 'Travel Diary',
    description:
      'Personal travel photography documenting journeys, cultures, and experiences from various destinations.',
    assetCount: 45,
    visibility: 'confidential' as Visibility,
    pricing: 25,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdBy: 'user2',
    assets: [
      {
        id: '10',
        name: 'Travel Video',
        type: 'video',
        size: '15.2 MB',
        uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '11',
        name: 'Cultural Event',
        type: 'image',
        size: '2.7 MB',
        uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '6': {
    id: '6',
    name: 'Confidential Development Collection',
    description:
      'A confidential collection for testing confidential visibility.',
    assetCount: 8,
    visibility: 'confidential' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    createdBy: 'dev-user-123',
    assets: [
      {
        id: '12',
        name: 'Product Shot 1',
        type: 'image',
        size: '1.6 MB',
        uploaded: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '13',
        name: 'Product Shot 2',
        type: 'image',
        size: '1.8 MB',
        uploaded: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '7': {
    id: '7',
    name: 'Public Development Collection',
    description: 'A test collection for development and testing purposes.',
    assetCount: 5,
    visibility: 'public' as Visibility,
    pricing: 10,
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    createdBy: 'dev-user-123',
    assets: [
      {
        id: '14',
        name: 'Test Image 1',
        type: 'image',
        size: '1.2 MB',
        uploaded: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '15',
        name: 'Test Image 2',
        type: 'image',
        size: '0.8 MB',
        uploaded: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '16',
        name: 'Test Document',
        type: 'document',
        size: '0.5 MB',
        uploaded: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '8': {
    id: '8',
    name: 'Private Development Collection',
    description: 'A private collection for testing not-shared visibility.',
    assetCount: 3,
    visibility: 'not-shared' as Visibility,
    pricing: 0,
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdBy: 'dev-user-123',
    assets: [
      {
        id: '17',
        name: 'Private Image 1',
        type: 'image',
        size: '2.1 MB',
        uploaded: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: '18',
        name: 'Private Image 2',
        type: 'image',
        size: '1.7 MB',
        uploaded: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
  },
  '9': {
    id: '9',
    name: 'Shared Confidential Collection',
    description:
      'A confidential collection shared with the development user by Alice Johnson.',
    assetCount: 12,
    visibility: 'confidential' as Visibility,
    pricing: 30,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    createdBy: 'user1',
    assets: [
      {
        id: '19',
        name: 'Shared Image 1',
        type: 'image',
        size: '2.3 MB',
        uploaded: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '20',
        name: 'Shared Image 2',
        type: 'image',
        size: '1.9 MB',
        uploaded: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '21',
        name: 'Shared Document',
        type: 'document',
        size: '0.8 MB',
        uploaded: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
};

// Mock user data for testing
const mockUsers = {
  user1: {
    identifier: 'user1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
  },
  user2: { identifier: 'user2', name: 'Bob Smith', email: 'bob@example.com' },
  user3: {
    identifier: 'user3',
    name: 'Carol Davis',
    email: 'carol@example.com',
  },
  'dev-user-123': {
    identifier: 'dev-user-123',
    name: 'Development User',
    email: 'dev@safehill.io',
  },
};

// Mock image data for testing
const mockImages = {
  '1': {
    id: '1',
    name: 'Mountain Lake',
    url: 'https://picsum.photos/300/300?random=1',
    thumbnailUrl: 'https://picsum.photos/150/150?random=1',
  },
  '2': {
    id: '2',
    name: 'Forest Path',
    url: 'https://picsum.photos/300/300?random=2',
    thumbnailUrl: 'https://picsum.photos/150/150?random=2',
  },
  '3': {
    id: '3',
    name: 'Sunset Valley',
    url: 'https://picsum.photos/300/300?random=3',
    thumbnailUrl: 'https://picsum.photos/150/150?random=3',
  },
  '4': {
    id: '4',
    name: 'Modern Skyscraper',
    url: 'https://picsum.photos/300/300?random=4',
    thumbnailUrl: 'https://picsum.photos/150/150?random=4',
  },
  '5': {
    id: '5',
    name: 'Historic Building',
    url: 'https://picsum.photos/300/300?random=5',
    thumbnailUrl: 'https://picsum.photos/150/150?random=5',
  },
  '6': {
    id: '6',
    name: 'Professional Headshot',
    url: 'https://picsum.photos/300/300?random=6',
    thumbnailUrl: 'https://picsum.photos/150/150?random=6',
  },
  '7': {
    id: '7',
    name: 'Environmental Portrait',
    url: 'https://picsum.photos/300/300?random=7',
    thumbnailUrl: 'https://picsum.photos/150/150?random=7',
  },
  '8': {
    id: '8',
    name: 'Abstract Pattern',
    url: 'https://picsum.photos/300/300?random=8',
    thumbnailUrl: 'https://picsum.photos/150/150?random=8',
  },
  '9': {
    id: '9',
    name: 'Texture Study',
    url: 'https://picsum.photos/300/300?random=9',
    thumbnailUrl: 'https://picsum.photos/150/150?random=9',
  },
  '10': {
    id: '10',
    name: 'Travel Video',
    url: 'https://picsum.photos/300/300?random=10',
    thumbnailUrl: 'https://picsum.photos/150/150?random=10',
  },
  '11': {
    id: '11',
    name: 'Cultural Event',
    url: 'https://picsum.photos/300/300?random=11',
    thumbnailUrl: 'https://picsum.photos/150/150?random=11',
  },
  '12': {
    id: '12',
    name: 'Product Shot 1',
    url: 'https://picsum.photos/300/300?random=12',
    thumbnailUrl: 'https://picsum.photos/150/150?random=12',
  },
  '13': {
    id: '13',
    name: 'Product Shot 2',
    url: 'https://picsum.photos/300/300?random=13',
    thumbnailUrl: 'https://picsum.photos/150/150?random=13',
  },
  '14': {
    id: '14',
    name: 'Test Image 1',
    url: 'https://picsum.photos/300/300?random=14',
    thumbnailUrl: 'https://picsum.photos/150/150?random=14',
  },
  '15': {
    id: '15',
    name: 'Test Image 2',
    url: 'https://picsum.photos/300/300?random=15',
    thumbnailUrl: 'https://picsum.photos/150/150?random=15',
  },
  '16': {
    id: '16',
    name: 'Test Document',
    url: 'https://picsum.photos/300/300?random=16',
    thumbnailUrl: 'https://picsum.photos/150/150?random=16',
  },
  '17': {
    id: '17',
    name: 'Private Image 1',
    url: 'https://picsum.photos/300/300?random=17',
    thumbnailUrl: 'https://picsum.photos/150/150?random=17',
  },
  '18': {
    id: '18',
    name: 'Private Image 2',
    url: 'https://picsum.photos/300/300?random=18',
    thumbnailUrl: 'https://picsum.photos/150/150?random=18',
  },
  '19': {
    id: '19',
    name: 'Shared Image 1',
    url: 'https://picsum.photos/300/300?random=19',
    thumbnailUrl: 'https://picsum.photos/150/150?random=19',
  },
  '20': {
    id: '20',
    name: 'Shared Image 2',
    url: 'https://picsum.photos/300/300?random=20',
    thumbnailUrl: 'https://picsum.photos/150/150?random=20',
  },
  '21': {
    id: '21',
    name: 'Shared Document',
    url: 'https://picsum.photos/300/300?random=21',
    thumbnailUrl: 'https://picsum.photos/150/150?random=21',
  },
};

// Mock sharing data - tracks which collections are shared with which users
const mockSharedCollections = {
  'dev-user-123': ['9'], // Collection 9 is shared with dev-user-123
};

// Types
export type Visibility = 'public' | 'confidential' | 'not-shared';

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
  // Get all collections for a specific user (owned + shared)
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

    // Get collections shared with the user
    const sharedCollectionIds =
      mockSharedCollections[userId as keyof typeof mockSharedCollections] || [];
    const sharedCollections = mockCollections.filter((collection) =>
      sharedCollectionIds.includes(collection.id)
    );

    // Combine owned and shared collections
    return [...ownedCollections, ...sharedCollections];
  },

  // Get single collection by ID (only if owned by user or shared with user)
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

    if (!isOwner && !isShared) {
      throw new Error(
        'Access denied - you do not have access to this collection'
      );
    }

    return collection;
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

  // Get user info by ID
  getUser: async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockUsers[userId as keyof typeof mockUsers];
  },

  // Get image data by ID
  getImage: async (imageId: string): Promise<ImageData> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    // console.log('getImage called with:', imageId);
    // console.log('Available mock images:', Object.keys(mockImages));

    const image = mockImages[imageId as keyof typeof mockImages];

    // console.log('Found image:', image);

    if (!image) {
      throw new Error(`Image with id ${imageId} not found`);
    }

    return image;
  },
};
