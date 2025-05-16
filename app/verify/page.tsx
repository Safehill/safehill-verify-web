'use client';

import React, {useRef, useState} from 'react';
import FileUploader from '@/components/verification/FileUploader';
import {FileDetails, FingerprintMatchDTO, ImageMatch,} from '@/components/verification/FileDetailsProps';
import {useOpenCV} from '@/lib/hooks/use-opencv';
import MessageView from '@/components/shared/MessageView';
import {toast} from "sonner";
import {v4 as uuidv4} from 'uuid';
import AxiosInstance from "@/lib/api/api";
import VerifyResultsPage from "@/components/verification/VerifyResultsPage";
import {Button} from "@/components/shared/button";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import LoadingSpinner from "../../components/shared/icons/loading-spinner";
import {formattedDate} from "@/lib/utils";
import ProvidedImage from "@/components/verification/ProvidedImage";

export default function VerifyPage() {
  const router = useRouter();
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

    var imageMatches: ImageMatch[] = apiResponse.map((match) => {
      const imageMatch: ImageMatch = {
        globalIdentifier: match.globalIdentifier,
        author: match.createdBy,
        issuedAt: new Date(match.authenticationDate),
        distance: match.distance,
      };
      return imageMatch;
    });

    // if (imageMatches.length == 0) {
    //   imageMatches.push({
    //     globalIdentifier: uuidv4().toString(),
    //     author: "John Scavenger",
    //     issuedAt: new Date(),
    //     distance: 10,
    //   })
    //   imageMatches.push({
    //     globalIdentifier: uuidv4().toString(),
    //     author: "Deliah Jones",
    //     issuedAt: new Date(),
    //     distance: 8,
    //   })
    // }

    setIsLoading(false);
    setImageMatches(imageMatches);
  };

  if (fileDetails && imageMatches) {
    return (<VerifyResultsPage fileDetails={fileDetails} matches={imageMatches} onBack={() => {
      setFileDetails(null);
      setImageMatches(null);
      setIsLoading(false);
    }}/>);
  } else if (!isCVLoaded) {
    return (
      <>
        <LoadingSpinner/>
        <MessageView message="Preparing for authentication" sizeClass={4}/>
      </>
    );
  } else if (isLoading) {
    return (
      <>
        <LoadingSpinner />
        <MessageView message="Authenticating" sizeClass={4} />
        {fileDetails && (
          <ProvidedImage file={fileDetails.file} properties={[{
            key: "File name",
            icon: null,
            value: (<span>{fileDetails.file.name}</span>)
          },{
            key: "Image size",
            icon: null,
            value: (<span>{fileDetails.imageData.width + ' X ' + fileDetails.imageData.height}</span>)
          }]} />
        )}
      </>
    );
  } else {
    return (
      <>
        <FileUploader isLoading={isLoading} setIsLoading={setIsLoading} onSubmit={handleFileProvided} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Button
          variant="outline"
          onClick={e => { e.preventDefault(); router.push('/authenticate'); }}
          className="opacity-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <p className="text-sm md:text-md">Back</p>
        </Button>
      </>
    );
  }
}
