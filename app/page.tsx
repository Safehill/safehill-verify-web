import React, {Suspense} from 'react';
import Navbar from '@/components/layout/navbar';
import ItemizedList from '@/components/home/ItemizedList';
import CenteredItems from '@/components/home/CenteredItems';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import {Item} from "@/components/home/ItemizedListProps";
import LineSeparator from "@/components/home/LineSeparator";
import {ArrowDownCircleIcon, ArrowRightCircleIcon, CalendarDaysIcon, FingerprintIcon} from "lucide-react";
import {DownloadAppButtons} from "@/components/home/DownloadAppButtons";
import SafehillAppLogo from "@/components/shared/SafehillAppLogo";
import {ImageCarousel} from "@/components/home/ImageCarousel";
import FeaturesList from '@/components/home/FeaturesList';
import TypewriterHeadline from '@/components/home/TypewriterHeadline';

export default function Home() {
  const steps: Item[] = [
    {
      icon: null,
      title: 'Create your fingerprint',
      mainContent: (
        <>
          Use our app on a mobile or desktop device to securely create
          <br />
          your or your company&apos;s fingerprint.
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-20">
          <SafehillAppLogo variant="large"/>
        </div>
      ),
      cta: (
        <div className="flex flex-col sm:flex-row justify-start gap-4 mt-10 mb-3">
          <DownloadAppButtons className="w-[160px] sm:w-[200px] transition-all duration-50 hover:scale-105"/>
        </div>
      )
    },
    {
      icon: null,
      title: 'Add it to your content',
      mainContent: (
        <>
          Start uploading content to our cloud via the app or our site. 
          <br />
          We authenticate it, secure it, and attach your fingerprint. Permanently.
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
      )
    },
    {
      icon: null,
      title: 'Let us worry about the rest',
      mainContent: (
        <>
          Once fingerprinted assets are in Safehill, you get peace of mind!
          <br />
          You get things like:
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
      )
    },
  ];

  const whys: Item[] = [
    {
      icon: '🧑‍🎨',
      title: 'Focus on making great content',
      mainContent: (
        <div>
          Spend less time worrying about protecting your valuable work, and more
          on what you do best:
          <br />
          creating and sharing your beautiful work!
          {/* <br />
          <br />
          Safehill will come to the rescue if copyrights are infringed, by
          either humans or AI. */}
        </div>
      ),
    },
    {
      icon: '🔗',
      title: 'Collaborate confidentially',
      mainContent: (
        <div>
          Because of our superior security standards
          <br />
          and the control over the distribution you get with Safehill,
          <br />
          you are protected from any data or security or copyright breach.
          <br />
          <br />
          Sharing password-protected links with your colleagues is a thing of the past!
        </div>
      ),
    },
    {
      icon: '🖋️',
      title: 'Get credit for your work',
      mainContent: (
        <div>
          We love AI generated images and videos!
          <br />
          <br />
          We love them even more if they can be used safely
          <br />while giving credits to the owner and not infringing copyrights.
          {/* <br />
          <br />
          If AI regulations are the cure, we provide preventive care! */}
        </div>
      ),
    },
    {
      icon: '⏭',
      title: 'Increase your speed to market',
      mainContent: (
        <div>
          We handle the complexities of distributing copyrighted content,
          <br />
          letting you focus on your core value proposition.
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-deepTeal to-mutedTeal min-w-800px" />
      <Suspense fallback="...">
        <Navbar darkTheme={true} withNavBar={true} currentPage="home"/>
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center pt-32">
        <div className="z-10 w-full">
          {/*<h1*/}
          {/*  className="animate-fade-up bg-gradient-to-br from-purple-300 to-yellow-200 bg-clip-text text-center font-display text-6xl md:text-9xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] py-10"*/}
          {/*  style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}*/}
          {/*>*/}
          {/*  <HandRaised*/}
          {/*    className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto bg-clip-text bg-gradient-to-br from-yellow-200 to-purple-300"*/}
          {/*    fill="url(#gradient)"*/}
          {/*    width="100%" // or a specific value like "200px"*/}
          {/*    height="100%" // or a specific value like "200px"*/}
          {/*  />*/}
          {/*  <svg width="0" height="0">*/}
          {/*    <defs>*/}
          {/*      <linearGradient*/}
          {/*        id="gradient"*/}
          {/*        x1="0%"*/}
          {/*        y1="0%"*/}
          {/*        x2="100%"*/}
          {/*        y2="100%"*/}
          {/*      >*/}
          {/*        <stop offset="0%" stopColor="#E9D8FD" /> /!* Purple-300 *!/*/}
          {/*        <stop offset="100%" stopColor="#FEF9C3" /> /!* Yellow-200 *!/*/}
          {/*      </linearGradient>*/}
          {/*    </defs>*/}
          {/*  </svg>*/}
          {/*</h1>*/}

          <h1
            className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-8xl md:text-9xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[5.5rem] pt-16 pb-20"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Yours. Truly.
          </h1>

          <div className="my-20">
            <ImageCarousel />
          </div>

          <div className="mt-20 px-10">
            <h1
              className="animate-fade-up bg-gradient-to-br from-purple-100 to-cyan-100 bg-clip-text text-center font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.01em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] leading-tight sm:leading-tight md:leading-[5rem] px-2 sm:px-4 md:px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              Fingerprint and protect your assets
            </h1>
            <p
              className="text-transparent bg-gradient-to-br from-teal-300/80 to-cyan-500/80 bg-clip-text text-center text-xl md:text-2xl font-light tracking-[-0.01em] px-2 mt-5"
            >
              from Security, IP and Copyright breaches
              <br />
              made by humans and AI
            </p>
            <div className="flex flex-row z-10 w-full justify-center items-center px-2 mt-20">
              <Link
                href="#howitworks"
                className="flex gap-2 px-6 py-2 bg-cyan-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-teal/80 hover:text-gray-800"
              >
                See how it works
                <ArrowDownCircleIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center mt-20 ">
            <div
              className="bg-white rounded-full p-2 shadow-md text-orange-500/80"
            >
              <FingerprintIcon size={86} />
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                  objectFit: "contain",
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
                  display: "block",
                  marginBottom: 0,
                }}
                src="/images/fingerprint-example.png"
                alt="Example of an asset fingerprint"
              />
            </div>
          </div>

          <div className="md:mt-20 mb-20 px-5">
            <div
              className="mt-4 animate-fade-up text-center text-teal-100/70 opacity-0 [text-wrap:balance] text-lg md:text-2xl font-light tracking-[-0.01em] py-10"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards', top: 0 }}
            >
              With true ownership over your content, you can …
            </div>
            {/* Typewriter effect for animated headline */}
            <TypewriterHeadline
              className="bg-gradient-to-br from-purple-100 to-orange-300 bg-clip-text text-center font-display text-5xl md:text-7xl font-bold text-transparent drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[4rem] pb-10"
              style={{}}
              strings={[
                "get credit<br />and royalties<br />from it.",
                "prevent<br />unauthorized<br />distribution<br />or leaks.",
                "share it while<br />retaining<br />control.",
                "prevent legal<br />battles over<br />copyrights<br />and IP.",
                "avoid<br />AI-generated<br />copyright <br />infringements."
              ]}
            />
          </div>

          <LineSeparator/>

          <div id="howitworks" className="z-10 w-full pt-40">
            <h1
              className="animate-fade-up bg-gradient-to-br from-purple-400 to-yellow-100 bg-clip-text text-center font-display text-7xl md:text-8xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              How it works
            </h1>
            <p
              className="animate-fade-up text-center text-purple-100 opacity-0 [text-wrap:balance] md:text-2xl font-base tracking-[-0.01em] px-5 pt-5 pb-20"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              As simple as downloading an app
            </p>

            <ItemizedList items={steps} />
            <FeaturesList />
          </div>

          <div className="my-20 px-5">
            <LineSeparator />
          </div>

          <div className="z-10 w-full xl:px-20 pt-20 pb-10 px-5">
            <h1
              className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-5xl md:text-7xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:leading-[5rem] px-5 pb-10"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              Why use Safehill
            </h1>

            <CenteredItems items={whys} />
          </div>
          <div className="my-10">
            <LineSeparator />
          </div>
        </div>

        <div className="z-10 w-full xl:px-20 pt-40">
          <h1
            className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-5xl md:text-7xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[4rem] pb-4"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Curious about the rights and history of an image?
          </h1>
          <div className="pb-20">
            <p
              className="mt-8 mb-5 animate-fade-up text-center text-purple-50 opacity-0 [text-wrap:balance] text-lg md:text-2xl font-light px-2"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Check out our{" "}
              <Link
                href="/authenticate"
                className="text-purple-100 opacity-90"
              >
                authenticator tool
              </Link>
              !
            </p>
            <div className="flex flex-row z-10 w-full justify-center items-center mb-20 px-2">
              <Link
                href="/authenticate"
                className="flex gap-2 px-6 py-2 bg-purple-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
              >
                Try it out now
                <ArrowRightCircleIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="my-10">
            <LineSeparator />
          </div>
        </div>

        <div className="flex flex-row z-10 w-full justify-center items-center my-20 px-2">
          <span className="px-4 py-2 text-purple-100 text-sm md:text-lg font-default">
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
