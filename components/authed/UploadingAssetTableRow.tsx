'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { UploadingAsset } from '@/lib/types/asset';

interface UploadingAssetTableRowProps {
  asset: UploadingAsset;
  isLastRow?: boolean;
  onClick?: () => void;
}

export default function UploadingAssetTableRow({
  asset,
  isLastRow = false,
  onClick: _onClick,
}: UploadingAssetTableRowProps) {
  // For pending assets, don't allow clicking
  const handleClick = undefined;

  return (
    <tr
      className="bg-blue-500/10 border-l-4 border-blue-400 transition-colors"
      onClick={handleClick}
    >
      <td className="w-16 p-0 relative">
        <div
          className={`absolute inset-0 bg-white/20 flex items-center justify-center overflow-hidden ${
            isLastRow ? 'rounded-bl-2xl' : ''
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={asset.thumbnailURL}
              alt={asset.fileName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              {asset.uploadStatus === 'uploading' && (
                <Loader2 className="h-3 w-3 animate-spin text-white" />
              )}
              {asset.uploadStatus === 'error' && (
                <span className="text-red-400 text-xs">!</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-blue-200">{asset.fileName}</p>
          {asset.uploadStatus === 'uploading' && (
            <p className="text-xs text-blue-300">
              Uploading... {Math.round(asset.uploadProgress || 0)}%
            </p>
          )}
          {asset.uploadStatus === 'error' && (
            <p className="text-xs text-red-300 truncate">
              Failed: {asset.uploadError || 'Upload error'}
            </p>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-white/80">
          {asset.file.type} • {(asset.file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-white/80">Uploading...</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end space-x-2">
          {/* No action button for uploading assets */}
        </div>
      </td>
    </tr>
  );
}