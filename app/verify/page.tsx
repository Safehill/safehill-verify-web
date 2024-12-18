'use client';

import { useEffect, useRef, useState } from 'react';
import FileUploader from '@/components/verification/FileUploader';
import ImageDetails from '@/components/verification/ImageDetails';
import ImageMatchesLoader from '@/components/verification/ImageMatchesLoader';
import {
  ImageMatch,
  FingerprintMatchDTO,
} from '@/components/verification/FileDetailsProps';
import { useOpenCV } from '../../lib/hooks/use-opencv';
import MessageView from '@/components/shared/MessageView';
import PrimaryButton from '@/components/shared/PrimaryButton';
import ProvidedImage from '@/components/verification/ProvidedImage';

const formattedDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function VerifyPage() {
  const { isLoaded: isCVLoaded, calculatePHash } = useOpenCV();
  const [file, setFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [pHash, setPHash] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<
    FingerprintMatchDTO[] | Error | null
  >(null);
  const [matches, setMatches] = useState<ImageMatch[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateHash = (imageData: ImageData) => {
    try {
      const hash = calculatePHash(imageData);
      console.log('Hash has been calculated ' + hash);
      setPHash(hash);
    } catch {
      console.error('ERROR calculating hash');
      setPHash(null);
      return;
    }
  };

  useEffect(() => {
    if (pHash) {
      return;
    }
    if (!imageData) {
      return;
    }
    if (!isCVLoaded) {
      return;
    }
    calculateHash(imageData);
  }, [imageData, pHash, isCVLoaded]);

  const handleFileProvided = (file: File | null) => {
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
          setImageData(imageData);

          if (!isCVLoaded) {
            console.error('CV library still warming up');
            return;
          }
          console.log('Image data has been pulled ' + imageData);
          calculateHash(imageData);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }

    setFile(file);
    console.log('File has been received ' + file);
  };

  const handleApiResponse = (apiResponse: FingerprintMatchDTO[] | null) => {
    if (!apiResponse) {
      setApiResponse(new Error('No response from server. Please try again'));
      setMatches(null);
      return;
    } else {
      setApiResponse(apiResponse);
    }

    const imageMatches: ImageMatch[] = apiResponse.map((match) => {
      const imageMatch: ImageMatch = {
        author: match.createdBy,
        issuedAt: formattedDate(new Date(match.authenticationDate)),
        distance: match.distance,
      };
      return imageMatch;
    });

    setMatches(imageMatches);
  };

  if (file == null) {
    return (
      <>
        <FileUploader currentFile={file} onFileChange={handleFileProvided} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </>
    );
  } else if (pHash == null) {
    <MessageView message="Preparing …" sizeClass={4} />;
  } else if (apiResponse == null) {
    return (
      <ImageMatchesLoader
        currentFile={file}
        fingerprint={pHash}
        onApiResponse={handleApiResponse}
      />
    );
  } else if (!matches) {
    return (
      <MessageView message={(apiResponse as Error).message} sizeClass={4} />
    );
  } else if (imageData) {
    const bestMatch = matches[0];
    return (
      <>
        {matches.length == 0 ? (
          <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
            <div className="my-5">
              <MessageView
                message="We couldn't find any matches"
                sizeClass={4}
              />
            </div>
            <ProvidedImage file={file} imageData={imageData} />
          </div>
        ) : (
          <ImageDetails
            file={file}
            imageData={imageData}
            author={bestMatch.author}
            people="people"
            issuedAt={bestMatch.issuedAt}
            distance={bestMatch.distance}
          />
        )}
        <PrimaryButton
          label="Start a new search"
          onClick={() => {
            setFile(null);
            setImageData(null);
            setApiResponse(null);
            setMatches(null);
          }}
        />
      </>
    );
  } else {
    return (
      <>
        <MessageView message="Something unexpected occurred" sizeClass={4} />
        <PrimaryButton
          label="Start over"
          onClick={() => {
            setFile(null);
            setImageData(null);
            setApiResponse(null);
            setMatches(null);
          }}
        />
      </>
    );
  }
}
