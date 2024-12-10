import { ImageMetadataProps } from "./FileDetailsProps"

function LabelValue({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex h-10 flex-col px-10 py-10">
      <label className="font-bold">{label}</label>
      <span>{value}</span>
    </div>
  );
}

const ImageMetadata: React.FC<ImageMetadataProps> = ({ file, author, people, createdAt }) => {
  return (
    <div className="relative col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      
      <LabelValue label="Author" value={author} />
      <LabelValue label="People with access" value={people} />
      <LabelValue label="Created on" value={createdAt} />

      <div className="flex flex-col items-center px-5 py-10"/>

    </div>
  );
}

export default ImageMetadata;