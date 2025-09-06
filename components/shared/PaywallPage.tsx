import { Avatar, AvatarFallback } from '@/components/shared/avatar';
import { Badge } from '@/components/shared/badge';
import { Button } from '@/components/shared/button';
import { getAvatarColorValue, getInitials } from '@/lib/utils';
import { CreditCard, Eye, Lock } from 'lucide-react';
import type { AccessCheckResultDTO } from '@/lib/api/models/dto/Collection';

interface PaywallPageProps {
  accessCheck: AccessCheckResultDTO;
  onPurchaseClick: () => void;
  collectionName?: string;
  ownerName?: string;
}

export default function PaywallPage({
  accessCheck,
  onPurchaseClick,
  collectionName = 'Collection',
  ownerName = 'Unknown User',
}: PaywallPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="mb-6">
          <h1 className="bg-gradient-to-br from-purple-100 to-orange-300 bg-clip-text font-display text-3xl md:text-5xl font-bold text-transparent drop-shadow-sm [text-wrap:balance]">
            {collectionName}
          </h1>

          {/* Owner info with avatar */}
          <div className="flex items-center justify-center gap-2 m-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-sm"
                style={{
                  backgroundColor: getAvatarColorValue(
                    accessCheck.createdBy || 'unknown'
                  ),
                }}
              >
                {getInitials(ownerName, accessCheck.createdBy)}
              </AvatarFallback>
            </Avatar>
            <p className="text-white/80">by {ownerName}</p>
          </div>

          {/* Visibility badge */}
          <div className="flex justify-center mb-4">
            {accessCheck.visibility === 'public' && (
              <Badge
                variant="secondary"
                className="text-sm bg-green-500/80 text-white border-green-400/50"
              >
                <Eye className="mr-1 h-4 w-4" />
                Public
              </Badge>
            )}
            {accessCheck.visibility === 'confidential' && (
              <Badge
                variant="outline"
                className="text-sm bg-yellow-500/80 text-white border-yellow-400/50"
              >
                <Lock className="mr-1 h-4 w-4" />
                Confidential
              </Badge>
            )}
          </div>

          <p className="text-white/60 text-sm leading-relaxed mt-10">
            In order to access this collection, you must purchase access for $
            {accessCheck.price}.
          </p>
        </div>

        <div className="space-y-3 flex justify-center">
          <Button
            onClick={onPurchaseClick}
            className="flex gap-2 px-4 py-2 bg-purple-300/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:text-gray-800 hover:bg-purple-200"
          >
            <CreditCard className="h-4 w-4" />
            <span>Purchase Access</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
