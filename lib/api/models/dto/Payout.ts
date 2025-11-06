export type PayoutAccountStatus = 'active' | 'pending' | 'restricted' | 'none';

export interface PayoutAccountStatusDTO {
  hasAccount: boolean;
  accountId?: string;
  status: PayoutAccountStatus;
  detailsSubmitted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export interface PayoutSessionDTO {
  client_secret: string;
  expires_at: number;
}

export interface BalanceAmount {
  amount: number;
  currency: string;
}

export interface PayoutBalanceDTO {
  available: BalanceAmount[];
  pending: BalanceAmount[];
  totalEarnings: number;
  currency: string;
}

export interface PayoutEarningsQueryDTO {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  collectionId?: string;
}
