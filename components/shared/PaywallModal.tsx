'use client';

import { Avatar, AvatarFallback } from '@/components/shared/avatar';
import { Badge } from '@/components/shared/badge';
import { Button } from '@/components/shared/button';
import Modal from '@/components/shared/modal';
import type { AccessCheckResultDTO } from '@/lib/api/models/dto/Collection';
import { useAuth } from '@/lib/auth/auth-context';
import { getAvatarColorValue, getInitials } from '@/lib/utils';
import { getStripe } from '@/lib/stripe/stripe-service';
import {
  useCreateCheckoutSession,
  useCollectionAccess,
} from '@/lib/hooks/use-collections';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import {
  CreditCard,
  Eye,
  Lock,
  Shield,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { LucideShieldCheck } from 'lucide-react';

interface PaywallModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  accessCheck: AccessCheckResultDTO;
  collectionId: string;
  collectionName?: string;
  ownerName?: string;
  onPaymentSuccess: () => void;
}

type PaymentStage = 'info' | 'checkout' | 'verifying' | 'success';

export default function PaywallModal({
  showModal,
  setShowModal,
  accessCheck,
  collectionId,
  collectionName,
  ownerName,
  onPaymentSuccess,
}: PaywallModalProps) {
  const { authedSession } = useAuth();
  const [stage, setStage] = useState<PaymentStage>('info');
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const createCheckoutSession = useCreateCheckoutSession();
  const { refetch: refetchAccess } = useCollectionAccess(collectionId);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  const startPollingForAccess = useCallback(() => {
    setStage('verifying');

    let pollCount = 0;
    const maxPolls = 15; // Poll for up to 30 seconds (15 polls * 2 seconds)

    // Start polling
    pollingIntervalRef.current = setInterval(async () => {
      pollCount++;

      const { data } = await refetchAccess();

      if (data?.status !== 'paywall') {
        // Access granted!
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
        setStage('success');
        setTimeout(() => {
          onPaymentSuccess();
          setShowModal(false);
          // Reset state for next time
          setStage('info');
          setClientSecret(null);
        }, 1500);
      } else if (pollCount >= maxPolls) {
        // Timeout
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setError(
          'Payment verification is taking longer than expected. Please refresh the page in a moment.'
        );
        setStage('info');
      }
    }, 2000);

    // Set a timeout to stop polling after 30 seconds
    pollingTimeoutRef.current = setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      setError(
        'Payment verification is taking longer than expected. Please refresh the page in a moment.'
      );
      setStage('info');
    }, 30000);
  }, [refetchAccess, onPaymentSuccess, setShowModal]);

  const handleClose = useCallback(() => {
    if (stage === 'verifying') {
      // Don't allow closing during verification
      return;
    }
    setShowModal(false);
    // Reset state
    setStage('info');
    setClientSecret(null);
    setError(null);
  }, [stage, setShowModal]);

  const stripePromise = getStripe();

  // Early return after all hooks
  if (!showModal || !accessCheck || accessCheck.status !== 'paywall') {
    return null;
  }

  const handlePurchase = async () => {
    if (!authedSession) {
      setError('Authentication required');
      return;
    }

    setError(null);

    try {
      // Create checkout session
      const result = await createCheckoutSession.mutateAsync({
        collectionId,
        request: {
          ui_mode: 'embedded',
          web_base_url: window.location.origin,
        },
      });

      if (!result.clientSecret) {
        throw new Error('No client secret returned from server');
      }

      setClientSecret(result.clientSecret);
      setStage('checkout');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create checkout session'
      );
    }
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={handleClose}
      title={stage === 'checkout' ? 'Complete Payment' : 'Purchase Required'}
    >
      <div className="p-6 gap-2">
        {stage === 'info' && (
          <>
            <div className="flex items-center justify-center gap-2 mb-8">
              <CreditCard className="h-8 w-8 text-purple-800" />
              <h2 className="text-2xl font-semibold">Payment Required</h2>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  {collectionName || 'Collection'}
                </h3>

                {/* Owner info with avatar */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className="text-xs"
                      style={{
                        backgroundColor: getAvatarColorValue(
                          ownerName || 'unknown'
                        ),
                      }}
                    >
                      {getInitials(ownerName || '', ownerName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-600">
                    by {ownerName || 'Unknown'}
                  </p>
                </div>

                {/* Visibility badge */}
                <div className="flex justify-center mb-4">
                  {accessCheck.visibility === 'public' && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-500/80 text-white border-green-400/50"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Public
                    </Badge>
                  )}
                  {accessCheck.visibility === 'confidential' && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-yellow-500/80 text-white border-yellow-400/50"
                    >
                      <Lock className="mr-1 h-3 w-3" />
                      Confidential
                    </Badge>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-6xl font-bold text-purple-800">
                    ${accessCheck.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    One-time purchase
                  </div>
                </div>
              </div>

              <div className="space-y-3 pb-8 pl-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Lifetime access to this collection</span>
                </div>

                {accessCheck.visibility === 'confidential' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        The content in this collection is confidential. You will
                        not be able to download or share those assets until the
                        owner removes this restriction.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Download all assets</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Share with others (if permitted)</span>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={createCheckoutSession.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchase}
                  className="flex-1 bg-purple-800 hover:bg-purple-600"
                  disabled={createCheckoutSession.isPending}
                >
                  {createCheckoutSession.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Purchase for ${accessCheck.price}
                    </div>
                  )}
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <LucideShieldCheck className="h-3 w-3 text-green-600" />
                <span>Secure payment powered by&nbsp;</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-semibold">Stripe</span>
                </div>
              </div>
            </div>
          </>
        )}

        {stage === 'checkout' && clientSecret && (
          <div className="min-h-[400px]">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret,
                onComplete: () => {
                  // Payment completed, start polling for access
                  startPollingForAccess();
                },
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {stage === 'verifying' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 text-purple-800 animate-spin" />
            <h3 className="text-xl font-semibold">Verifying Payment...</h3>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Please wait while we confirm your payment. This usually takes just
              a few seconds.
            </p>
          </div>
        )}

        {stage === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-sm text-gray-600">
              Redirecting to your collection...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
