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

export interface FileDetails {
  file: File;
  imageData: ImageData;
}

export interface FileUploaderProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSubmit: (files: File[]) => void;
}

export interface FileMetadataLoaderProps {
  fingerprint: string;
  onApiResponse: (response: FingerprintMatchDTO[] | Error | null) => void;
}

export interface ImageMatch {
  author: string;
  issuedAt: string;
  distance: number;
}