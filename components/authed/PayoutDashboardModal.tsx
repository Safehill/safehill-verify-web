'use client';

import Modal from '@/components/shared/modal';
import { useEffect, useState, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from '@stripe/connect-js/pure';

interface PayoutDashboardModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  clientSecret: string;
}

export default function PayoutDashboardModal({
  showModal,
  setShowModal,
  clientSecret,
}: PayoutDashboardModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>(null);

  // Use ref to prevent double initialization in React Strict Mode
  const initializingRef = useRef(false);
  const initializedRef = useRef(false);

  // Track previous modal state to reset when it closes
  const [prevShowModal, setPrevShowModal] = useState(showModal);

  // Adjust state while rendering when modal closes (recommended React pattern)
  if (prevShowModal !== showModal) {
    setPrevShowModal(showModal);
    if (!showModal && prevShowModal) {
      // Modal is closing - reset state
      setLoading(true);
      setError(null);
      setStripeConnectInstance(null);
    }
  }

  // Update refs when modal closes (must be in useEffect, not during render)
  useEffect(() => {
    if (!showModal && prevShowModal) {
      initializedRef.current = false;
      initializingRef.current = false;
    }
  }, [showModal, prevShowModal]);

  // Initialize Stripe Connect
  useEffect(() => {
    if (!showModal || !clientSecret) {
      return;
    }

    // If currently initializing, skip
    if (initializingRef.current) {
      return;
    }

    const initializeStripeConnect = async () => {
      initializingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
          console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
          setError('Missing Stripe configuration');
          setLoading(false);
          initializingRef.current = false;
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
        initializingRef.current = false;
      } catch (error) {
        console.error('Failed to initialize Stripe Connect:', error);
        setError('Failed to load dashboard. Please try again.');
        setLoading(false);
        initializingRef.current = false;
      }
    };

    initializeStripeConnect();
  }, [showModal, clientSecret]);

  // Create the Connect Account Management component when ready
  useEffect(() => {
    if (!stripeConnectInstance || !showModal) {
      return;
    }

    // Wait for container to be available in the DOM
    const mountComponent = () => {
      const container = document.getElementById('stripe-dashboard-container');
      if (!container) {
        // Container not ready yet, try again
        requestAnimationFrame(mountComponent);
        return;
      }

      const accountManagement =
        stripeConnectInstance.create('account-management');

      container.innerHTML = ''; // Clear previous content
      container.appendChild(accountManagement);
      setLoading(false);

      // Cleanup function
      return () => {
        if (container && accountManagement.parentNode === container) {
          container.removeChild(accountManagement);
        }
      };
    };

    const cleanup = mountComponent();
    return cleanup;
  }, [stripeConnectInstance, showModal]);

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      className="max-w-5xl w-full overflow-visible"
      title="Payout Dashboard"
      description="View and manage your payout account"
    >
      <div className="w-full max-h-[85vh] overflow-y-auto p-6">
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-teal mb-4" />
            <p className="text-gray-700 text-lg">Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <p className="text-red-800 text-center mb-4">{error}</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div
          id="stripe-dashboard-container"
          className={`min-h-[700px] ${loading || error ? 'hidden' : ''}`}
        />
      </div>
    </Modal>
  );
}
