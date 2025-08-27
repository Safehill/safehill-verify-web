'use client';

import AssetFingerprintPopover from '@/components/authed/AssetFingerprintPopover';
import { Button } from '@/components/shared/button';
import FingerprintIcon from '@/components/shared/FingerprintIcon';
import { useCollection, useImage } from '@/lib/hooks/use-collections';
import { getUserColor } from '@/lib/utils';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Asset {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
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

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialAssetIndex);
    }
  }, [isOpen, initialAssetIndex]);

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
  collection?: any;
}) {
  const { data: imageData, isLoading, error } = useImage(asset.id);

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

  return (
    <div className="relative max-w-full max-h-full">
      <Image
        src={imageData.thumbnailUrl}
        alt={imageData.name}
        width={1200}
        height={800}
        className="max-w-full max-h-full object-contain"
        priority
      />

      {/* Fingerprint Icon Overlaid on Image */}
      <div className="absolute top-4 right-4 z-20">
        <AssetFingerprintPopover asset={asset}>
          <button className="transition-all duration-200 hover:scale-110">
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
  const { data: imageData, isLoading, error } = useImage(asset.id);

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

  return (
    <Image
      src={imageData.thumbnailUrl}
      alt={imageData.name}
      width={64}
      height={64}
      className="w-full h-full object-cover"
    />
  );
}
