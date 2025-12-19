'use client';

import { Button } from '@/components/shared/button';
import CopyButton from '@/components/shared/CopyButton';
import Modal from '@/components/shared/modal';
import WarningModal from '@/components/shared/WarningModal';
import {
  useUpdateCollection,
  useDeleteCollection,
  useChangeCollectionVisibility,
} from '@/lib/hooks/use-collections';
import { usePayoutAccountStatus } from '@/lib/hooks/use-payouts';
import { isPayoutRequirementsDisabled } from '@/lib/utils/feature-flags';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { generateCollectionLink } from '@/lib/api/collections';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { VisibilityChangeService } from '@/lib/services/visibility-change-service';
import { useServerEncryptionKeys } from '@/lib/hooks/useServerEncryptionKeys';
import { useAuth } from '@/lib/auth/auth-context';

import type {
  CollectionOutputDTO,
  Visibility,
} from '@/lib/api/models/dto/Collection';

interface CollectionSettingsModalProps {
  showModal: boolean;
  setShowModalAction: Dispatch<SetStateAction<boolean>>;
  collection: CollectionOutputDTO;
}

export default function CollectionSettingsModal({
  showModal,
  setShowModalAction,
  collection,
}: CollectionSettingsModalProps) {
  // Local state for form values (not persisted until save)
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [visibility, setVisibility] = useState(collection.visibility);
  const [pricing, setPricing] = useState(collection.pricing.toString());

  // Warning modal states
  const [showPublicWarning, setShowPublicWarning] = useState(false);
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] =
    useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] =
    useState<Visibility | null>(null);
  const [publicConfirmationText, setPublicConfirmationText] = useState('');
  const [showArchiveWarning, setShowArchiveWarning] = useState(false);
  const [archiveConfirmationText, setArchiveConfirmationText] = useState('');

  // API mutations
  const updateCollectionMutation = useUpdateCollection();
  const deleteCollectionMutation = useDeleteCollection();
  const changeVisibilityMutation = useChangeCollectionVisibility();
  const router = useRouter();

  // Auth and encryption keys
  const { authedSession } = useAuth();
  const { data: serverKeys, isLoading: isLoadingServerKeys } =
    useServerEncryptionKeys();

  // Check payout status for validation
  const { data: payoutStatus } = usePayoutAccountStatus();

  // Track previous modal state to reset form when it opens
  const [prevShowModal, setPrevShowModal] = useState(showModal);

  // Adjust state while rendering when modal opens (recommended React pattern)
  if (prevShowModal !== showModal) {
    setPrevShowModal(showModal);
    if (showModal && !prevShowModal) {
      // Modal is opening - reset form to current collection values
      setName(collection.name);
      setDescription(collection.description);
      setVisibility(collection.visibility);
      setPricing(collection.pricing.toString());
    }
  }

  // Safehill's platform fee rate (applied to gross amount before payment processor fees)
  const platformFeeRate = 0.18;

  // Pricing tiers for web (via Stripe)
  // Apple IAP prices are set higher to ensure sellers receive the same payout regardless
  // of which platform the buyer uses. Buyers pay 25-39% more on iOS.
  //
  // Web Tiers (Stripe):     $0.99, $1.99, $4.99, $9.99, $19.99, $29.99, $49.99, $99.99
  // Apple IAP Tiers (iOS):  $0.99, $2.49, $6.49, $13.49, $26.99, $40.99, $68.99, $138.99
  //
  // Fee Structure:
  // - Web (Stripe): Buyer pays -> Stripe takes 2.9% + $0.30 -> Safehill takes 18% of gross -> Seller gets rest
  // - Apple (iOS):  Buyer pays MORE -> Apple takes 30% of gross -> Safehill takes remainder -> Seller gets SAME as web
  //   Safehill's Apple fee = Apple tier price - Apple's 30% cut - Seller's payout (calculated from Stripe tier)
  //
  // Example for tier 6 ($29.99 web / $40.99 Apple):
  // Web:   $29.99 -> Stripe: $1.17 (2.9% + $0.30) -> Safehill: $5.40 (18%) -> Seller: $23.42
  // Apple: $40.99 -> Apple: $12.30 (30%) -> Safehill: $5.27 (12.9%) -> Seller: $23.42 ✓
  // Buyer surcharge on iOS: 36.68% | Safehill fee vs Stripe: -2.4%
  //
  // Note: Sellers receive identical payouts across platforms. The iOS price premium mostly
  // covers the buyer's choice to use Apple IAP, with Safehill absorbing a slight reduction.
  const pricingTiers = [0, 0.99, 1.99, 4.99, 9.99, 19.99, 29.99, 49.99, 99.99];

  // Find the closest tier to current pricing
  const numericPricing = parseFloat(pricing) || 0;
  const currentTierIndex =
    pricingTiers.findIndex((tier) => Math.abs(tier - numericPricing) < 0.01) ??
    0;

  // Calculate total platform fee (Stripe fees + Safehill's fee combined)
  // User doesn't need to know the breakdown - just what they get vs what platform takes
  const stripeFee = numericPricing > 0 ? numericPricing * 0.029 + 0.3 : 0;
  const safehillFee = numericPricing * platformFeeRate;
  const platformFee = stripeFee + safehillFee;

  // Determine which visibility options are disabled based on original hierarchy
  const originalIsPublic = collection.visibility === 'public';
  const originalIsConfidential = collection.visibility === 'confidential';
  const originalIsNotShared = collection.visibility === 'not-shared';
  const historicalRevenue = 0;

  // Check if payouts are fully active
  // Skip validation if payout requirements are disabled via feature flag
  const isPayoutActive =
    isPayoutRequirementsDisabled() ||
    (payoutStatus?.hasAccount &&
      payoutStatus?.status === 'active' &&
      payoutStatus?.chargesEnabled &&
      payoutStatus?.payoutsEnabled);

  // Pricing is only enabled if visibility is confidential AND payouts are active
  const isPricingEnabled = visibility === 'confidential' && isPayoutActive;

  // Handle visibility change with warnings
  const handleVisibilityChange = (newVisibility: Visibility) => {
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
    if (!authedSession || !serverKeys) {
      toast.error('Missing authentication or server keys');
      return;
    }

    try {
      const nameChanged = name !== collection.name;
      const descriptionChanged = description !== collection.description;
      const visibilityChanged = visibility !== collection.visibility;
      const pricingChanged = numericPricing !== collection.pricing;

      // Validate payout setup if pricing is being changed
      if (pricingChanged && numericPricing > 0 && !isPayoutActive) {
        toast.error(
          'Please set up payouts before setting a price on your collection.'
        );
        return;
      }

      // Step 1: Change visibility if needed (must happen first)
      if (visibilityChanged) {
        const visibilityChangeRequest =
          await VisibilityChangeService.prepareVisibilityChange(
            collection,
            visibility,
            authedSession.privateKey,
            authedSession.privateSignature,
            serverKeys.publicKey,
            serverKeys.encryptionProtocolSalt,
            authedSession
          );

        await changeVisibilityMutation.mutateAsync({
          id: collection.id,
          request: visibilityChangeRequest,
        });
      }

      // Step 2: Update name, description, and/or pricing if needed (after visibility change)
      if (nameChanged || descriptionChanged || pricingChanged) {
        console.debug('Updating collection details', {
          nameChanged,
          descriptionChanged,
          pricingChanged,
        });

        const updates: {
          name?: string;
          description?: string;
          pricing?: number;
        } = {};

        if (nameChanged) {
          updates.name = name;
        }
        if (descriptionChanged) {
          updates.description = description;
        }
        if (pricingChanged) {
          updates.pricing = numericPricing;
        }

        await updateCollectionMutation.mutateAsync({
          id: collection.id,
          updates,
        });

        console.debug('Collection details updated successfully');
      }

      setShowModalAction(false);
      toast.success('Collection settings updated successfully');
    } catch (error) {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection settings. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      setShowUnsavedChangesWarning(true);
    } else {
      // Reset to original values
      setName(collection.name);
      setDescription(collection.description);
      setVisibility(collection.visibility);
      setPricing(collection.pricing.toString());
      setShowModalAction(false);
    }
  };

  // Handle modal close (clicking outside or pressing escape)
  const handleModalClose = () => {
    if (hasChanges) {
      setShowUnsavedChangesWarning(true);
    } else {
      setShowModalAction(false);
    }
  };

  // Handle unsaved changes warning - save
  const handleUnsavedChangesSave = async () => {
    // Just call the main handleSave function
    setShowUnsavedChangesWarning(false);
    await handleSave();
  };

  // Handle unsaved changes warning - discard
  const handleUnsavedChangesDiscard = () => {
    // Reset to original values
    setName(collection.name);
    setDescription(collection.description);
    setVisibility(collection.visibility);
    setPricing(collection.pricing.toString());
    setShowModalAction(false);
    setShowUnsavedChangesWarning(false);
  };

  // Handle archive collection (settings modal only shown for owned collections)
  const handleArchiveCollection = async () => {
    if (archiveConfirmationText === collection.name) {
      try {
        await deleteCollectionMutation.mutateAsync({
          collectionId: collection.id,
          isOwned: true,
        });
        setShowModalAction(false);
        router.push('/authed');
        toast.success('Collection archived successfully');
      } catch (error) {
        console.error('Failed to archive collection:', error);
        toast.error('Failed to archive collection. Please try again.');
      }
    }
  };

  // Handle archive warning cancel
  const handleArchiveWarningCancel = () => {
    setShowArchiveWarning(false);
    setArchiveConfirmationText('');
  };

  // Check if there are unsaved changes
  const hasChanges =
    name !== collection.name ||
    description !== collection.description ||
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
              <div className="text-sm text-gray-600">
                for <b>{collection.name}</b>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={
                !hasChanges ||
                updateCollectionMutation.isPending ||
                changeVisibilityMutation.isPending ||
                isLoadingServerKeys
              }
              className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateCollectionMutation.isPending ||
              changeVisibilityMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-12 p-8">
              {/* Name Setting */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Collection Name
                  </h3>
                  <p className="text-sm text-gray-600">
                    The display name for your collection
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Enter collection name"
                  />
                </div>
              </div>

              {/* Description Setting */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600">
                    A brief description of your collection
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                    placeholder="Enter collection description"
                  />
                </div>
              </div>

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
                    {(
                      [
                        {
                          value: 'not-shared' as const,
                          label: 'Not Shared',
                          disabled: originalIsPublic || originalIsConfidential,
                        },
                        {
                          value: 'confidential' as const,
                          label: 'Confidential',
                          disabled: originalIsPublic,
                        },
                        {
                          value: 'public' as const,
                          label: 'Public',
                          disabled: false,
                        },
                      ] as const
                    ).map((option) => (
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
                            You&apos;ll start earning from this collection once
                            you set a price! 🎉
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
                      !isPricingEnabled
                        ? 'opacity-50 pointer-events-none select-none'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="text-2xl font-bold text-gray-900">
                        ${numericPricing.toFixed(2)}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={pricingTiers.length - 1}
                        step="1"
                        value={currentTierIndex}
                        onChange={(e) => {
                          const tierIndex = parseInt(e.target.value);
                          setPricing(pricingTiers[tierIndex].toFixed(2));
                        }}
                        disabled={!isPricingEnabled}
                        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
                          !isPricingEnabled
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      />
                      {/* Tier labels aligned with slider thumb positions */}
                      <div className="relative w-full h-5">
                        {pricingTiers.map((tier, index) => {
                          // Calculate position percentage for each tier
                          const percentage =
                            (index / (pricingTiers.length - 1)) * 100;
                          return (
                            <span
                              key={index}
                              className={`absolute text-xs transform -translate-x-1/2 ${
                                currentTierIndex === index
                                  ? 'font-bold text-purple-600'
                                  : 'text-gray-500'
                              }`}
                              style={{ left: `${percentage}%` }}
                            >
                              ${tier === 0 ? '0' : tier.toFixed(2)}
                            </span>
                          );
                        })}
                      </div>
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
                  ) : !isPayoutActive ? (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800 mb-1">
                            Payout setup required
                          </p>
                          <p className="text-sm text-yellow-700 mb-2">
                            You need to complete payout setup before you can set
                            prices on your collections.
                          </p>
                          <Link
                            href="/authed/payouts"
                            className="text-sm font-medium text-yellow-900 underline hover:text-yellow-800"
                          >
                            Set up payouts now →
                          </Link>
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
                {/* Desktop layout - horizontal */}
                <div className="hidden md:grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-6">
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

                {/* Mobile layout - vertical */}
                <div className="md:hidden flex flex-col gap-4">
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
                      Once you archive a collection, it will be hidden from your
                      dashboard and all users who have access.
                      <br />
                      Access to the assets will not be revoked when archiving
                      the collection.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowArchiveWarning(true)}
                      className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400"
                    >
                      Archive Collection
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

      {/* Archive Collection Warning Modal */}
      <WarningModal
        showModal={showArchiveWarning}
        setShowModal={setShowArchiveWarning}
        title="Archive Collection"
        message={`Are you absolutely sure you want to archive this collection?

<b>This action will hide the collection from your dashboard and all users who have access to it.</b>

Access to the assets will not be revoked when archiving the collection.

To confirm, please type the full collection name:`}
        confirmText="Archive Collection"
        cancelText="Cancel"
        onConfirm={handleArchiveCollection}
        onCancel={handleArchiveWarningCancel}
        variant="warning"
        requireConfirmation={true}
        confirmationValue={archiveConfirmationText}
        confirmationPlaceholder={collection.name}
        confirmationLabel="Type the collection name below"
        onConfirmationChange={setArchiveConfirmationText}
      />
    </>
  );
}
