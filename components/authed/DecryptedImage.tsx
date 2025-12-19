'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth, type AuthedSession } from '@/lib/auth/auth-context';
import { AssetEncryption } from '@/lib/crypto/asset-encryption';
import { useServerEncryptionKeys } from '@/lib/hooks/useServerEncryptionKeys';
import type { AssetVersionOutputDTO } from '@/lib/api/models/dto/Asset';
import type { ServerEncryptionKeysDTO } from '@/lib/api/models/dto/ServerEncryptionKeys';
import { USE_MOCK_UPLOAD } from '@/lib/api/api';

/**
 * Decrypt an asset version and return a blob URL
 */
async function decryptVersion(
  version: AssetVersionOutputDTO,
  authedSession: AuthedSession,
  serverKeys: ServerEncryptionKeysDTO
): Promise<string> {
  const imageId =
    version.presignedURL.split('/').pop()?.substring(0, 8) || 'unknown';
  console.debug(`[${imageId}] Starting decryption for ${version.versionName}`);

  // In mock mode, presigned URLs point to unencrypted images from picsum.photos
  if (USE_MOCK_UPLOAD && version.presignedURL.includes('picsum.photos')) {
    console.debug(`[${imageId}] Mock mode - using unencrypted URL directly`);
    return version.presignedURL;
  }

  // Fetch encrypted data from presigned URL
  console.debug(`[${imageId}] Fetching from presigned URL`);
  const response = await fetch(version.presignedURL);
  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.statusText}`);
  }

  const encryptedData = await response.arrayBuffer();
  console.debug(`[${imageId}] Fetched ${encryptedData.byteLength} bytes`);

  // Decrypt the secret key first
  console.debug(`[${imageId}] Decrypting secret key`);
  const secretKey = await AssetEncryption.decryptSecret(
    version.encryptedSecret,
    version.ephemeralPublicKey,
    version.publicSignature,
    version.senderPublicSignature,
    version.serverPublicSignature,
    authedSession.privateKey,
    authedSession.user.publicKey,
    serverKeys.encryptionProtocolSalt
  );
  console.debug(`[${imageId}] Secret key decrypted successfully`);

  // Decrypt the asset data
  console.debug(`[${imageId}] Decrypting asset data`);
  const decryptedData = await AssetEncryption.decryptData(
    new Uint8Array(encryptedData),
    secretKey
  );
  console.debug(
    `[${imageId}] Asset data decrypted: ${decryptedData.byteLength} bytes`
  );

  // Create blob URL from decrypted data
  const blob = new Blob([decryptedData], { type: 'image/jpeg' });
  const objectURL = URL.createObjectURL(blob);
  console.debug(`[${imageId}] Decryption complete, blob URL created`);

  return objectURL;
}

interface DecryptedImageProps {
  version: AssetVersionOutputDTO;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** Optional low-resolution preview to show while high-res loads */
  lowResPreview?: AssetVersionOutputDTO;
}

export default function DecryptedImage({
  version,
  alt,
  width,
  height,
  className,
  lowResPreview,
}: DecryptedImageProps) {
  const { authedSession } = useAuth();
  const { data: serverKeys } = useServerEncryptionKeys();
  const [decryptedURL, setDecryptedURL] = useState<string | null>(null);
  const [lowResURL, setLowResURL] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to decrypt low-res preview if provided
  useEffect(() => {
    if (!lowResPreview || !authedSession || !serverKeys) {
      return;
    }

    let objectURL: string | null = null;
    let isCancelled = false;

    const decryptLowRes = async () => {
      try {
        objectURL = await decryptVersion(
          lowResPreview,
          authedSession,
          serverKeys
        );
        if (!isCancelled) {
          setLowResURL(objectURL);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to decrypt low-res preview:', err);
          // Don't set error state for preview failures
        }
      }
    };

    decryptLowRes();

    return () => {
      isCancelled = true;
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [
    lowResPreview?.presignedURL,
    lowResPreview?.encryptedSecret,
    authedSession,
    serverKeys,
  ]);

  // Effect to decrypt main (high-res) version
  useEffect(() => {
    if (!authedSession || !serverKeys) {
      return;
    }

    let objectURL: string | null = null;
    let isCancelled = false;

    const decryptMain = async () => {
      setIsDecrypting(true);
      setError(null);

      try {
        objectURL = await decryptVersion(version, authedSession, serverKeys);
        if (!isCancelled) {
          setDecryptedURL(objectURL);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to decrypt image:', err);
          setError(err instanceof Error ? err.message : 'Decryption failed');
        }
      } finally {
        if (!isCancelled) {
          setIsDecrypting(false);
        }
      }
    };

    decryptMain();

    return () => {
      isCancelled = true;
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [
    version.presignedURL,
    version.encryptedSecret,
    authedSession,
    serverKeys,
  ]);

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white/5">
        <div className="text-center p-4">
          <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center mx-auto mb-2">
            <span className="text-white/60 text-xs">!</span>
          </div>
          <p className="text-white/60 text-xs">Failed to decrypt</p>
        </div>
      </div>
    );
  }

  // Progressive loading: show low-res while high-res is loading
  if (isDecrypting && lowResURL) {
    return (
      <div className="relative w-full h-full">
        {/* Low-res preview with blur effect */}
        <Image
          src={lowResURL}
          alt={alt}
          width={width || 150}
          height={height || 150}
          className={`${className || 'w-full h-full object-cover'} blur-sm`}
          unoptimized
        />
        {/* Loading spinner overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="h-6 w-6 animate-spin text-white/60" />
        </div>
      </div>
    );
  }

  // Show loading spinner if no preview available
  if (isDecrypting) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white/5">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }

  // Show high-res image when ready
  if (decryptedURL) {
    return (
      <Image
        src={decryptedURL}
        alt={alt}
        width={width || 150}
        height={height || 150}
        className={className || 'w-full h-full object-cover'}
        unoptimized // Since we're using blob URLs
      />
    );
  }

  return null;
}
