'use client';

import { Button } from '@/components/shared/button';
import { useImage } from '@/lib/hooks/use-collections';
import { timeAgo } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AssetTableRowProps {
  asset: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploaded: string;
  };
  isLastRow?: boolean;
}

export default function AssetTableRow({ asset, isLastRow = false }: AssetTableRowProps) {
  const { data: imageData, isLoading, error } = useImage(asset.id);

  // Debug logging
  console.log('AssetTableRow:', { assetId: asset.id, imageData, isLoading, error });

  return (
    <tr className="hover:bg-white/10 transition-colors">
      <td className="w-16 p-0 relative">
        <div className={`absolute inset-0 bg-white/20 flex items-center justify-center overflow-hidden ${isLastRow ? 'rounded-bl-2xl' : ''}`}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
          ) : error ? (
            <span className="text-white/60 text-xs">?</span>
          ) : imageData ? (
            <Image
              src={imageData.thumbnailUrl}
              alt={imageData.name}
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
        <p className="text-sm text-white/80">{asset.type} • {asset.size}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-white/80">{timeAgo(asset.uploaded)}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end space-x-2">
          {/* Placeholder for more actions */}
          <Button className="flex gap-2 px-2 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20">
            {/* Replace with icon for quick look */}
            <span>⋯</span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
