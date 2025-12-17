'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { toast } from 'sonner';
import {
  AssetUploadService,
  type UploadProgress,
} from '@/lib/services/upload-service';
import { AssetEncryption } from '@/lib/crypto/asset-encryption';
import type { CollectionOutputDTO } from '@/lib/api/models/dto/Collection';
import { useAuth } from '@/lib/auth/auth-context';

export interface UploadItem {
  globalIdentifier: string;
  fileName: string;
  progress: number; // Aggregated across all versions
  status: 'uploading' | 'completed' | 'error';
  error?: Error;
  collectionName?: string;
  file: File;
  versionProgress: Record<string, number>; // Progress per version
}

interface UploadContextType {
  uploads: UploadItem[];
  uploadFiles: (
    files: File[],
    collection: CollectionOutputDTO,
    onComplete?: (error: Error | null) => void,
    onFinishedProcessingItem?: (
      globalIdentifier: string,
      error: Error | null
    ) => void
  ) => Promise<void>;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}

interface UploadProviderProps {
  children: ReactNode;
}

export function UploadProvider({ children }: UploadProviderProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const { authedSession } = useAuth();

  const addUpload = useCallback(
    (
      file: File,
      globalIdentifier: string,
      collectionName?: string
    ): UploadItem => {
      const uploadItem: UploadItem = {
        globalIdentifier,
        fileName: file.name,
        progress: 0,
        status: 'uploading',
        collectionName,
        file,
        versionProgress: {}, // Will be populated as versions are processed
      };

      setUploads((prev) => [...prev, uploadItem]);
      return uploadItem;
    },
    []
  );

  const updateVersionProgress = useCallback(
    (
      globalIdentifier: string,
      versionName: string,
      progress: UploadProgress
    ) => {
      setUploads((prev) =>
        prev.map((upload) => {
          if (upload.globalIdentifier !== globalIdentifier) {
            return upload;
          }

          // Update progress for this specific version
          const newVersionProgress = {
            ...upload.versionProgress,
            [versionName]: progress.progress,
          };

          // Calculate aggregated progress across all versions
          const versionProgresses = Object.values(newVersionProgress);
          const aggregatedProgress =
            versionProgresses.length > 0
              ? Math.round(
                  versionProgresses.reduce((sum, p) => sum + p, 0) /
                    versionProgresses.length
                )
              : 0;

          // Determine overall status
          const isError = progress.stage === 'error';
          const isCompleted =
            progress.stage === 'completed' && aggregatedProgress === 100;
          const status = isError
            ? ('error' as const)
            : isCompleted
            ? ('completed' as const)
            : ('uploading' as const);

          return {
            ...upload,
            versionProgress: newVersionProgress,
            progress: aggregatedProgress,
            status,
            error: progress.error,
          };
        })
      );
    },
    []
  );

  const removeUpload = useCallback((globalIdentifier: string) => {
    setUploads((prev) =>
      prev.filter((upload) => upload.globalIdentifier !== globalIdentifier)
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) =>
      prev.filter((upload) => upload.status !== 'completed')
    );
  }, []);

  const uploadFiles = useCallback(
    async (
      files: File[],
      collection: CollectionOutputDTO,
      onComplete?: (error: Error | null) => void,
      onFinishedProcessingItem?: (
        globalIdentifier: string,
        error: Error | null
      ) => void
    ) => {
      console.debug('UploadContext.uploadFiles called', {
        fileCount: files.length,
        collectionId: collection.id,
        collectionName: collection.name,
        collectionVisibility: collection.visibility,
      });

      if (!authedSession) {
        console.error('UploadContext.uploadFiles authentication required');
        toast.error('Authentication required for upload');
        return;
      }

      // Generate globalIdentifiers upfront and create upload items
      const uploadItems = files.map((file) => {
        const globalIdentifier = AssetEncryption.generateGlobalIdentifier();
        console.debug('UploadContext.uploadFiles generated globalIdentifier', {
          fileName: file.name,
          globalIdentifier,
        });
        return addUpload(file, globalIdentifier, collection.name);
      });

      try {
        // Create upload service with progress callback
        const uploadService = new AssetUploadService(
          (
            globalIdentifier: string,
            versionName: string,
            progress: UploadProgress
          ) => {
            console.debug('UploadContext.uploadFiles progress update', {
              globalIdentifier,
              versionName,
              stage: progress.stage,
              progress: progress.progress,
              message: progress.message,
            });
            updateVersionProgress(globalIdentifier, versionName, progress);
          }
        );

        // Create the files array with pre-generated globalIdentifiers
        const filesWithIds = files.map((file, index) => ({
          file,
          globalIdentifier: uploadItems[index].globalIdentifier,
        }));

        console.debug('UploadContext.uploadFiles starting upload service');

        // Use the upload service
        const results = await uploadService.uploadFiles(
          files,
          collection,
          authedSession,
          (file: File) => {
            // Return the pre-generated globalIdentifier for this file
            const matchingItem = filesWithIds.find(
              (item) => item.file === file
            );
            return (
              matchingItem?.globalIdentifier ||
              AssetEncryption.generateGlobalIdentifier()
            );
          },
          onFinishedProcessingItem
        );

        console.debug('UploadContext.uploadFiles upload service completed', {
          totalResults: results.length,
          successCount: results.filter((r) => r.success).length,
          errorCount: results.filter((r) => !r.success).length,
        });

        // Check results
        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.filter((r) => !r.success).length;

        if (errorCount === 0) {
          toast.success(
            `Successfully uploaded ${successCount} file${
              successCount === 1 ? '' : 's'
            }`
          );
        } else if (successCount > 0) {
          toast.warning(`Uploaded ${successCount} files, ${errorCount} failed`);
        } else {
          toast.error('All uploads failed');
        }

        if (onComplete) {
          console.debug(
            'UploadContext.uploadFiles calling onComplete callback'
          );
          onComplete(
            errorCount > 0 ? new Error(`${errorCount} uploads failed`) : null
          );
        }
      } catch (error) {
        console.error('UploadContext.uploadFiles failed', error);
        toast.error('Upload failed. Please try again.');

        if (onComplete) {
          onComplete(
            error instanceof Error ? error : new Error('Upload failed')
          );
        }
      }
    },
    [authedSession, addUpload, updateVersionProgress]
  );

  const value: UploadContextType = {
    uploads,
    uploadFiles,
    removeUpload,
    clearCompleted,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}
