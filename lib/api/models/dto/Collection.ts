import type { AssetOutputDTO } from './Asset';

export type Visibility = 'public' | 'confidential' | 'not-shared';

export type AccessStatus = 'granted' | 'paywall' | 'denied' | 'loading';

export interface CollectionOutputDTO {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  visibility: Visibility;
  pricing: number;
  lastUpdated: string; // ISO string timestamp
  createdBy: string;
  assets: AssetOutputDTO[];
}

export interface CollectionCreateDTO {
  name: string;
  description: string;
}

export interface CollectionUpdateDTO {
  visibility?: Visibility;
  pricing?: number;
}

export interface CollectionSearchDTO {
  searchScope: 'owned' | 'public' | 'all';
  query?: string;
  visibility?: Visibility;
  priceRange?: PriceRangeDTO;
}

export interface PriceRangeDTO {
  min?: number;
  max?: number;
}

export interface AccessCheckResultDTO {
  status: AccessStatus;
  message?: string;
  price?: number;
  visibility?: Visibility;
  createdBy?: string;
}

export interface PaymentIntentDTO {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentConfirmationDTO {
  success: boolean;
  message?: string;
}
