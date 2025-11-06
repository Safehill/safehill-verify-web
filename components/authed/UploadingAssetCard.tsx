'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { UploadingAsset } from '@/lib/types/asset';

interface UploadingAssetCardProps {
  asset: UploadingAsset;
  onClick?: () => void;
}

export default function UploadingAssetCard({
  asset,
  onClick: _onClick,
}: UploadingAssetCardProps) {
  // For pending assets, don't allow clicking
  const handleClick = undefined;

  return (
    <div
      className="group relative aspect-square rounded-lg overflow-hidden bg-white/10 border border-blue-400 opacity-75 transition-all duration-200"
      onClick={handleClick}
    >
      <Image
        src={asset.thumbnailURL}
        alt={asset.fileName}
        width={150}
        height={150}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        {asset.uploadStatus === 'uploading' && (
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-white mb-2 mx-auto" />
            <div className="text-white text-xs">
              {Math.round(asset.uploadProgress || 0)}%
            </div>
          </div>
        )}
        {asset.uploadStatus === 'error' && (
          <div className="text-center">
            <div className="text-red-400 text-xs mb-1">Upload failed</div>
            {asset.uploadError && (
              <div className="text-red-300 text-xs truncate px-2 max-w-full">
                {asset.uploadError}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-xs truncate">{asset.fileName}</p>
        <p className="text-white/70 text-xs">
          {asset.file.type} • {(asset.file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
}
