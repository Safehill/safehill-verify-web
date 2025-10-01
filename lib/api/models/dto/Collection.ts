import type {
  AssetOutputDTO,
  AssetInputDTO,
  AssetVersionInputDTO,
  AssetVersionOutputDTO,
  PublicAssetVersionOutputDTO,
} from './Asset';

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
  assets: CollectionAssetDTO[];
  publicAssets: PublicCollectionAssetDTO[];
}

export interface CollectionCreateDTO {
  name: string;
  description: string;
}

export interface CollectionUpdateDTO {
  name?: string;
  description?: string;
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

export interface CollectionAssetAddRequestDTO {
  assets: AssetInputDTO[];
  serverDecryptionDetails?: CollectionAssetDecryptionDTO[];
}

export interface CollectionAssetAddResultDTO {
  success: boolean;
  message: string;
  addedCount: number;
  skippedCount: number;
  assets?: AssetOutputDTO[];
  errors?: string[];
}

export interface CollectionAssetDecryptionDTO {
  assetGlobalIdentifier: string;
  versionDecryptionDetails: AssetVersionInputDTO[];
}

export interface CollectionChangeVisibilityDTO {
  visibility: Visibility;
  assetDecryptionDetails: CollectionAssetDecryptionDTO[];
  deleteOrphanedVersions?: boolean;
}

export interface CollectionChangeVisibilityResultDTO {
  collectionId: string;
  newVisibility: string;
  linkSharingEnabled: boolean;
  totalAssets: number;
  alreadyInTargetStateAssets: number;
  queuedAssets?: number;
  processedVersions?: number;
  processedAssetIds: string[];
}

export interface CollectionAssetDTO {
  globalIdentifier: string;
  name: string;
  type: string;
  lowResolutionVersion?: AssetVersionOutputDTO;
  uploadedAt: string; // ISO string timestamp
}

export interface PublicCollectionAssetDTO {
  globalIdentifier: string;
  name: string;
  type: string;
  lowResolutionVersion?: PublicAssetVersionOutputDTO;
  uploadedAt: string; // ISO string timestamp
}
