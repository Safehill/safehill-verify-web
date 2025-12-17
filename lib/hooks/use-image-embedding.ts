// import cv from '../../deps/opencv_version';
import {
  generateEmbeddingFromImageData,
  loadTinyCLIPModel,
  serializeEmbeddingToBase64,
} from '@/lib/embeddings/tinyclip-embeddings';
import React, { useSyncExternalStore } from 'react';
import { toast } from 'sonner';

type ModelState =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'failed_once'
  | 'failed_twice';

export const EmbeddingsSingleton = {
  state: 'idle' as ModelState,
  hasInitStarted: false,
  listeners: new Set<() => void>(),
  loadingPromise: null as Promise<void> | null,
};

function notifyAll() {
  EmbeddingsSingleton.listeners.forEach((cb) => cb());
}

/**
 * Attempt to load the model with retry logic and toast notifications
 */
async function attemptModelLoad(isRetry: boolean = false): Promise<void> {
  if (
    EmbeddingsSingleton.state === 'loading' &&
    EmbeddingsSingleton.loadingPromise
  ) {
    // Already loading, return existing promise
    console.log(
      '[Embedding Model] Already loading, returning existing promise'
    );
    return EmbeddingsSingleton.loadingPromise;
  }

  console.log('[Embedding Model] Starting load, isRetry:', isRetry);
  EmbeddingsSingleton.state = 'loading';
  EmbeddingsSingleton.hasInitStarted = true;
  notifyAll();

  // Show toast notification
  if (isRetry) {
    console.log('[Embedding Model] Showing retry toast');
    toast.loading('Retrying fingerprint model initialization...', {
      id: 'embedding-model',
    });
  } else {
    console.log('[Embedding Model] Showing initial loading toast');
    toast.loading('Preparing fingerprint model...', {
      id: 'embedding-model',
    });
  }

  const loadingPromise = loadTinyCLIPModel()
    .then(() => {
      console.log('[Embedding Model] Load successful');
      EmbeddingsSingleton.state = 'loaded';
      EmbeddingsSingleton.loadingPromise = null;
      toast.success('Fingerprint model ready', {
        id: 'embedding-model',
        duration: 2000,
      });
      notifyAll();
    })
    .catch((reason: any) => {
      console.error('[Embedding Model] Load failed:', reason);

      if (EmbeddingsSingleton.state === 'loading') {
        // First failure
        console.log('[Embedding Model] First failure, will auto-retry');
        EmbeddingsSingleton.state = 'failed_once';
        toast.warning('Retrying model initialization...', {
          id: 'embedding-model',
        });
        notifyAll();

        // Auto-retry after 1 second
        setTimeout(() => {
          attemptModelLoad(true);
        }, 1000);
      } else if (EmbeddingsSingleton.state === 'failed_once') {
        // Second failure
        console.error('[Embedding Model] Second failure, giving up');
        EmbeddingsSingleton.state = 'failed_twice';
        EmbeddingsSingleton.loadingPromise = null;
        toast.error('Failed to load fingerprint model. Please retry.', {
          id: 'embedding-model',
          duration: Infinity, // Persistent until dismissed
        });
        notifyAll();
      }
    });

  EmbeddingsSingleton.loadingPromise = loadingPromise;
  return loadingPromise;
}

/**
 * Manually trigger model reload (for retry button)
 */
export function reloadEmbeddingModel(): void {
  // Reset state to allow retry
  EmbeddingsSingleton.state = 'idle';
  EmbeddingsSingleton.hasInitStarted = false;
  EmbeddingsSingleton.loadingPromise = null;
  attemptModelLoad(false);
}

export function useImageEmbedding(options?: { delayMs?: number }) {
  const delayMs = options?.delayMs ?? 0;
  const [isReady, setIsReady] = React.useState(delayMs === 0);

  // Subscribe to global state
  const state = useSyncExternalStore(
    (callback) => {
      EmbeddingsSingleton.listeners.add(callback);
      return () => EmbeddingsSingleton.listeners.delete(callback);
    },
    () => EmbeddingsSingleton.state,
    () => 'idle' as ModelState
  );

  // Handle delay if specified
  React.useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => {
        console.log('[useImageEmbedding] Delay complete, starting load');
        setIsReady(true);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  // Perform init once on mount (after delay if specified)
  React.useEffect(() => {
    if (
      isReady &&
      typeof window !== 'undefined' &&
      EmbeddingsSingleton.state === 'idle' &&
      !EmbeddingsSingleton.hasInitStarted
    ) {
      attemptModelLoad(false);
    }
  }, [isReady]);

  const calculateEmbedding = async (imageData: ImageData): Promise<string> => {
    if (EmbeddingsSingleton.state !== 'loaded') {
      throw new Error('Model is not loaded yet');
    }

    const embedding = await generateEmbeddingFromImageData(imageData);
    return serializeEmbeddingToBase64(embedding);
  };

  // Return state information
  return {
    isLoaded: state === 'loaded',
    isLoading: state === 'loading',
    hasFailed: state === 'failed_once' || state === 'failed_twice',
    needsRetry: state === 'failed_twice',
    state,
    calculate: calculateEmbedding,
    reload: reloadEmbeddingModel,
  };
}
