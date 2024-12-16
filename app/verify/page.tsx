'use client';

import { useRef, useState } from 'react';
import FileUploader from '@/components/verification/FileUploader';
import ImageDetails from '@/components/verification/ImageDetails';
import ImageDetailsLoader from '@/components/verification/ImageDetailsLoader';
import {
  ImageMetadataApiReponse,
  FingerprintMatchDTO,
} from '@/components/verification/FileDetailsProps';
import NoMatches from '@/components/verification/NoMatches';
import { useOpenCV } from '../../lib/hooks/use-opencv';

const formattedDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function StartOverButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
      style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
    >
      <button
        className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
        onClick={onClick}
      >
        <p>Start over</p>
      </button>
    </div>
  );
}

export default function VerifyPage() {
  const { isLoaded, calculatePHash } = useOpenCV();
  const [file, setFile] = useState<File | null>(null);
  const [pHash, setPHash] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<FingerprintMatchDTO[] | null>(
    null
  );
  const [imageMetadata, setImageMetadata] =
    useState<ImageMetadataApiReponse | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          const hash = calculatePHash(imageData);
          setPHash(hash);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }

    setFile(file);
    console.log('File has been received ' + file);
  };

  const handleApiResponse = (matches: FingerprintMatchDTO[] | null) => {
    setApiResponse(matches);
    if (!matches) {
      return;
    }

    if (matches.length <= 0) {
      setImageMetadata(null);
      return;
    }
    const bestMatch = matches[0];

    const imageMetadata: ImageMetadataApiReponse = {
      author: bestMatch.createdBy,
      issuedAt: formattedDate(new Date(bestMatch.authenticationDate)),
      score: bestMatch.score,
    };
    setImageMetadata(imageMetadata);
  };

  if (!file) {
    return (
      <>
        <FileUploader currentFile={file} onFileChange={handleFileProvided} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </>
    );
  } else if (!apiResponse) {
    return (
      <ImageDetailsLoader
        currentFile={file}
        onApiResponse={handleApiResponse}
      />
    );
  } else if (!imageMetadata) {
    return (
      <>
        {imageMetadata && <NoMatches file={file} />}

        <StartOverButton
          onClick={() => {
            setFile(null);
            setApiResponse(null);
            setImageMetadata(null);
          }}
        />
      </>
    );
  } else {
    return (
      <>
        <ImageDetails
          file={file}
          author={imageMetadata.author}
          people="people"
          issuedAt={imageMetadata.issuedAt}
          score={imageMetadata.score}
        />

        <StartOverButton
          onClick={() => {
            setFile(null);
            setApiResponse(null);
            setImageMetadata(null);
          }}
        />
      </>
    );
  }
}
