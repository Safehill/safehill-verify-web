import { DownloadAppButtons } from '@/components/home/DownloadAppButtons';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import FeaturesList from '@/components/home/FeaturesList';
import { ImageCarousel } from '@/components/home/ImageCarousel';
import ItemizedList from '@/components/home/ItemizedList';
import type { Item } from '@/components/home/ItemizedListProps';
import LineSeparator from '@/components/home/LineSeparator';
import TypewriterHeadline from '@/components/home/TypewriterHeadline';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import SafehillAppLogo from '@/components/shared/SafehillAppLogo';
import TabView from '@/components/shared/TabView';
import {
  // ArrowDownCircleIcon,
  ArrowRightCircleIcon,
  CalendarDaysIcon,
  FingerprintIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  const steps: Item[] = [
    {
      icon: null,
      title: 'Create an Account',
      mainContent: (
        <>
          Use our app on a mobile or desktop device to securely create
          <br />
          your or your company&apos;s account.
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-20">
          <SafehillAppLogo variant="large" />
        </div>
      ),
      cta: (
        <div className="flex flex-col sm:flex-row justify-start gap-4 mt-10 mb-3">
          <DownloadAppButtons className="w-[160px] sm:w-[200px] transition-all duration-50 hover:scale-105" />
        </div>
      ),
    },
    {
      icon: null,
      title: 'Add Your Content',
      mainContent: (
        <>
          Add your content to a Collection via the web app or on a mobile
          device.
          <br />
          We authenticate it, secure it, and fingerprint it.
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-28">
          <img
            src="/images/fingerprint.png"
            alt={`Image at /images/fingerprint.png`}
            className="w-full h-auto object-cover"
          />
        </div>
      ),
    },
    {
      icon: null,
      title: 'Distribute and Sell with Peace of Mind',
      mainContent: (
        <>
          Change visibility, pricing and target audience for the collection.
          <br />
          Decide who can see its content, and whether they can re-distribute it.
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-28">
          <img
            src="/images/share-check.png"
            alt={`Image at /images/fingerprint.png`}
            className="w-full h-auto object-cover"
          />
        </div>
      ),
    },
    {
      icon: null,
      title: 'Let Us Worry About the Rest',
      mainContent: (
        <>
          Once fingerprinted assets are in Safehill, you get:
          <br />
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-20">
          <img
            src="/images/umbrella.png"
            alt={`Image at /images/umbrella.png`}
            className="w-full h-auto object-cover"
          />
        </div>
      ),
    },
  ];

  const fingerprintFeatures = [
    {
      icon: '🫆',
      title: 'Give you ownership',
      description:
        "Over your content. We extract your content's unique features and link them to fingerprints, in a way that is resilient to tampering and alterations",
    },
    {
      icon: '⛓️',
      title: 'Trace Access',
      description:
        'Similarly to "blockchains", we verify and record content access in the network. Like living fingerprints on something you touch.',
    },
    {
      icon: '🔍',
      title: 'Detect misuse',
      description:
        'We look for copies of your content on the wide web using its unique features and figerprints attached',
    },
    {
      icon: '🛡️',
      title: 'Keep your content private',
      description:
        'Our technology works without ever accessing the content itself. EVER.',
    },
  ];

  const whySafehillFeatures = [
    {
      icon: '🔗',
      title: 'Collaborate Confidentially',
      description:
        'Because of our superior security standards and distribution controls, you are protected from data, security and copyright breaches',
    },
    {
      icon: '🧑‍🎨',
      title: 'Focus just on your Content',
      description:
        'Spend less time and money worrying about protecting your valuable work, and more on what you do best: creating and sharing your masterpieces.',
    },
    {
      icon: '＄🫆',
      title: 'Get Credit and Royalties',
      description:
        'Whether it is AI generated or plain copied by humans, we warn you if anything trending is too similar to what you claimed and can be considered a breach.',
    },
    {
      icon: '💼',
      title: 'Help your Legal Team',
      description:
        "With proof of ownership and traceability, you prevent IP and copyright battles. Make your Legal team's work easy",
    },
  ];

  const whyTabs = [
    {
      id: 'why-safehill',
      label: 'Why Safehill',
      gradient: 'linear-gradient(135deg,rgb(191, 146, 233),rgb(242, 121, 224))',
      content: (
        <div>
          <h1
            className="animate-fade-up bg-gradient-to-br from-purple-600 to-yellow-100 bg-clip-text text-center font-display text-5xl md:text-6xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:leading-[5rem] px-5 mb-10"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Why use Safehill?
          </h1>

          <p className="text-center text-xl md:text-2xl font-light tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mb-10">
            It&apos;s the tool you&apos;ve been waiting for to protect, share
            and monetize your work
            <br />
            &nbsp;
          </p>

          <FeaturesGrid items={whySafehillFeatures} />
        </div>
      ),
    },
    {
      id: 'fingerprint',
      label: 'Fingerprints',
      gradient: 'linear-gradient(135deg,rgb(230, 195, 89),rgb(148, 214, 122))',
      content: (
        <div>
          <h1
            className="animate-fade-up bg-gradient-to-br from-yellow-300 to-yellow-100 bg-clip-text text-center font-display text-5xl md:text-6xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:leading-[5rem] px-5 mb-10"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            What&apos;s a Fingerprint?
          </h1>

          <p className="text-center text-xl md:text-2xl font-light tracking-[-0.01em] bg-gradient-to-br from-yellow-100/90 to-cyan-200/60 bg-clip-text text-transparent mb-10">
            It&apos;s a cryptographically-secure and verifiable representation
            of
            <br />
            your content and its accessors.
            <br />
            <br />
            Fingerprints let us …
          </p>

          <FeaturesGrid items={fingerprintFeatures} />
        </div>
      ),
    },
    {
      id: 'authenticator',
      label: 'Image Authentication',
      gradient: 'linear-gradient(135deg,rgb(119, 167, 243),rgb(193, 131, 251))',
      content: (
        <div>
          <h1
            className="animate-fade-up bg-gradient-to-br from-cyan-100 to-purple-300 bg-clip-text text-center font-display text-5xl md:text-7xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[4rem] pb-4"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Curious about
            <br /> the rights and history
            <br />
            of an image?
          </h1>
          <div>
            <p
              className="mt-8 mb-5 animate-fade-up text-center text-purple-200 opacity-0 [text-wrap:balance] text-lg md:text-2xl font-light px-2"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Check out our{' '}
              <Link href="/authenticate">tool for authenticating content</Link>!
            </p>
            <div className="flex flex-row z-10 w-full justify-center items-center px-2">
              <Link
                href="/authenticate"
                className="flex gap-2 px-6 py-2 bg-purple-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
              >
                Try it out now
                <ArrowRightCircleIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-deepTeal to-mutedTeal min-w-800px" />
      <Suspense fallback="...">
        <Navbar darkTheme={true} withNavBar={true} currentPage="home" />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center pt-32">
        <div className="z-10 w-full">
          <h1
            className="animate-fade-up bg-gradient-to-br from-orange-300 to-purple-100 bg-clip-text text-center font-display text-8xl md:text-9xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 pt-16 pb-10"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Yours.
            <br />
            Truly.
          </h1>

          <div className="my-20">
            <ImageCarousel />
          </div>

          <p className="text-transparent bg-gradient-to-br from-orange-100 to-red-100 bg-clip-text text-center text-lg sm:text-lg md:text-2xl font-light tracking-[-0.01em] px-2 md:mt-10">
            Distributing your digital content means losing control over
          </p>
          <h1
            className="animate-fade-up bg-gradient-to-br from-red-100 to-red-400 bg-clip-text text-center font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-transparent opacity-0 drop-shadow-lg [text-wrap:balance] leading-tight sm:leading-tight md:leading-tight px-2 sm:px-4 md:px-5 mt-10 mb-20"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Confidentiality,
            <br />
            IP and Copyrights,
            <br />
            Reputation and
            <br />
            Royalties.
          </h1>

          <LineSeparator />

          <div className="mt-20 px-10">
            <h1
              className="animate-fade-up bg-gradient-to-br from-red-200 to-cyan-100 bg-clip-text text-center font-display text-6xl sm:text-6xl font-bold tracking-[-0.01em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] leading-tight sm:leading-tight md:leading-[5rem] px-2 sm:px-4 md:px-5 mb-10"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              But what if you can keep control?
            </h1>
            <p className="text-transparent bg-gradient-to-br from-cyan-100 to-purple-100 bg-clip-text text-center text-xl md:text-2xl font-light tracking-[-0.01em] px-2 mt-5 mb-20">
              Via <b>Fingerprints</b>, when your content travels you can follow.
            </p>
          </div>

          {/*<div className="mt-20 px-10">*/}
          {/*  <div className="flex flex-row z-10 w-full justify-center items-center px-2 mt-10 mb-20">*/}
          {/*    <Link*/}
          {/*      href="#howitworks"*/}
          {/*      className="flex gap-2 px-6 py-2 bg-cyan-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-teal/80 hover:text-gray-800"*/}
          {/*    >*/}
          {/*      How does it work?*/}
          {/*      <ArrowDownCircleIcon className="w-5 h-5" />*/}
          {/*    </Link>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="flex flex-row justify-center items-center mt-20 ">
            <div className="bg-white rounded-full p-2 shadow-md text-cyan-800/80">
              <FingerprintIcon size={86} />
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <svg
              width="48"
              height="28"
              viewBox="0 0 48 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon points="24,4 44,28 4,28" fill="#17191c" />
            </svg>
          </div>

          {/* Overlapping images: fingerprint anchored to top, aura below in z-axis */}
          <div className="flex flex-col items-center justify-center w-full sm:mb-5 md:mb-20 px-5">
            <div className="relative flex flex-col items-center justify-start w-fit">
              {/* The aura is below the fingerprint in z-axis, but visually behind */}
              <img
                className="absolute inset-0 w-full h-full max-w-xs sm:max-w-sm md:max-w-md pointer-events-none select-none"
                style={{
                  zIndex: 0,
                  objectFit: 'contain',
                  // The aura is centered and fills the container, but is behind
                }}
                src="/images/aura.png"
                alt="home-glow-background"
                aria-hidden="true"
              />
              {/* The fingerprint is anchored to the top and above the aura */}
              <img
                className="relative block h-auto max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg z-10"
                style={{
                  zIndex: 1,
                  display: 'block',
                  marginBottom: 0,
                }}
                src="/images/fingerprint-example.png"
                alt="Example of an asset fingerprint"
              />
            </div>
          </div>

          <div className="md:mt-20 mb-20 px-5">
            <p className="text-transparent bg-gradient-to-br from-purple-100 to-orange-100 bg-clip-text text-center text-xl md:text-2xl font-light tracking-[-0.01em] px-2 mt-5 mb-20">
              And with true ownership over your content, you can …
            </p>
            {/* Typewriter effect for animated headline */}
            <TypewriterHeadline
              className="bg-gradient-to-br from-purple-100 to-orange-300 bg-clip-text text-center font-display text-5xl md:text-7xl font-bold text-transparent drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[4rem] pb-10"
              style={{}}
              strings={[
                'get proper <br />credit and<br />royalties<br />from it.',
                'prevent<br />unauthorized<br />distribution<br />or leaks.',
                'revoke rights<br />as needed.',
                'prevent and aid<br />legal battles<br />over IP and<br />copyrights.',
                'avoid<br />AI-generated<br />copyright <br />infringements.',
              ]}
            />
          </div>

          <div className="my-20 px-5">
            <LineSeparator />
          </div>

          <div className="z-10 w-full xl:px-20 pb-20 px-5">
            <TabView tabs={whyTabs} defaultTab="why-safehill" />
          </div>

          <div className="my-10">
            <LineSeparator />
          </div>

          <div id="howitworks" className="z-10 w-full pt-40">
            <h1
              className="animate-fade-up bg-gradient-to-br from-purple-300 to-cyan-100 bg-clip-text text-center font-display text-7xl md:text-8xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              How it works
            </h1>
            <p
              className="animate-fade-up text-center text-teal-100 opacity-0 [text-wrap:balance] text-lg md:text-2xl font-light tracking-[-0.01em] px-5 pt-5 pb-20"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              It&apos;s easier than you think
            </p>

            <ItemizedList items={steps} />
            <FeaturesList />
          </div>
          <div className="my-10">
            <LineSeparator />
          </div>
        </div>

        <div className="flex flex-row z-10 w-full justify-center items-center my-20 px-2">
          <span className="px-4 py-2 text-orange-50 text-lg md:text-xl font-semibold tracking-[-0.01em]">
            Still have questions?
          </span>
          <Link
            href="https://tally.so/r/3qoGxg"
            className="flex gap-2 px-6 py-2 bg-yellow-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
          >
            Get in touch
            <CalendarDaysIcon className="w-5 h-5" />
          </Link>
        </div>
      </main>
      <Footer darkTheme={true} />
    </>
  );
}
