'use client';

import { Button } from '@/components/shared/button';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AccessDeniedViewProps {
  message: string;
  collectionName?: string;
}

export default function AccessDeniedView({
  message,
  collectionName,
}: AccessDeniedViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          {collectionName && (
            <p className="text-white/80 mb-4">{collectionName}</p>
          )}
          <p className="text-white/60 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="space-y-3">
          <Button
            className="flex gap-2 px-6 py-3 bg-gray-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-gray-200"
            asChild
          >
            <Link href="/authed">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Collections</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
