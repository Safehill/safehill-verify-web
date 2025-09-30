'use client';

import { Button } from '@/components/shared/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card';
import { useAuth } from '@/lib/auth/auth-context';
import { getValidRedirectUrl } from '@/lib/utils';
import { AlertTriangle, Key, Shield, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock user data for development
const MOCK_USER = {
  name: 'Development User',
  identifier: 'dev-user-123',
  email: 'dev@safehill.io',
  publicKey: 'mock-public-key-base64',
  publicSignature: 'mock-public-signature-base64',
};

export default function DevLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthedSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDevelopment) {
      router.push('/login');
    }
  }, [isDevelopment, router]);

  const handleDevLogin = async () => {
    if (!isDevelopment) {
      alert('This feature is only available in development mode');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create mock session data
      const mockSession = {
        authToken: 'dev-bearer-token-' + Date.now(),
        privateKey: {} as CryptoKey, // Mock key
        privateSignature: {} as CryptoKey, // Mock signature
        user: MOCK_USER,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      };

      setAuthedSession(mockSession);

      // Redirect to preserved destination or authed section home page
      const redirectTo = getValidRedirectUrl(searchParams);
      router.push(redirectTo);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Dev login error:', error);
      alert('Failed to login in development mode');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">
            Development Login
          </CardTitle>
          <p className="text-sm text-red-700 mt-2">
            ⚠️ This is a development-only authentication bypass
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>User: {MOCK_USER.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Key className="h-4 w-4" />
              <span>ID: {MOCK_USER.identifier}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Security Notice:</p>
                <p className="mt-1">
                  This bypass is only available in development mode and uses
                  mock data. Never use this in production.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDevLogin}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400"
          >
            {isLoading ? 'Logging in...' : 'Login as Development User'}
          </Button>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                const redirectTo = searchParams.get('redirect');
                const loginUrl = redirectTo
                  ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                  : '/login';
                router.push(loginUrl);
              }}
              className="text-sm"
            >
              Go to Real Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
