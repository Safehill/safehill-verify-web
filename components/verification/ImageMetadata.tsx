import { create } from "domain";

function LabelValue({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex h-10 flex-col px-10 py-10">
      <label className="font-bold">{label}</label>
      <span>{value}</span>
    </div>
  );
}

export default function ImageMetadata({
  people,
  author,
  createdAt
}: {
  people: string;
  author: string;
  createdAt: string;
}) {
  return (
    <div
      className={`relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md`}
    >
      <div className="flex h-10 items-center justify-center"/>

      <div className="mx-auto max-w-lg text-center">
      <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
          Image History
      </h2>
      </div>
      <LabelValue label="Author" value={author} />
      <LabelValue label="People with access" value={people} />
      <LabelValue label="Created on" value={createdAt} />
    </div>
  );
}
