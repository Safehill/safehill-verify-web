'use client';

import AssetGallery from '@/components/authed/AssetGallery';
import AssetTableRow from '@/components/authed/AssetTableRow';
import CollectionSettingsModal from '@/components/authed/CollectionSettingsModal';
import DashboardTopBar from '@/components/authed/dashboard-top-bar';
import { Avatar, AvatarFallback } from '@/components/shared/avatar';
import { Badge } from '@/components/shared/badge';
import { Button } from '@/components/shared/button';
import CopyButton from '@/components/shared/CopyButton';
import SegmentedControl from '@/components/shared/segmented-control';
import { generateCollectionLink } from '@/lib/api/collections';
import { useAuth } from '@/lib/auth/auth-context';
import { useCollection, useUser } from '@/lib/hooks/use-collections';
import { cn, timeAgo } from '@/lib/utils';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, Grid, List, Loader2, Plus, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';



// Generate a color based on user identifier (same as dashboard-top-bar.tsx)
function getAvatarColor(identifier: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-emerald-500',
  ];

  // Simple hash function to get consistent color for same identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return colors[Math.abs(hash) % colors.length];
}

// Get initials from user name or identifier (same as dashboard-top-bar.tsx)
function getInitials(name?: string, identifier?: string): string {
  if (name) {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (identifier) {
    return identifier.slice(0, 2).toUpperCase();
  }

  return 'U';
}

type SortField = 'name' | 'size' | 'uploaded' | null;
type SortDirection = 'asc' | 'desc';

export default function CollectionDetail() {
  const params = useParams();
  const collectionId = params.id as string;
  const { authedSession } = useAuth();
  const currentUserId = authedSession?.user.identifier;
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Fetch collection data using React Query
  const { data: collection, isLoading, error } = useCollection(collectionId);
  const { data: user } = useUser(collection?.createdBy || '');

  // Sort assets based on current sort state
  const sortedAssets = useMemo(() => {
    if (!collection?.assets || !sortField) {
      return collection?.assets || [];
    }

    return [...collection.assets].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          // Extract numeric size from string (e.g., "2.5 MB" -> 2.5)
          aValue = parseFloat(a.size.split(' ')[0]);
          bValue = parseFloat(b.size.split(' ')[0]);
          break;
        case 'uploaded':
          aValue = new Date(a.uploaded).getTime();
          bValue = new Date(b.uploaded).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [collection?.assets, sortField, sortDirection]);

  // Handle header click for sorting
  const handleHeaderClick = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon for header
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Avatar styling
  const avatarColor = collection?.createdBy ? getAvatarColor(collection.createdBy) : 'bg-gray-500';
  const initials = getInitials(user?.name, collection?.createdBy);
  const isOwned = collection?.createdBy === currentUserId;

  const breadcrumbs = [
    { label: 'Collections', href: '/authed' },
    { label: collection?.name || 'Loading...' }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal">
        <DashboardTopBar breadcrumbs={breadcrumbs} />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 min-w-[350px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading collection...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal">
        <DashboardTopBar breadcrumbs={breadcrumbs} />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 min-w-[350px]">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-white/60">
              <X className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-white">Error loading collection</h3>
            <p className="mt-1 text-sm text-white/80">
              {error instanceof Error ? error.message : 'Collection not found'}
            </p>
            <div className="mt-6">
              <Button className="flex gap-2 px-4 py-2 bg-gray-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-gray-200" asChild>
                <Link href="/authed">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Collections</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal">
      <DashboardTopBar breadcrumbs={breadcrumbs} />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 min-w-[350px]">
        {/* Header */}
        <div className="mb-8">
          {/* Buttons Row */}
          <div className="flex items-center justify-between mb-6">
            <Button className="flex gap-2 px-4 py-2 bg-gray-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:text-gray-800 hover:bg-gray-200" asChild>
              <Link href="/authed">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              {isOwned && (
                <Button
                  className="flex gap-2 px-4 py-2 bg-purple-300/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:text-gray-800 hover:bg-purple-200"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={cn(avatarColor, 'text-white font-medium text-lg')}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-5xl font-bold from-purple-100 bg-gradient-to-br to-orange-300 bg-clip-text text-transparent mb-4">{collection.name}</h1>
                <p className="text-white/80 mb-1">{collection.description}</p>
                <p className="text-gray-500 text-sm">Created and owned by <span className="font-black text-white/80">{user?.name}</span>. Last updated <span className="font-semibold text-white/80">{timeAgo(collection.lastUpdated)}</span>.</p>
                {(collection.visibility === 'public' || collection.visibility === 'confidential') && (
                  <div className="flex items-center space-x-3 mt-3">
                    <div
                      className={`
                        text-sm font-mono text-gray-400
                        border-b-2
                        ${collection.visibility === 'public' ? 'border-green-500' : ''}
                        ${collection.visibility === 'confidential' ? 'border-orange-500' : ''}
                        pb-0.5
                      `}
                      style={{
                        display: 'inline-block'
                      }}
                    >
                      {generateCollectionLink(collectionId)}
                    </div>
                    <CopyButton
                      text={generateCollectionLink(collectionId)}
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-gray-400 hover:text-gray-800 hover:bg-white/10 focus:text-gray-800 focus:bg-white/10 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
            <div className="text-center">
              <p className="text-xs font-medium text-white/60">Total Assets</p>
              <p className="text-3xl font-bold text-white mt-2 h-10">{collection.assetCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
            <div className="text-center">
              <p className="text-xs font-medium text-white/60">Visibility</p>
              <div className="flex items-center justify-center mt-2 h-10">
                {collection.visibility === 'public' && (
                   <Badge variant="secondary" className="text-sm bg-green-500/80 text-white border-green-400/50">
                     <Eye className="mr-1 h-4 w-4" />
                     Public
                   </Badge>
                 )}
                 {collection.visibility === 'confidential' && (
                   <Badge variant="outline" className="text-sm bg-orange-500/80 text-white border-orange-400/50">
                     Confidential
                   </Badge>
                 )}
                 {collection.visibility === 'not-shared' && (
                   <Badge variant="outline" className="text-sm bg-gray-500/80 text-white border-gray-400/50">
                     Not Shared
                   </Badge>
                 )}
              </div>
            </div>
          </div>

          {/* Show pricing only if not not-shared */}
          {collection.visibility !== 'not-shared' && (
            <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
              <div className="text-center">
                <p className="text-xs font-medium text-white/60">Price to Access</p>
                <div className="flex items-center justify-center mt-2 h-10">
                  {collection.pricing > 0 ? (
                    <Badge
                      variant="outline"
                      className={
                        collection.visibility === 'confidential'
                          ? "text-sm bg-purple-500/80 text-white border-purple-400/50"
                          : "text-sm bg-gray-500/80 text-white border-gray-400/50"
                      }
                    >
                      ${collection.pricing}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm bg-white/20 text-white border-white/30">
                      Free
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Show revenue only if not not-shared */}
          {collection.visibility !== 'not-shared' && isOwned && (
            <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
              <div className="text-center">
                <p className="text-xs font-medium text-white/60">Revenue Generated</p>
                <p className="text-3xl font-bold text-white mt-2 h-10">$0</p>
              </div>
            </div>
          )}

          {collection.visibility === 'confidential' && isOwned && (
            <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
              <div className="text-center">
                <p className="text-xs font-medium text-white/60">Paying Users</p>
                <p className="text-3xl font-bold text-white mt-2 h-10">0</p>
              </div>
            </div>
          )}
        </div>

        {/* Assets List */}
        <div className="rounded-2xl border-2 border-solid border-white/30 bg-transparent shadow-none">
          <div className="flex items-center justify-between pl-5 pr-3 py-4">
            <h2 className="text-2xl font-semibold text-white">Assets</h2>
            <div className="flex items-center gap-4">
              <SegmentedControl
                options={[
                  { value: 'gallery', label: 'Gallery', icon: <Grid className="h-4 w-4" /> },
                  { value: 'table', label: 'Table', icon: <List className="h-4 w-4" /> },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as 'gallery' | 'table')}
              />
              <Button
                className="flex gap-2 px-4 py-2 bg-cyan-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-teal/80 hover:text-gray-800"
                disabled
              >
                <Plus className="h-4 w-4" />
                <span>Add Asset</span>
              </Button>
            </div>
          </div>
          {/* Line Separator */}
          <div className={`border-t border-white/10`}></div>

          {collection.assets.length > 0 ? (
            viewMode === 'gallery' ? (
              <AssetGallery assets={collection.assets} />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-white/40">
                    <tr>
                      <th className="w-16 px-4 py-3 text-left text-sm text-gray-800"></th>
                      <th
                        className="px-4 py-3 text-left text-sm text-gray-800 cursor-pointer hover:bg-white/60 transition-colors select-none"
                        onClick={() => handleHeaderClick('name')}
                      >
                        <div className="flex items-center">
                          <span>Name</span>
                          <div className="w-4 ml-1 flex justify-center">
                            {getSortIcon('name')}
                          </div>
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm text-gray-800 cursor-pointer hover:bg-white/60 transition-colors select-none"
                        onClick={() => handleHeaderClick('size')}
                      >
                        <div className="flex items-center">
                          <span>Type & Size</span>
                          <div className="w-4 ml-1 flex justify-center">
                            {getSortIcon('size')}
                          </div>
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm text-gray-800 cursor-pointer hover:bg-white/60 transition-colors select-none"
                        onClick={() => handleHeaderClick('uploaded')}
                      >
                        <div className="flex items-center">
                          <span>Uploaded</span>
                          <div className="w-4 ml-1 flex justify-center">
                            {getSortIcon('uploaded')}
                          </div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {sortedAssets.map((asset: any, index: number) => (
                      <AssetTableRow
                        key={asset.id}
                        asset={asset}
                        isLastRow={index === sortedAssets.length - 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-white/80">No assets in this collection yet.</p>
              <Button className="flex gap-2 px-6 py-2 bg-cyan-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-teal/80 hover:text-gray-800 mt-4">
                <Plus className="h-4 w-4" />
                <span>Add First Asset</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <CollectionSettingsModal
        showModal={showSettingsModal}
        setShowModal={setShowSettingsModal}
        collection={collection}
      />
    </div>
  );
}
