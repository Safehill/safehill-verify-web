'use client';

import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import Modal from '@/components/shared/modal';
import { useCreateCollection } from '@/lib/hooks/use-collections';
import { Loader2, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface CreateCollectionModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCollectionCreated: (collectionId: string) => void;
}

export default function CreateCollectionModal({
  showModal,
  setShowModal,
  onCollectionCreated: _onCollectionCreated,
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCollectionName, setCreatedCollectionName] = useState('');

  const createCollectionMutation = useCreateCollection();
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal) {
      setName('');
      setDescription('');
      setIsSubmitting(false);
      setShowSuccess(false);
      setCreatedCollectionName('');
    }
  }, [showModal]);

  // Close modal on escape key and focus name input when modal opens
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);

      // Manually focus the name input after a short delay to ensure modal is fully rendered
      const focusTimer = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        clearTimeout(focusTimer);
      };
    }
  }, [showModal]);

  const handleCancel = () => {
    if (!isSubmitting) {
      setShowModal(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newCollection = await createCollectionMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
      });

      // Show success screen
      setCreatedCollectionName(newCollection.name);
      setShowSuccess(true);
      setIsSubmitting(false);

      // Navigate to collection page after 2 seconds
      setTimeout(() => {
        router.push(`/authed/collections/${newCollection.id}`);
        setShowModal(false);
      }, 2000);
    } catch (error) {
      // console.error('Failed to create collection:', error);
      setIsSubmitting(false);
      // You might want to show an error toast here
    }
  };

  const isFormValid = name.trim().length > 0 && description.trim().length > 0;

  if (!showModal) {
    return null;
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={handleCancel}
      className="max-w-[500px]"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900">
              Create Collection
            </div>
          </div>
          <Button
            onClick={handleCreate}
            disabled={!isFormValid || isSubmitting}
            className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Collection &quot;{createdCollectionName}&quot; was created successfully
              </h3>
              <p className="text-sm text-gray-600">
                Redirecting to your collection...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="collection-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Collection Name *
                </label>
                <Input
                  ref={nameInputRef}
                  id="collection-name"
                  type="text"
                  placeholder="Enter collection name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="collection-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="collection-description"
                  placeholder="Describe your collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  You&apos;ll be able to configure visibility, pricing, and other
                  settings after creating the collection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {showSuccess
              ? 'Taking you to your new collection...'
              : isSubmitting
              ? 'Creating your collection...'
              : 'Fill in the details to continue'}
          </p>
        </div>
      </div>
    </Modal>
  );
}
