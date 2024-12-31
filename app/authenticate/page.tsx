import Card from '@/components/home/card';
import { VERIFICATION_URL } from '@/lib/constants';
import WebVitals from '@/components/home/web-vitals';
import { nFormatter } from '@/lib/utils';
import Link from 'next/link';

export default async function AuthenticatePage() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          Is it authentic?
        </h1>
        <p
          className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl font-light"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          In the sea of deepfakes and AI-generated media it’s hard to tell what
          is authentic and who owns what these days.
        </p>
        <p
          className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl font-light"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          With Safehill, you can match any image against our repository of
          fingerprinted assets to verify its provenance!
        </p>
        <div
          className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 py-10 opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <Link
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
            href="/verify"
          >
            <p>Give it a try</p>
          </Link>
          {/* <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href="https://github.com/steven-tey/precedent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>
              <span className="hidden sm:inline-block">Star on</span> GitHub{" "}
              <span className="font-semibold">{nFormatter(stars)}</span>
            </p>
          </a> */}
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
      'Authenticated by famous brands and companies partnering with Safehill',
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
