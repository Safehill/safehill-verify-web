'use client';

import ImageMetadata from './ImageMetadata';
import ImageView from './ImageView';
import { ImageMetadataProps } from './FileDetailsProps';
import MessageView from '../shared/MessageView';
import ProvidedImage from './ProvidedImage';

const ImageDetails: React.FC<ImageMetadataProps> = ({
  file,
  imageData,
  author,
  people,
  issuedAt,
  distance: score,
}) => {
  return (
    <div className="z-10 w-full max-w-6xl px-5 xl:px-0">
      <MessageView message="The image you provided" sizeClass={2} />
      <ProvidedImage file={file} imageData={imageData} />

      <div className="my-10">
        <MessageView message="Here's what we found …" sizeClass={4} />
      </div>

      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-[1fr_500px] gap-5 px-5 xl:px-0 py-2">
        <div className="md:col-span-1">
          <ImageView file={file} height={500} />
        </div>
        <div className="md:col-span-1">
          <ImageMetadata
            file={file}
            imageData={imageData}
            people={people}
            author={author}
            issuedAt={issuedAt}
            distance={score}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;
