"use client"

import ImageView from "./ImageView"

const NoMatches = ({ 
    file 
}: {
    file: File
}) => {
  return (
    <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        No matches
      </h1>
      
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up gap-5 px-5 xl:px-0 py-2">
        <ImageView file={file!}/>
      </div>
    </div>
  );
};

export default NoMatches;