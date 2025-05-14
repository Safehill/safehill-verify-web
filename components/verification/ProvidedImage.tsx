import ImageView from './ImageView';

const ProvidedImage = ({
  file,
  imageData,
}: {
  file: File;
  imageData: ImageData;
}) => {
  return (
    <div className="grid w-full max-w-screen-xl grid-cols-2 gap-5 px-5 xl:px-0 py-2">
      <div className="col-span-2 md:col-span-1 flex justify-end">
        <div className="w-fit">
          <ImageView file={file} height={300} />
        </div>
      </div>
      <div className="opacity-0 animate-fade-up"
           style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
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
