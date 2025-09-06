'use client';

import { Badge } from '@/components/shared/badge';
import { useUser } from '@/lib/hooks/use-users';
import { cn, timeAgo, getAvatarColorValue, getInitials } from '@/lib/utils';
import { Calendar, Eye, ImageIcon, Lock } from 'lucide-react';
import Link from 'next/link';
import type { CollectionOutputDTO } from '@/lib/api/models/dto/Collection';

interface CollectionCardProps {
  collection: CollectionOutputDTO;
  href: string;
  onMouseEnter?: () => void;
  isOwned?: boolean;
}

export default function CollectionCard({
  collection,
  href,
  onMouseEnter,
  isOwned = false,
}: CollectionCardProps) {
  const { data: user } = useUser(collection.createdBy);

  // Avatar styling
  const avatarColorValue = user?.identifier
    ? getAvatarColorValue(user.identifier)
    : '#6b7280';
  const initials = getInitials(user?.name, user?.identifier);

  // Determine styling based on ownership
  const cardStyles = isOwned
    ? 'rounded-2xl border-2 border-solid border-white/30 bg-white/90 flex flex-col shadow-none w-full min-w-[350px] transition-all duration-200 hover:scale-[1.02] active:scale-[1.01] hover:bg-white/95 active:bg-white cursor-pointer h-full'
    : 'rounded-2xl border-2 border-solid border-white/30 bg-purple-100/5 flex flex-col shadow-none w-full min-w-[350px] transition-all duration-200 hover:scale-[1.02] active:scale-[1.01] hover:bg-black/30 active:bg-white/30 cursor-pointer h-full';

  const textStyles = isOwned ? 'text-gray-900' : 'text-white/80';

  const titleStyles = isOwned
    ? 'text-left text-lg md:text-xl font-semibold tracking-[-0.01em] bg-gradient-to-br from-gray-800/90 to-teal-900/60 bg-clip-text text-transparent mb-1'
    : 'text-left text-lg md:text-xl font-semibold tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mb-1';

  const descriptionStyles = isOwned
    ? 'text-left text-sm font-light tracking-[-0.01em] text-gray-700 mb-6'
    : 'text-left text-sm font-light tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mb-6';

  const footerStyles = isOwned
    ? 'h-8 px-6 flex items-center justify-end text-xs text-gray-600 w-full'
    : 'h-8 px-6 flex items-center justify-end text-xs text-white/80 w-full';

  return (
    <Link href={href} className="block" onMouseEnter={onMouseEnter}>
      <div className={cardStyles}>
        {/* Top Section: Header and Previews - No padding */}
        <div className="flex flex-col">
          {/* Header: User Info and Badges - Fixed height, no padding */}
          <div className="h-12 flex items-center justify-between px-6">
            {/* User Info - Left side, max 50% width */}
            <div className="flex items-center space-x-2 min-w-0 flex-1 max-w-[50%]">
              <div
                className={cn(
                  'h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center text-white font-medium text-xs',
                  isOwned ? 'shadow-md' : ''
                )}
                style={{ backgroundColor: avatarColorValue }}
              >
                {initials}
              </div>
              <span className={`text-xs truncate ${textStyles}`}>
                {user?.name || 'Unknown User'}
              </span>
            </div>

            {/* Visibility and Pricing Badges - Right side */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {collection.visibility === 'public' && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-500/80 text-white border-green-400/50"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Public
                </Badge>
              )}
              {collection.visibility === 'confidential' && (
                <Badge
                  variant="outline"
                  className="text-xs bg-yellow-500/80 text-white border-yellow-400/50"
                >
                  <Lock className="mr-1 h-3 w-3" />
                  Confidential
                </Badge>
              )}
              {collection.visibility === 'not-shared' && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-500/80 text-white border-gray-400/50"
                >
                  <Lock className="mr-1 h-3 w-3" />
                  Not Shared
                </Badge>
              )}
              {/* Show pricing badge only if not not-shared and pricing > 0 */}
              {collection.visibility === 'confidential' &&
                collection.pricing > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-500/80 text-white border-purple-400/50"
                  >
                    ${collection.pricing}
                  </Badge>
                )}
            </div>
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
        <div
          className={`border-t ${
            isOwned ? 'border-gray-300' : 'border-white/10'
          }`}
        ></div>

        {/* Bottom Section: Content and Footer - With padding */}
        <div className="flex flex-col flex-1 pt-5">
          {/* Content area with padding */}
          <div className="px-6 flex-1 flex flex-col">
            {/* Title: Left aligned */}
            <h3 className={titleStyles}>{collection.name}</h3>

            {/* Description: Left aligned, italic if no description */}
            <p className={descriptionStyles}>
              {collection.description ? (
                collection.description
              ) : (
                <span className="italic">no description</span>
              )}
            </p>
          </div>

          {/* Footer: Stats - Fixed height */}
          <div className={footerStyles}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ImageIcon className="mr-1 h-3 w-3" />
                <span>{collection.assetCount} assets</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{timeAgo(collection.lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
