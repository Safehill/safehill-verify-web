import { collectionsApi, type Visibility } from '@/lib/api/collections';
import { useAuth } from '@/lib/auth/auth-context';
import { convertToAuthenticatedUser } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Re-export types for convenience
export type { Visibility };

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: string) => [...collectionKeys.lists(), { filters }] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
  users: () => [...collectionKeys.all, 'users'] as const,
  user: (id: string) => [...collectionKeys.users(), id] as const,
};

// Hook to get all collections
export const useCollections = () => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => collectionsApi.getCollections(authenticatedUser!),
    enabled: !!authenticatedUser, // Only run query if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook to get a single collection by ID
export const useCollection = (id: string) => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => collectionsApi.getCollection(id, authenticatedUser!),
    enabled: !!id && !!authenticatedUser, // Only run query if id exists and user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search collections
export const useSearchCollections = (query: string) => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useQuery({
    queryKey: collectionKeys.list(query),
    queryFn: () => collectionsApi.searchCollections(query, authenticatedUser!),
    enabled: query.length > 0 && !!authenticatedUser, // Only run query if there's a search query and user is authenticated
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get user information
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: collectionKeys.user(userId),
    queryFn: () => collectionsApi.getUser(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Hook to get image data
export const useImage = (imageId: string) => {
  return useQuery({
    queryKey: ['image', imageId],
    queryFn: () => collectionsApi.getImage(imageId),
    enabled: !!imageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to prefetch a collection (useful for navigation)
export const usePrefetchCollection = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return (id: string) => {
    if (!authenticatedUser) {
      return;
    }

    queryClient.prefetchQuery({
      queryKey: collectionKeys.detail(id),
      queryFn: () => collectionsApi.getCollection(id, authenticatedUser),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };
};

// Hook to invalidate collections cache
export const useInvalidateCollections = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: collectionKeys.all });
  };
};
