'use client';

import { Button } from '@/components/shared/button';
import * as Dialog from '@radix-ui/react-dialog';
import type { Dispatch, SetStateAction } from 'react';

interface WarningModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'warning' | 'info';
  requireConfirmation?: boolean;
  confirmationValue?: string;
  confirmationPlaceholder?: string;
  confirmationLabel?: string;
  onConfirmationChange?: (value: string) => void;
}

export default function WarningModal({
  showModal,
  setShowModal,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
  requireConfirmation = false,
  confirmationValue = '',
  confirmationPlaceholder = '',
  confirmationLabel = '',
  onConfirmationChange,
}: WarningModalProps) {
  const handleConfirm = () => {
    onConfirm();
    setShowModal(false);
  };

  const isConfirmDisabled =
    requireConfirmation && confirmationValue !== confirmationPlaceholder;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setShowModal(false);
  };

  const getIcon = () => {
    if (variant === 'warning') {
      return (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <svg
            className="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  };

  return (
    <Dialog.Root open={showModal} onOpenChange={setShowModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-gray-100 bg-opacity-50 backdrop-blur-md" />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="animate-scale-in fixed inset-0 z-50 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white p-0 shadow-xl rounded-2xl"
        >
          <Dialog.Title className="absolute left-[-10000px]">
            {title}
          </Dialog.Title>
          <div className="p-6">
            {getIcon()}

            <div className="mt-4 text-center">
              <h3 className="text-2xl font-medium text-gray-900">{title}</h3>
              <div className="mt-8">
                <div
                  className="text-sm text-gray-600 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>

              {requireConfirmation && (
                <div className="mt-4 text-left pt-5">
                  <label htmlFor="confirmation-input" className="block text-sm font-medium text-gray-700 mb-2">
                    {confirmationLabel}
                  </label>
                  <input
                    id="confirmation-input"
                    type="text"
                    value={confirmationValue}
                    onChange={(e) => {
                      onConfirmationChange?.(e.target.value);
                    }}
                    placeholder={confirmationPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {variant === 'warning' && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  {cancelText}
                </Button>
              )}
              <Button
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                className={`w-full sm:w-auto ${
                  variant === 'warning'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                    : 'bg-purple-800 hover:bg-purple-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                }`}
              >
                {variant === 'warning' ? confirmText : 'OK'}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
