import { collectionsApi } from '@/lib/api/collections';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: string) => [...collectionKeys.lists(), { filters }] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
};

// Hook to get all collections
export const useCollections = () => {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: collectionsApi.getCollections,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook to get a single collection by ID
export const useCollection = (id: string) => {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => collectionsApi.getCollection(id),
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search collections
export const useSearchCollections = (query: string) => {
  return useQuery({
    queryKey: collectionKeys.list(query),
    queryFn: () => collectionsApi.searchCollections(query),
    enabled: query.length > 0, // Only run query if there's a search query
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to prefetch a collection (useful for navigation)
export const usePrefetchCollection = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: collectionKeys.detail(id),
      queryFn: () => collectionsApi.getCollection(id),
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
