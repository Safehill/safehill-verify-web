'use client';

import { cn } from '@/lib/utils';
import { FingerprintIcon as LucideFingerprintIcon } from 'lucide-react';

interface FingerprintIconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function FingerprintIcon({
  color,
  size = 16,
  className,
}: FingerprintIconProps) {
  return (
    <div
      className={cn('bg-white rounded-full p-1 shadow-md', color, className)}
    >
      <LucideFingerprintIcon size={size} />
    </div>
  );
}
