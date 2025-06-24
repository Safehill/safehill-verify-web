import {UserDTO} from "@/lib/api/models/dto/User";

export type AuthenticatedUser = {
  authToken: string
  privateKey: CryptoKey
  privateSignature: CryptoKey
  user: UserDTO
}