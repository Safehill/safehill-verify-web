import React, {JSX} from "react";
import {EyeIcon} from "lucide-react";
import {formattedDate} from "@/lib/utils";
import LineSeparator from "@/components/home/LineSeparator";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/shared/avatar";

const ImageMetadata = ({ title, properties, confidence }: {
   title: JSX.Element | null,
   properties: {
     key: string,
     icon: JSX.Element | null,
     value: JSX.Element | null,
     date: Date | null,
   }[],
  confidence: number | null,
}) => {
  return (
    <div className="rounded-xl bg-neutral-800 p-4 shadow-md pb-8">
      <div className="flex items-center mb-5">
        {(title || confidence) && (
          <div className="flex flex-cols justify-between items-center w-full h-10">
            {title && title}
            {confidence && (<span className="text-white/90 text-4xl">{confidence}%</span>)}
          </div>
        )}
      </div>

      {(title || confidence) && (
        <div className="mt-3 mb-6">
          <div
            className="h-0.5 w-full bg-neutral-900"
            style={{ opacity: 0.7 }}
          ></div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {properties.map((property) => (
          <div key={property.key} className="space-y-2">
            {property.date && (<div className="flex flex-col items-center w-full text-gray-400 text-xs pt-4">{formattedDate(property.date, true)}</div>)}
            <div className="text-xs text-white/60 uppercase pl-2 flex flex-cols gap-2">
              {property.icon ?? (<></>)}
              {property.key}
            </div>
            <div className="bg-neutral-900 rounded-lg px-4 py-3 text-sm text-white flex flex-cols gap-2 justify-between items-center">
              {property.value}
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <div className="flex flex-col items-center w-full text-gray-400 text-xs pt-4">{formattedDate(new Date(), true)}</div>
          <div
            className="bg-green-500 rounded-lg px-4 py-3 text-sm text-black flex flex-cols gap-2 justify-between items-center h-12">
            <div className="flex flex-cols gap-1">
              <EyeIcon className="w-5 h-5" />
              Made public by
            </div>
            <div className="flex flex-cols gap-2 items-center">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Jeremy Windsor" />
              </Avatar>
              Jeremy Windsor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMetadata;
