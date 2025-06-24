"use client";

import Card from '@/components/home/card';
import WebVitals from '@/components/home/web-vitals';
import {Button} from "@/components/shared/button";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function AuthenticatePage() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] text-4xl md:text-6xl leading-[3rem] md:leading-[5rem]"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          Is it authentic? Copyrighted?
        </h1>
        <p
          className="mt-8 animate-fade-up text-center text-gray-600 opacity-0 [text-wrap:balance] md:text-lg font-light"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          In the sea of deepfakes and AI-generated media it’s hard to tell what
          is authentic and who owns what these days.
        </p>
        <p
          className="mt-8 animate-fade-up text-center text-gray-600 opacity-0 [text-wrap:balance] md:text-lg font-light"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          With Safehill, you can match any image against our repository of
          fingerprinted assets to verify its history!
        </p>
        <div
          className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 py-10 opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <Link href="/verify">
            <Button>
              Give it a try
            </Button>
          </Link>
        </div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={demo}
          />
        ))}
      </div>
    </>
  );
}

const features = [
  {
    title: 'Public images',
    description:
      'Authenticated by companies partnering with Safehill',
    demo: <WebVitals />,
  },
  {
    title: 'Total images',
    description: 'Authenticated privately by anyone using Safehill',
    demo: (
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 m-auto"
          viewBox="0 0 100 100"
          width="140"
          height="140"
        >
          <circle
            strokeWidth="7"
            strokeDasharray="1px 1px"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            cx="50"
            cy="50"
            r="45"
            fill="#211233"
            stroke="#211233"
            pathLength="1"
            strokeDashoffset="0px"
          ></circle>
        </svg>
        <p className="absolute inset-0 mx-auto flex items-center justify-center font-display text-5xl text-green-500">
          1.2M
        </p>
      </div>
    ),
  },
  {
    title: 'Partner with us!',
    description:
      '[Get in touch](mailto:hi@safehill.io). Become a verified partner to authenticate your images!',
    demo: (
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 m-auto"
          viewBox="0 0 100 100"
          width="140"
          height="140"
        >
          <circle
            strokeWidth="7"
            strokeDasharray="1px 1px"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            cx="50"
            cy="50"
            r="45"
            fill="#D4FF33"
            stroke="#D4FF33"
            pathLength="1"
            strokeDashoffset="0px"
          ></circle>
        </svg>
        <p className="absolute inset-0 mx-auto flex items-center justify-center font-display text-5xl text-green-500">
          🤙
        </p>
      </div>
    ),
  },
];
