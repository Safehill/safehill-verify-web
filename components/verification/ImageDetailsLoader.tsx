"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { FileMetadataLoaderProps } from "./FileDetailsProps";
import { FingerprintMatchDTO } from "./FileDetailsProps";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

AxiosInstance.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      return Promise.reject(error);
  }
);

async function generatePerceptualHash(file: File): Promise<number> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.src = url
  await image.decode()
  // const hash = await phash.imageHash(image);
  // return hash
  return 213897219821;
}

const ImageDetailsLoader: React.FC<FileMetadataLoaderProps> = ({ currentFile, onApiResponse }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const fingerprint = "" + generatePerceptualHash(currentFile);

    AxiosInstance.post<FingerprintMatchDTO[]>('/fingerprint/retrieve-similar', { fingerprint: fingerprint })
        .then(response => {
          console.log("received response " + response.status)
          onApiResponse(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.log("received error " + error.message)
          setErrorMessage(error.message);
          setIsLoading(false);
        });
  }, []);

  if (errorMessage) return (
    <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-2xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        Error: {errorMessage}
    </h1>
  );
  if (isLoading) return (
    <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        Loading …
    </h1>
  );
  
  return (
    <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        {currentFile.name}
      </h1>
    </div>
  );
};

export default ImageDetailsLoader;