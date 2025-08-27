// import cv from '../../deps/opencv_version';
import {
  generateEmbeddingFromImageData,
  loadTinyCLIPModel,
  serializeEmbeddingToBase64,
} from '@/lib/embeddings/tinyclip-embeddings';
import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';

export const EmbeddingsSingleton = {
  isLoaded: false,
  hasInitStarted: false,
  listeners: new Set<() => void>(),
};

function notifyAll() {
  EmbeddingsSingleton.listeners.forEach((cb) => cb());
}

export function useImageEmbedding() {
  // Subscribe to global isLoaded state
  const isLoadedState = useSyncExternalStore(
    (callback) => {
      EmbeddingsSingleton.listeners.add(callback);
      return () => EmbeddingsSingleton.listeners.delete(callback);
    },
    () => EmbeddingsSingleton.isLoaded,
    () => false
  );

  // Perform init once
  if (
    typeof window !== 'undefined' &&
    !EmbeddingsSingleton.isLoaded &&
    !EmbeddingsSingleton.hasInitStarted
  ) {
    // console.log('Image Embeddings Model initializing');
    EmbeddingsSingleton.hasInitStarted = true;

    loadTinyCLIPModel()
      .then(() => {
        // console.log('Image Embeddings Model initialization COMPLETE!');
        EmbeddingsSingleton.isLoaded = true;
        notifyAll();
      })
      .catch((reason: any) => {
        // console.error(reason);
        toast.error('Initialization failed: ' + reason);
        EmbeddingsSingleton.isLoaded = false;
        notifyAll();
      });
  }

  const calculateEmbedding = async (imageData: ImageData): Promise<string> => {
    if (!EmbeddingsSingleton.isLoaded) {
      throw new Error('Model is not loaded yet');
    }

    const embedding = await generateEmbeddingFromImageData(imageData);
    // console.log('embedding', embedding);
    return serializeEmbeddingToBase64(embedding);
  };

  // Return singleton-safe state
  return {
    isLoaded: isLoadedState,
    calculate: calculateEmbedding,
  };
}
