import {UserDTO} from "@/lib/api/models/dto/User";

export type AuthSessionInitializationMessage = {
  sessionId: string;
  requestorIp: string;
};

export type AuthCredentialsMessage = {
  encryptedPrivateKey: string
  encryptedPrivateKeyIV: string
  encryptedPrivateSignature: string
  encryptedPrivateSignatureIV: string
  authToken: string
  user: UserDTO
}

