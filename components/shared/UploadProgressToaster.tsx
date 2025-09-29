'use client';

import { Button } from '@/components/shared/button';
import { Progress } from '@/components/shared/progress';
import {
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useState } from 'react';
import { useUpload } from '@/lib/contexts/upload-context';

export default function UploadProgressToaster({
  className = '',
}: {
  className?: string;
}) {
  const { uploads, removeUpload, clearCompleted } = useUpload();
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show if no uploads
  if (uploads.length === 0) {
    return null;
  }

  const activeUploads = uploads.filter((u) => u.status === 'uploading');
  const completedUploads = uploads.filter((u) => u.status === 'completed');
  const errorUploads = uploads.filter((u) => u.status === 'error');

  const totalProgress =
    uploads.length > 0
      ? uploads.reduce((sum, upload) => sum + upload.progress, 0) /
        uploads.length
      : 0;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 w-96 bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm text-gray-900">
            Uploads ({uploads.length})
          </span>
          {activeUploads.length > 0 && (
            <div className="text-xs text-gray-500">
              {activeUploads.length} active
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-3 w-3" />
            ) : (
              <Minimize2 className="h-3 w-3" />
            )}
          </Button>
          {completedUploads.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearCompleted}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Overall Progress */}
          {activeUploads.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(totalProgress)}%
                </span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>
          )}

          {/* Upload List */}
          <div className="max-h-64 overflow-y-auto">
            {uploads.map((upload) => (
              <div
                key={upload.globalIdentifier}
                className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {upload.status === 'uploading' && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent" />
                  )}
                  {upload.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {upload.fileName}
                  </div>
                  {upload.collectionName && (
                    <div className="text-xs text-gray-500 truncate">
                      to {upload.collectionName}
                    </div>
                  )}

                  {/* Progress Bar */}
                  {upload.status === 'uploading' && (
                    <div className="mt-1">
                      <Progress value={upload.progress} className="h-1" />
                    </div>
                  )}

                  {/* Error Message */}
                  {upload.status === 'error' && upload.error && (
                    <div className="text-xs text-red-600 mt-1 truncate">
                      {upload.error}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => removeUpload(upload.globalIdentifier)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-3 bg-gray-50 rounded-b-lg text-xs text-gray-600">
            {activeUploads.length > 0 && (
              <div>
                Uploading {activeUploads.length} file
                {activeUploads.length === 1 ? '' : 's'}...
              </div>
            )}
            {completedUploads.length > 0 && (
              <div className="text-green-600">
                {completedUploads.length} completed
              </div>
            )}
            {errorUploads.length > 0 && (
              <div className="text-red-600">{errorUploads.length} failed</div>
            )}
          </div>
        </>
      )}

      {/* Minimized View */}
      {isMinimized && (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeUploads.length > 0 ? (
                <>Uploading {activeUploads.length}...</>
              ) : (
                <>All uploads complete</>
              )}
            </div>
            {activeUploads.length > 0 && (
              <div className="text-xs text-gray-500">
                {Math.round(totalProgress)}%
              </div>
            )}
          </div>
          {activeUploads.length > 0 && (
            <Progress value={totalProgress} className="h-1 mt-2" />
          )}
        </div>
      )}
    </div>
  );
}
