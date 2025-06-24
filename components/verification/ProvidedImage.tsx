import ImageView from './ImageView';
import {JSX} from "react";

const ProvidedImage = ({ file, properties }: {
  file: File,
  properties: {
    key: string,
    icon: JSX.Element | null,
    value: JSX.Element | null,
  }[],
}) => {
  return (
    <div className="grid w-full grid-cols-2 gap-5 px-5 xl:px-0 py-2">
      <div className="col-span-1 flex justify-end">
        <div className="h-[200px]">
          <ImageView file={file} height={200} isConfidential={false}/>
        </div>
      </div>
      <div className="w-[360px] h-[200px] col-span-1 opacity-95">
        <div className="rounded-xl bg-gray-200 p-4 shadow-md pb-4">
          <div className="flex flex-col gap-5">
            {properties.map((property) => (
              <div key={property.key} className="space-y-1">
                <div className="text-xs text-black/60 uppercase pl-2 flex flex-cols gap-2">
                  {property.icon ?? (<></>)}
                  {property.key}
                </div>
                <div className="bg-neutral-100/60 rounded-lg px-4 py-3 text-sm text-black flex-cols gap-2 justify-between items-center truncate block h-12">
                  {property.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidedImage;
