'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface PayoutWarningBannerProps {
  className?: string;
}

export default function PayoutWarningBanner({
  className = '',
}: PayoutWarningBannerProps) {
  return (
    <div
      className={`bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex items-start gap-3 ${className}`}
    >
      <AlertTriangle className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-black font-medium text-sm">
          Set up payouts to start selling collections
        </p>
        <p className="text-black/80 text-sm mt-1">
          You need to complete payout setup before you can set prices on your
          collections.
        </p>
      </div>
      <Link
        href="/authed/payouts"
        className="bg-black text-yellow-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-black/90 transition-colors flex-shrink-0"
      >
        Set up now
      </Link>
    </div>
  );
}
