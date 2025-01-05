import React from 'react';
import { ItemizedListProps } from './ItemizedListProps';

const CenteredItems: React.FC<ItemizedListProps> = ({ items }) => {
  return (
    <div className="w-full text-center px-5 sm:px-8 md:px-20 lg:px-30">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="w-full text-center">
            <h1 className="bg-gradient-to-br from-yellow-100 to-purple-200 bg-clip-text text-center font-display text-6xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-6xl py-5">
              {item.icon}
            </h1>
            <div className="bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text font-display text-xl md:text-3xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm font-light py-5">
              {item.title}
            </div>

            <div className="mt-4 text-gray-300 text-sm md:text-base font-light px-4 sm:px-20 md:px-30 lg:px-40">
              {item.content}
            </div>
          </div>

          {/* Separator Line */}
          {index < items.length - 1 ? (
            <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-10">
              <div
                className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                style={{ opacity: 0.7 }}
              ></div>
            </div>
          ) : (
            <div />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CenteredItems;
