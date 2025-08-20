'use client';

import CollectionCard from '@/components/authed/CollectionCard';
import DashboardTopBar from '@/components/layout/dashboard-top-bar';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import Popover from '@/components/shared/popover';
import { ArrowUpDown, Filter, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

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

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'unpublished'>('all');
  const [filterPricing, setFilterPricing] = useState<'all' | 'paid' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'lastUpdated' | 'name'>('lastUpdated');
  const [openFilterPopover, setOpenFilterPopover] = useState(false);
  const [openSortPopover, setOpenSortPopover] = useState(false);

  // Filter collections based on search and filters
  const filteredCollections = mockCollections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPublishedFilter = filterPublished === 'all' ||
                                 (filterPublished === 'published' && collection.isPublished) ||
                                 (filterPublished === 'unpublished' && !collection.isPublished);

    const matchesPricingFilter = filterPricing === 'all' ||
                                (filterPricing === 'paid' && collection.hasPricing) ||
                                (filterPricing === 'free' && !collection.hasPricing);

    return matchesSearch && matchesPublishedFilter && matchesPricingFilter;
  });

  // Sort collections
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (sortBy === 'lastUpdated') {
      // Simple sorting based on the "X days ago" format
      const getDays = (timeStr: string) => {
        if (timeStr.includes('day')) {
          return parseInt(timeStr.split(' ')[0]);
        }
        if (timeStr.includes('week')) {
          return parseInt(timeStr.split(' ')[0]) * 7;
        }
        return 999; // For "X weeks ago" or other formats
      };
      return getDays(a.lastUpdated) - getDays(b.lastUpdated);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const breadcrumbs = [
    { label: 'Collections', href: '/authed' }
  ];

      return (
    <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal">
      <DashboardTopBar breadcrumbs={breadcrumbs} />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 min-w-[350px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-br from-purple-100 to-orange-300 bg-clip-text font-display text-3xl md:text-5xl font-bold text-transparent drop-shadow-sm [text-wrap:balance]">Collections</h1>
              <p className="mt-2 text-white/80 font-extralight">
                Manage and organize your digital assets
              </p>
            </div>
            <Button
              className="flex gap-2 px-6 py-2 bg-cyan-100/80 font-display text-black text-sm rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              <Plus className="h-4 w-4" />
              <span>New Collection</span>
            </Button>
          </div>
        </div>

                        {/* Search and Filter Bar */}
        <div className="mb-6 flex items-center space-x-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40"
            />
          </div>

          {/* Filter Button */}
          <Popover
            content={
              <div className="w-full p-4">
                <div className="text-base text-gray-900 font-medium mb-3">Filter by:</div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Status</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="published"
                          value="all"
                          checked={filterPublished === 'all'}
                          onChange={(e) => setFilterPublished(e.target.value as any)}
                          className="text-green-500"
                        />
                        <span className="text-gray-900 text-sm">All</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="published"
                          value="published"
                          checked={filterPublished === 'published'}
                          onChange={(e) => setFilterPublished(e.target.value as any)}
                          className="text-green-500"
                        />
                        <span className="text-gray-900 text-sm">Published</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="published"
                          value="unpublished"
                          checked={filterPublished === 'unpublished'}
                          onChange={(e) => setFilterPublished(e.target.value as any)}
                          className="text-green-500"
                        />
                        <span className="text-gray-900 text-sm">Unpublished</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Pricing</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="pricing"
                          value="all"
                          checked={filterPricing === 'all'}
                          onChange={(e) => setFilterPricing(e.target.value as any)}
                          className="text-purple-500"
                        />
                        <span className="text-gray-900 text-sm">All</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="pricing"
                          value="paid"
                          checked={filterPricing === 'paid'}
                          onChange={(e) => setFilterPricing(e.target.value as any)}
                          className="text-purple-500"
                        />
                        <span className="text-gray-900 text-sm">Paid</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="pricing"
                          value="free"
                          checked={filterPricing === 'free'}
                          onChange={(e) => setFilterPricing(e.target.value as any)}
                          className="text-purple-500"
                        />
                        <span className="text-gray-900 text-sm">Free</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            }
            openPopover={openFilterPopover}
            setOpenPopover={setOpenFilterPopover}
            align="end"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0 px-3"
              onClick={() => setOpenFilterPopover(!openFilterPopover)}
            >
              <Filter className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Filter</span>
            </Button>
          </Popover>

          {/* Sort Button */}
          <Popover
            content={
              <div className="w-full max-w-xs p-4">
                <div className="text-base text-gray-900 font-medium mb-3">Sort by:</div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sort"
                      value="lastUpdated"
                      checked={sortBy === 'lastUpdated'}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-blue-500"
                    />
                    <span className="text-gray-900 text-sm">Last Updated</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sort"
                      value="name"
                      checked={sortBy === 'name'}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-blue-500"
                    />
                    <span className="text-gray-900 text-sm">Name</span>
                  </label>
                </div>
              </div>
            }
            openPopover={openSortPopover}
            setOpenPopover={setOpenSortPopover}
            align="end"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0 px-3"
              onClick={() => setOpenSortPopover(!openSortPopover)}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Sort</span>
            </Button>
          </Popover>
        </div>

        {/* Collections Grid */}
        {sortedCollections.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {sortedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                href={`/authed/collections/${collection.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-white/60">
              <Search className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-white">No collections found</h3>
            <p className="mt-1 text-sm text-white/80">
              {searchQuery || filterPublished !== 'all' || filterPricing !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first collection.'
              }
            </p>
            {!searchQuery && filterPublished === 'all' && filterPricing === 'all' ? (
              <div className="mt-6 flex justify-center">
                <Button
                  className="flex gap-2 px-6 py-2 bg-cyan-100/80 font-display text-black text-sm rounded-lg opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Plus className="h-4 w-4" />
                  <span>New Collection</span>
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex justify-center">
                <Button
                className="flex gap-2 px-6 py-2 bg-gray-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-teal/80 hover:text-gray-800"
                onClick={() => {
                  setSearchQuery('');
                  setFilterPublished('all');
                  setFilterPricing('all');
                }}
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
