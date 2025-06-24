import React, {JSX} from "react";
import {formattedDate} from "@/lib/utils";

const ImageMetadata = ({ title, properties, confidence }: {
   title: JSX.Element | null,
   properties: {
     key: string,
     icon: JSX.Element | null,
     value: JSX.Element | null,
     date: Date | null,
     color: string | null,
   }[],
  confidence: number | null,
}) => {
  return (
    <div className="relative w-full max-w-screen-md mx-auto">
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-[-1] pointer-events-none select-none"
        style={{ height: '500px' }}
        alt="home-glow-background"
        src="/images/aura.png"
      />

      {/* Your main component */}
      <div className="rounded-xl bg-neutral-900/90 p-4 shadow-md pb-8">
        <div className="flex items-center mb-5">
          {(title || confidence) && (
            <div className="flex flex-cols justify-between items-center w-full h-10">
              {title && title}
              {confidence && (
                <span className="text-white/90 text-4xl">
              {confidence.toFixed(1)}%
            </span>
              )}
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
              {property.date && (
                <div className="flex flex-col items-center w-full text-gray-400 text-xs pt-4 pb-3">
                  {formattedDate(property.date, true)}
                </div>
              )}
              <div className="text-xs text-white/60 uppercase pl-2 flex flex-cols gap-2">
                {property.icon ?? <></>}
                {property.key}
              </div>
              <div
                className={`${
                  property.color ? property.color : 'bg-neutral-900/60'
                } rounded-lg px-4 py-3 text-sm text-white flex flex-cols gap-2 justify-between items-center h-14`}
              >
                {property.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default ImageMetadata;
