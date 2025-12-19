'use client';

import Modal from '@/components/shared/modal';
import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { payoutKeys } from '@/lib/hooks/use-payouts';
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from '@stripe/connect-js/pure';

interface PayoutOnboardingModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  clientSecret: string;
}

export default function PayoutOnboardingModal({
  showModal,
  setShowModal,
  clientSecret,
}: PayoutOnboardingModalProps) {
  const [stage, setStage] = useState<'loading' | 'onboarding' | 'complete'>(
    'loading'
  );
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>(null);
  const queryClient = useQueryClient();

  // Track previous modal state to reset when it closes
  const [prevShowModal, setPrevShowModal] = useState(showModal);

  // Adjust state while rendering when modal closes (recommended React pattern)
  if (prevShowModal !== showModal) {
    setPrevShowModal(showModal);
    if (!showModal && prevShowModal) {
      // Modal is closing - reset state
      setStage('loading');
      setStripeConnectInstance(null);
    }
  }

  // Initialize Stripe Connect
  useEffect(() => {
    if (!showModal || !clientSecret) {
      return;
    }

    // Flag to prevent double initialization in React Strict Mode
    let isInitialized = false;

    const initializeStripeConnect = async () => {
      if (isInitialized) {
        return;
      }
      isInitialized = true;

      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
          console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
          return;
        }

        // Initialize Stripe Connect instance
        const instance = await loadConnectAndInitialize({
          publishableKey,
          fetchClientSecret: async () => clientSecret,
          appearance: {
            overlays: 'drawer',
            variables: {
              colorPrimary: '#9527F5',
            },
          },
        });

        setStripeConnectInstance(instance);
        setStage('onboarding');
      } catch (error) {
        console.error('Failed to initialize Stripe Connect:', error);
        setStage('loading');
      }
    };

    initializeStripeConnect();

    return () => {
      isInitialized = true; // Prevent re-initialization on cleanup
    };
  }, [showModal, clientSecret]);

  // Handle onboarding completion
  const handleExit = async () => {
    setStage('complete');

    // Invalidate payout status to refresh
    await queryClient.invalidateQueries({
      queryKey: payoutKeys.accountStatus(),
    });

    // Close modal after a brief delay
    setTimeout(() => {
      setShowModal(false);
      setStage('loading');
    }, 2000);
  };

  // Create the Connect Onboarding component when ready
  useEffect(() => {
    if (!stripeConnectInstance || !showModal) {
      return;
    }

    // Wait for container to be available in the DOM
    const mountComponent = () => {
      const container = document.getElementById('stripe-onboarding-container');
      if (!container) {
        // Container not ready yet, try again
        requestAnimationFrame(mountComponent);
        return;
      }

      const accountOnboarding =
        stripeConnectInstance.create('account-onboarding');

      // Listen for exit event (when user completes or exits onboarding)
      accountOnboarding.setOnExit(handleExit);

      container.innerHTML = ''; // Clear previous content
      container.appendChild(accountOnboarding);

      // Cleanup function
      return () => {
        if (container && accountOnboarding.parentNode === container) {
          container.removeChild(accountOnboarding);
        }
      };
    };

    const cleanup = mountComponent();
    return cleanup;
  }, [stripeConnectInstance, showModal, handleExit]);

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      className="max-w-2xl w-full overflow-visible"
      title="Payout Account Setup"
      description="Set up your payout account to receive payments"
    >
      <div className="w-full max-h-[85vh] overflow-y-auto p-6">
        {stage === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-teal mb-4" />
            <p className="text-gray-700 text-lg">Loading onboarding...</p>
          </div>
        )}

        {stage === 'onboarding' && (
          <div>
            <div id="stripe-onboarding-container" className="min-h-[600px]" />
          </div>
        )}

        {stage === 'complete' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-gray-900 text-xl font-semibold mb-2">
              Setup Complete!
            </p>
            <p className="text-gray-600 text-sm">
              Your payout account is now ready to receive payments.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
