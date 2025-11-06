import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/auth-context';
import { payoutsApi } from '@/lib/api/payouts';
import type { PayoutEarningsQueryDTO } from '@/lib/api/models/dto/Payout';

// Query key factory for payouts
export const payoutKeys = {
  all: ['payouts'] as const,
  accountStatus: () => [...payoutKeys.all, 'accountStatus'] as const,
  balance: () => [...payoutKeys.all, 'balance'] as const,
  earnings: (query?: PayoutEarningsQueryDTO) =>
    [...payoutKeys.all, 'earnings', query] as const,
};

/**
 * Hook to get payout account status
 * @param options.refetchInterval - Interval in ms to refetch (useful during onboarding)
 * @param options.enabled - Whether to enable the query
 */
export function usePayoutAccountStatus(options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: payoutKeys.accountStatus(),
    queryFn: async () => {
      if (!authedSession) {
        throw new Error('Not authenticated');
      }
      return payoutsApi.getAccountStatus(authedSession);
    },
    enabled: !!authedSession && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: options?.refetchInterval,
  });
}

/**
 * Hook to get payout balance
 */
export function usePayoutBalance(options?: { enabled?: boolean }) {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: payoutKeys.balance(),
    queryFn: async () => {
      if (!authedSession) {
        throw new Error('Not authenticated');
      }
      return payoutsApi.getBalance(authedSession);
    },
    enabled: !!authedSession && (options?.enabled ?? true),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to query earnings with filters
 */
export function usePayoutEarnings(
  query: PayoutEarningsQueryDTO,
  options?: { enabled?: boolean }
) {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: payoutKeys.earnings(query),
    queryFn: async () => {
      if (!authedSession) {
        throw new Error('Not authenticated');
      }
      return payoutsApi.queryEarnings(query, authedSession);
    },
    enabled: !!authedSession && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create embedded onboarding session
 */
export function useCreateOnboardingSession() {
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!authedSession) {
        throw new Error('Not authenticated');
      }
      return payoutsApi.createOnboardingSession(authedSession);
    },
  });
}

/**
 * Hook to create embedded dashboard session
 */
export function useCreateDashboardSession() {
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!authedSession) {
        throw new Error('Not authenticated');
      }
      return payoutsApi.createDashboardSession(authedSession);
    },
  });
}

/**
 * Helper hook to check if payouts are fully set up and active
 */
export function useIsPayoutActive() {
  const { data: accountStatus } = usePayoutAccountStatus();

  return (
    accountStatus?.hasAccount &&
    accountStatus?.status === 'active' &&
    accountStatus?.chargesEnabled &&
    accountStatus?.payoutsEnabled
  );
}
