'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/auth-context';
import { AssetEncryption } from '@/lib/crypto/asset-encryption';
import { useServerEncryptionKeys } from '@/lib/hooks/useServerEncryptionKeys';
import type { AssetVersionOutputDTO } from '@/lib/api/models/dto/Asset';
import { USE_MOCK_UPLOAD } from '@/lib/api/api';

interface DecryptedImageProps {
  version: AssetVersionOutputDTO;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function DecryptedImage({
  version,
  alt,
  width,
  height,
  className,
}: DecryptedImageProps) {
  const { authedSession } = useAuth();
  const { data: serverKeys } = useServerEncryptionKeys();
  const [decryptedURL, setDecryptedURL] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectURL: string | null = null;
    let isCancelled = false;

    const decryptAndDisplay = async () => {
      if (!authedSession || !serverKeys) {
        return;
      }

      setIsDecrypting(true);
      setError(null);

      const imageId =
        version.presignedURL.split('/').pop()?.substring(0, 8) || 'unknown';
      console.debug(`[${imageId}] Starting decryption`);

      // In mock mode, presigned URLs point to unencrypted images from picsum.photos
      // Skip decryption and use the URL directly
      if (USE_MOCK_UPLOAD && version.presignedURL.includes('picsum.photos')) {
        console.debug(
          `[${imageId}] Mock mode detected - using unencrypted URL directly`
        );
        setDecryptedURL(version.presignedURL);
        setIsDecrypting(false);
        return;
      }

      try {
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
          authedSession.privateKey,
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

        if (isCancelled) {
          console.debug(`[${imageId}] Cancelled before creating blob`);
          return;
        }

        // Create blob URL from decrypted data
        const blob = new Blob([decryptedData], { type: 'image/jpeg' });
        objectURL = URL.createObjectURL(blob);
        setDecryptedURL(objectURL);
        console.debug(`[${imageId}] Decryption complete, blob URL created`);
      } catch (err) {
        if (!isCancelled) {
          console.error(`[${imageId}] Failed to decrypt image:`, err);
          console.error(`[${imageId}] Error name:`, (err as Error)?.name);
          console.error(`[${imageId}] Error message:`, (err as Error)?.message);
          setError(err instanceof Error ? err.message : 'Decryption failed');
        }
      } finally {
        if (!isCancelled) {
          setIsDecrypting(false);
        }
      }
    };

    decryptAndDisplay();

    // Cleanup: revoke object URL when component unmounts
    return () => {
      isCancelled = true;
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [
    version.presignedURL,
    version.encryptedSecret,
    version.ephemeralPublicKey,
    version.publicSignature,
    version.senderPublicSignature,
    authedSession?.privateKey,
    serverKeys?.encryptionProtocolSalt,
  ]);

  if (isDecrypting) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white/5">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }

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

  if (!decryptedURL) {
    return null;
  }

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
