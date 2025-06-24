import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api/user';
import {UserDTO} from "@/lib/api/models/dto/User";

export const useUsers = (userIds: string[]) => {
  const uniqueSortedIds = Array.from(new Set(userIds)).sort()
  return useQuery<UserDTO[]>({
    queryKey: ['users', uniqueSortedIds],
    queryFn: () => fetchUsers(uniqueSortedIds),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: uniqueSortedIds.length > 0,
  });
};
