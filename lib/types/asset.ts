// For assets that exist on the server
// Note: Asset version details (URLs, encryption metadata) are fetched separately via useAsset hook
export interface UploadedAsset {
  id: string;
  globalIdentifier: string;
  name: string; // Comes from localIdentifier in AssetOutputDTO
  type: string;
  size: string;
  uploaded: string;
  isPublic: boolean; // True if this is a public asset (no decryption needed)
  uploadState: 'not_started' | 'partial' | 'completed'; // Upload status from server
}

// For assets currently being uploaded
export interface UploadingAsset {
  uploadId: string; // unique ID for pending asset
  file: File;
  fileName: string;
  collectionName?: string;
  uploadProgress: number;
  uploadStatus: 'uploading' | 'error';
  uploadError?: string;
  thumbnailURL: string; // from URL.createObjectURL(file)
}

// Union type for display components
export type DisplayAsset = UploadedAsset | UploadingAsset;

// Type guard functions
export function isUploadingAsset(asset: DisplayAsset): asset is UploadingAsset {
  return 'uploadId' in asset;
}

export function isUploadedAsset(asset: DisplayAsset): asset is UploadedAsset {
  return 'id' in asset;
}

// Helper functions
export function getAssetId(asset: DisplayAsset): string {
  return isUploadingAsset(asset) ? asset.uploadId : asset.id;
}

export function getAssetName(asset: DisplayAsset): string {
  return isUploadingAsset(asset) ? asset.fileName : asset.name;
}

export function getAssetSortName(asset: DisplayAsset): string {
  return isUploadingAsset(asset)
    ? asset.fileName.toLowerCase()
    : asset.globalIdentifier.toLowerCase();
}

export function getAssetUploadTime(asset: DisplayAsset): number {
  if (isUploadingAsset(asset)) {
    // For uploading assets, use current time (they appear newest)
    return Date.now();
  }
  // For uploaded assets, parse the uploaded date
  return new Date(asset.uploaded || '').getTime();
}
