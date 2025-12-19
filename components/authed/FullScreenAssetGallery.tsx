'use client';

import AssetFingerprintPopover from '@/components/authed/AssetFingerprintPopover';
import { Button } from '@/components/shared/button';
import FingerprintIcon from '@/components/shared/FingerprintIcon';
import { useCollection } from '@/lib/hooks/use-collections';
import type { CollectionOutputDTO } from '@/lib/api/models/dto/Collection';
import { useAsset } from '@/lib/hooks/use-assets';
import { getUserColor } from '@/lib/utils';
import { selectVersion, selectPublicVersion } from '@/lib/utils/asset-versions';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DecryptedImage from './DecryptedImage';

interface Asset {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  isPublic: boolean;
}

interface FullScreenAssetGalleryProps {
  assets: Asset[];
  initialAssetIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
}

export default function FullScreenAssetGallery({
  assets,
  initialAssetIndex = 0,
  isOpen,
  onClose,
  collectionId,
}: FullScreenAssetGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialAssetIndex);

  // Get collection data to find the owner
  const { data: collection } = useCollection(collectionId);

  // Track previous open state to reset index when gallery opens
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Adjust state while rendering when gallery opens (recommended React pattern)
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && !prevIsOpen) {
      // Gallery is opening - set to initial index
      setCurrentIndex(initialAssetIndex);
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : assets.length - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex((prev) => (prev < assets.length - 1 ? prev + 1 : 0));
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, assets.length, onClose]);

  if (!isOpen) {
    return null;
  }

  const currentAsset = assets[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="text-white">
            <h2 className="text-lg font-semibold">{currentAsset.name}</h2>
            <p className="text-sm text-white/70">
              {currentIndex + 1} of {assets.length} • {currentAsset.type} •{' '}
              {currentAsset.size}
            </p>
          </div>
        </div>

        {/* Placeholder for future actions */}
      </div>

      {/* Navigation Buttons */}
      {assets.length > 1 && (
        <>
          <Button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev > 0 ? prev - 1 : assets.length - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev < assets.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Image Display */}
      <div className="flex items-center justify-center h-full p-4">
        <AssetImageView asset={currentAsset} collection={collection} />
      </div>

      {/* Thumbnail Navigation */}
      {assets.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
            {assets.map((asset, index) => (
              <button
                key={asset.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-white shadow-lg scale-110'
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <AssetThumbnail asset={asset} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AssetImageView({
  asset,
  collection,
}: {
  asset: Asset;
  collection?: CollectionOutputDTO;
}) {
  const { data: imageData, isLoading, error } = useAsset(asset.id);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white text-lg">Failed to load image</div>
      </div>
    );
  }

  // Get user color for fingerprint icon
  const userColor = collection?.createdBy
    ? getUserColor(collection.createdBy)
    : 'text-gray-500';

  // Determine version based on isPublic flag
  // Use high-resolution for full-screen view, with low-res preview for progressive loading
  const isPublic = asset.isPublic;
  const publicVersionHi = selectPublicVersion(imageData.publicVersions, 'hi');
  const encryptedVersionHi = selectVersion(imageData.versions, 'hi');
  const encryptedVersionLow = selectVersion(imageData.versions, 'low');

  return (
    <div className="relative w-full h-full">
      {isPublic && publicVersionHi ? (
        <Image
          src={publicVersionHi.presignedURL}
          alt={asset.name || 'Asset'}
          fill
          className="object-contain"
          sizes="100vw"
          unoptimized
        />
      ) : !isPublic && encryptedVersionHi ? (
        <DecryptedImage
          version={encryptedVersionHi}
          lowResPreview={encryptedVersionLow}
          alt={asset.name || 'Asset'}
          className="object-contain w-full h-full"
        />
      ) : null}

      {/* Fingerprint Icon Overlaid on Image */}
      <div className="absolute top-4 right-4 z-20">
        <AssetFingerprintPopover asset={asset} onOpenChange={setIsPopoverOpen}>
          <button
            className={`transition-all duration-200 hover:opacity-50 rounded-full p-1 ${
              isPopoverOpen ? 'bg-gray-600/80' : 'bg-white/20'
            }`}
          >
            <FingerprintIcon
              color={userColor}
              size={20}
              className="shadow-lg transition-all duration-200"
            />
          </button>
        </AssetFingerprintPopover>
      </div>
    </div>
  );
}

function AssetThumbnail({ asset }: { asset: Asset }) {
  const { data: imageData, isLoading, error } = useAsset(asset.id);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-white/10 flex items-center justify-center">
        <div className="text-white text-xs">...</div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="w-full h-full bg-white/10 flex items-center justify-center">
        <div className="text-white text-xs">?</div>
      </div>
    );
  }

  // Determine version based on isPublic flag
  // Use low-resolution for thumbnails for better performance
  const isPublic = asset.isPublic;
  const publicVersion = selectPublicVersion(imageData.publicVersions, 'low');
  const encryptedVersion = selectVersion(imageData.versions, 'low');

  return (
    <>
      {isPublic && publicVersion ? (
        <Image
          src={publicVersion.presignedURL}
          alt={asset.name || 'Asset'}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      ) : !isPublic && encryptedVersion ? (
        <DecryptedImage
          version={encryptedVersion}
          alt={asset.name || 'Asset'}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      ) : null}
    </>
  );
}
