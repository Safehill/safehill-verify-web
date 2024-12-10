"use client"

import { MutableRefObject, useState } from "react";
import { useRef } from "react";
import Link from "next/link";

const VerifyButton = () => {
  
  return (
    <Link 
    className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
    href="/">
      <p>Verify</p>
    </Link>
  )
}

const ImageUploader = () => {
    const [file, setFileSelected] = useState(null);
    const fileInputRef: MutableRefObject<any | null> = useRef(null);

    const handleCancelSelection = async () => {
      setFileSelected(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  
    const handleImageUpload = async (event: any) => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        setFileSelected(file);
        const formData = new FormData();
        formData.append('image', file);
  
      try {
    //     const response = await axios.post('/api/enhance-image', formData);
    //     console.log('Upload image response:', response.data);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      } else {
        setFileSelected(null)
      }
    };
  
    return (
      <div style={{ height: "30px" }}>
        <div
        className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={file != null} ref={fileInputRef}/>
      </div>
      <div
        className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
      { file != null ? <VerifyButton/> : <></>}
      { file != null ? <button onClick={handleCancelSelection}>Clear selection</button> : <></>}  
      </div>
      </div>
    );
  };
  
  export default ImageUploader;