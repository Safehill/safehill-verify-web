import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { useAuth } from '@/lib/auth/auth-context';

// Hook to get asset data
export const useAsset = (globalIdentifier: string) => {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: ['asset', globalIdentifier],
    queryFn: () => {
      if (!authedSession) {
        throw new Error('Authentication required');
      }
      return assetsApi.getAsset(globalIdentifier, authedSession);
    },
    enabled: !!globalIdentifier && !!authedSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
