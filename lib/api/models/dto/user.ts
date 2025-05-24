export type UserDTO = {
  identifier: string
  name: string
  email?: string
  phoneNumber?: string
  publicKey: string // base64EncodedData
  publicSignature: string // base64EncodedData
}