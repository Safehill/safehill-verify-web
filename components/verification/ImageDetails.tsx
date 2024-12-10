"use client"

import Link from "next/link";
import ImageMetadata from "./ImageMetadata";
import ImageView from "./ImageView"

const StartOverButton = () => {
  return (
    <Link 
    className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
    href="/verify">
      <p>Start over</p>
    </Link>
  )
}

const ImageDetails = () => {
    return (
      <>
        <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-2 xl:px-0">
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
      <div
        className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
      <StartOverButton />
      </div>
    </>
    );
  };
  
  export default ImageDetails;