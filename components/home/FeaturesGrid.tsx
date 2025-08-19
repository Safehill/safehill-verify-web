import React from 'react';

interface FeatureItem {
  icon: string;
  title?: string;
  description: string;
}

interface FeaturesGridProps {
  items: FeatureItem[];
  className?: string;
}

export default function FeaturesGrid({
  items,
  className = '',
}: FeaturesGridProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px]">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border-4 border-solid border-white/30 bg-transparent p-6 pt-10 flex flex-col items-center shadow-none max-w-[300px] mx-auto transition-all duration-200 hover:scale-110 active:scale-105 hover:bg-black/30 active:bg-white/30 cursor-pointer"
          >
            <span className="text-5xl mb-8 bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent">
              {item.icon}
            </span>
            {item.title && (
              <h3 className="text-center text-xl md:text-2xl font-semibold tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mt-4 mb-8 h-12 md:h-14 flex items-center justify-center">
                {item.title}
              </h3>
            )}
            <p className="text-center text-sm md:text-base font-light tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
