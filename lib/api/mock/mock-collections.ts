import type { Visibility } from '@/lib/api/collections';

// Mock data for collections
export const mockCollections = [
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
  {
    id: '10',
    name: 'Premium Photography Collection',
    description:
      'High-quality professional photography collection with exclusive content.',
    assetCount: 25,
    visibility: 'confidential' as Visibility,
    pricing: 50,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdBy: 'user2',
    previewAssets: [
      { id: '45', name: 'Premium Image 1', type: 'image' as const },
      { id: '46', name: 'Premium Image 2', type: 'image' as const },
      { id: '47', name: 'Premium Video', type: 'video' as const },
    ],
  },
  {
    id: '11',
    name: 'Public Premium Collection',
    description: 'A public collection that requires payment to access.',
    assetCount: 15,
    visibility: 'public' as Visibility,
    pricing: 25,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdBy: 'user3',
    previewAssets: [
      { id: '48', name: 'Public Premium 1', type: 'image' as const },
      { id: '49', name: 'Public Premium 2', type: 'image' as const },
    ],
  },
];

// Mock collection detail data
export const mockCollectionDetails = {
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
  '10': {
    id: '10',
    name: 'Premium Photography Collection',
    description:
      'High-quality professional photography collection with exclusive content.',
    assetCount: 25,
    visibility: 'confidential' as Visibility,
    pricing: 50,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdBy: 'user2',
    assets: [
      {
        id: '22',
        name: 'Premium Image 1',
        type: 'image',
        size: '3.2 MB',
        uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '23',
        name: 'Premium Image 2',
        type: 'image',
        size: '2.8 MB',
        uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '24',
        name: 'Premium Video',
        type: 'video',
        size: '45.6 MB',
        uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  '11': {
    id: '11',
    name: 'Public Premium Collection',
    description: 'A public collection that requires payment to access.',
    assetCount: 15,
    visibility: 'public' as Visibility,
    pricing: 25,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdBy: 'user3',
    assets: [
      {
        id: '25',
        name: 'Public Premium 1',
        type: 'image',
        size: '2.1 MB',
        uploaded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '26',
        name: 'Public Premium 2',
        type: 'image',
        size: '1.7 MB',
        uploaded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
};
