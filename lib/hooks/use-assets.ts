import { useQuery, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { useAuth } from '@/lib/auth/auth-context';

// Hook to get asset data
export const useAsset = (globalIdentifier: string, enabled: boolean = true) => {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: ['asset', globalIdentifier],
    queryFn: () => {
      if (!authedSession) {
        throw new Error('Authentication required');
      }
      return assetsApi.getAsset(globalIdentifier, authedSession);
    },
    enabled: enabled && !!globalIdentifier && !!authedSession,
    staleTime: 30 * 60 * 1000, // 30 minutes
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

      // Populate individual asset cache entries
      assets.forEach((asset) => {
        queryClient.setQueryData(['asset', asset.globalIdentifier], asset);
      });

      return assets;
    },
    enabled: enabled && globalIdentifiers.length > 0 && !!authedSession,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};
