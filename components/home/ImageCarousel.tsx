"use client";

import React, { useEffect, useRef, useState } from "react";
import {FingerprintIcon} from "lucide-react";

const IMAGE_COUNT = 20;

const COLORS = [
  "text-red-500",
  "text-green-500",
  "text-blue-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
];


const generateImageUrls = () => {
  return Array.from({ length: IMAGE_COUNT }, (_, i) => {
    const width = 800;
    const height = 600;
    return `https://picsum.photos/id/${i + 70}/${width}/${height}`;
  });
};

export const ImageCarousel: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImages(generateImageUrls());
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let frameId: number;
    const scrollSpeed = 0.5;

    const step = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += scrollSpeed;

      // Seamless loop
      const scrollWidth = scrollContainer.scrollWidth / 2;
      if (scrollContainer.scrollLeft >= scrollWidth) {
        scrollContainer.scrollLeft = 0;
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [images]);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 whitespace-nowrap overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "auto" }} // prevent smooth scrolling artifacts
      >
        {images.length == 0 && (
          <div className="w-full overflow-x-auto h-[200px] lg:h-[300px]"></div>
        )}
        {[...images, ...images].map((src, idx) => (
          <div
            key={idx}
            className="relative -ml-[2px] rounded-xl shadow-lg bg-transparent"
            style={{ flex: "0 0 auto" }}
          >
            <img
              src={src}
              alt={`Sample Image ${idx}`}
              className="rounded-xl h-[200px] lg:h-[300px] object-contain"
            />
            <div className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow-md ${COLORS[Math.floor(Math.random() * COLORS.length)]}`}>
              <FingerprintIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
