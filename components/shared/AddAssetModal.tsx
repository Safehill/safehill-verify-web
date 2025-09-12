'use client';

import { Button } from '@/components/shared/button';
import Modal from '@/components/shared/modal';
import FileUploader from '@/components/shared/FileUploader';
import FileTable from '@/components/shared/FileTable';
import { useState, useEffect } from 'react';

interface AddAssetModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAssetsSubmit: (files: File[]) => void;
  collection: {
    id: string;
    name: string;
    description: string;
    visibility: string;
    pricing: number;
    assetCount: number;
    lastUpdated: string;
    createdBy: string;
  };
  isLoading?: boolean;
}

export default function AddAssetModal({
  showModal,
  setShowModal,
  onAssetsSubmit,
  collection,
  isLoading = false,
}: AddAssetModalProps) {
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [justOpened, setJustOpened] = useState(false);

  // Reset staged files when modal opens/closes
  useEffect(() => {
    if (!showModal) {
      setStagedFiles([]);
      setJustOpened(false);
    } else {
      // When modal opens, mark it as just opened
      setJustOpened(true);
      // After a short delay, allow normal close behavior
      const timer = setTimeout(() => {
        setJustOpened(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showModal]);

  const handleCancel = () => {
    if (!isLoading && !justOpened) {
      setShowModal(false);
    }
  };

  const handleFilesAdded = (newFiles: File[]) => {
    if (newFiles.length < 1) {
      return;
    }

    // Add files to staging area, avoiding duplicates by name
    const existingFileNames = stagedFiles.map(f => f.name);
    const uniqueNewFiles = newFiles.filter(f => !existingFileNames.includes(f.name));
    
    if (uniqueNewFiles.length > 0) {
      setStagedFiles(prev => [...prev, ...uniqueNewFiles]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setStagedFiles(prev => prev.filter(f => f.name !== fileToRemove.name));
  };

  const handleUpload = (files: File[]) => {
    onAssetsSubmit(files);
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={handleCancel}
      className="max-w-4xl h-[90vh] sm:h-[80vh] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800 px-2 sm:px-3"
          >
            Cancel
          </Button>
          <div className="text-center flex-1 mx-4">
            <div className="text-lg sm:text-2xl font-semibold text-gray-900">
              Upload Assets
            </div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">
              adding to <b>{collection.name}</b>
            </div>
          </div>
          <Button
            onClick={() => handleUpload(stagedFiles)}
            disabled={stagedFiles.length === 0 || isLoading}
            className="px-2 sm:px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-1 sm:mr-2"></div>
                <span className="hidden sm:inline">Uploading...</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Upload {stagedFiles.length}</span>
                <span className="hidden sm:inline">Upload {stagedFiles.length} Asset{stagedFiles.length === 1 ? '' : 's'}</span>
              </>
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6">
            {/* File Uploader */}
            <FileUploader
              onFilesAdded={handleFilesAdded}
              acceptedFileTypes=".png,.jpg,.jpeg,.heic,.webp"
              maxFileSize="500MB"
              title="Drop your files here"
              subtitle="or click to select files"
              isLoading={isLoading}
              multiple={true}
              id="add-asset-file-upload"
            />
          </div>

          {/* Staged Files - Scrollable */}
          {stagedFiles.length > 0 ? (
            <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                Ready for Upload ({stagedFiles.length} file{stagedFiles.length === 1 ? '' : 's'})
              </h3>
              <FileTable
                files={stagedFiles}
                onRemoveFile={handleRemoveFile}
                readyLabel="Ready for upload"
                showSubmitButton={false}
                showImagePreviews={true}
              />
            </div>
          ) : (
            <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-sm sm:text-base">Files you drag and drop or select above will be staged here</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {stagedFiles.length > 0
              ? `${stagedFiles.length} asset${stagedFiles.length === 1 ? '' : 's'} ready to upload`
              : 'Select the assets to upload and add to this collection'}
          </p>
        </div>
      </div>
    </Modal>
  );
}