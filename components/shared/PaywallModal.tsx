'use client';

import { Avatar, AvatarFallback } from '@/components/shared/avatar';
import { Badge } from '@/components/shared/badge';
import { Button } from '@/components/shared/button';
import Modal from '@/components/shared/modal';
import { collectionsApi } from '@/lib/api/collections';
import type { AccessCheckResultDTO } from '@/lib/api/models/dto/Collection';
import { useAuth } from '@/lib/auth/auth-context';
import {
  convertToAuthenticatedUser,
  getAvatarColorValue,
  getInitials,
} from '@/lib/utils';
import { stripeService } from '@/lib/stripe/stripe-service';
import { CreditCard, Eye, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
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
  const authenticatedUser = convertToAuthenticatedUser(authedSession);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showModal || !accessCheck || accessCheck.status !== 'paywall') {
    return null;
  }

  const handlePurchase = async () => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Initialize Stripe (in a real app, this would be done at app startup)
      await stripeService.initialize(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock'
      );

      // Create payment intent using Stripe service
      const stripePaymentIntent = await stripeService.createPaymentIntent(
        (accessCheck.price || 0) * 100 // Convert to cents
      );

      // Create payment intent in our backend
      const paymentIntent = await collectionsApi.createPaymentIntent(
        collectionId,
        authenticatedUser
      );

      console.log('Payment intent created:', paymentIntent);

      // In a real implementation, this would redirect to Stripe Checkout
      // For now, we'll simulate the payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Confirm payment with Stripe
      const stripeResult = await stripeService.confirmPayment(
        stripePaymentIntent.client_secret
      );
      if (stripeResult.error) {
        throw new Error(stripeResult.error);
      }

      // Confirm payment with our backend
      const result = await collectionsApi.confirmPayment(
        collectionId,
        paymentIntent.clientSecret,
        authenticatedUser
      );

      if (result.success) {
        onPaymentSuccess();
        setShowModal(false);
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Purchase Required"
    >
      <div className="p-6 gap-2">
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
                    The content in this collection is confidential. You will not
                    be able to download or share those assets until the owner
                    removes this restriction.
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
              onClick={() => setShowModal(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              className="flex-1 bg-purple-800 hover:bg-purple-600"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
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
      </div>
    </Modal>
  );
}
