import { arrayBufferToBase64, base64ToArrayBuffer } from '@/lib/crypto/base64';

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
  // Export the private key in JWK format to get access to the key parameters
  const jwk = await crypto.subtle.exportKey('jwk', privateKey);

  if (!jwk.d || !jwk.crv) {
    throw new Error('Invalid private key: missing required parameters');
  }

  // The JWK format for EC keys includes both the private parameter (d)
  // and the public point coordinates (x, y) when exported from a private key
  if (jwk.x && jwk.y) {
    // Public key coordinates are available in the JWK
    // Create a public key JWK
    const publicKeyJwk = {
      kty: jwk.kty,
      crv: jwk.crv,
      x: jwk.x,
      y: jwk.y,
      ext: true,
    };

    // Determine the algorithm based on the original key
    const keyAlgorithm =
      privateKey.algorithm.name === 'ECDSA'
        ? { name: 'ECDSA', namedCurve: 'P-256' }
        : { name: 'ECDH', namedCurve: 'P-256' };

    // Import as public key
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      publicKeyJwk,
      keyAlgorithm,
      true,
      []
    );

    // Export the public key in raw format (uncompressed point: 0x04 || x || y)
    const publicKeyBuffer = await crypto.subtle.exportKey('raw', publicKey);
    return arrayBufferToBase64(publicKeyBuffer);
  }

  // If public key coordinates are not in the JWK, we need to compute them
  // This requires EC point multiplication (Q = G * d) which isn't available in Web Crypto API
  throw new Error(
    'Public key coordinates not available in private key JWK. EC point math required.'
  );
}
