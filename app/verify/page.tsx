"use client"

import { useState } from "react";
import ImageUploader from "@/components/verification/ImageUploader";
import ImageDetails from "@/components/verification/ImageDetails";

export default function VerifyPage() {

    const [file, setFile] = useState<File | null>(null);

    const handleFileProvided = (file: File | null) => {
      setFile(file);
      console.log("File has been received " + file);
    };

    return (
      <>
        <ImageDetails file={file}/>
        <ImageUploader currentFile={file} onFileChange={handleFileProvided}/>
      </>
      );
}