'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Toaster } from 'sonner';
import { UploadProvider } from '@/lib/contexts/upload-context';
import UploadProgressToaster from '@/components/shared/UploadProgressToaster';
import { useImageEmbedding } from '@/lib/hooks/use-image-embedding';

export default function AuthedSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Preload embedding model (with 200ms delay to ensure Toaster is mounted)
  useImageEmbedding({ delayMs: 200 });

  // Protect all authed section routes
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      const currentPath = window.location.pathname;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, router]);

  // Only render children if authenticated
  return isAuthenticated ? (
    <UploadProvider>
      <Toaster position="bottom-center" richColors />
      {children}
      <UploadProgressToaster />
    </UploadProvider>
  ) : null;
}
