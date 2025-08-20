'use client';

import DashboardTopBar from '@/components/layout/dashboard-top-bar';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import Popover from '@/components/shared/popover';
import CollectionCard from '@/components/verification/CollectionCard';
import { useCollections, usePrefetchCollection, useSearchCollections } from '@/lib/hooks/use-collections';
import { ArrowUpDown, Filter, Loader2, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';



export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'unpublished'>('all');
  const [filterPricing, setFilterPricing] = useState<'all' | 'paid' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'lastUpdated' | 'name'>('lastUpdated');
  const [openFilterPopover, setOpenFilterPopover] = useState(false);
  const [openSortPopover, setOpenSortPopover] = useState(false);

  // React Query hooks
  const { data: collections = [], isLoading, error } = useCollections();
  const { data: searchResults, isLoading: isSearching } = useSearchCollections(searchQuery);
  const prefetchCollection = usePrefetchCollection();

  // Use search results if there's a search query, otherwise use all collections
  const allCollections = searchQuery ? (searchResults || []) : collections;

  // Filter collections based on search and filters
  const filteredCollections = allCollections.filter((collection: any) => {
    const matchesPublishedFilter = filterPublished === 'all' ||
                                 (filterPublished === 'published' && collection.isPublished) ||
                                 (filterPublished === 'unpublished' && !collection.isPublished);

    const matchesPricingFilter = filterPricing === 'all' ||
                                (filterPricing === 'paid' && collection.hasPricing) ||
                                (filterPricing === 'free' && !collection.hasPricing);

    return matchesPublishedFilter && matchesPricingFilter;
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading collections...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-white/60">
              <X className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-white">Error loading collections</h3>
            <p className="mt-1 text-sm text-white/80">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </div>
        ) : isSearching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Searching collections...</span>
          </div>
        ) : sortedCollections.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {sortedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                href={`/authed/collections/${collection.id}`}
                onMouseEnter={() => prefetchCollection(collection.id)}
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
