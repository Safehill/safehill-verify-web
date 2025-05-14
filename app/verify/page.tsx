'use client';

import {useRef, useState} from 'react';
import FileUploader from '@/components/verification/FileUploader';
import {FileDetails, FingerprintMatchDTO, ImageMatch,} from '@/components/verification/FileDetailsProps';
import {useOpenCV} from '@/lib/hooks/use-opencv';
import MessageView from '@/components/shared/MessageView';
import {toast} from "sonner";
import {v4 as uuidv4} from 'uuid';
import AxiosInstance from "@/lib/api/api";
import VerifyResultsPage from "@/components/verification/VerifyResultsPage";

const formattedDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoaded: isCVLoaded, calculatePHash } = useOpenCV();
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [imageMatches, setImageMatches] = useState<ImageMatch[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateHash = (imageData: ImageData): string | null => {
    try {
      const hash = calculatePHash(imageData);
      console.log('Hash has been calculated ' + hash);
      return hash;
    } catch {
      toast.error('ERROR calculating hash');
      return null;
    }
  };

  const handleFileProvided = (files: File[]) => {
    const file = files.length > 0 ? files[0] : null;

    console.log('File has been received ' + file);

    if (file && canvasRef.current) {
      const canvas = canvasRef.current!;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (!isCVLoaded) {
            toast.error('CV library still warming up');
            return;
          }
          console.log('Image data has been pulled ' + imageData);
          const hash = calculateHash(imageData);
          if (hash) {
            const fileDetails: FileDetails = {file: file, imageData: imageData};
            setFileDetails(fileDetails);
            performAuthentication(hash);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const performAuthentication = (fingerprint: string) => {
    console.log('Calling API');
    AxiosInstance.post<FingerprintMatchDTO[]>('/fingerprint/retrieve-similar', {
      fingerprint: fingerprint,
    })
      .then((response) => {
        console.log('received response ' + response.status);
        handleApiResponse(response.data);
      })
      .catch((error) => {
        console.log('received error ' + error.message);
        handleApiResponse(error);
      });
  }

  const handleApiResponse = (apiResponse: FingerprintMatchDTO[] | Error | null) => {
    const id = uuidv4();

    if (!apiResponse) {
      toast.error('Error connecting to the server. Please try again');
      setIsLoading(false);
      return;
    }

    if (apiResponse instanceof Error) {
      toast.error('Error from server ' + apiResponse.message + '. Please try again');
      setIsLoading(false);
      return;
    }

    const imageMatches: ImageMatch[] = apiResponse.map((match) => {
      const imageMatch: ImageMatch = {
        author: match.createdBy,
        issuedAt: formattedDate(new Date(match.authenticationDate)),
        distance: match.distance,
      };
      return imageMatch;
    });

    setImageMatches(imageMatches);
  };

  if (!isCVLoaded) {
    return (<MessageView message="Preparing Image Authenticator …" sizeClass={4} />);
  }

  if (fileDetails && imageMatches) {
    return (<VerifyResultsPage fileDetails={fileDetails} matches={imageMatches} onBack={() => {
      setFileDetails(null);
      setImageMatches(null);
      setIsLoading(false);
    }} />);
  }

  return (
    <>
      <FileUploader isLoading={isLoading} setIsLoading={setIsLoading} onSubmit={handleFileProvided} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
