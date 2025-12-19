'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const FeaturesList = () => {
  const carouselItems = [
    {
      icon: '🏦',
      title: 'Banking-like Security',
      titleClass: 'text-cyan-300',
      content: (
        <>
          Our best-in-class security standards guarantee that{' '}
          <b className="text-cyan-300">NO-ONE</b> other than people with
          explicit access can ever decrypt your content or use it for AI
          training. Not even Safehill.
        </>
      ),
    },
    {
      icon: '🧬',
      title: 'Blockchain-like Traceability',
      titleClass: 'text-purple-300',
      content: (
        <>
          We use fingerprints to track access to your content in Safehill.
          <br />
          <br />
          We can then detect unauthorized use on the web even if the content is
          altered or tampered with.
        </>
      ),
    },
    {
      icon: '🤑',
      title: 'Credit and Royalties',
      titleClass: 'text-green-500',
      content: (
        <>
          Distribute your content with confidence, and rely on our monitoring
          system to prevent breach of copyright or to earn royalties.
        </>
      ),
    },
    {
      icon: '💾',
      title: 'Controlled Distribution',
      titleClass: 'text-yellow-300',
      content: (
        <>
          If you share content confidentially, you can prevent saves, re-shares,
          screenshots, or any other form of unauthorized distribution.
          <div className="flex flex-row gap-4 my-5 justify-center">
            <img
              src="/images/share-choice-3.png"
              alt="Sharing options"
              className="w-[125px] sm:w-[170px] rounded-xl shadow-lg"
            />
          </div>
        </>
      ),
    },
    {
      icon: '🔥',
      title: 'Ability to Remove or Revoke',
      titleClass: 'text-red-400',
      content: (
        <>
          You can revoke access and remove all copies of any content you upload
          until you publish it.
        </>
      ),
    },
    // {
    //   icon: "🙋🏽",
    //   title: "Attribution from Gen AI",
    //   titleClass: "text-orange-300",
    //   content: (
    //     <>
    //       AI systems can integrate with our MCP server to prevent copyrights, IP infringements and attribution of generated media.
    //     </>
    //   ),
    // },
  ];

  // Embla setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false, // disable looping
    align: 'center',
    containScroll: false, // allow first/last to be centered
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const play = () => {
      if (!emblaApi) {
        return;
      }
      if (selectedIndex === carouselItems.length - 1) {
        emblaApi.scrollTo(0); // Go back to first card
      } else {
        emblaApi.scrollNext();
      }
    };
    autoPlayInterval.current = setInterval(play, 3500);
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [emblaApi, selectedIndex, carouselItems.length]);

  // Update selected index on scroll
  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Track whether we've initialized from emblaApi
  const [initializedApi, setInitializedApi] = useState<typeof emblaApi | null>(
    null
  );

  // Adjust state while rendering when emblaApi becomes available (recommended React pattern)
  if (emblaApi !== initializedApi) {
    setInitializedApi(emblaApi);
    if (emblaApi) {
      // Sync initial state from emblaApi
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Padding for centering first/last card: use px on container
  const slideClass =
    'embla__slide flex flex-col items-center justify-center rounded-3xl px-4 py-8 transition-all duration-150';

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10 pb-10">
      <div
        className="embla w-full overflow-x-hidden overflow-y-visible mb-10 pt-10 pb-10"
        ref={emblaRef}
      >
        <div className="embla__container flex px-[20vw] sm:px-[20vw] md:px-[25vw] gap-5">
          {carouselItems.map((item, idx) => {
            // Animate scale/shadow/opacity based on center
            const isCenter = idx === selectedIndex;
            const dist = Math.abs(idx - selectedIndex);
            const scale = isCenter ? 1.08 : dist === 1 ? 0.95 : 0.9;
            const opacity = isCenter ? 1 : dist === 1 ? 0.7 : 0.5;
            const shadow = isCenter
              ? '0 12px 48px 0 rgba(30, 60, 39, 0.32)'
              : '0 3px 12px 0 rgba(30, 60, 39, 0.12)';
            const bgClass = isCenter
              ? 'bg-white/15 backdrop-blur-xl'
              : 'bg-white/5 backdrop-blur-md';
            const zIndex = isCenter ? 10 : 1;
            return (
              <motion.div
                key={idx}
                className={
                  slideClass +
                  ` shrink-0 grow-0 basis-[80vw] sm:basis-[350px] md:basis-[400px] ${bgClass} flex flex-col items-center justify-center` // ensure vertical centering
                }
                style={{
                  boxShadow: shadow,
                  opacity,
                  scale,
                  zIndex,
                  margin: 0,
                  overflow: 'visible',
                }}
                animate={{ scale, opacity, boxShadow: shadow, zIndex }}
                transition={{
                  type: 'spring',
                  stiffness: 160,
                  damping: 24,
                  mass: 0.7,
                }}
              >
                <div className="flex flex-col items-center justify-center gap-8 w-full px-5">
                  <span className="text-5xl md:text-7xl mb-0 drop-shadow-lg">
                    {item.icon}
                  </span>
                  <h1
                    className={`text-center font-display text-2xl md:text-3xl font-bold tracking-[-0.02em] [text-wrap:balance] ${item.titleClass}`}
                  >
                    {item.title}
                  </h1>
                  <div className="text-center text-teal-100 text-sm md:text-base font-extralight mt-2">
                    {item.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Dots navigation */}
      <div className="flex gap-2 mt-4">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              selectedIndex === idx ? 'bg-purple-100' : 'bg-teal-200/40'
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            tabIndex={0}
            style={{ outline: 'none', border: 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesList;
