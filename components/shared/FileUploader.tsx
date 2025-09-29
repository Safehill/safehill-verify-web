'use client';

import { Input } from '@/components/shared/input';
import { FileUp } from 'lucide-react';
import type React from 'react';

export interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFileSize?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  isLoading?: boolean;
  multiple?: boolean;
  id?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  acceptedFileTypes = '.png,.jpg,.heic',
  maxFileSize = '500MB',
  title = 'Drop your files here',
  subtitle = 'or click to select files',
  className = '',
  isLoading = false,
  multiple = true,
  id = 'file-upload',
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
      // Clear the input so the same files can be selected again
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    if (!isLoading) {
      document.getElementById(id)?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          isLoading
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-muted/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <Input
          id={id}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          multiple={multiple}
          disabled={isLoading}
        />
        <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
        <p className="text-xs text-muted-foreground">
          Supports {acceptedFileTypes.replace(/\./g, '').toUpperCase()} files up
          to {maxFileSize}
        </p>
        <div className="mt-3 h-5">
          {isLoading && (
            <>
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-muted-foreground border-r-transparent"></div>
              <span className="ml-2 text-sm text-muted-foreground">
                Processing...
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
