import ImageView from './ImageView';

const ProvidedImage = ({
  file,
  imageData,
}: {
  file: File;
  imageData: ImageData;
}) => {
  return (
    <div className="grid w-full max-w-screen-xl animate-fade-up grid-cols-2 gap-5 px-5 xl:px-0 py-2">
      <div className="md:col-span-1 flex justify-end">
        <div className="w-fit">
          <ImageView file={file} height={100} />
        </div>
      </div>
      <div className="md:col-span-1">
        <p>
          <b>File: </b>
          {file.name}
        </p>
        <p>
          <b>Size: </b>
          {imageData.width} x {imageData.height}
        </p>
      </div>
    </div>
  );
};

export default ProvidedImage;
