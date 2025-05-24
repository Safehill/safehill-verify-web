import {UserDTO} from "@/lib/api/models/dto/user";

export type AuthenticatedUser = {
  authToken: string
  privateKey: CryptoKey
  privateSignature: CryptoKey
  user: UserDTO
}