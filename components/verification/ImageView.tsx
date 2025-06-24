import { useState, useEffect } from 'react';

import React, { useMemo } from 'react';

export function ConfidentialPlaceholder(
  {
    url,
    height = 300
  }: {
    url: string;
    height?: number
  }) {
  const width = height * 1.5;

  return (
    <div
      className="relative rounded-md border border-gray-200 shadow-sm overflow-hidden"
      style={{ width, height }}
    >
      {/* Blurred background image */}
      <img
        src={url}
        alt="Confidential placeholder"
        className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-105"
      />

      {/* Overlay text */}
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="text-white text-lg font-semibold backdrop-blur-sm bg-black/40 px-4 py-2 rounded">
          Confidential content
        </span>
      </div>
    </div>
  );
}

const ImageView = (
  {
    file, height, isConfidential = false
  } : {
    file: File; height: number, isConfidential: boolean
  }) => {
  const [url, setURL] = useState<string | null>(null);

  useEffect(() => {
    setURL(URL.createObjectURL(file!));
  }, []);

  if (!url) {
    return (
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-2xl md:leading-[5rem]"
        style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
      >
        Loading …
      </h1>
    );
  } else {
    return (
      <div className="w-full flex justify-center items-center">
        {isConfidential ? (
          <ConfidentialPlaceholder url={url} height={height} />
        ) : (
          <img
            className="relative col-span-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm h-auto object-cover"
            src={url}
            alt="Preview of the selected image"
            // className=""
            style={{
              maxWidth: '100%',
              maxHeight: height + 'px',
              objectFit: 'contain',
            }}
          />
        )}
      </div>
    );
  }
};

export default ImageView;
