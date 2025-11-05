import type { AuthedSession } from '@/lib/auth/auth-context';
import type {
  PayoutAccountStatusDTO,
  PayoutSessionDTO,
  PayoutBalanceDTO,
  PayoutEarningsQueryDTO,
} from '@/lib/api/models/dto/Payout';
import { createAuthenticatedRequest } from './api';
import { toast } from 'sonner';

// API functions for payout management
export const payoutsApi = {
  // Get current payout account status
  getAccountStatus: async (
    authedSession: AuthedSession
  ): Promise<PayoutAccountStatusDTO> => {
    try {
      return await createAuthenticatedRequest<PayoutAccountStatusDTO>(
        'get',
        '/payouts/account-status',
        authedSession
      );
    } catch (error) {
      console.error('Failed to fetch payout account status:', error);
      throw new Error('Failed to load payout status');
    }
  },

  // Create embedded onboarding session
  createOnboardingSession: async (
    authedSession: AuthedSession
  ): Promise<PayoutSessionDTO> => {
    try {
      return await createAuthenticatedRequest<PayoutSessionDTO>(
        'post',
        '/payouts/create-onboarding-session',
        authedSession,
        {}
      );
    } catch (error) {
      console.error('Failed to create onboarding session:', error);
      toast.error('Failed to start onboarding. Please try again.');
      throw new Error('Failed to create onboarding session');
    }
  },

  // Create embedded dashboard session
  createDashboardSession: async (
    authedSession: AuthedSession
  ): Promise<PayoutSessionDTO> => {
    try {
      return await createAuthenticatedRequest<PayoutSessionDTO>(
        'post',
        '/payouts/create-dashboard-session',
        authedSession,
        {}
      );
    } catch (error) {
      console.error('Failed to create dashboard session:', error);
      toast.error('Failed to open dashboard. Please try again.');
      throw new Error('Failed to create dashboard session');
    }
  },

  // Get seller balance and earnings
  getBalance: async (
    authedSession: AuthedSession
  ): Promise<PayoutBalanceDTO> => {
    try {
      return await createAuthenticatedRequest<PayoutBalanceDTO>(
        'post',
        '/payouts/balance',
        authedSession,
        {}
      );
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      throw new Error('Failed to load balance');
    }
  },

  // Query earnings with filters
  queryEarnings: async (
    query: PayoutEarningsQueryDTO,
    authedSession: AuthedSession
  ): Promise<PayoutBalanceDTO> => {
    try {
      return await createAuthenticatedRequest<PayoutBalanceDTO>(
        'post',
        '/payouts/earnings',
        authedSession,
        query
      );
    } catch (error) {
      console.error('Failed to query earnings:', error);
      toast.error('Failed to load earnings data');
      throw new Error('Failed to query earnings');
    }
  },
};
