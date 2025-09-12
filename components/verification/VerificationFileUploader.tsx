'use client';

import { Card, CardContent } from '@/components/shared/card';
import FileUploader from '@/components/shared/FileUploader';
import FileTable from '@/components/shared/FileTable';
import type React from 'react';
import { useState } from 'react';
import type { FileUploaderProps } from './FileDetailsProps';

const VerificationFileUploader: React.FC<FileUploaderProps> = ({
  isLoading,
  setIsLoading,
  onSubmit,
}) => {
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const handleFilesAdded = (newFiles: File[]) => {
    if (newFiles.length < 1) {
      return;
    }

    // For verification, we submit immediately
    setIsLoading(true);
    onSubmit(newFiles);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setStagedFiles(prev => prev.filter(f => f.name !== fileToRemove.name));
  };

  return (
    <div className="z-10 w-full max-w-3xl px-5 xl:px-0 pt-32">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-semibold text-4xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] pb-10"
        style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
      >
        Image Authentication
      </h1>
      <p
        className="mt-2 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl font-light"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        Drop an image to discover its history
      </p>
      <div
        className="flex items-center justify-center py-10 mt-2 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-l w-full"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        <Card className="w-full border-0 shadow-none">
          <CardContent className="space-y-6">
            <FileUploader
              onFilesAdded={handleFilesAdded}
              acceptedFileTypes=".png,.jpg,.heic"
              maxFileSize="500MB"
              title="Drop your image here"
              subtitle="or click to select a file"
              isLoading={isLoading}
              multiple={false}
            />

            {/* Optional: Show staged files (currently not used for verification) */}
            {stagedFiles.length > 0 && (
              <FileTable
                files={stagedFiles}
                onRemoveFile={handleRemoveFile}
                readyLabel="Ready for authentication"
                showSubmitButton={false}
                showImagePreviews={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationFileUploader;
