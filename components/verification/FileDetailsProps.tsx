export interface FingerprintMatchDTO {
  globalIdentifier: string
  createdBy: string
  creationDate: string | null // ISO8601 formatted datetime
  authenticationDate: string // ISO8601 formatted datetime
  score: number
}

export interface ImageMetadataProps {
  file: File
  author: string
  people: string
  issuedAt: string
  score: number
}

export interface FileDetailsProps {
  file: File | null
}

export interface FileUploaderProps {
  currentFile: File | null
  onFileChange: (file: File | null) => void
}

export interface FileMetadataLoaderProps {
  currentFile: File
  onApiResponse: (response: FingerprintMatchDTO[] | null) => void
}

export interface ImageMetadataApiReponse {
  author: string
  issuedAt: string
  score: number
}