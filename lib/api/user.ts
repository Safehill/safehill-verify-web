import type { UserDTO } from '@/lib/api/models/dto/User';
import { createUnauthenticatedRequest } from './api';

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

      return Promise.reject('Unavailable users');
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
