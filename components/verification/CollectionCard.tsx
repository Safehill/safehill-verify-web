'use client';

import { Badge } from '@/components/shared/badge';
import type { Collection } from '@/lib/api/collections';
import { Calendar, Eye, ImageIcon, Lock } from 'lucide-react';
import Link from 'next/link';

interface CollectionCardProps {
  collection: Collection;
  href: string;
  onMouseEnter?: () => void;
}

export default function CollectionCard({ collection, href, onMouseEnter }: CollectionCardProps) {
  return (
    <Link href={href} className="block" onMouseEnter={onMouseEnter}>
      <div className="rounded-2xl border-2 border-solid border-white/30 bg-purple-100/5 flex flex-col shadow-none w-full min-w-[350px] transition-all duration-200 hover:scale-[1.02] active:scale-[1.01] hover:bg-black/30 active:bg-white/30 cursor-pointer h-full">
        {/* Top Section: Header and Previews - No padding */}
        <div className="flex flex-col">
          {/* Header: Badges and States - Fixed height, no padding */}
          <div className="h-12 flex items-center justify-end space-x-1 pr-6">
            {collection.visibility === 'public' && (
              <Badge variant="secondary" className="text-xs bg-green-500/80 text-white border-green-400/50">
                <Eye className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
            {collection.visibility === 'confidential' && (
              <Badge variant="outline" className="text-xs bg-yellow-500/80 text-white border-yellow-400/50">
                <Lock className="mr-1 h-3 w-3" />
                Confidential
              </Badge>
            )}
            {collection.visibility === 'unshared' && (
              <Badge variant="outline" className="text-xs bg-gray-500/80 text-white border-gray-400/50">
                <Lock className="mr-1 h-3 w-3" />
                Unshared
              </Badge>
            )}
            {collection.hasPricing && (
              <Badge variant="outline" className="text-xs bg-purple-500/80 text-white border-purple-400/50">
                $20
              </Badge>
            )}
          </div>

          {/* Photo Previews: Full width, no padding */}
          {/* {collection.previewAssets && collection.previewAssets.length > 0 && (
            <div className="flex w-full">
              {collection.previewAssets.slice(0, 4).map((asset, _index) => (
                <div
                  key={asset.id}
                  className="flex-1 h-16 bg-white/20 flex items-center justify-center"
                >
                  <span className="text-white/60 text-sm">
                    {asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎥' : '📄'}
                  </span>
                </div>
              ))}
              {collection.assetCount > 4 && (
                <div className="flex-1 h-16 bg-white/20 flex items-center justify-center">
                  <span className="text-white/60 text-sm">+{collection.assetCount - 4}</span>
                </div>
              )}
            </div>
          )} */}
        </div>

        {/* Line Separator */}
        <div className="border-t border-white/10"></div>

        {/* Bottom Section: Content and Footer - With padding */}
        <div className="flex flex-col flex-1 pt-5">
          {/* Content area with padding */}
          <div className="px-6 flex-1 flex flex-col">
            {/* Title: Left aligned */}
            <h3 className="text-left text-xl md:text-2xl font-semibold tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mb-2">
              {collection.name}
            </h3>

            {/* Description: Left aligned, italic if no description */}
            <p className="text-left text-sm font-light tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mb-6">
              {collection.description ? (
                collection.description
              ) : (
                <span className="italic">no description</span>
              )}
            </p>
          </div>

          {/* Footer: Stats - Fixed height */}
          <div className="h-8 px-6 flex items-center justify-end text-xs text-white/80 w-full">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ImageIcon className="mr-1 h-3 w-3" />
                <span>{collection.assetCount} assets</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{collection.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
