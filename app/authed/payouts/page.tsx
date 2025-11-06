'use client';

import AuthedSectionTopBar from '@/components/authed/AuthedSectionTopBar';
import HeaderSpacer from '@/components/authed/HeaderSpacer';
import PayoutOnboardingModal from '@/components/authed/PayoutOnboardingModal';
import PayoutDashboardModal from '@/components/authed/PayoutDashboardModal';
import { Button } from '@/components/shared/button';
import { useAuth } from '@/lib/auth/auth-context';
import {
  useCreateDashboardSession,
  useCreateOnboardingSession,
  usePayoutAccountStatus,
  usePayoutBalance,
} from '@/lib/hooks/use-payouts';
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Clock,
  DollarSign,
  ExternalLink,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { SiStripe } from 'react-icons/si';
import { useState } from 'react';
import { toast } from 'sonner';
import { isPayoutRequirementsDisabled } from '@/lib/utils/feature-flags';

export default function PayoutsPage() {
  const { authedSession, isAuthenticated } = useAuth();

  const {
    data: accountStatus,
    isLoading: isLoadingStatus,
    refetch: _refetchStatus,
  } = usePayoutAccountStatus();

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = usePayoutBalance({
    enabled: !!accountStatus?.hasAccount && accountStatus?.status === 'active',
  });

  const createOnboardingSession = useCreateOnboardingSession();
  const createDashboardSession = useCreateDashboardSession();

  // Modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingClientSecret, setOnboardingClientSecret] = useState<
    string | null
  >(null);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardClientSecret, setDashboardClientSecret] = useState<
    string | null
  >(null);

  // Handle onboarding button click
  const handleStartOnboarding = async () => {
    // Always create a fresh session - account sessions are single-use
    setOnboardingClientSecret(null); // Clear old secret first
    createOnboardingSession.mutate(undefined, {
      onSuccess: (data) => {
        setOnboardingClientSecret(data.client_secret);
        setShowOnboardingModal(true);
      },
      onError: () => {
        toast.error('Failed to start onboarding. Please try again.');
      },
    });
  };

  // Handle dashboard button click
  const handleOpenDashboard = async () => {
    createDashboardSession.mutate(undefined, {
      onSuccess: (data) => {
        setDashboardClientSecret(data.client_secret);
        setShowDashboardModal(true);
      },
      onError: () => {
        toast.error('Failed to open dashboard. Please try again.');
      },
    });
  };

  const breadcrumbs = [{ label: 'Payouts', href: '/authed/payouts' }];

  // Show loading state while authentication is being established
  if (!isAuthenticated || !authedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/80">Loading authentication...</p>
        </div>
      </div>
    );
  }

  const _isActive =
    accountStatus?.hasAccount &&
    accountStatus?.status === 'active' &&
    accountStatus?.chargesEnabled &&
    accountStatus?.payoutsEnabled;

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusBadge = () => {
    if (!accountStatus?.hasAccount) {
      return (
        <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          Inactive
        </span>
      );
    }

    if (accountStatus.status === 'active' && accountStatus.chargesEnabled) {
      return (
        <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          <CircleDot className="h-4 w-4 mr-1.5" />
          Active
        </span>
      );
    }

    if (accountStatus.status === 'pending' || !accountStatus.detailsSubmitted) {
      return (
        <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
          <Clock className="h-4 w-4 mr-1.5" />
          Pending
        </span>
      );
    }

    if (accountStatus.status === 'restricted') {
      return (
        <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-red-100 text-red-800">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          Restricted
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
        <AlertCircle className="h-4 w-4 mr-1.5" />
        Unknown
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepTeal to-mutedTeal">
      <AuthedSectionTopBar breadcrumbs={breadcrumbs} />

      {/* Spacer to push content below fixed header */}
      <HeaderSpacer />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-w-[350px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-br from-purple-100 to-orange-300 bg-clip-text font-display text-3xl md:text-5xl font-bold text-transparent drop-shadow-sm [text-wrap:balance]">
                Payouts
              </h1>
              <p className="mt-2 text-white/80 font-extralight">
                Manage your earnings and payout settings
              </p>
            </div>
            {!isPayoutRequirementsDisabled() && getStatusBadge()}
          </div>
        </div>

        {/* Feature Disabled Message */}
        {isPayoutRequirementsDisabled() && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-blue-100/10 backdrop-blur-xl border border-blue-500/30 rounded-lg p-8 md:p-12">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Payout Requirements Disabled
                  </h2>
                  <p className="text-white/80 mb-4">
                    Payout requirements are currently disabled in this
                    environment. You can set collection prices without
                    completing payout setup.
                  </p>
                  <div className="bg-blue-100/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-2">
                      <strong>Note:</strong> This is controlled by the{' '}
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                        NEXT_PUBLIC_DISABLE_PAYOUT_REQUIREMENTS
                      </code>{' '}
                      environment variable.
                    </p>
                    <p className="text-white/70 text-sm">
                      Set it to{' '}
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                        false
                      </code>{' '}
                      in{' '}
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                        .env.local
                      </code>{' '}
                      to enable full payout functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isPayoutRequirementsDisabled() &&
          (isLoadingStatus ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">Loading payout status...</span>
            </div>
          ) : !accountStatus?.hasAccount ||
            accountStatus.status !== 'active' ? (
            // Setup Section
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                    Set Up Payouts
                  </h2>
                  <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
                    To start selling your collections, you need to set up your
                    payout account. This secure process is handled by Stripe and
                    takes just a few minutes.
                  </p>
                </div>

                {accountStatus?.hasAccount &&
                  (accountStatus.status === 'pending' ||
                    !accountStatus.detailsSubmitted) && (
                    <div className="bg-yellow-100/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-200 font-medium mb-1">
                            Setup Incomplete
                          </p>
                          <p className="text-yellow-200/80 text-sm">
                            Your account setup is incomplete. Click below to
                            continue where you left off.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {accountStatus?.status === 'restricted' && (
                  <div className="bg-red-100/10 border border-red-500/30 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-red-200 font-medium mb-2">
                          Account Restricted
                        </p>
                        <p className="text-red-200/80 text-sm mb-4">
                          Your payout account has been restricted and requires
                          attention. This usually happens due to verification
                          issues or missing information.
                        </p>
                        <div className="space-y-2 text-red-200/80 text-sm">
                          <p className="font-medium">Next steps:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>
                              Check your email from Stripe for specific details
                            </li>
                            <li>Contact Stripe support for assistance</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-white font-medium mb-4 text-center">
                    What you will need:
                  </h3>
                  <ul className="space-y-3 text-white/80 text-sm max-w-md mx-auto">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-green-400" />
                      <span>Your business or personal information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-green-400" />
                      <span>Bank account details for receiving payouts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-green-400" />
                      <span>
                        Tax information (Stripe handles all reporting)
                      </span>
                    </li>
                  </ul>
                </div>

                {accountStatus?.status === 'restricted' ? (
                  <div className="text-center">
                    <a
                      href="https://support.stripe.com/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-base shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Contact Stripe Support
                    </a>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button
                      onClick={handleStartOnboarding}
                      disabled={createOnboardingSession.isPending}
                      className="w-full max-w-md h-13 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all"
                    >
                      {createOnboardingSession.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : accountStatus?.hasAccount ? (
                        'Continue Setup'
                      ) : (
                        'Start Payout Setup'
                      )}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm mt-4">
                      <SiStripe className="h-4 w-4" />
                      <span>Powered by Stripe • Secure & encrypted</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Dashboard Section (Active account)
            <div className="space-y-6">
              {/* Balance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Available Balance */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white/80 text-sm font-medium">
                      Available
                    </h3>
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  {isLoadingBalance ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <p className="text-3xl font-bold text-white">
                      {balance?.available?.[0]
                        ? formatCurrency(
                            balance.available[0].amount,
                            balance.available[0].currency
                          )
                        : '$0.00'}
                    </p>
                  )}
                  <p className="text-white/60 text-xs mt-1">Ready to payout</p>
                </div>

                {/* Pending Balance */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white/80 text-sm font-medium">
                      Pending
                    </h3>
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  {isLoadingBalance ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <p className="text-3xl font-bold text-white">
                      {balance?.pending?.[0]
                        ? formatCurrency(
                            balance.pending[0].amount,
                            balance.pending[0].currency
                          )
                        : '$0.00'}
                    </p>
                  )}
                  <p className="text-white/60 text-xs mt-1">Processing</p>
                </div>

                {/* Total Earnings */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white/80 text-sm font-medium">
                      Total Earnings
                    </h3>
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  {isLoadingBalance ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <p className="text-3xl font-bold text-white">
                      {balance
                        ? formatCurrency(
                            balance.totalEarnings,
                            balance.currency
                          )
                        : '$0.00'}
                    </p>
                  )}
                  <p className="text-white/60 text-xs mt-1">All time</p>
                </div>
              </div>

              {/* Account Management */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Account Management
                </h2>
                <p className="text-white/80 text-sm mb-6">
                  Access your Stripe Express dashboard to view detailed
                  transaction history, update your payout settings, and manage
                  your account information.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-white text-sm font-medium">
                        Charges Enabled
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">
                      You can receive payments
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-white text-sm font-medium">
                        Payouts Enabled
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">
                      You can receive payouts
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleOpenDashboard}
                    disabled={createDashboardSession.isPending}
                    className="bg-white text-deepTeal hover:bg-white/90 font-semibold"
                  >
                    {createDashboardSession.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'View Stripe Dashboard'
                    )}
                  </Button>
                  <Button
                    onClick={() => refetchBalance()}
                    variant="outline"
                    disabled={isLoadingBalance}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {isLoadingBalance ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Refresh Balance'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Onboarding Modal */}
      {onboardingClientSecret && (
        <PayoutOnboardingModal
          showModal={showOnboardingModal}
          setShowModal={setShowOnboardingModal}
          clientSecret={onboardingClientSecret}
        />
      )}

      {/* Dashboard Modal */}
      {dashboardClientSecret && (
        <PayoutDashboardModal
          showModal={showDashboardModal}
          setShowModal={setShowDashboardModal}
          clientSecret={dashboardClientSecret}
        />
      )}
    </div>
  );
}
