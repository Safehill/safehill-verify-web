'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Protect all dashboard routes
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      const currentPath = window.location.pathname;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, router]);

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
