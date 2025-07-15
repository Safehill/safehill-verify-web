"use client";

import React from 'react';
import { ItemizedListProps } from './ItemizedListProps';
import { motion } from 'framer-motion';

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      type: 'spring',
      stiffness: 60,
    },
  }),
};

const ItemizedList: React.FC<ItemizedListProps> = ({ items }) => {
  return (
    <div className="max-w-6xl mx-auto pt-10 px-4 md:px-10">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`flex flex-col md:flex-row md:gap-4 lg:gap-8 ${index === items.length ? '' : 'mb-16'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={index}
          variants={stepVariants}
        >
          {/* Left column: Media (GIF/video/placeholder) */}
          <div className="hidden md:flex md:w-1/6 lg:w-1/8 flex-shrink-0 mt-4 md:mt-0 items-center justify-center">
            {/* Placeholder for GIF/video. Replace with <video> or <img src={item.media} /> as needed. */}
            {item.sideContent || (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-yellow-100 rounded-xl flex items-center justify-center shadow-md animate-pulse">
                <span className="text-3xl">🎬</span>
              </div>
            )}
          </div>

          {/* Right side: Content with number and text */}
          <div className="flex-grow">
            <div className="grid grid-cols-[1fr_10fr] gap-x-6 gap-y-4">
              {/* Number circle with animation */}
              <motion.div
                className="flex justify-center md:justify-end"
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ type: 'spring', stiffness: 200, delay: index * 0.18 }}
              >
                <div
                  className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-purple-300 text-deepTeal font-bold shadow-lg text-xl md:text-3xl"
                  style={{
                    animationFillMode: 'forwards',
                  }}
                >
                  {index + 1}
                </div>
              </motion.div>

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
                  {/* Animate CTA in step 1 */}
                  {item.cta ?? (
                    <motion.div
                      initial={{ scale: 0.95, boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                      whileInView={{ scale: 1, boxShadow: '0 4px 32px 0 rgba(255, 230, 100, 0.25)' }}
                      transition={{ type: 'spring', stiffness: 120, delay: 0.5 }}
                    >
                      {item.cta}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ItemizedList;
