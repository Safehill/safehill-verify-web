import { arrayBufferToBase64, base64ToArrayBuffer } from './base64';
import { derivePublicKeyFromPrivate } from './keys';

/**
 * Represents the shareable encrypted payload
 * Equivalent to ShareablePayload in Kotlin
 */
export interface ShareablePayload {
  ephemeralPublicKey: string; // base64
  ciphertext: string; // base64
  signature: string; // base64
}

/**
 * Creates a shareable encrypted payload using ECDH key agreement
 * Equivalent to shareable() and SafehillCypher.encrypt() in Kotlin
 *
 * @param data - The data to encrypt (e.g., symmetric key bytes)
 * @param receiverPublicKey - Receiver's public key (base64 encoded, raw format)
 * @param senderSignaturePrivateKey - Sender's signature private key (CryptoKey)
 * @param protocolSalt - Salt for HKDF key derivation (base64 encoded string from server)
 * @returns ShareablePayload with ephemeral key, ciphertext, and signature
 */
export async function createShareablePayload(
  data: Uint8Array,
  receiverPublicKey: string,
  senderSignaturePrivateKey: CryptoKey,
  protocolSalt: string
): Promise<ShareablePayload> {
  // Generate ephemeral key pair
  const ephemeralKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );

  // Import receiver's public key
  // The key might be in SPKI format (91 bytes) or raw format (65 bytes)
  const receiverPublicKeyBuffer = base64ToArrayBuffer(receiverPublicKey);
  console.debug('createShareablePayload importing receiver public key', {
    keyLength: receiverPublicKeyBuffer.byteLength,
    keyPreview: receiverPublicKey.substring(0, 20) + '...',
  });

  let receiverPublicKeyCrypto: CryptoKey;

  // Determine the receiver public key raw buffer
  let receiverPublicKeyRawBuffer: ArrayBuffer;

  // Try importing as raw first (65 bytes for P-256)
  if (receiverPublicKeyBuffer.byteLength === 65) {
    // Already in raw format
    receiverPublicKeyRawBuffer = receiverPublicKeyBuffer;
    receiverPublicKeyCrypto = await crypto.subtle.importKey(
      'raw',
      receiverPublicKeyBuffer,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );
  } else {
    // Key is in SPKI format, import and extract raw format
    const tempKey = await crypto.subtle.importKey(
      'spki',
      receiverPublicKeyBuffer,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      []
    );

    // Export to raw format
    receiverPublicKeyRawBuffer = await crypto.subtle.exportKey('raw', tempKey);

    // Re-import as raw for ECDH operations
    receiverPublicKeyCrypto = await crypto.subtle.importKey(
      'raw',
      receiverPublicKeyRawBuffer,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );
  }

  // Generate shared secret using ECDH
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: receiverPublicKeyCrypto },
    ephemeralKeyPair.privateKey,
    256
  );

  // Export ephemeral public key in raw format
  const ephemeralPublicKeyBuffer = await crypto.subtle.exportKey(
    'raw',
    ephemeralKeyPair.publicKey
  );

  // Derive sender's public signature key
  const senderPublicSignature = await derivePublicKeyFromPrivate(
    senderSignaturePrivateKey
  );
  const senderPublicSignatureBuffer = base64ToArrayBuffer(
    senderPublicSignature
  );

  // Shared info: ephemeralPublicKey + receiverPublicKey + senderPublicSignature
  const sharedInfo = new Uint8Array(
    ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyRawBuffer.byteLength +
      senderPublicSignatureBuffer.byteLength
  );
  sharedInfo.set(new Uint8Array(ephemeralPublicKeyBuffer), 0);
  sharedInfo.set(
    new Uint8Array(receiverPublicKeyRawBuffer),
    ephemeralPublicKeyBuffer.byteLength
  );
  sharedInfo.set(
    new Uint8Array(senderPublicSignatureBuffer),
    ephemeralPublicKeyBuffer.byteLength + receiverPublicKeyRawBuffer.byteLength
  );

  // Decode protocol salt from base64
  const protocolSaltBytes = new Uint8Array(base64ToArrayBuffer(protocolSalt));

  // Derive symmetric encryption key using HKDF
  const derivedKey = await hkdfDerive(
    new Uint8Array(sharedSecret),
    protocolSaltBytes,
    sharedInfo,
    32
  );

  // Encrypt the data with the derived key
  const ciphertext = await encryptWithDerivedKey(data, derivedKey);

  // Sign: ciphertext + ephemeralPublicKey + receiverPublicKey (raw format)
  const dataToSign = new Uint8Array(
    ciphertext.byteLength +
      ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyRawBuffer.byteLength
  );
  dataToSign.set(new Uint8Array(ciphertext), 0);
  dataToSign.set(
    new Uint8Array(ephemeralPublicKeyBuffer),
    ciphertext.byteLength
  );
  dataToSign.set(
    new Uint8Array(receiverPublicKeyRawBuffer),
    ciphertext.byteLength + ephemeralPublicKeyBuffer.byteLength
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    senderSignaturePrivateKey,
    dataToSign
  );

  return {
    ephemeralPublicKey: arrayBufferToBase64(ephemeralPublicKeyBuffer),
    ciphertext: arrayBufferToBase64(ciphertext),
    signature: arrayBufferToBase64(signature),
  };
}

/**
 * HKDF key derivation (HMAC-based Key Derivation Function)
 * Equivalent to HKDF.fromHmacSha256() in Kotlin
 *
 * @param ikm - Input keying material (shared secret)
 * @param salt - Salt value
 * @param info - Context and application specific information
 * @param length - Length of output keying material in bytes
 * @returns Derived key
 */
export async function hkdfDerive(
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number
): Promise<Uint8Array> {
  // HKDF Extract: PRK = HMAC-Hash(salt, IKM)
  const prk = await hmacSha256(salt, ikm);

  // HKDF Expand: OKM = HMAC-Hash(PRK, info || 0x01)
  const infoWithCounter = new Uint8Array(info.length + 1);
  infoWithCounter.set(info);
  infoWithCounter[info.length] = 0x01;

  const okm = await hmacSha256(prk, infoWithCounter);

  return new Uint8Array(okm.slice(0, length));
}

/**
 * HMAC-SHA256 helper
 */
async function hmacSha256(
  key: Uint8Array,
  data: Uint8Array
): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return new Uint8Array(signature);
}

/**
 * Encrypt data with derived key using AES-GCM
 * IV is prepended to the ciphertext
 */
async function encryptWithDerivedKey(
  data: Uint8Array,
  derivedKey: Uint8Array
): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    derivedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );

  // Prepend IV to encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);

  return result.buffer;
}

/**
 * Decrypts a shareable payload using ECDH key agreement
 * This is the reverse operation of createShareablePayload
 *
 * @param payload - The shareable payload to decrypt
 * @param receiverPrivateKey - Receiver's private key (CryptoKey)
 * @param senderPublicSignature - Sender's public signature key (base64 encoded, raw format)
 * @param protocolSalt - Salt for HKDF key derivation (base64 encoded string from server)
 * @returns Decrypted data as Uint8Array
 */
export async function decryptShareablePayload(
  payload: ShareablePayload,
  receiverPrivateKey: CryptoKey,
  senderPublicSignature: string,
  protocolSalt: string
): Promise<Uint8Array> {
  console.debug('decryptShareablePayload started', {
    ephemeralPublicKeyLength: payload.ephemeralPublicKey.length,
    ciphertextLength: payload.ciphertext.length,
    signatureLength: payload.signature.length,
  });

  // Import ephemeral public key from the payload
  const ephemeralPublicKeyBuffer = base64ToArrayBuffer(
    payload.ephemeralPublicKey
  );
  console.debug('Ephemeral public key buffer', {
    byteLength: ephemeralPublicKeyBuffer.byteLength,
  });

  const ephemeralPublicKeyCrypto = await crypto.subtle.importKey(
    'raw',
    ephemeralPublicKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Import sender's public signature key for verification
  // The key might be in SPKI format (91 bytes) or raw format (65 bytes)
  const senderPublicSignatureBuffer = base64ToArrayBuffer(
    senderPublicSignature
  );

  let senderPublicSignatureCrypto: CryptoKey;
  let senderPublicSignatureRawBuffer: ArrayBuffer;

  if (senderPublicSignatureBuffer.byteLength === 65) {
    // Already in raw format
    senderPublicSignatureRawBuffer = senderPublicSignatureBuffer;
    senderPublicSignatureCrypto = await crypto.subtle.importKey(
      'raw',
      senderPublicSignatureBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
  } else {
    // Key is in SPKI format, import and extract raw format
    const tempKey = await crypto.subtle.importKey(
      'spki',
      senderPublicSignatureBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['verify']
    );

    // Export to raw format
    senderPublicSignatureRawBuffer = await crypto.subtle.exportKey(
      'raw',
      tempKey
    );

    // Re-import as raw for verification
    senderPublicSignatureCrypto = await crypto.subtle.importKey(
      'raw',
      senderPublicSignatureRawBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
  }

  // Derive receiver's public key from their private key
  const receiverPublicKey = await derivePublicKeyFromPrivate(
    receiverPrivateKey
  );
  const receiverPublicKeyBuffer = base64ToArrayBuffer(receiverPublicKey);
  console.debug('Receiver public key derived', {
    byteLength: receiverPublicKeyBuffer.byteLength,
  });

  // Get the ciphertext buffer for signature verification
  const ciphertextBuffer = base64ToArrayBuffer(payload.ciphertext);

  // Verify signature: dataToSign = ciphertext + ephemeralPublicKey + receiverPublicKey
  const dataToVerify = new Uint8Array(
    ciphertextBuffer.byteLength +
      ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyBuffer.byteLength
  );
  dataToVerify.set(new Uint8Array(ciphertextBuffer), 0);
  dataToVerify.set(
    new Uint8Array(ephemeralPublicKeyBuffer),
    ciphertextBuffer.byteLength
  );
  dataToVerify.set(
    new Uint8Array(receiverPublicKeyBuffer),
    ciphertextBuffer.byteLength + ephemeralPublicKeyBuffer.byteLength
  );

  const signatureBuffer = base64ToArrayBuffer(payload.signature);
  const isValid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    senderPublicSignatureCrypto,
    signatureBuffer,
    dataToVerify
  );

  if (!isValid) {
    throw new Error('Signature verification failed');
  }

  console.debug('Signature verified successfully');

  // Generate shared secret using ECDH
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: ephemeralPublicKeyCrypto },
    receiverPrivateKey,
    256
  );
  console.debug('Shared secret derived', {
    byteLength: sharedSecret.byteLength,
  });

  // Shared info: ephemeralPublicKey + receiverPublicKey + senderPublicSignature (all in raw format)
  const sharedInfo = new Uint8Array(
    ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyBuffer.byteLength +
      senderPublicSignatureRawBuffer.byteLength
  );
  sharedInfo.set(new Uint8Array(ephemeralPublicKeyBuffer), 0);
  sharedInfo.set(
    new Uint8Array(receiverPublicKeyBuffer),
    ephemeralPublicKeyBuffer.byteLength
  );
  sharedInfo.set(
    new Uint8Array(senderPublicSignatureRawBuffer),
    ephemeralPublicKeyBuffer.byteLength + receiverPublicKeyBuffer.byteLength
  );

  console.debug('Shared info constructed', {
    totalLength: sharedInfo.byteLength,
    ephemeralKeyLength: ephemeralPublicKeyBuffer.byteLength,
    receiverKeyLength: receiverPublicKeyBuffer.byteLength,
    senderSigLength: senderPublicSignatureRawBuffer.byteLength,
  });

  // Decode protocol salt from base64
  const protocolSaltBytes = new Uint8Array(base64ToArrayBuffer(protocolSalt));

  // Derive symmetric decryption key using HKDF
  const derivedKey = await hkdfDerive(
    new Uint8Array(sharedSecret),
    protocolSaltBytes,
    sharedInfo,
    32
  );
  console.debug('Symmetric key derived via HKDF', {
    keyLength: derivedKey.length,
  });

  // Decrypt the ciphertext
  const decrypted = await decryptWithDerivedKey(ciphertextBuffer, derivedKey);

  console.debug('decryptShareablePayload completed');

  return new Uint8Array(decrypted);
}

/**
 * Decrypt data with derived key using AES-GCM
 * IV is expected to be prepended to the ciphertext
 */
async function decryptWithDerivedKey(
  encryptedData: ArrayBuffer,
  derivedKey: Uint8Array
): Promise<ArrayBuffer> {
  const encryptedArray = new Uint8Array(encryptedData);

  console.debug('decryptWithDerivedKey', {
    encryptedDataLength: encryptedArray.length,
    derivedKeyLength: derivedKey.length,
  });

  // Extract IV (first 12 bytes)
  const iv = encryptedArray.slice(0, 12);

  // Extract ciphertext (remaining bytes)
  const ciphertext = encryptedArray.slice(12);

  console.debug('Extracted IV and ciphertext', {
    ivLength: iv.length,
    ciphertextLength: ciphertext.length,
  });

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    derivedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      ciphertext
    );

    console.debug('Decryption successful');
    return decrypted;
  } catch (error) {
    console.error('AES-GCM decryption failed', {
      error,
      ivLength: iv.length,
      ciphertextLength: ciphertext.length,
      derivedKeyLength: derivedKey.length,
    });
    throw new Error(`AES-GCM decryption failed: ${error}`);
  }
}
