"use client"

import { useState } from "react";
import FileUploader from "@/components/verification/FileUploader";
import ImageDetails from "@/components/verification/ImageDetails";
import ImageDetailsLoader from "@/components/verification/ImageDetailsLoader";
import { ImageMetadataProps, APIResponse } from "@/components/verification/FileDetailsProps";

const JSONPreview: React.FC<APIResponse> = (response) => {
  if (!response.data) { return (<></>); }
  return (
    <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  )
}

export default function VerifyPage() {
  
  const [file, setFile] = useState<File | null>(null);
  const [apiResponseData, setApiResponseData] = useState<Blob | null>(null);
  const [imageMetadata, setImageImageMetadata] = useState<ImageMetadataProps | null>(null);
  
  const handleFileProvided = (file: File | null) => {
    setFile(file);
    console.log("File has been received " + file);
  };
  
  if (!file) {
    return (
      <FileUploader currentFile={file} onFileChange={handleFileProvided}/>
    );
  } else if (!apiResponseData) {
    return (
      <ImageDetailsLoader currentFile={file} onApiResponse={(data) => {
        setApiResponseData(data)
      }}/>
    );
  } else {
    return (
      <>
        <ImageDetails 
          file={file}
          author="author"
          people="people"
          createdAt={Date().toString()}
        />
        
        <div
          className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <button
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
            onClick={() => {
              setFile(null);
              setApiResponseData(null);
              setImageImageMetadata(null)
            }}>
            <p>Start over</p>
          </button>
        </div>

        <JSONPreview data={apiResponseData}/>
      </>
  );
}
}