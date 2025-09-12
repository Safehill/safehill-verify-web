'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

export interface UploadItem {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  collectionName?: string;
  file: File;
}

interface UploadContextType {
  uploads: UploadItem[];
  addUpload: (file: File, collectionName?: string) => string;
  updateUploadProgress: (id: string, progress: number) => void;
  completeUpload: (id: string) => void;
  failUpload: (id: string, error: string) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
  uploadFiles: (files: File[], collectionName?: string, onComplete?: () => void) => Promise<void>;
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
  onUploadComplete?: (files: File[], collectionName?: string) => Promise<void>;
}

export function UploadProvider({ children, onUploadComplete }: UploadProviderProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const addUpload = useCallback((file: File, collectionName?: string): string => {
    const id = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const uploadItem: UploadItem = {
      id,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
      collectionName,
      file,
    };

    setUploads(prev => [...prev, uploadItem]);
    return id;
  }, []);

  const updateUploadProgress = useCallback((id: string, progress: number) => {
    setUploads(prev =>
      prev.map(upload =>
        upload.id === id
          ? { ...upload, progress: Math.min(100, Math.max(0, progress)) }
          : upload
      )
    );
  }, []);

  const completeUpload = useCallback((id: string) => {
    setUploads(prev =>
      prev.map(upload =>
        upload.id === id
          ? { ...upload, progress: 100, status: 'completed' as const }
          : upload
      )
    );
  }, []);

  const failUpload = useCallback((id: string, error: string) => {
    setUploads(prev =>
      prev.map(upload =>
        upload.id === id
          ? { ...upload, status: 'error' as const, error }
          : upload
      )
    );
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(upload => upload.status !== 'completed'));
  }, []);

  const uploadFiles = useCallback(async (
    files: File[],
    collectionName?: string,
    onComplete?: () => void
  ) => {
    const uploadIds = files.map(file => addUpload(file, collectionName));

    try {
      // Simulate upload progress for each file
      const uploadPromises = files.map(async (file, index) => {
        const uploadId = uploadIds[index];
        
        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            updateUploadProgress(uploadId, progress);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          // Call the actual upload handler if provided
          if (onUploadComplete) {
            await onUploadComplete([file], collectionName);
          }

          completeUpload(uploadId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          failUpload(uploadId, errorMessage);
          throw error;
        }
      });

      await Promise.all(uploadPromises);

      toast.success(`Successfully uploaded ${files.length} file${files.length === 1 ? '' : 's'}`);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Some uploads failed. Please try again.');
    }
  }, [addUpload, updateUploadProgress, completeUpload, failUpload, onUploadComplete]);

  const value: UploadContextType = {
    uploads,
    addUpload,
    updateUploadProgress,
    completeUpload,
    failUpload,
    removeUpload,
    clearCompleted,
    uploadFiles,
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
}