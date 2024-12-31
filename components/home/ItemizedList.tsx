import React from 'react';
import { ItemizedListProps } from './ItemizedListProps';

const ItemizedList: React.FC<ItemizedListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-[1fr_10fr] gap-x-6 gap-y-10 py-20 px-20 max-w-4xl mx-auto">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {/* Left column: Circle */}
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

          {/* Right column: Text */}
          <div>
            {/* Title */}
            <div
              className="bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-left font-display text-lg md:text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm font-light"
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
              {item.content}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ItemizedList;
