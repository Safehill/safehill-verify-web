import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';

// Hook to get asset data
export const useAsset = (assetId: string) => {
  return useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => assetsApi.getAsset(assetId),
    enabled: !!assetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
