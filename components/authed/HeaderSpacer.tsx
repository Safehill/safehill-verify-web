'use client';

import { usePayoutAccountStatus } from '@/lib/hooks/use-payouts';
import { useCollections } from '@/lib/hooks/use-collections';
import { useAuth } from '@/lib/auth/auth-context';
import { isPayoutRequirementsDisabled } from '@/lib/utils/feature-flags';

/**
 * Dynamic spacer that accounts for the fixed header and optional warning banner
 * - Header height: 64px (h-16)
 * - Warning banner height (when shown): ~52px
 */
export default function HeaderSpacer() {
  const { authedSession } = useAuth();
  const currentUserId = authedSession?.user.identifier;

  const { data: payoutStatus, isLoading: isLoadingPayoutStatus } =
    usePayoutAccountStatus();
  const { data: collections = [] } = useCollections();

  // Check if user owns any collections
  const ownsCollections = collections.some(
    (collection: any) => collection.createdBy === currentUserId
  );

  // Show warning if user owns collections but hasn't set up payouts
  // Skip if payout requirements are disabled via feature flag
  // Don't show banner while loading (prevents flash of banner on page load)
  const shouldShowPayoutWarning =
    !isPayoutRequirementsDisabled() &&
    !isLoadingPayoutStatus &&
    ownsCollections &&
    payoutStatus &&
    (!payoutStatus.hasAccount ||
      payoutStatus.status !== 'active' ||
      !payoutStatus.chargesEnabled ||
      !payoutStatus.payoutsEnabled);

  // h-16 = 64px (header only)
  // h-28 = 112px (header + warning banner)
  return <div className={shouldShowPayoutWarning ? 'h-28' : 'h-16'} />;
}
