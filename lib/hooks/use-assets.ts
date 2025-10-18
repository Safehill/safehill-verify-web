import { useQuery, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { useAuth } from '@/lib/auth/auth-context';
import type { AssetOutputDTO } from '@/lib/api/models/dto/Asset';

/**
 * Calculate stale time based on presigned URL expiration
 * We use 80% of the shortest expiration time to ensure we refetch before URLs expire
 */
const calculateStaleTime = (asset: AssetOutputDTO | AssetOutputDTO[]): number => {
  const assets = Array.isArray(asset) ? asset : [asset];

  // Find the shortest expiration time across all assets and their versions
  let shortestExpirationMinutes = Infinity;

  for (const a of assets) {
    for (const version of a.versions) {
      if (version.presignedURLExpiresInMinutes < shortestExpirationMinutes) {
        shortestExpirationMinutes = version.presignedURLExpiresInMinutes;
      }
    }
  }

  // Use 80% of the expiration time to ensure we refetch before URLs expire
  // Convert from minutes to milliseconds
  const staleTimeMs = Math.floor(shortestExpirationMinutes * 0.8 * 60 * 1000);

  // Ensure a minimum of 1 minute to avoid excessive refetching
  return Math.max(staleTimeMs, 60 * 1000);
};

// Hook to get asset data
export const useAsset = (globalIdentifier: string, enabled: boolean = true) => {
  const { authedSession } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['asset', globalIdentifier],
    queryFn: async () => {
      if (!authedSession) {
        throw new Error('Authentication required');
      }
      const asset = await assetsApi.getAsset(globalIdentifier, authedSession);

      // Update the stale time based on presigned URL expiration
      const staleTime = calculateStaleTime(asset);
      queryClient.setQueryDefaults(['asset', globalIdentifier], {
        staleTime,
      });

      return asset;
    },
    enabled: enabled && !!globalIdentifier && !!authedSession,
    staleTime: 5 * 60 * 1000, // Initial stale time (will be updated after first fetch)
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};

// Hook to batch fetch multiple assets (single API call, populates cache for all)
export const useAssets = (
  globalIdentifiers: string[],
  enabled: boolean = true
) => {
  const { authedSession } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['assets-batch', ...globalIdentifiers.sort()],
    queryFn: async () => {
      if (!authedSession) {
        throw new Error('Authentication required');
      }

      // Fetch all assets in one API call
      const assets = await assetsApi.getAssets(
        globalIdentifiers,
        authedSession
      );

      // Calculate stale time based on presigned URL expiration for all assets
      const staleTime = calculateStaleTime(assets);

      // Populate individual asset cache entries with appropriate stale time
      assets.forEach((asset) => {
        queryClient.setQueryData(['asset', asset.globalIdentifier], asset);
        queryClient.setQueryDefaults(['asset', asset.globalIdentifier], {
          staleTime,
        });
      });

      // Update batch query stale time as well
      queryClient.setQueryDefaults(
        ['assets-batch', ...globalIdentifiers.sort()],
        {
          staleTime,
        }
      );

      return assets;
    },
    enabled: enabled && globalIdentifiers.length > 0 && !!authedSession,
    staleTime: 5 * 60 * 1000, // Initial stale time (will be updated after first fetch)
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};
