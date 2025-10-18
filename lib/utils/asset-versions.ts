import type {
  AssetVersionOutputDTO,
  PublicAssetVersionOutputDTO,
} from '@/lib/api/models/dto/Asset';

/**
 * Select the best available encrypted version for a given quality preference.
 * Falls back to any available version if preferred quality is not found.
 *
 * @param versions - Array of encrypted asset versions
 * @param preferredQuality - Preferred quality level ('hi' or 'low')
 * @returns The selected version or undefined if no versions available
 */
export function selectVersion(
  versions: AssetVersionOutputDTO[] | undefined,
  preferredQuality: 'hi' | 'low'
): AssetVersionOutputDTO | undefined {
  if (!versions || versions.length === 0) {
    return undefined;
  }

  // First try to find the preferred quality
  const preferred = versions.find((v) => v.versionName === preferredQuality);
  if (preferred) {
    return preferred;
  }

  // Fall back to any available version
  return versions[0];
}

/**
 * Select the best available public version for a given quality preference.
 * Falls back to any available version if preferred quality is not found.
 *
 * @param versions - Array of public asset versions
 * @param preferredQuality - Preferred quality level ('hi' or 'low')
 * @returns The selected version or undefined if no versions available
 */
export function selectPublicVersion(
  versions: PublicAssetVersionOutputDTO[] | undefined,
  preferredQuality: 'hi' | 'low'
): PublicAssetVersionOutputDTO | undefined {
  if (!versions || versions.length === 0) {
    return undefined;
  }

  // First try to find the preferred quality
  const preferred = versions.find((v) => v.versionName === preferredQuality);
  if (preferred) {
    return preferred;
  }

  // Fall back to any available version
  return versions[0];
}
