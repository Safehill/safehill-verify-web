import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/user';
import type { ServerEncryptionKeysDTO } from '@/lib/api/models/dto/ServerEncryptionKeys';

export function useServerEncryptionKeys() {
  return useQuery({
    queryKey: ['server-encryption-keys'],
    queryFn: () => userApi.getServerEncryptionKeys(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Non-hook version for use outside React components
export async function getServerEncryptionKeys(): Promise<ServerEncryptionKeysDTO> {
  return userApi.getServerEncryptionKeys();
}
