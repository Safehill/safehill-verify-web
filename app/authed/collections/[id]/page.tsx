'use client';

import AssetGallery from '@/components/authed/AssetGallery';
import UploadedAssetTableRow from '@/components/authed/UploadedAssetTableRow';
import UploadingAssetTableRow from '@/components/authed/UploadingAssetTableRow';
import {
  isUploadingAsset,
  getAssetId,
  getAssetSortName,
  getAssetUploadTime,
  UploadedAsset,
  DisplayAsset,
} from '@/lib/types/asset';
import CollectionSettingsModal from '@/components/authed/CollectionSettingsModal';
import AuthedSectionTopBar from '@/components/authed/AuthedSectionTopBar';
import FullScreenAssetGallery from '@/components/authed/FullScreenAssetGallery';
import AccessDeniedView from '@/components/shared/AccessDeniedView';
import PaywallModal from '@/components/shared/PaywallModal';
import PaywallPage from '@/components/shared/PaywallPage';
import AddAssetDropdown from '@/components/shared/AddAssetDropdown';
import AddAssetModal from '@/components/shared/AddAssetModal';
import { useUpload } from '@/lib/contexts/upload-context';

import { Badge } from '@/components/shared/badge';
import { Button } from '@/components/shared/button';
import CopyButton from '@/components/shared/CopyButton';
import SegmentedControl from '@/components/shared/segmented-control';
import { useAuth } from '@/lib/auth/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import {
  useCollection,
  useCollectionAccess,
  useTrackCollectionAccess,
  useDeleteCollection,
  collectionKeys,
} from '@/lib/hooks/use-collections';
import { generateCollectionLink } from '@/lib/api/collections';
import { useUser } from '@/lib/hooks/use-users';
import { timeAgo, getAvatarColorValue, getInitials } from '@/lib/utils';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  Grid,
  List,
  Loader2,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import WarningModal from '@/components/shared/WarningModal';

type SortField = 'name' | 'size' | 'uploaded' | null;
type SortDirection = 'asc' | 'desc';

export default function CollectionDetail() {
  const params = useParams();
  const collectionId = params.id as string;
  const router = useRouter();
  const { authedSession, isAuthenticated } = useAuth();
  const currentUserId = authedSession?.user.identifier;
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFullScreenGallery, setShowFullScreenGallery] = useState(false);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showRemoveWarning, setShowRemoveWarning] = useState(false);
  const { uploadFiles, uploads } = useUpload();
  const queryClient = useQueryClient();
  const deleteCollectionMutation = useDeleteCollection();

  // Check access first - always call hooks at the top
  const {
    data: accessCheck,
    isLoading: accessLoading,
    error: accessError,
  } = useCollectionAccess(collectionId);

  // Fetch collection data using React Query (only if access is granted)
  const {
    data: collection,
    isLoading: collectionLoading,
    error: collectionError,
  } = useCollection(collectionId, accessCheck?.status === 'granted');
  const { data: user } = useUser(collection?.createdBy || '');

  // Track collection access
  const trackCollectionAccess = useTrackCollectionAccess();

  // Handle React Query errors with toast notifications
  useEffect(() => {
    if (accessError) {
      toast.error('Failed to check collection access. Please try again.');
    }
    if (collectionError) {
      toast.error('Failed to load collection. Please try again.');
    }
  }, [accessError, collectionError]);

  // Track when a collection is successfully loaded (for collections user doesn't own)
  useEffect(() => {
    if (collection && accessCheck?.status === 'granted') {
      // Only track if user doesn't own this collection
      const isOwner = collection.createdBy === currentUserId;
      if (!isOwner) {
        trackCollectionAccess.mutate(
          { collectionId },
          {
            onError: (error) => {
              console.error('Failed to track collection access:', error);
              // Don't show toast for tracking failures as it's not critical to user experience
            },
          }
        );
      }
    }
  }, [
    collection,
    accessCheck?.status,
    currentUserId,
    collectionId,
    trackCollectionAccess,
  ]);

  // Transform DTO assets to match UploadedAsset interface
  const transformedAssets = useMemo((): UploadedAsset[] => {
    if (!collection?.assets) {
      return [];
    }

    return collection.assets.map((asset) => ({
      id: asset.globalIdentifier,
      globalIdentifier: asset.globalIdentifier,
      name: asset.globalIdentifier,
      type: 'image', // Default type since DTO doesn't have this
      size: 'Unknown', // Default size since DTO doesn't have this
      uploaded: asset.uploadedAt || 'Unknown',
    }));
  }, [collection?.assets]);

  // Get pending uploads for this collection
  const pendingAssets = useMemo(() => {
    const collectionUploads = uploads.filter(
      (upload) =>
        upload.collectionName === collection?.name &&
        (upload.status === 'uploading' || upload.status === 'error')
    );

    return collectionUploads.map((upload) => ({
      uploadId: upload.globalIdentifier,
      file: upload.file,
      fileName: upload.fileName,
      collectionName: upload.collectionName,
      uploadProgress: upload.progress,
      uploadStatus: upload.status as 'uploading' | 'error',
      uploadError: upload.error,
      thumbnailURL: URL.createObjectURL(upload.file), // Create preview from File object
    }));
  }, [uploads, collection?.name]);

  // Combine real assets with pending uploads
  const allAssets = useMemo((): DisplayAsset[] => {
    return [...(transformedAssets || []), ...pendingAssets];
  }, [transformedAssets, pendingAssets]);

  // Sort assets based on current sort state
  const sortedAssets = useMemo((): DisplayAsset[] => {
    if (!allAssets || !sortField) {
      return allAssets || [];
    }

    return [...allAssets].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = getAssetSortName(a);
          bValue = getAssetSortName(b);
          break;
        case 'size':
          // Sort by upload time for both types
          aValue = getAssetUploadTime(a);
          bValue = getAssetUploadTime(b);
          break;
        case 'uploaded':
          aValue = getAssetUploadTime(a);
          bValue = getAssetUploadTime(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [allAssets, sortField, sortDirection]);

  // Show loading state while authentication is being established
  if (!isAuthenticated || !authedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/80">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Determine loading and error states
  const isLoading =
    accessLoading || (accessCheck?.status === 'granted' && collectionLoading);
  const error = accessError || collectionError;

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaywall(false);
    // The access check will be invalidated and refetched automatically
  };

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

  // Handle asset click to open full screen gallery
  const handleAssetClick = (assetIndex: number) => {
    const asset = sortedAssets[assetIndex];
    // Don't allow clicking on uploading assets
    if (isUploadingAsset(asset)) {
      return;
    }

    // Calculate the index in the uploaded-only array
    const uploadedAssets = sortedAssets.filter((a) => !isUploadingAsset(a));
    const uploadedIndex = uploadedAssets.findIndex(
      (a) => getAssetId(a) === getAssetId(asset)
    );

    setSelectedAssetIndex(uploadedIndex);
    setShowFullScreenGallery(true);
  };

  // Handle asset upload from modal
  const handleAssetUpload = async (files: File[]) => {
    if (!isOwned) {
      toast.error('You can only upload assets to collections you own');
      return;
    }

    if (!collection) {
      toast.error('Collection not available for upload');
      return;
    }

    // Use the upload context with the new upload system
    await uploadFiles(
      files,
      collection,
      (error: Error | null) => {
        // Callback when all uploads complete
        if (error) {
          console.debug('Uploads completed with errors', error);
        } else {
          console.debug('All uploads completed successfully');
        }
      },
      (globalIdentifier: string, error: Error | null) => {
        // Callback when each individual asset completes (success or failure)
        console.debug('Asset upload finished', {
          globalIdentifier,
          error: error?.message,
        });
        // Invalidate collection cache so the new asset appears immediately
        queryClient.invalidateQueries({
          queryKey: collectionKeys.detail(collectionId),
        });
      }
    );
  };

  // Handle dropdown actions
  const handleUploadAssets = () => {
    setShowAddAssetModal(true);
  };

  const handleFromOtherCollection = () => {
    // TODO: Implement copy from other collection functionality
    toast.info('Copy from other collection coming soon!');
  };

  // Handle soft-delete collection (for non-owned collections)
  const handleRemoveCollection = async () => {
    try {
      await deleteCollectionMutation.mutateAsync({
        collectionId: collection!.id,
        isOwned: false,
      });
      router.push('/authed');
      toast.success('Collection removed from your dashboard');
    } catch (error) {
      console.error('Failed to remove collection:', error);
      toast.error('Failed to remove collection. Please try again.');
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
  const avatarColorValue = collection?.createdBy
    ? getAvatarColorValue(collection.createdBy)
    : '#6b7280';
  const initials = getInitials(user?.name, collection?.createdBy);
  const isOwned = collection?.createdBy === currentUserId;

  const breadcrumbs = [
    { label: 'Collections', href: '/authed' },
    { label: collection?.name || 'Loading...' },
  ];

  // Render different views based on access status
  if (accessCheck?.status === 'denied') {
    return (
      <AccessDeniedView message={accessCheck.message || 'Access denied'} />
    );
  }

  if (accessCheck?.status === 'paywall') {
    return (
      <>
        <PaywallPage
          accessCheck={accessCheck}
          onPurchaseClick={() => setShowPaywall(true)}
          collectionName={collection?.name || 'Collection'}
          ownerName={user?.name || 'Unknown User'}
        />

        <PaywallModal
          showModal={showPaywall}
          setShowModal={setShowPaywall}
          accessCheck={accessCheck}
          collectionId={collectionId}
          collectionName={collection?.name}
          ownerName={user?.name}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal">
        <AuthedSectionTopBar breadcrumbs={breadcrumbs} />
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
        <AuthedSectionTopBar breadcrumbs={breadcrumbs} />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 min-w-[350px]">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-white/60">
              <X className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-white">
              Error loading collection
            </h3>
            <p className="mt-1 text-sm text-white/80">
              {error instanceof Error ? error.message : 'Collection not found'}
            </p>
            <div className="mt-6">
              <Button
                className="flex gap-2 px-4 py-2 bg-gray-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-gray-200"
                asChild
              >
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
      <AuthedSectionTopBar breadcrumbs={breadcrumbs} />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 min-w-[350px]">
        {/* Header */}
        <div className="mb-8">
          {/* Buttons Row */}
          <div className="flex items-center justify-between mb-6">
            <Button
              className="flex gap-2 px-4 py-2 bg-gray-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:text-gray-800 hover:bg-gray-200"
              asChild
            >
              <Link href="/authed">
                <ArrowLeft className="h-4 w-4" />
                <span>All Collections</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              {isOwned ? (
                <Button
                  className="flex gap-2 px-4 py-2 bg-purple-300/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:text-gray-800 hover:bg-purple-200"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              ) : (
                <Button
                  className="flex gap-2 px-4 py-2 bg-red-400/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:text-gray-800 hover:bg-red-200"
                  onClick={() => setShowRemoveWarning(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove this Collection</span>
                </Button>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <div className="flex items-start space-x-4 mb-4">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center text-white font-medium text-lg"
                style={{ backgroundColor: avatarColorValue }}
              >
                {initials}
              </div>
              <div>
                <h1 className="text-5xl font-bold from-purple-100 bg-gradient-to-br to-orange-300 bg-clip-text text-transparent mb-4">
                  {collection.name}
                </h1>
                <p className="text-white/80 mb-1">{collection.description}</p>
                <p className="text-gray-500 text-sm">
                  Created and owned by{' '}
                  <span className="font-black text-white/80">{user?.name}</span>
                  . Last updated{' '}
                  <span className="font-semibold text-white/80">
                    {timeAgo(collection.lastUpdated)}
                  </span>
                  .
                </p>
                {(collection.visibility === 'public' ||
                  collection.visibility === 'confidential') && (
                  <div className="flex items-center space-x-3 mt-3">
                    <div
                      className={`
                        text-sm font-mono text-gray-400
                        border-b-2
                        ${
                          collection.visibility === 'public'
                            ? 'border-green-500'
                            : ''
                        }
                        ${
                          collection.visibility === 'confidential'
                            ? 'border-orange-500'
                            : ''
                        }
                        pb-0.5
                      `}
                      style={{
                        display: 'inline-block',
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
              <p className="text-3xl font-bold text-white mt-2 h-10">
                {collection.assetCount}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
            <div className="text-center">
              <p className="text-xs font-medium text-white/60">Visibility</p>
              <div className="flex items-center justify-center mt-2 h-10">
                {collection.visibility === 'public' && (
                  <Badge
                    variant="secondary"
                    className="text-sm bg-green-500/80 text-white border-green-400/50"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Public
                  </Badge>
                )}
                {collection.visibility === 'confidential' && (
                  <Badge
                    variant="outline"
                    className="text-sm bg-orange-500/80 text-white border-orange-400/50"
                  >
                    Confidential
                  </Badge>
                )}
                {collection.visibility === 'not-shared' && (
                  <Badge
                    variant="outline"
                    className="text-sm bg-gray-500/80 text-white border-gray-400/50"
                  >
                    Not Shared
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {collection.visibility === 'confidential' && isOwned && (
            <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
              <div className="text-center">
                <p className="text-xs font-medium text-white/60">
                  People with access
                </p>
                <p className="text-3xl font-bold text-white mt-2 h-10">0</p>
              </div>
            </div>
          )}

          {/* Show pricing only if not not-shared */}
          {collection.visibility !== 'not-shared' && (
            <div className="rounded-2xl border-2 border-solid border-white/30 bg-white/10 px-6 py-4 flex items-center justify-center shadow-none transition-all duration-200">
              <div className="text-center">
                <p className="text-xs font-medium text-white/60">
                  Price to Access
                </p>
                <div className="flex items-center justify-center mt-2 h-10">
                  {collection.pricing > 0 ? (
                    <Badge
                      variant="outline"
                      className={
                        collection.visibility === 'confidential'
                          ? 'text-sm bg-purple-500/80 text-white border-purple-400/50'
                          : 'text-sm bg-gray-500/80 text-white border-gray-400/50'
                      }
                    >
                      ${collection.pricing}
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-sm bg-white/20 text-white border-white/30"
                    >
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
                <p className="text-xs font-medium text-white/60">
                  Revenue Generated
                </p>
                <p className="text-3xl font-bold text-white mt-2 h-10">$0</p>
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
                  {
                    value: 'gallery',
                    label: 'Gallery',
                    icon: <Grid className="h-4 w-4" />,
                  },
                  {
                    value: 'table',
                    label: 'Table',
                    icon: <List className="h-4 w-4" />,
                  },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as 'gallery' | 'table')}
              />
              {isOwned && (
                <AddAssetDropdown
                  onSelectUpload={handleUploadAssets}
                  onSelectFromCollection={handleFromOtherCollection}
                />
              )}
            </div>
          </div>
          {/* Line Separator */}
          <div className={`border-t border-white/10`}></div>

          {allAssets.length > 0 ? (
            viewMode === 'gallery' ? (
              <AssetGallery
                assets={sortedAssets}
                onAssetClick={handleAssetClick}
              />
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
                      <th className="px-4 py-3 text-right text-sm text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {sortedAssets.map((asset, index: number) =>
                      isUploadingAsset(asset) ? (
                        <UploadingAssetTableRow
                          key={getAssetId(asset)}
                          asset={asset}
                          isLastRow={index === sortedAssets.length - 1}
                          onClick={() => handleAssetClick(index)}
                        />
                      ) : (
                        <UploadedAssetTableRow
                          key={getAssetId(asset)}
                          asset={asset}
                          isLastRow={index === sortedAssets.length - 1}
                          onClick={() => handleAssetClick(index)}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <p className="text-white/80">No assets in this collection yet</p>
              <p className="text-white/60 text-sm mt-2">
                Get started by adding your first assets
              </p>
              {isOwned && (
                <div className="mt-4">
                  <AddAssetDropdown
                    onSelectUpload={handleUploadAssets}
                    onSelectFromCollection={handleFromOtherCollection}
                    className="px-6 py-2"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <CollectionSettingsModal
        key={`${collection.id}-${collection.visibility}-${collection.pricing}`}
        showModal={showSettingsModal}
        setShowModalAction={setShowSettingsModal}
        collection={collection}
      />

      {/* Add Asset Modal */}
      <AddAssetModal
        showModal={showAddAssetModal}
        setShowModal={setShowAddAssetModal}
        onAssetsSubmit={handleAssetUpload}
        collection={collection}
        isLoading={false}
      />

      {/* Full Screen Asset Gallery */}
      <FullScreenAssetGallery
        assets={
          sortedAssets.filter((asset) => !isUploadingAsset(asset)) as any[]
        }
        initialAssetIndex={selectedAssetIndex}
        isOpen={showFullScreenGallery}
        onClose={() => setShowFullScreenGallery(false)}
        collectionId={collectionId}
      />

      {/* Remove Collection Warning Modal */}
      <WarningModal
        showModal={showRemoveWarning}
        setShowModal={setShowRemoveWarning}
        title="Remove Collection"
        message={`Are you sure you want to remove this collection from your dashboard?

<b>This will only remove it from your view.</b> The collection will still be available to other users and the owner.`}
        confirmText="Remove Collection"
        cancelText="Cancel"
        onConfirm={handleRemoveCollection}
        variant="warning"
      />
    </div>
  );
}
