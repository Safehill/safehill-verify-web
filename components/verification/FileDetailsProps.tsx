export interface FingerprintMatchDTO {
  globalIdentifier: string;
  createdBy: string; // User Identifier
  creationDate: string | null; // ISO8601 formatted datetime
  authenticationDate: string; // ISO8601 formatted datetime
  distance: number;
}

export interface ImageMetadataProps {
  file: File;
  imageData: ImageData;
  author: string;
  people: string;
  issuedAt: string;
  distance: number;
}

export interface FileDetailsProps {
  file: File | null;
}

export interface FileUploaderProps {
  currentFile: File | null;
  onFileChange: (file: File | null) => void;
}

export interface FileMetadataLoaderProps {
  currentFile: File;
  fingerprint: string;
  onApiResponse: (response: FingerprintMatchDTO[] | null) => void;
}

export interface ImageMatch {
  author: string;
  issuedAt: string;
  distance: number;
}
