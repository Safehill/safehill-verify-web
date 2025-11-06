import { arrayBufferToBase64, base64ToArrayBuffer } from './base64';

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
 * Convert ECDSA signature from IEEE P1363 format to DER format
 * P1363 format: r || s (64 bytes for P-256: 32 bytes r + 32 bytes s)
 * DER format: ASN.1 encoded SEQUENCE of two INTEGERs
 */
function p1363ToDer(p1363Signature: ArrayBuffer): Uint8Array {
  const sig = new Uint8Array(p1363Signature);
  const r = sig.slice(0, 32);
  const s = sig.slice(32, 64);

  // Helper to encode an integer in DER format
  const encodeInteger = (bytes: Uint8Array): Uint8Array => {
    // Remove leading zeros, but keep one if the value would be interpreted as negative
    let i = 0;
    while (i < bytes.length - 1 && bytes[i] === 0) {
      i++;
    }

    // If high bit is set, prepend 0x00 to indicate positive number
    const needsPadding = bytes[i] >= 0x80;
    const length = bytes.length - i + (needsPadding ? 1 : 0);

    const result = new Uint8Array(2 + length);
    result[0] = 0x02; // INTEGER tag
    result[1] = length;
    if (needsPadding) {
      result[2] = 0x00;
      result.set(bytes.slice(i), 3);
    } else {
      result.set(bytes.slice(i), 2);
    }
    return result;
  };

  const rDer = encodeInteger(r);
  const sDer = encodeInteger(s);

  // Build SEQUENCE
  const totalLength = rDer.length + sDer.length;
  const result = new Uint8Array(2 + totalLength);
  result[0] = 0x30; // SEQUENCE tag
  result[1] = totalLength;
  result.set(rDer, 2);
  result.set(sDer, 2 + rDer.length);

  return result;
}

/**
 * Convert ECDSA signature from DER format to IEEE P1363 format
 * DER format: ASN.1 encoded SEQUENCE of two INTEGERs
 * P1363 format: r || s (64 bytes for P-256)
 */
function derToP1363(derSignature: ArrayBuffer): Uint8Array {
  const sig = new Uint8Array(derSignature);

  // Parse DER SEQUENCE
  if (sig[0] !== 0x30) {
    throw new Error('Invalid DER signature: not a SEQUENCE');
  }

  let pos = 2; // Skip SEQUENCE tag and length

  // Parse r
  if (sig[pos] !== 0x02) {
    throw new Error('Invalid DER signature: r is not an INTEGER');
  }
  const rLength = sig[pos + 1];
  const rBytes = sig.slice(pos + 2, pos + 2 + rLength);
  pos += 2 + rLength;

  // Parse s
  if (sig[pos] !== 0x02) {
    throw new Error('Invalid DER signature: s is not an INTEGER');
  }
  const sLength = sig[pos + 1];
  const sBytes = sig.slice(pos + 2, pos + 2 + sLength);

  // Convert to fixed 32-byte arrays (remove padding or add leading zeros)
  const r = new Uint8Array(32);
  const s = new Uint8Array(32);

  const rStart = Math.max(0, rBytes.length - 32);
  const sStart = Math.max(0, sBytes.length - 32);

  r.set(rBytes.slice(rStart), 32 - (rBytes.length - rStart));
  s.set(sBytes.slice(sStart), 32 - (sBytes.length - sStart));

  // Concatenate r and s
  const result = new Uint8Array(64);
  result.set(r, 0);
  result.set(s, 32);

  return result;
}

/**
 * Creates a shareable encrypted payload using ECDH key agreement
 * Equivalent to shareable() and SafehillCypher.encrypt() in Kotlin
 *
 * @param data - The data to encrypt (e.g., symmetric key bytes)
 * @param receiverPublicKey - Receiver's public key (base64 encoded, raw or SPKI format)
 * @param senderPrivateSignature - Sender's signature private key (CryptoKey) for signing
 * @param senderPublicSignature - Sender's public signature key (base64 encoded, SPKI format from user profile)
 * @param protocolSalt - Salt for HKDF key derivation (base64 encoded string from server)
 * @returns ShareablePayload with ephemeral key, ciphertext, and signature
 */
export async function createShareablePayload(
  data: Uint8Array,
  receiverPublicKey: string,
  senderPrivateSignature: CryptoKey,
  senderPublicSignature: string,
  protocolSalt: string
): Promise<ShareablePayload> {
  // Generate ephemeral key pair
  const ephemeralKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );

  // Import receiver's public key (should be in SPKI/DER format from session)
  const receiverPublicKeyBuffer = base64ToArrayBuffer(receiverPublicKey);
  console.debug('createShareablePayload importing receiver public key', {
    keyLength: receiverPublicKeyBuffer.byteLength,
    keyPreview: receiverPublicKey.substring(0, 20) + '...',
  });

  // Import SPKI key for ECDH operations
  const receiverPublicKeyCrypto = await crypto.subtle.importKey(
    'spki',
    receiverPublicKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Generate shared secret using ECDH
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: receiverPublicKeyCrypto },
    ephemeralKeyPair.privateKey,
    256
  );

  // Export ephemeral public key in SPKI/DER format
  const ephemeralPublicKeyBuffer = await crypto.subtle.exportKey(
    'spki',
    ephemeralKeyPair.publicKey
  );

  // Use sender's public signature from user profile (SPKI format)
  const senderPublicSignatureBuffer = base64ToArrayBuffer(
    senderPublicSignature
  );
  console.debug(
    'createShareablePayload using sender public signature from profile',
    {
      keyLength: senderPublicSignatureBuffer.byteLength,
      keyPreview: senderPublicSignature.substring(0, 20) + '...',
    }
  );

  // Shared info: ephemeralPublicKey (DER) + receiverPublicKey (DER) + senderPublicSignature (DER)
  const sharedInfo = new Uint8Array(
    ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyBuffer.byteLength +
      senderPublicSignatureBuffer.byteLength
  );
  sharedInfo.set(new Uint8Array(ephemeralPublicKeyBuffer), 0);
  sharedInfo.set(
    new Uint8Array(receiverPublicKeyBuffer),
    ephemeralPublicKeyBuffer.byteLength
  );
  sharedInfo.set(
    new Uint8Array(senderPublicSignatureBuffer),
    ephemeralPublicKeyBuffer.byteLength + receiverPublicKeyBuffer.byteLength
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

  // Sign: ciphertext + ephemeralPublicKey (DER) + receiverPublicKey (DER)
  const dataToSign = new Uint8Array(
    ciphertext.byteLength +
      ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyBuffer.byteLength
  );
  dataToSign.set(new Uint8Array(ciphertext), 0);
  dataToSign.set(
    new Uint8Array(ephemeralPublicKeyBuffer),
    ciphertext.byteLength
  );
  dataToSign.set(
    new Uint8Array(receiverPublicKeyBuffer),
    ciphertext.byteLength + ephemeralPublicKeyBuffer.byteLength
  );

  const signatureP1363 = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    senderPrivateSignature,
    dataToSign
  );

  // Convert signature from P1363 (64 bytes) to DER format for compatibility
  const signatureDer = p1363ToDer(signatureP1363);

  console.debug('Signature generated', {
    p1363Length: signatureP1363.byteLength,
    derLength: signatureDer.byteLength,
  });

  return {
    ephemeralPublicKey: arrayBufferToBase64(ephemeralPublicKeyBuffer),
    ciphertext: arrayBufferToBase64(ciphertext),
    signature: arrayBufferToBase64(signatureDer),
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
 * @param receiverPublicKey - Receiver's public key (base64 encoded, SPKI format)
 * @param senderPublicSignature - Sender's public signature key (base64 encoded, SPKI format)
 * @param protocolSalt - Salt for HKDF key derivation (base64 encoded string from server)
 * @returns Decrypted data as Uint8Array
 */
export async function decryptShareablePayload(
  payload: ShareablePayload,
  receiverPrivateKey: CryptoKey,
  receiverPublicKey: string,
  senderPublicSignature: string,
  protocolSalt: string
): Promise<Uint8Array> {
  console.debug('decryptShareablePayload started', {
    ephemeralPublicKeyLength: payload.ephemeralPublicKey.length,
    ciphertextLength: payload.ciphertext.length,
    signatureLength: payload.signature.length,
  });

  // Import ephemeral public key from the payload (in SPKI/DER format)
  const ephemeralPublicKeyBuffer = base64ToArrayBuffer(
    payload.ephemeralPublicKey
  );
  console.debug('Ephemeral public key buffer (SPKI)', {
    byteLength: ephemeralPublicKeyBuffer.byteLength,
  });

  const ephemeralPublicKeyCrypto = await crypto.subtle.importKey(
    'spki',
    ephemeralPublicKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Import sender's public signature key for verification (SPKI/DER format)
  const senderPublicSignatureBuffer = base64ToArrayBuffer(
    senderPublicSignature
  );

  const senderPublicSignatureCrypto = await crypto.subtle.importKey(
    'spki',
    senderPublicSignatureBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );

  // Receiver's public key (in SPKI/DER format from session)
  const receiverPublicKeyBuffer = base64ToArrayBuffer(receiverPublicKey);
  console.debug('Receiver public key from session (SPKI format)', {
    byteLength: receiverPublicKeyBuffer.byteLength,
  });

  // Get the ciphertext buffer for signature verification
  const ciphertextBuffer = base64ToArrayBuffer(payload.ciphertext);

  // Verify signature: ciphertext + ephemeralPublicKey (DER) + receiverPublicKey (DER)
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

  const signatureDer = base64ToArrayBuffer(payload.signature);
  // Convert signature from DER to P1363 format for Web Crypto API verification
  const signatureP1363 = derToP1363(signatureDer);

  const isValid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    senderPublicSignatureCrypto,
    signatureP1363,
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

  // Shared info: ephemeralPublicKey (DER) + receiverPublicKey (DER) + senderPublicSignature (DER)
  const sharedInfo = new Uint8Array(
    ephemeralPublicKeyBuffer.byteLength +
      receiverPublicKeyBuffer.byteLength +
      senderPublicSignatureBuffer.byteLength
  );
  sharedInfo.set(new Uint8Array(ephemeralPublicKeyBuffer), 0);
  sharedInfo.set(
    new Uint8Array(receiverPublicKeyBuffer),
    ephemeralPublicKeyBuffer.byteLength
  );
  sharedInfo.set(
    new Uint8Array(senderPublicSignatureBuffer),
    ephemeralPublicKeyBuffer.byteLength + receiverPublicKeyBuffer.byteLength
  );

  console.debug('Shared info constructed', {
    totalLength: sharedInfo.byteLength,
    ephemeralKeyLength: ephemeralPublicKeyBuffer.byteLength,
    receiverKeyLength: receiverPublicKeyBuffer.byteLength,
    senderSigLength: senderPublicSignatureBuffer.byteLength,
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
