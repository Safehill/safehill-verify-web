import { useState } from 'react';
import { ImageMetadataProps } from './FileDetailsProps';
import Image from 'next/image';

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-10 flex-col px-10 py-10">
      <label className="font-bold">{label}</label>
      <span>{value}</span>
    </div>
  );
}

const ImageMetadata: React.FC<ImageMetadataProps> = ({
  file,
  author,
  people,
  issuedAt,
  distance,
}) => {
  const [userData, setUserData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      <div className="flex flex-col items-center px-5 py-2" />

      <div className="mx-auto max-w-lg text-center mb-4">
        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
          {distance < 10 ? 'Best Match' : 'Similar match'}
        </h2>
      </div>
      <hr />

      <div className="flex h-10 flex-col px-10 py-10">
        <label className="font-bold">User</label>
        <span>
          {loading ? 'Loading …' : error ? 'Error loading user' : userData}
        </span>
      </div>

      <LabelValue label="Status" value="Public" />
      <LabelValue label="Released on" value={issuedAt} />
      <LabelValue label="Similarity" value={100 - distance + '%'} />

      <div className="flex flex-col items-center px-5 py-5" />
    </div>
  );
};

export default ImageMetadata;
