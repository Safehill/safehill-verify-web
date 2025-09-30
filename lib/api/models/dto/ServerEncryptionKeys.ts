export interface ServerEncryptionKeysDTO {
  publicKey: string; // base64 encoded
  publicSignature: string; // base64 encoded
  encryptionProtocolSalt: string; // base64 encoded
}
