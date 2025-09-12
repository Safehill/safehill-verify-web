'use client';

import { DisplayAsset, isUploadingAsset, getAssetId } from '@/lib/types/asset';
import UploadedAssetCard from './UploadedAssetCard';
import UploadingAssetCard from './UploadingAssetCard';

interface AssetGalleryProps {
  assets: DisplayAsset[];
  onAssetClick?: (assetIndex: number) => void;
}

export default function AssetGallery({
  assets,
  onAssetClick,
}: AssetGalleryProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/80">No assets in this collection yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-5">
      {assets.map((asset, index) => (
        isUploadingAsset(asset) ? (
          <UploadingAssetCard
            key={getAssetId(asset)}
            asset={asset}
            onClick={() => onAssetClick?.(index)}
          />
        ) : (
          <UploadedAssetCard
            key={getAssetId(asset)}
            asset={asset}
            onClick={() => onAssetClick?.(index)}
          />
        )
      ))}
    </div>
  );
}