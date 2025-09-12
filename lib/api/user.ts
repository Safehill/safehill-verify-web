import type { UserDTO } from '@/lib/api/models/dto/User';
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
};
