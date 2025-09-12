'use client';

import { Button } from '@/components/shared/button';
import { FileUp, Trash2 } from 'lucide-react';
import type React from 'react';

export interface FileTableProps {
  files: File[];
  onRemoveFile: (file: File) => void;
  onSubmit?: (files: File[]) => void;
  isLoading?: boolean;
  readyLabel?: string;
  submitLabel?: string;
  showSubmitButton?: boolean;
  showImagePreviews?: boolean;
  className?: string;
}

function typeOf(file: File): string | null {
  let suffix = null;
  const index = file.name.lastIndexOf('.');
  if (index > -1) {
    suffix = file.name.substring(index + 1);
  }
  return file.type || suffix;
}

const FileTable: React.FC<FileTableProps> = ({
  files,
  onRemoveFile,
  onSubmit,
  isLoading = false,
  readyLabel = 'Ready for upload',
  submitLabel = 'Upload',
  showSubmitButton = true,
  showImagePreviews = false,
  className = '',
}) => {
  const handleSubmit = () => {
    if (onSubmit && files.length > 0) {
      onSubmit(files);
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={`border rounded-md overflow-hidden shadow-sm ${className}`}>
      {/* Header row */}
      <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 md:text-sm text-xs font-semibold text-left px-5">
        <div className="col-span-5">{readyLabel}</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* File rows */}
      <div className="divide-y">
        {files.map((file) => (
          <div
            key={file.name}
            className="grid grid-cols-6 gap-4 p-3 items-center text-sm text-left"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                {showImagePreviews && file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                    onLoad={(e) => {
                      // Clean up object URL after image loads
                      URL.revokeObjectURL((e.target as HTMLImageElement).src);
                    }}
                  />
                ) : (
                  <FileUp className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {typeOf(file)} •{' '}
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="col-span-1 flex gap-1 pr-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveFile(file)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload button */}
      {showSubmitButton && onSubmit && (
        <div className="p-4 bg-muted/25 border-t">
          <Button
            onClick={handleSubmit}
            disabled={files.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                {submitLabel}ing {files.length} file{files.length === 1 ? '' : 's'}...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                {submitLabel} {files.length} file{files.length === 1 ? '' : 's'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileTable;