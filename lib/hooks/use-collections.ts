import {
  collectionsApi,
  type CollectionDetail,
  type Visibility,
  type AccessCheckResult,
  type PaymentIntent,
} from '@/lib/api/collections';
import { useAuth } from '@/lib/auth/auth-context';
import { convertToAuthenticatedUser } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Re-export types for convenience
export type { CollectionDetail, Visibility, AccessCheckResult, PaymentIntent };

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: string) => [...collectionKeys.lists(), { filters }] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
  users: () => [...collectionKeys.all, 'users'] as const,
  user: (id: string) => [...collectionKeys.users(), id] as const,
  access: () => [...collectionKeys.all, 'access'] as const,
  accessCheck: (id: string) => [...collectionKeys.access(), id] as const,
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
export const useCollection = (id: string, enabled: boolean = true) => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => collectionsApi.getCollection(id, authenticatedUser!),
    enabled: enabled && !!id && !!authenticatedUser, // Only run query if enabled, id exists and user is authenticated
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

// Hook to search all collections for adding to user's list
export const useSearchAllCollections = (query: string) => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useQuery({
    queryKey: [...collectionKeys.all, 'search-all', query],
    queryFn: () =>
      collectionsApi.searchAllCollections(query, authenticatedUser!),
    enabled: query.length > 0 && !!authenticatedUser,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    gcTime: 3 * 60 * 1000, // 3 minutes
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

// Hook to update a collection
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: { visibility?: Visibility; pricing?: number };
    }) => collectionsApi.updateCollection(id, updates, authenticatedUser!),
    onSuccess: (updatedCollection: CollectionDetail) => {
      // Update the collection in the cache
      queryClient.setQueryData(
        collectionKeys.detail(updatedCollection.id),
        updatedCollection
      );

      // Invalidate the collections list to refresh it
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};

// Hook to check access to a collection
export const useCollectionAccess = (id: string) => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useQuery({
    queryKey: collectionKeys.accessCheck(id),
    queryFn: () => collectionsApi.checkAccess(id, authenticatedUser!),
    enabled: !!id && !!authenticatedUser,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create payment intent
export const useCreatePaymentIntent = () => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);

  return useMutation({
    mutationFn: ({ collectionId }: { collectionId: string }) =>
      collectionsApi.createPaymentIntent(collectionId, authenticatedUser!),
  });
};

// Hook to confirm payment
export const useConfirmPayment = () => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      collectionId: string;
      paymentIntentId: string;
    }) =>
      collectionsApi.confirmPayment(
        variables.collectionId,
        variables.paymentIntentId,
        authenticatedUser!
      ),
    onSuccess: (
      result: { success: boolean; message?: string },
      variables: { collectionId: string; paymentIntentId: string }
    ) => {
      if (result.success) {
        // Invalidate access check and collection data
        queryClient.invalidateQueries({
          queryKey: collectionKeys.accessCheck(variables.collectionId),
        });
        queryClient.invalidateQueries({
          queryKey: collectionKeys.detail(variables.collectionId),
        });
        queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      }
    },
  });
};

// Hook to track collection access
export const useTrackCollectionAccess = () => {
  const { authedSession } = useAuth();
  const authenticatedUser = convertToAuthenticatedUser(authedSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId }: { collectionId: string }) =>
      collectionsApi.trackCollectionAccess(collectionId, authenticatedUser!),
    onSuccess: () => {
      // Invalidate collections list to show the newly accessed collection
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};
