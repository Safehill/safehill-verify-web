import {arrayBufferToBase64, base64ToArrayBuffer} from "@/lib/crypto/base64";

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
  const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKeyBase64 = arrayBufferToBase64(privateKeyBuffer);

  // Export public key (SPKI format, DER-encoded)
  const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer);

  return {
    publicKeyBase64,
    privateKeyBase64,
  };
}

export async function initializePrivateKeyAgreement(rawPrivateKey: ArrayBuffer): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "pkcs8",
    rawPrivateKey,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}

export async function importPrivateKeySigning(rawPrivateKey: ArrayBuffer): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "pkcs8",
    rawPrivateKey,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"]
  );
}

export async function generateSymmetricKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // `true` allows the key to be exported later if needed
    ["encrypt", "decrypt"]
  );
}

export async function encryptWithKey(key: CryptoKey, plaintext: string): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return { ciphertext, iv };
}

export async function decryptWithKey(key: CryptoKey, ciphertext: ArrayBuffer, iv: Uint8Array): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export async function cryptoKeyToBase64(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key); // ArrayBuffer
  return arrayBufferToBase64(raw);
}

export async function base64ToCryptoKey(base64: string): Promise<CryptoKey> {
  const raw = base64ToArrayBuffer(base64);
  return await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}