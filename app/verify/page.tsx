'use client';

import { Button } from '@/components/shared/button';
import MessageView from '@/components/shared/MessageView';
import type {
  FileDetails,
  FingerprintMatchDTO,
  ImageMatch,
} from '@/components/verification/FileDetailsProps';
import FileUploader from '@/components/verification/FileUploader';
import ProvidedImage from '@/components/verification/ProvidedImage';
import VerifyResultsPage from '@/components/verification/VerifyResultsPage';
import AxiosInstance from '@/lib/api/api';
import type { AssetSimilarMatchRequestDTO } from '@/lib/api/models/dto/AssetFingerprint';
import { useImageEmbedding } from '@/lib/hooks/use-image-embedding';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/shared/icons/loading-spinner';

export default function VerifyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    isLoaded: isEmbeddingModelLoaded,
    calculate: calculateImageEmbedding,
  } = useImageEmbedding();
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [imageMatches, setImageMatches] = useState<ImageMatch[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

          if (!isEmbeddingModelLoaded) {
            toast.error('Embedding model still warming up');
            return;
          }
          console.log('Image data has been pulled ' + imageData);
          calculateImageEmbedding(imageData)
            .then((embeddingBase64) => {
              const fileDetails: FileDetails = {
                file: file,
                imageData: imageData,
              };
              setFileDetails(fileDetails);
              const fingerprint = {
                embeddings: embeddingBase64,
                maxDistance: 0.9,
              } as AssetSimilarMatchRequestDTO;
              performAuthentication(fingerprint);
            })
            .catch((err) => {
              toast.error('Failed to calculate embedding');
              setIsLoading(false);
            });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const performAuthentication = (matching: AssetSimilarMatchRequestDTO) => {
    console.log('Calling API');
    AxiosInstance.post<FingerprintMatchDTO[]>(
      '/fingerprint/retrieve-similar',
      matching
    )
      .then((response) => {
        console.log('received response ' + response.status);
        handleApiResponse(response.data);
      })
      .catch((error) => {
        console.log('received error ' + error.message);
        handleApiResponse(error);
      });
  };

  const handleApiResponse = (
    apiResponse: FingerprintMatchDTO[] | Error | null
  ) => {
    if (!apiResponse) {
      toast.error('Error connecting to the server. Please try again');
      setIsLoading(false);
      return;
    }

    if (apiResponse instanceof Error) {
      toast.error(
        'Error from server ' + apiResponse.message + '. Please try again'
      );
      setIsLoading(false);
      return;
    }

    const imageMatches: ImageMatch[] = apiResponse.map((match) => {
      const imageMatch: ImageMatch = {
        globalIdentifier: match.globalIdentifier,
        author: match.createdBy,
        issuedAt: new Date(match.authenticationDate),
        distance: match.distance,
      };
      return imageMatch;
    });

    setIsLoading(false);
    setImageMatches(imageMatches);
  };

  if (fileDetails && imageMatches) {
    return (
      <VerifyResultsPage
        fileDetails={fileDetails}
        matches={imageMatches}
        onBack={() => {
          setFileDetails(null);
          setImageMatches(null);
          setIsLoading(false);
        }}
      />
    );
  } else if (!isEmbeddingModelLoaded) {
    return (
      <>
        <LoadingSpinner />
        <MessageView message="Preparing for authentication" sizeClass={4} />
        <div className="opacity-95 text-gray-500 text-center">
          This may take a minute or so the first time, as your browser needs to
          fetch our AI models for content authentication.
          <br />
          Don&apos;t close the page until the process is complete.
        </div>
      </>
    );
  } else if (isLoading) {
    return (
      <>
        <LoadingSpinner />
        <MessageView message="Authenticating" sizeClass={4} />
        {fileDetails && (
          <ProvidedImage
            file={fileDetails.file}
            properties={[
              {
                key: 'File name',
                icon: null,
                value: <span>{fileDetails.file.name}</span>,
              },
              {
                key: 'Image size',
                icon: null,
                value: (
                  <span>
                    {fileDetails.imageData.width +
                      ' X ' +
                      fileDetails.imageData.height}
                  </span>
                ),
              },
            ]}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <FileUploader
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSubmit={handleFileProvided}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            router.push('/authenticate');
          }}
          className="opacity-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <p className="text-sm md:text-md">Back</p>
        </Button>
      </>
    );
  }
}
