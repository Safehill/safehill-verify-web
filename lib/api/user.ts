import type { UserDTO } from '@/lib/api/models/dto/User';
import type { ServerEncryptionKeysDTO } from '@/lib/api/models/dto/ServerEncryptionKeys';
import { createUnauthenticatedRequest } from './api';
import { toast } from 'sonner';

// API functions for users
export const userApi = {
  // Fetch users by IDs (unauthenticated endpoint)
  fetchUsers: async (userIds: string[]): Promise<UserDTO[]> => {
    try {
      const response = await createUnauthenticatedRequest<UserDTO[]>(
        'post',
        '/users/retrieve-unauthed',
        {
          userIdentifiers: userIds,
        }
      );

      if (response && response.length > 0) {
        return response;
      }

      throw new Error('Unavailable users');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load user information');
      throw error;
    }
  },

  // Get server encryption keys (public key, signature, protocol salt)
  getServerEncryptionKeys: async (): Promise<ServerEncryptionKeysDTO> => {
    try {
      console.debug('userApi.getServerEncryptionKeys called');

      const serverKeys =
        await createUnauthenticatedRequest<ServerEncryptionKeysDTO>(
          'get',
          '/users/server-encryption-keys'
        );

      console.debug('userApi.getServerEncryptionKeys successful', {
        publicKeyLength: serverKeys.publicKey?.length || 0,
        publicSignatureLength: serverKeys.publicSignature?.length || 0,
        encryptionProtocolSaltLength:
          serverKeys.encryptionProtocolSalt?.length || 0,
      });

      return serverKeys;
    } catch (error) {
      console.error('userApi.getServerEncryptionKeys failed', error);
      throw new Error(
        `Failed to fetch server encryption keys: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};
