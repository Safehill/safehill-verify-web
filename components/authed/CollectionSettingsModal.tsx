'use client';

import { Button } from '@/components/shared/button';
import CopyButton from '@/components/shared/CopyButton';
import Modal from '@/components/shared/modal';
import WarningModal from '@/components/shared/WarningModal';
import {
  useUpdateCollection,
  useDeleteCollection,
} from '@/lib/hooks/use-collections';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { generateCollectionLink } from '@/lib/api/collections';
import { useRouter } from 'next/navigation';

interface CollectionSettingsModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
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
}

export default function CollectionSettingsModal({
  showModal,
  setShowModal,
  collection,
}: CollectionSettingsModalProps) {
  // Local state for form values (not persisted until save)
  const [visibility, setVisibility] = useState(collection.visibility);
  const [pricing, setPricing] = useState(collection.pricing.toString());

  // Warning modal states
  const [showPublicWarning, setShowPublicWarning] = useState(false);
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] =
    useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState<
    string | null
  >(null);
  const [publicConfirmationText, setPublicConfirmationText] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // API mutations
  const updateCollectionMutation = useUpdateCollection();
  const deleteCollectionMutation = useDeleteCollection();
  const router = useRouter();

  // Reset form values when collection changes or modal opens
  useEffect(() => {
    if (showModal) {
      setVisibility(collection.visibility);
      setPricing(collection.pricing.toString());
    }
  }, [showModal, collection]);

  // Calculate platform fees (8.5% fee)
  const platformFeeRate = 0.085;
  const numericPricing = parseFloat(pricing) || 0;
  const platformFee = numericPricing * platformFeeRate;

  // Determine which visibility options are disabled based on original hierarchy
  const originalIsPublic = collection.visibility === 'public';
  const originalIsConfidential = collection.visibility === 'confidential';
  const originalIsNotShared = collection.visibility === 'not-shared';
  const historicalRevenue = 0;

  // Handle visibility change with warnings
  const handleVisibilityChange = (newVisibility: string) => {
    if (newVisibility === 'public' && visibility !== 'public') {
      setPendingVisibilityChange(newVisibility);
      setShowPublicWarning(true);
    } else if (
      newVisibility === 'confidential' &&
      visibility !== 'confidential'
    ) {
      setPendingVisibilityChange(newVisibility);
      setShowConfidentialInfo(true);
    } else {
      // Direct change for other cases
      if (newVisibility === 'not-shared' || visibility === 'public') {
        setPricing('0');
      }
      setVisibility(newVisibility);
    }
  };

  // Handle public warning confirmation
  const handlePublicWarningConfirm = () => {
    if (pendingVisibilityChange && publicConfirmationText === collection.name) {
      setVisibility(pendingVisibilityChange);
      setPricing('0'); // Reset pricing when going public
      setPendingVisibilityChange(null);
      setPublicConfirmationText('');
    }
  };

  // Handle public warning cancellation
  const handlePublicWarningCancel = () => {
    setPendingVisibilityChange(null);
    setPublicConfirmationText('');
  };

  // Handle confidential info confirmation
  const handleConfidentialInfoConfirm = () => {
    if (pendingVisibilityChange) {
      setVisibility(pendingVisibilityChange);
      setPendingVisibilityChange(null);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      await updateCollectionMutation.mutateAsync({
        id: collection.id,
        updates: {
          visibility: visibility as any,
          pricing: numericPricing,
        },
      });
      setShowModal(false);
    } catch (_error) {
      // console.error('Failed to update collection:', error);
      // You might want to show an error toast here
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      setShowUnsavedChangesWarning(true);
    } else {
      // Reset to original values
      setVisibility(collection.visibility);
      setPricing(collection.pricing.toString());
      setShowModal(false);
    }
  };

  // Handle modal close (clicking outside or pressing escape)
  const handleModalClose = () => {
    if (hasChanges) {
      setShowUnsavedChangesWarning(true);
    } else {
      setShowModal(false);
    }
  };

  // Handle unsaved changes warning - save
  const handleUnsavedChangesSave = async () => {
    try {
      await updateCollectionMutation.mutateAsync({
        id: collection.id,
        updates: {
          visibility: visibility as any,
          pricing: numericPricing,
        },
      });
      setShowModal(false);
      setShowUnsavedChangesWarning(false);
    } catch (_error) {
      // console.error('Failed to update collection:', error);
      // You might want to show an error toast here
    }
  };

  // Handle unsaved changes warning - discard
  const handleUnsavedChangesDiscard = () => {
    // Reset to original values
    setVisibility(collection.visibility);
    setPricing(collection.pricing.toString());
    setShowModal(false);
    setShowUnsavedChangesWarning(false);
  };

  // Handle delete collection
  const handleDeleteCollection = async () => {
    if (deleteConfirmationText === collection.name) {
      try {
        await deleteCollectionMutation.mutateAsync({
          collectionId: collection.id,
        });
        setShowModal(false);
        router.push('/authed');
      } catch (error) {
        // console.error('Failed to delete collection:', error);
        // You might want to show an error toast here
      }
    }
  };

  // Handle delete warning cancel
  const handleDeleteWarningCancel = () => {
    setShowDeleteWarning(false);
    setDeleteConfirmationText('');
  };

  // Check if there are unsaved changes
  const hasChanges =
    visibility !== collection.visibility ||
    numericPricing !== collection.pricing;

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={handleModalClose}
        className="w-full max-w-[600px] md:min-w-[600px] md:max-w-[800px] h-[80vh] flex flex-col"
        title="Collection Settings"
      >
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                Collection Settings
              </div>
              <div className="text-sm text-gray-600">{collection.name}</div>
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateCollectionMutation.isPending}
              className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateCollectionMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-12 p-8">
              {/* Link Setting */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Collection Link
                  </h3>
                  <p className="text-sm text-gray-600">
                    Share this URL to give others access to your collection
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 w-full">
                    <div
                      className={`flex-1 min-w-0 text-sm font-mono p-3 rounded-lg border ${
                        visibility === 'not-shared'
                          ? 'bg-gray-50 text-gray-400 border-gray-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <div className="truncate">
                        {generateCollectionLink(collection.id)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <CopyButton
                        text={generateCollectionLink(collection.id)}
                        disabled={visibility === 'not-shared'}
                        size="sm"
                        variant="outline"
                        className="h-10 px-4"
                      />
                    </div>
                  </div>

                  {/* Link Tooltip */}
                  {originalIsNotShared && visibility === 'not-shared' ? (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-800 mb-1">
                            Link is inactive
                          </p>
                          <p className="text-sm text-yellow-700">
                            Set visibility to{' '}
                            <span className="font-semibold">Confidential</span>{' '}
                            to activate the sharing link.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-xs font-bold">
                            ✓
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Link is active
                          </p>
                          <p className="text-sm text-green-700">
                            You can share this link
                            {visibility === 'confidential'
                              ? ' confidentially'
                              : ''}{' '}
                            with others.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Visibility Setting */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Visibility
                  </h3>
                  <p className="text-sm text-gray-600">
                    Control who can see and access this collection
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    {[
                      {
                        value: 'not-shared',
                        label: 'Not Shared',
                        disabled: originalIsPublic || originalIsConfidential,
                      },
                      {
                        value: 'confidential',
                        label: 'Confidential',
                        disabled: originalIsPublic,
                      },
                      { value: 'public', label: 'Public', disabled: false },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          if (option.disabled) {
                            return;
                          }
                          handleVisibilityChange(option.value);
                        }}
                        className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                          option.disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : visibility === option.value
                            ? option.value === 'public'
                              ? 'bg-green-600 text-white shadow-sm'
                              : option.value === 'confidential'
                              ? 'bg-yellow-600 text-white shadow-sm'
                              : 'bg-gray-700 text-white shadow-sm'
                            : option.value === 'public'
                            ? 'text-green-700 hover:text-green-900 hover:bg-green-100'
                            : option.value === 'confidential'
                            ? 'text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                        }`}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Visibility Tooltip */}
                  {originalIsPublic && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-800 mb-1">
                            Cannot change visibility
                          </p>
                          <p className="text-sm text-red-700">
                            Once a collection is{' '}
                            <span className="font-semibold">Public</span>, you
                            cannot restrict access or charge for it.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {!originalIsPublic && visibility === 'not-shared' && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-xs font-bold">
                            i
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Private collection
                          </p>
                          <p className="text-sm text-blue-700">
                            Only confidentially shared collections can be sold.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {!originalIsPublic && visibility === 'confidential' && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-xs font-bold">
                            $
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Ready to earn
                          </p>
                          <p className="text-sm text-green-700">
                            You&apos;ll start earning from this collection once you
                            set a price! 🎉
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Setting */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Sale Price
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set the price for accessing this collection
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div
                    className={`transition-opacity ${
                      visibility !== 'confidential'
                        ? 'opacity-50 pointer-events-none select-none'
                        : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${numericPricing}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={numericPricing}
                        onChange={(e) => setPricing(e.target.value)}
                        disabled={visibility !== 'confidential'}
                        className={`flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
                          visibility !== 'confidential'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Pricing Tooltip or Historical Revenue */}
                  {visibility === 'not-shared' ? (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-gray-600 text-xs font-bold">
                            i
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            Pricing unavailable
                          </p>
                          <p className="text-sm text-gray-700">
                            Only confidentially shared collections can be sold.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-bold">
                            💰
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-800">
                            Total earnings so far:{' '}
                            <span className="font-bold text-purple-900">
                              ${historicalRevenue.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-sm text-purple-700">
                            {originalIsConfidential &&
                            visibility === 'confidential'
                              ? 'Keep it up!'
                              : visibility === 'confidential'
                              ? 'Save the changes to start earning!'
                              : 'From when this was confidential'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${
                  visibility !== 'confidential'
                    ? 'opacity-50 pointer-events-none'
                    : ''
                }`}
              >
                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Buyer Pays
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${numericPricing.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">−</span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Safehill&apos;s Fee
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${platformFee.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">=</span>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-sm font-medium text-purple-600 mb-2">
                      You Get
                    </p>
                    <p className="text-3xl font-bold text-purple-800">
                      ${(numericPricing - platformFee).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 border-t border-red-200 bg-red-50">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-sm font-bold">⚠</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete a collection, there is no going back. This
                      will permanently remove the collection.
                      <br />
                      Access to the assets will not be revoked when deleting the
                      collection.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteWarning(true)}
                      className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400"
                    >
                      Delete Collection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="bg-gray-50 p-4 border-t border-gray-200 text-center flex-shrink-0">
            <p
              className={`text-sm text-gray-600 font-semibold ${
                hasChanges ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              {hasChanges ? 'You have unsaved changes' : 'No changes to save'}
            </p>
          </div>
        </div>
      </Modal>

      {/* Public Warning Modal */}
      <WarningModal
        showModal={showPublicWarning}
        setShowModal={setShowPublicWarning}
        title="Make Collection Public?"
        message={`Are you sure you want to make this collection public?

<b>Once public, anyone can view and share your content freely.</b> If the collection was confidential, you will stop earning revenue from it.

<b>This action cannot be undone.</b>

To confirm, please type the full collection name:`}
        confirmText="Make Public"
        cancelText="Cancel"
        onConfirm={handlePublicWarningConfirm}
        onCancel={handlePublicWarningCancel}
        variant="warning"
        requireConfirmation={true}
        confirmationValue={publicConfirmationText}
        confirmationPlaceholder={collection.name}
        confirmationLabel="Type the collection name below ↓"
        onConfirmationChange={setPublicConfirmationText}
      />

      {/* Confidential Info Modal */}
      <WarningModal
        showModal={showConfidentialInfo}
        setShowModal={setShowConfidentialInfo}
        title="Confidential Sharing"
        message={`Sharing confidentially means your collection will still be protected. You give exclusive access to your collection to specific people via a link.

You can charge for access to your collection by setting a price. Anyone with access won't be able to save or re-share your content.`}
        onConfirm={handleConfidentialInfoConfirm}
        variant="info"
      />

      {/* Unsaved Changes Warning Modal */}
      <WarningModal
        showModal={showUnsavedChangesWarning}
        setShowModal={setShowUnsavedChangesWarning}
        title="Unsaved Changes"
        message={`You have unsaved changes to your collection settings.

Would you like to save the changes or discard them?`}
        confirmText="Save Changes"
        cancelText="Discard Changes"
        onConfirm={handleUnsavedChangesSave}
        onCancel={handleUnsavedChangesDiscard}
        variant="warning"
      />

      {/* Delete Collection Warning Modal */}
      <WarningModal
        showModal={showDeleteWarning}
        setShowModal={setShowDeleteWarning}
        title="Delete Collection"
        message={`Are you absolutely sure you want to delete this collection?

<b>This action cannot be undone.</b> This will permanently delete the collection for you and all users who have access to it.

It will not delete the assets in it.

To confirm, please type the full collection name:`}
        confirmText="Delete Collection"
        cancelText="Cancel"
        onConfirm={handleDeleteCollection}
        onCancel={handleDeleteWarningCancel}
        variant="warning"
        requireConfirmation={true}
        confirmationValue={deleteConfirmationText}
        confirmationPlaceholder={collection.name}
        confirmationLabel="Type the collection name below"
        onConfirmationChange={setDeleteConfirmationText}
      />
    </>
  );
}
