'use client';

import { useAsset } from '@/lib/hooks/use-assets';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { UploadedAsset } from '@/lib/types/asset';
import DecryptedImage from './DecryptedImage';
import { selectVersion, selectPublicVersion } from '@/lib/utils/asset-versions';

interface UploadedAssetCardProps {
  asset: UploadedAsset;
  onClick?: () => void;
}

export default function UploadedAssetCard({
  asset,
  onClick,
}: UploadedAssetCardProps) {
  // Check if upload hasn't started yet
  const isUploadNotStarted = asset.uploadState === 'not_started';

  // Always fetch asset data from cache (prefetched at page level)
  const { data: imageData, isLoading, error } = useAsset(asset.id);

  // Determine version to use based on isPublic flag
  // For thumbnails, prefer low-resolution for better performance
  const isPublic = asset.isPublic;
  const publicVersion = selectPublicVersion(imageData?.publicVersions, 'low');
  const encryptedVersion = selectVersion(imageData?.versions, 'low');

  return (
    <div
      className="group relative aspect-square rounded-lg overflow-hidden bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {isUploadNotStarted ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-white/60" />
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-white/60" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center mx-auto mb-2">
              <span className="text-white/60 text-xs">?</span>
            </div>
            <p className="text-white/60 text-xs truncate px-2">{asset.name}</p>
          </div>
        </div>
      ) : isPublic && publicVersion ? (
        // Public asset - use publicVersions array with direct Image component
        <>
          <Image
            src={publicVersion.presignedURL}
            alt={asset.name || 'Asset'}
            width={150}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-xs truncate">{asset.name}</p>
            <p className="text-white/70 text-xs">
              {asset.type} • {asset.size}
            </p>
          </div>
        </>
      ) : !isPublic && encryptedVersion ? (
        // Encrypted asset - use DecryptedImage component
        <>
          <DecryptedImage
            version={encryptedVersion}
            alt={asset.name || 'Asset'}
            width={150}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-xs truncate">{asset.name}</p>
            <p className="text-white/70 text-xs">
              {asset.type} • {asset.size}
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center mx-auto mb-2">
              <span className="text-white/60 text-xs">IMG</span>
            </div>
            <p className="text-white/60 text-xs truncate px-2">{asset.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
