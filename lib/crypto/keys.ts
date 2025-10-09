import { arrayBufferToBase64, base64ToArrayBuffer } from '@/lib/crypto/base64';
import { p256 } from '@noble/curves/nist.js';

export async function generateAndExportECKeyPair(
  algorithm: 'ECDH' | 'ECDSA'
): Promise<{
  publicKeyBase64: string;
  privateKeyBase64: string;
}> {
  const keyUsages: KeyUsage[] =
    algorithm === 'ECDSA' ? ['sign', 'verify'] : ['deriveKey', 'deriveBits'];

  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: algorithm,
      namedCurve: 'P-256',
    } as EcKeyGenParams,
    true, // extractable
    keyUsages
  );

  // Export private key (PKCS#8 format, DER-encoded)
  const privateKeyBuffer = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );
  const privateKeyBase64 = arrayBufferToBase64(privateKeyBuffer);

  // Export public key (SPKI format, DER-encoded)
  const publicKeyBuffer = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer);

  return {
    publicKeyBase64,
    privateKeyBase64,
  };
}

export async function initializePrivateKeyAgreement(
  rawPrivateKey: ArrayBuffer
): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'pkcs8',
    rawPrivateKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );
}

export async function importPrivateKeySigning(
  rawPrivateKey: ArrayBuffer
): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'pkcs8',
    rawPrivateKey,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign']
  );
}

export async function generateSymmetricKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // `true` allows the key to be exported later if needed
    ['encrypt', 'decrypt']
  );
}

export async function encryptWithKey(
  key: CryptoKey,
  plaintext: string
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return { ciphertext, iv };
}

export async function decryptWithKey(
  key: CryptoKey,
  ciphertext: ArrayBuffer,
  iv: Uint8Array
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export async function cryptoKeyToBase64(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key); // ArrayBuffer
  return arrayBufferToBase64(raw);
}

export async function base64ToCryptoKey(base64: string): Promise<CryptoKey> {
  const raw = base64ToArrayBuffer(base64);
  return await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Derives the public key from an ECDH/ECDSA private key
 * This is equivalent to SafehillPublicKey.derivePublicKeyFrom() in the Kotlin implementation
 *
 * The Kotlin implementation uses EC point math: Q = G * s
 * where s is the private scalar and G is the generator point
 *
 * @param privateKey - The ECDH/ECDSA private key (CryptoKey)
 * @returns The corresponding public key as base64-encoded string (raw format)
 */
export async function derivePublicKeyFromPrivate(
  privateKey: CryptoKey
): Promise<string> {
  // Export the private key in PKCS#8 format
  const pkcs8Buffer = await crypto.subtle.exportKey('pkcs8', privateKey);

  console.debug('derivePublicKeyFromPrivate', {
    pkcs8Length: pkcs8Buffer.byteLength,
    algorithm: privateKey.algorithm.name,
  });

  // Extract the private key scalar from PKCS#8 DER encoding
  // PKCS#8 structure for EC keys contains the private key in an OCTET STRING
  // We need to parse the DER structure to extract the 32-byte private scalar
  const privateScalar = extractPrivateScalarFromPKCS8(
    new Uint8Array(pkcs8Buffer)
  );

  console.debug('Private scalar extracted', {
    scalarLength: privateScalar.length,
    firstBytes: Array.from(privateScalar.slice(0, 4))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' '),
  });

  // Use @noble/curves to compute the public key from the private scalar
  // This matches the Kotlin implementation: Q = G * d
  // getPublicKey returns uncompressed format (0x04 || x || y) when isCompressed=false
  const publicKeyBytes = p256.getPublicKey(privateScalar, false);

  const publicKeyBase64 = arrayBufferToBase64(publicKeyBytes.buffer);
  console.debug('Public key derived', {
    publicKeyLength: publicKeyBytes.length,
    publicKeyPreview: publicKeyBase64.substring(0, 20) + '...',
  });

  return publicKeyBase64;
}

/**
 * Extract the private scalar (32 bytes) from a PKCS#8 DER-encoded EC private key
 *
 * PKCS#8 structure (simplified):
 * SEQUENCE {
 *   version
 *   privateKeyAlgorithm
 *   privateKey OCTET STRING {
 *     SEQUENCE {
 *       version
 *       privateKey OCTET STRING  <- This is what we want (32 bytes for P-256)
 *       ...
 *     }
 *   }
 * }
 */
function extractPrivateScalarFromPKCS8(pkcs8: Uint8Array): Uint8Array {
  // Simple DER parser to find the 32-byte private key
  // For P-256, the private key is always 32 bytes

  // Look for the pattern: 0x04 0x20 (OCTET STRING of length 32)
  // followed by 32 bytes of private key data
  for (let i = 0; i < pkcs8.length - 34; i++) {
    if (pkcs8[i] === 0x04 && pkcs8[i + 1] === 0x20) {
      // Found OCTET STRING tag (0x04) with length 32 (0x20)
      // The next 32 bytes are the private scalar
      const privateScalar = pkcs8.slice(i + 2, i + 34);

      // Verify it's not all zeros (sanity check)
      if (privateScalar.some((byte) => byte !== 0)) {
        return privateScalar;
      }
    }
  }

  throw new Error('Could not extract private scalar from PKCS#8 key');
}
