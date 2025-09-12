'use client';

import { useAsset } from '@/lib/hooks/use-assets';
import { timeAgo } from '@/lib/utils';
import { Eye, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../shared/button';
import { UploadedAsset } from '@/lib/types/asset';

interface UploadedAssetTableRowProps {
  asset: UploadedAsset;
  isLastRow?: boolean;
  onClick?: () => void;
}

export default function UploadedAssetTableRow({
  asset,
  isLastRow = false,
  onClick,
}: UploadedAssetTableRowProps) {
  const { data: imageData, isLoading, error } = useAsset(asset.id);

  return (
    <tr
      className="hover:bg-white/10 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="w-16 p-0 relative">
        <div
          className={`absolute inset-0 bg-white/20 flex items-center justify-center overflow-hidden ${
            isLastRow ? 'rounded-bl-2xl' : ''
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
          ) : error ? (
            <span className="text-white/60 text-xs">?</span>
          ) : imageData ? (
            <Image
              src={imageData?.versions[0]?.presignedURL || '/placeholder.svg'}
              alt={imageData?.globalIdentifier || 'Asset'}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/60 text-xs">IMG</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-white">{asset.name}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-white/80">
          {asset.type} • {asset.size}
        </p>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-white/80">{timeAgo(asset.uploaded)}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button className="flex gap-2 px-2 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20">
            <Eye />
          </Button>
        </div>
      </td>
    </tr>
  );
}