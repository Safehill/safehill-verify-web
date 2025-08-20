// Mock data for collections
const mockCollections = [
  {
    id: '1',
    name: 'Nature Photography',
    description: 'A collection of stunning nature photographs from around the world, featuring landscapes, wildlife, and botanical subjects.',
    assetCount: 24,
    isPublished: true,
    hasPricing: true,
    lastUpdated: '2 days ago',
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
    description: 'Modern and classic architectural photography showcasing cityscapes, buildings, and urban design elements.',
    assetCount: 18,
    isPublished: false,
    hasPricing: false,
    lastUpdated: '1 week ago',
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
    description: 'Professional portrait photography featuring diverse subjects in various lighting and style approaches.',
    assetCount: 12,
    isPublished: true,
    hasPricing: false,
    lastUpdated: '3 days ago',
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
    description: 'Experimental and abstract photography exploring patterns, textures, and creative compositions.',
    assetCount: 31,
    isPublished: false,
    hasPricing: true,
    lastUpdated: '5 days ago',
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
    description: 'Personal travel photography documenting journeys, cultures, and experiences from various destinations.',
    assetCount: 45,
    isPublished: true,
    hasPricing: true,
    lastUpdated: '1 day ago',
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
    description: 'High-quality product shots for commercial use, featuring various items in professional studio settings.',
    assetCount: 8,
    isPublished: false,
    hasPricing: false,
    lastUpdated: '2 weeks ago',
    previewAssets: [
      { id: '31', name: 'Product Shot 1', type: 'image' as const },
      { id: '32', name: 'Product Shot 2', type: 'image' as const },
      { id: '33', name: 'Product Shot 3', type: 'image' as const },
      { id: '34', name: 'Product Shot 4', type: 'image' as const },
      { id: '35', name: 'Product Shot 5', type: 'image' as const },
      { id: '36', name: 'Product Shot 6', type: 'image' as const },
    ],
  },
];

// Mock collection detail data
const mockCollectionDetails = {
  '1': {
    id: '1',
    name: 'Nature Photography',
    description: 'A collection of stunning nature photographs from around the world, featuring landscapes, wildlife, and botanical subjects.',
    assetCount: 24,
    isPublished: true,
    hasPricing: true,
    lastUpdated: '2 days ago',
    assets: [
      { id: '1', name: 'Mountain Lake', type: 'image', size: '2.4 MB', uploaded: '1 day ago' },
      { id: '2', name: 'Forest Path', type: 'image', size: '1.8 MB', uploaded: '2 days ago' },
      { id: '3', name: 'Sunset Valley', type: 'image', size: '3.1 MB', uploaded: '3 days ago' },
    ]
  },
  '2': {
    id: '2',
    name: 'Urban Architecture',
    description: 'Modern and classic architectural photography showcasing cityscapes, buildings, and urban design elements.',
    assetCount: 18,
    isPublished: false,
    hasPricing: false,
    lastUpdated: '1 week ago',
    assets: [
      { id: '4', name: 'Modern Skyscraper', type: 'image', size: '1.9 MB', uploaded: '1 week ago' },
      { id: '5', name: 'Historic Building', type: 'image', size: '2.2 MB', uploaded: '1 week ago' },
    ]
  },
  '3': {
    id: '3',
    name: 'Portrait Series',
    description: 'Professional portrait photography featuring diverse subjects in various lighting and style approaches.',
    assetCount: 12,
    isPublished: true,
    hasPricing: false,
    lastUpdated: '3 days ago',
    assets: [
      { id: '6', name: 'Professional Headshot', type: 'image', size: '1.5 MB', uploaded: '3 days ago' },
      { id: '7', name: 'Environmental Portrait', type: 'image', size: '2.8 MB', uploaded: '3 days ago' },
    ]
  },
  '4': {
    id: '4',
    name: 'Abstract Art',
    description: 'Experimental and abstract photography exploring patterns, textures, and creative compositions.',
    assetCount: 31,
    isPublished: false,
    hasPricing: true,
    lastUpdated: '5 days ago',
    assets: [
      { id: '8', name: 'Abstract Pattern', type: 'image', size: '3.2 MB', uploaded: '5 days ago' },
      { id: '9', name: 'Texture Study', type: 'image', size: '2.1 MB', uploaded: '5 days ago' },
    ]
  },
  '5': {
    id: '5',
    name: 'Travel Diary',
    description: 'Personal travel photography documenting journeys, cultures, and experiences from various destinations.',
    assetCount: 45,
    isPublished: true,
    hasPricing: true,
    lastUpdated: '1 day ago',
    assets: [
      { id: '10', name: 'Travel Video', type: 'video', size: '15.2 MB', uploaded: '1 day ago' },
      { id: '11', name: 'Cultural Event', type: 'image', size: '2.7 MB', uploaded: '1 day ago' },
    ]
  },
  '6': {
    id: '6',
    name: 'Product Photography',
    description: 'High-quality product shots for commercial use, featuring various items in professional studio settings.',
    assetCount: 8,
    isPublished: false,
    hasPricing: false,
    lastUpdated: '2 weeks ago',
    assets: [
      { id: '12', name: 'Product Shot 1', type: 'image', size: '1.6 MB', uploaded: '2 weeks ago' },
      { id: '13', name: 'Product Shot 2', type: 'image', size: '1.8 MB', uploaded: '2 weeks ago' },
    ]
  },
};

// Types
export interface Collection {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  isPublished: boolean;
  hasPricing: boolean;
  lastUpdated: string;
  thumbnailUrl?: string;
  previewAssets?: Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    thumbnailUrl?: string;
  }>;
}

export interface CollectionDetail extends Collection {
  assets: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploaded: string;
  }>;
}

// API functions
export const collectionsApi = {
  // Get all collections
  getCollections: async (): Promise<Collection[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simulate potential error (uncomment to test error handling)
    // if (Math.random() > 0.9) throw new Error('Failed to fetch collections');

    return mockCollections;
  },

  // Get single collection by ID
  getCollection: async (id: string): Promise<CollectionDetail> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const collection = mockCollectionDetails[id as keyof typeof mockCollectionDetails];

    if (!collection) {
      throw new Error(`Collection with id ${id} not found`);
    }

    return collection;
  },

  // Search collections
  searchCollections: async (query: string): Promise<Collection[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));

    const filtered = mockCollections.filter(collection =>
      collection.name.toLowerCase().includes(query.toLowerCase()) ||
      collection.description.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  }
};
