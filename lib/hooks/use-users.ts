import { useQuery } from '@tanstack/react-query';
import type { UserDTO } from '@/lib/api/models/dto/User';
import { userApi } from '@/lib/api/user';

export const useUsers = (userIds: string[]) => {
  const uniqueSortedIds = Array.from(new Set(userIds)).sort();
  return useQuery<UserDTO[]>({
    queryKey: ['users', uniqueSortedIds],
    queryFn: () => userApi.fetchUsers(uniqueSortedIds),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: uniqueSortedIds.length > 0,
  });
};

// Hook to get a single user by ID
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.fetchUsers([userId]).then((users) => users[0]),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};
