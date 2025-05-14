import React from 'react';
import { ItemizedListProps } from './ItemizedListProps';
import Image from "next/image";

const ItemizedList: React.FC<ItemizedListProps> = ({ items }) => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-10">
      {items.map((item, index) => (
        <div key={index} className="mb-16 flex flex-col md:flex-row md:gap-4 lg:gap-8">
          {/* Left column: Image (only visible on md and larger screens) */}
          <div className="hidden md:block md:w-1/6 lg:w-1/8 flex-shrink-0 mt-4 md:mt-0">
            {item.sideContent}
          </div>

          {/* Right side: Content with number and text */}
          <div className="flex-grow">
            <div className="grid grid-cols-[1fr_10fr] gap-x-6 gap-y-4">
              {/* Number circle */}
              <div className="flex justify-center md:justify-end">
                <div
                  className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-purple-300 text-deepTeal font-bold shadow-lg text-xl md:text-3xl"
                  style={{
                    animationFillMode: 'forwards',
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Text content */}
              <div>
                {/* Title */}
                <div
                  className="bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-left font-display text-2xl md:text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm font-light"
                  style={{
                    animationFillMode: 'forwards',
                  }}
                >
                  {item.title}
                </div>

                {/* Content */}
                <div
                  className="mt-4 text-teal-100 text-sm md:text-base font-light"
                  style={{
                    animationDelay: '0.25s',
                    animationFillMode: 'forwards',
                  }}
                >
                  {item.mainContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemizedList;
