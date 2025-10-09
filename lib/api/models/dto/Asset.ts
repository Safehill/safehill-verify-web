export interface AssetOutputDTO {
  globalIdentifier: string;
  localIdentifier?: string;
  createdBy: string;
  creationDate?: string;
  versions: AssetVersionOutputDTO[];
  isPublic?: boolean;
  /// Public versions with direct access URLs (only present when isPublic = true)
  publicVersions?: PublicAssetVersionOutputDTO[];
  /// Upload state (not_started, partial, completed)
  uploadState: 'not_started' | 'partial' | 'completed';
}

export interface AssetVersionOutputDTO {
  versionName: string;
  ephemeralPublicKey: string;
  publicSignature: string;
  encryptedSecret: string;
  senderPublicSignature: string;
  presignedURL: string;
  presignedURLExpiresInMinutes: number;
  timeUploaded?: string;
}

export interface PublicAssetVersionOutputDTO {
  versionName: string;
  presignedURL: string;
  presignedURLExpiresInMinutes: number;
  timeUploaded?: string;
}

export interface AssetInputDTO {
  globalIdentifier: string;
  localIdentifier?: string;
  fingerprint?: string;
  perceptualHash?: string;
  embeddings?: string;
  creationDate: string;
  groupId?: string;
  versions: AssetVersionInputDTO[];
  force?: boolean;
}

export interface AssetVersionInputDTO {
  versionName: string;
  senderEncryptedSecret: string;
  ephemeralPublicKey: string;
  publicSignature: string;
}

export interface AssetSearchCriteriaDTO {
  globalIdentifiers: string[];
  versionNames?: string[];
}

export interface AssetDeleteCriteriaDTO {
  globalIdentifiers: string[];
}

export interface AssetDescriptorDTO {
  globalIdentifier: string;
  localIdentifier?: string;
  creationDate: string;
  uploadState: string;
  sharingInfo: AssetDescriptorSharingInfoDTO;
}

export interface AssetDescriptorSharingInfoDTO {
  sharedByUserIdentifier: string;
  sharedWithUserIdentifiersInGroup: Record<string, string[]>;
  groupIdsByRecipientUserIdentifier: Record<string, string[]>;
  groupInfoById: Record<string, AssetGroupInfoDTO>;
}

export interface AssetGroupInfoDTO {
  createdBy: string;
  createdAt: string;
  invitedUsersPhoneNumbers?: string[];
  permissions?: number;
  createdFromThreadId?: string;
  encryptedTitle?: string;
}

export interface AssetShareDTO {
  globalAssetIdentifier: string;
  versionSharingDetails: AssetVersionUserShareDTO[];
  isPhotoMessage?: boolean;
  shouldLinkToThread?: boolean;
  groupId?: string;
  asPhotoMessageInThreadId?: string;
  suppressNotification?: boolean;
  permissions?: number;
}

export interface AssetVersionUserShareDTO {
  versionName: string;
  recipientUserIdentifier: string;
  recipientEncryptedSecret: string;
  ephemeralPublicKey: string;
  publicSignature: string;
}

export interface AssetSimilarMatchDTO {
  globalIdentifier: string;
  createdBy: string;
  authenticationDate: string;
  distance: number;
  creationDate?: string;
}

export interface AssetSimilarMatchRequestDTO {
  embeddings: string;
  maxDistance: number;
  perceptualHash?: string;
}

export interface AssetFingerprintDTO {
  embeddings: string;
  perceptualHash?: string;
}
