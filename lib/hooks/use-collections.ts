import { collectionsApi } from '@/lib/api/collections';
import type {
  CollectionOutputDTO,
  CollectionCreateDTO,
  CollectionUpdateDTO,
  PaymentConfirmationDTO,
  CollectionChangeVisibilityDTO,
  CollectionChangeVisibilityResultDTO,
} from '@/lib/api/models/dto/Collection';
import { useAuth } from '@/lib/auth/auth-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => collectionsApi.getCollections(authedSession!),
    enabled: !!authedSession, // Only run query if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook to get a single collection by ID
export const useCollection = (id: string, enabled: boolean = true) => {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => collectionsApi.getCollection(id, authedSession!),
    enabled: enabled && !!id && !!authedSession, // Only run query if enabled, id exists and user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search collections
export const useSearchCollections = (query: string) => {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: collectionKeys.list(query),
    queryFn: () => collectionsApi.searchCollections(query, authedSession!),
    enabled: query.length > 0 && !!authedSession, // Only run query if there's a search query and user is authenticated
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search all collections for adding to user's list
export const useSearchAllCollections = (query: string) => {
  const { authedSession } = useAuth();

  return useQuery({
    queryKey: [...collectionKeys.all, 'search-all', query],
    queryFn: () => collectionsApi.searchAllCollections(query, authedSession!),
    enabled: query.length > 0 && !!authedSession,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Hook to prefetch a collection (useful for navigation)
export const usePrefetchCollection = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();

  return (id: string) => {
    if (!authedSession) {
      return;
    }

    queryClient.prefetchQuery({
      queryKey: collectionKeys.detail(id),
      queryFn: () => collectionsApi.getCollection(id, authedSession),
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

// Hook to create a collection
export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: (collectionData: CollectionCreateDTO) =>
      collectionsApi.createCollection(collectionData, authedSession!),
    onSuccess: (newCollection: CollectionOutputDTO) => {
      // Add the new collection to the cache
      queryClient.setQueryData(
        collectionKeys.detail(newCollection.id),
        newCollection
      );

      // Invalidate the collections list to refresh it
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};

// Hook to archive or remove a collection (based on ownership)
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: ({
      collectionId,
      isOwned,
    }: {
      collectionId: string;
      isOwned: boolean;
    }) => {
      if (isOwned) {
        return collectionsApi.archiveCollection(collectionId, authedSession!);
      } else {
        return collectionsApi.softRemoveCollection(
          collectionId,
          authedSession!
        );
      }
    },
    onSuccess: (_, variables) => {
      // Remove the collection from the cache
      queryClient.removeQueries({
        queryKey: collectionKeys.detail(variables.collectionId),
      });

      // Invalidate the collections list to refresh it
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};

// Hook to update a collection
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: CollectionUpdateDTO;
    }) => collectionsApi.updateCollection(id, updates, authedSession!),
    onSuccess: (updatedCollection: CollectionOutputDTO) => {
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

  return useQuery({
    queryKey: collectionKeys.accessCheck(id),
    queryFn: () => collectionsApi.checkAccess(id, authedSession!),
    enabled: !!id && !!authedSession,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create payment intent
export const useCreatePaymentIntent = () => {
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: ({ collectionId }: { collectionId: string }) =>
      collectionsApi.createPaymentIntent(collectionId, authedSession!),
  });
};

// Hook to confirm payment
export const useConfirmPayment = () => {
  const { authedSession } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      collectionId: string;
      paymentIntentId: string;
    }) =>
      collectionsApi.confirmPayment(
        variables.collectionId,
        variables.paymentIntentId,
        authedSession!
      ),
    onSuccess: (
      result: PaymentConfirmationDTO,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId }: { collectionId: string }) =>
      collectionsApi.trackCollectionAccess(collectionId, authedSession!),
    onSuccess: () => {
      // Invalidate collections list to show the newly accessed collection
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};

// Hook to change collection visibility
export const useChangeCollectionVisibility = () => {
  const queryClient = useQueryClient();
  const { authedSession } = useAuth();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: CollectionChangeVisibilityDTO;
    }) =>
      collectionsApi.changeCollectionVisibility(id, request, authedSession!),
    onSuccess: async (
      result: CollectionChangeVisibilityResultDTO,
      variables: { id: string; request: CollectionChangeVisibilityDTO }
    ) => {
      // onSuccess only fires if the API returned a 2xx status code
      // Invalidate queries to refresh the UI with updated data
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.id),
      });

      await queryClient.invalidateQueries({
        queryKey: collectionKeys.lists(),
      });
    },
  });
};
