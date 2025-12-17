'use client';

import Modal from '@/components/shared/modal';
import { Button } from '@/components/shared/button';
import { AssetClaimedError } from '@/lib/errors/upload-errors';
import { AlertCircle } from 'lucide-react';
import { useUsers } from '@/lib/hooks/use-users';
import { useMemo } from 'react';

interface AssetClaimedInfoModalProps {
  error: AssetClaimedError | null;
  onClose: () => void;
}

export default function AssetClaimedInfoModal({
  error,
  onClose,
}: AssetClaimedInfoModalProps) {
  // Extract unique user identifiers from conflicting assets
  const userIds = useMemo(() => {
    if (!error?.conflictingAssets) {
      return [];
    }
    return Array.from(
      new Set(error.conflictingAssets.map((asset) => asset.createdBy))
    );
  }, [error]);

  // Fetch user information for all asset owners
  const { data: users, isLoading: usersLoading } = useUsers(userIds);

  // Helper to resolve user by identifier
  const resolveUser = (identifier: string) =>
    users?.find((u) => u.identifier === identifier);

  if (!error) {
    return null;
  }

  return (
    <Modal
      showModal={!!error}
      setShowModal={(open) => !open && onClose()}
      title="Asset Already Claimed"
      description="This asset has already been claimed by another user"
    >
      <div className="p-6">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <AlertCircle className="h-6 w-6 text-orange-600" />
        </div>

        {/* Title */}
        <div className="mt-4 text-center">
          <h3 className="text-2xl font-medium text-gray-900">
            Asset Already Claimed
          </h3>
        </div>

        {/* Message */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            This asset has already been claimed by another user. Assets can only
            be owned by one person at a time to ensure authenticity and prevent
            duplicate claims.
          </p>
        </div>

        {/* Display conflicting assets */}
        {error.conflictingAssets && error.conflictingAssets.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs font-medium text-gray-700 mb-3">
              Similar assets found ({error.conflictingAssets.length}):
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {error.conflictingAssets.map((asset) => {
                const owner = resolveUser(asset.createdBy);
                return (
                  <div
                    key={asset.globalIdentifier}
                    className="text-xs bg-gray-50 rounded p-2"
                  >
                    <div className="font-mono text-gray-500 truncate">
                      {asset.globalIdentifier}
                    </div>
                    <div className="text-gray-600 mt-1">
                      Claimed by:{' '}
                      {usersLoading ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : owner ? (
                        <span className="font-medium">{owner.name}</span>
                      ) : (
                        <span className="text-gray-400">Unknown User</span>
                      )}
                    </div>
                    <div className="text-gray-500">
                      Similarity: {((1 - asset.distance) * 100).toFixed(1)}%
                    </div>
                    {asset.creationDate && (
                      <div className="text-gray-400 text-[10px] mt-1">
                        Created:{' '}
                        {new Date(asset.creationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Support Message */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> If you believe this is an error or you
            own the rights to this asset, please contact our support team for
            assistance at{' '}
            <a href="mailto:support@safehill.io">support@safehill.io</a>.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={(e) => {
              window.location.href = 'mailto:support@safehill.io';
              e.preventDefault();
            }}
            className="w-full bg-orange-600 hover:bg-orange-500"
          >
            Contact Support
          </Button>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
