/**
 * Asset quality levels with their corresponding maximum dimensions
 */
export enum AssetQuality {
  LOW = 'low',
  HIGH = 'hi',
}

export interface AssetVersionSpec {
  name: string;
  maxWidth: number;
  maxHeight: number;
}

export const ASSET_VERSION_SPECS: Record<AssetQuality, AssetVersionSpec> = {
  [AssetQuality.LOW]: {
    name: 'low',
    maxWidth: 480,
    maxHeight: 480,
  },
  [AssetQuality.HIGH]: {
    name: 'hi',
    maxWidth: 4800,
    maxHeight: 4800,
  },
};

/**
 * Get all version specs in order (low to high)
 */
export function getAllVersionSpecs(): AssetVersionSpec[] {
  return [
    ASSET_VERSION_SPECS[AssetQuality.LOW],
    ASSET_VERSION_SPECS[AssetQuality.HIGH],
  ];
}
