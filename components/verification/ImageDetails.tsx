"use client"

import ImageMetadata from "./ImageMetadata";
import ImageView from "./ImageView"

interface FileDetailsProps {
  file: File | null;
}

const ImageDetails: React.FC<FileDetailsProps> = ({ file }) => {
  if (!file) return (<></>);
  
  return (
    <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
    <h1
      className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
      style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
    >
      {file.name}
    </h1>
    <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-2 gap-5 px-5 md:grid-cols-2 xl:px-0">
      <div className="md:col-span-1">
        <ImageView />
      </div>
      <div className="md:col-span-1">
        <ImageMetadata 
          people="blah"
          author="Many people"
          createdAt={Date()}
        />
      </div>
    </div>
    </div>
  );
};

export default ImageDetails;