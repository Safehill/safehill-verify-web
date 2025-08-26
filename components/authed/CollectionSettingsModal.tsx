'use client';

import { Button } from '@/components/shared/button';
import CopyButton from '@/components/shared/CopyButton';
import Modal from '@/components/shared/modal';
import WarningModal from '@/components/shared/WarningModal';
import { generateCollectionLink } from '@/lib/api/collections';
import { useUpdateCollection } from '@/lib/hooks/use-collections';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

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
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] = useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState<string | null>(null);
  const [publicConfirmationText, setPublicConfirmationText] = useState('');

  // API mutation
  const updateCollectionMutation = useUpdateCollection();

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
    } else if (newVisibility === 'confidential' && visibility !== 'confidential') {
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
    } catch (error) {
      console.error('Failed to update collection:', error);
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
    } catch (error) {
      console.error('Failed to update collection:', error);
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





  // Check if there are unsaved changes
  const hasChanges =
    visibility !== collection.visibility ||
    numericPricing !== collection.pricing;

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={handleModalClose}
        className="w-full max-w-[600px] md:min-w-[600px] md:max-w-[800px]"
        title="Collection Settings"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">Collection Settings</div>
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

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Link Setting */}
            <div className="flex items-center justify-between h-20">
              <div className="flex-1">
                <div className="font-semibold text-xl text-gray-900">Link</div>
                <div className="text-sm text-gray-600">
                  Access this collection by visiting this URL
                </div>
              </div>
              <div className="ml-6 flex items-center space-x-3">
                <div className={`text-sm font-mono ${
                  visibility === 'not-shared' ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {generateCollectionLink(collection.id)}
                </div>
                <CopyButton
                  text={generateCollectionLink(collection.id)}
                  disabled={visibility === 'not-shared'}
                  size="sm"
                  variant="outline"
                  className="h-8 px-3"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-1 flex justify-end px-2 italic">
              { originalIsNotShared && visibility === 'not-shared' ? (
                  <p className="text-sm text-gray-800">
                    Set Visibility to <span className="font-bold">Confidential</span> to activate the link
                  </p>
              ) : (
                  <p className="text-sm text-gray-800">
                      Use this link to share your collection {visibility === 'confidential' ? 'confidentially' : ''}!
                  </p>
              )}
            </div>

            {/* Visibility Setting */}
            <div className="flex items-center justify-between h-20">
              <div className="flex-1">
                <div className="font-semibold text-xl text-gray-900">Visibility</div>
                <div className="text-sm text-gray-600">
                  Control who can see and access this collection
                </div>
              </div>
              <div className="ml-6">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  {[
                    { value: 'not-shared', label: 'Not Shared', disabled: originalIsPublic || originalIsConfidential },
                    { value: 'confidential', label: 'Confidential', disabled: originalIsPublic },
                    { value: 'public', label: 'Public', disabled: false }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (option.disabled) {
                          return;
                        }
                        handleVisibilityChange(option.value);
                      }}
                      className={`flex items-center px-4 py-2 text-base font-medium rounded-md transition-all duration-200 ${
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
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-1 flex justify-end px-2 italic">
              { originalIsPublic && (
                  <p className="text-sm text-red-500">
                      You can&apos;t restrict access to this collection or charge for access once it&apos;s <span className="font-bold">Public</span>
                  </p>
              )}
              { !originalIsPublic && visibility === 'not-shared' && (
                  <p className="text-sm text-gray-800">
                      Only confidentially shared collections can be sold
                  </p>
              )}
              { !originalIsPublic && visibility === 'confidential' && (
                  <p className="text-sm text-gray-600">
                      You&apos;ll start earning from this collection once you set a price! 👍
                  </p>
              )}
            </div>

            {/* Pricing Setting */}
            <div
              className={`flex items-center justify-between h-20 transition-opacity ${
                  visibility !== 'confidential' ? 'opacity-50 pointer-events-none select-none' : ''
              }`}
            >
              <div className="flex-1">
                <div className="font-semibold text-xl text-gray-900">Sale Price</div>
                <div className="text-sm text-gray-600">
                  Set the price for accessing this collection
                </div>
              </div>
              <div className="ml-6 flex items-center space-x-3">
                <div className="relative">
                  <span className="mr-3 text-lg font-medium text-gray-700">${numericPricing}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={numericPricing}
                    onChange={(e) => setPricing(e.target.value)}
                    disabled={visibility !== 'confidential'}
                    className={`w-32 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
                      visibility !== 'confidential' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Profits Cards */}
            <div
              className={`grid grid-cols-3 gap-4 mt-4 transition-opacity ${
                  visibility !== 'confidential' ? 'opacity-50 pointer-events-none select-none' : ''
              }`}>
              <div className="rounded-2xl border-2 border-solid border-gray-200/30 bg-white/10 px-4 py-3 flex items-center justify-center shadow-none transition-all duration-200">
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">Buyer Pays</p>
                  <p className="text-2xl font-bold text-black mt-1">${numericPricing.toFixed(2)}</p>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-solid border-gray-200/30 bg-white/10 px-4 py-3 flex items-center justify-center shadow-none transition-all duration-200">
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">Safehill&apos;s Fee</p>
                  <p className="text-2xl font-bold text-black mt-1">${platformFee.toFixed(2)}</p>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-solid border-purple-800 bg-purple-800/10 px-4 py-3 flex items-center justify-center shadow-none transition-all duration-200">
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">You Get</p>
                  <p className="text-2xl font-bold text-purple-800 mt-1">${(numericPricing - platformFee).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Historical profits string */}
            { historicalRevenue > 0 ? (
              <div className="text-sm text-gray-600 mt-1 flex items-center justify-end px-2 italic">
                { originalIsConfidential && (
                  <p className="text-sm text-gray-600">
                    So far you&apos;ve made<span className="font-bold text-purple-800 px-1">${historicalRevenue.toFixed(2)}</span>🙌
                  </p>
                )}
                { originalIsPublic && (
                  <p className="text-sm text-gray-600">
                    When you were sharing this collection confidentially, you made<span className="font-bold text-purple-800 px-1">${historicalRevenue.toFixed(2)}</span>
                  </p>
                )}
                { originalIsNotShared && (
                  <p className="text-sm text-gray-600">
                    Share this collection confidentially to start earning!
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600 flex items-center justify-end px-2 italic">
                { originalIsConfidential && (
                  <p className="text-sm text-gray-600">
                    You haven&apos;t earned anything from this collection yet
                  </p>
                )}
                { originalIsPublic && (
                  <p className="text-sm text-gray-600">
                    You haven&apos;t earned anything from this collection before you made it <span className="font-bold text-green-500">Public</span>
                  </p>
                )}
                { originalIsNotShared && visibility === 'confidential' && numericPricing === 0 && (
                  <p className="text-sm text-gray-600">
                    Set a price and start earning!
                  </p>
                )}
                { originalIsNotShared && visibility === 'confidential' && numericPricing > 0 && (
                  <p className="text-sm text-gray-600">
                    Share the link to this collection confidentially to start earning!
                  </p>
                )}
                { originalIsNotShared && visibility !== 'confidential' && (
                  <p className="text-sm text-gray-600">
                    Only confidentially shared collections can be sold
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 font-semibold">
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

<b>Once public, anyone can view and share your content freely, and you will stop earning revenue from it.</b>

This action cannot be undone.

To confirm, please type the full collection name:`}
        confirmText="Make Public"
        cancelText="Cancel"
        onConfirm={handlePublicWarningConfirm}
        onCancel={handlePublicWarningCancel}
        variant="warning"
        requireConfirmation={true}
        confirmationValue={publicConfirmationText}
        confirmationPlaceholder={collection.name}
        confirmationLabel="Collection Name"
        onConfirmationChange={setPublicConfirmationText}
      />

      {/* Confidential Info Modal */}
      <WarningModal
        showModal={showConfidentialInfo}
        setShowModal={setShowConfidentialInfo}
        title="Confidential Sharing"
        message={`Your collection will still be protected when shared confidentially.

Users won't be able to save or re-share your content, and you can earn royalties every time your content is sold.`}
        onConfirm={handleConfidentialInfoConfirm}
        variant="info"
      />

      {/* Unsaved Changes Warning Modal */}
      <WarningModal
        showModal={showUnsavedChangesWarning}
        setShowModal={setShowUnsavedChangesWarning}
        title="Unsaved Changes"
        message={`You have unsaved changes to your collection settings.

Would you like to save your changes or discard them?`}
        confirmText="Save Changes"
        cancelText="Discard Changes"
        onConfirm={handleUnsavedChangesSave}
        onCancel={handleUnsavedChangesDiscard}
        variant="warning"
      />
    </>
  );
}
