import { useState, useEffect } from 'react';

const ImageView = ({ file, height }: { file: File; height: number }) => {
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
      </div>
    );
  }
};

export default ImageView;
