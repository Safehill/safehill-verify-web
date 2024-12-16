import Image from "next/image";
import { useState, useEffect } from "react";

const ImageView = ({ 
  file 
}: {
  file: File
}) => {
  const [url, setURL] = useState<string | null>(null)

  useEffect(() => {
    setURL(URL.createObjectURL(file!))
  }, []);

  if (!url) {
    return (
      <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-2xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Loading …
      </h1>
    );
  } else {
    return (
      <div className="relative col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <Image
          src={url}
          alt="Preview of the selected image"
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }
};

export default ImageView;