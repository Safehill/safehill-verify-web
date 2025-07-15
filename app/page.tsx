import React, {Suspense} from 'react';
import Navbar from '@/components/layout/navbar';
import ItemizedList from '@/components/home/ItemizedList';
import CenteredItems from '@/components/home/CenteredItems';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import {Item} from "@/components/home/ItemizedListProps";
import LineSeparator from "@/components/home/LineSeparator";
import {ArrowDownCircleIcon, ArrowRightCircleIcon, CalendarDaysIcon} from "lucide-react";
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
          your or your company's fingerprint.
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
          Start uploading content to our cloud.
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
      <div className="fixed h-screen w-full bg-gradient-to-br from-deepTeal to-mutedTeal" />
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
            className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-8xl md:text-9xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[5.5rem] pt-16 pb-32"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Yours. Truly.
          </h1>

          <ImageCarousel />

          <div className="mt-20">
            <p
              className="mt-8 text-center bg-gradient-to-br from-purple-100 to-orange-300 text-transparent bg-clip-text [text-wrap:balance] text-4xl md:text-5xl font-semibold px-2"
            >
              Safehill protects you and your assets
            </p>
            <p
              className="mt-4 text-center text-orange-200 [text-wrap:balance] text-2xl md:text-3xl font-extralight px-2"
            >
              from Security, IP and Copyright breaches
              <br />
              made by humans and AI
            </p>
            <div className="flex flex-row z-10 w-full justify-center items-center px-2 mt-20">
              <Link
                href="#howitworks"
                className="flex gap-2 px-6 py-2 bg-purple-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
              >
                See how it works
                <ArrowDownCircleIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center sm:mt-10 md:mt-20 sm:mb-5 md:mb-20 px-4">
            <img
              className="w-full h-auto max-w-screen-md"
              style={{
                height: '800px',
              }}
              alt="home-glow-background"
              src="/images/aura.png"
            />

            <img
              className="absolute w-full sm:w-3/4 md:w-1/2 lg:w-auto h-auto max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg"
              style={{
                opacity: 0.9,
              }}
              src="/images/fingerprint-example.png"
              alt="Example of an asset fingerprint"
            />
          </div>

          <div className="md:mt-20 mb-20">
            <div
              className="mt-4 animate-fade-up text-center text-purple-100 opacity-0 [text-wrap:balance] text-xl md:text-2xl font-extralight px-2 pb-10"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              With true ownership over your work, you can …
            </div>
            {/* Typewriter effect for animated headline */}
            <TypewriterHeadline
              className="bg-gradient-to-br from-purple-100 to-orange-300 bg-clip-text text-center font-display text-5xl md:text-7xl font-bold text-transparent drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[4rem] pb-4"
              style={{ height: '300px' }}
              strings={[
                "Get credit<br />and monetize<br />from it.",
                "Prevent unauthorized<br />distribution<br />or leaks.",
                "Share it while<br />retaining control.",
                "Prevent legal<br />battles over<br />copyrights and IP.",
                "Avoid AI-generated<br />copyright infringements."
              ]}
            />
          </div>

          <div className="md:mt-20 mb-20"></div>

          <LineSeparator/>

          <div id="howitworks" className="z-10 w-full xl:px-20 pt-40">
            <h1
              className="animate-fade-up bg-gradient-to-br from-teal-100 to-yellow-300 bg-clip-text text-center font-display text-7xl md:text-8xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              How it works
            </h1>
            <p
              className="animate-fade-up text-center text-yellow-100 opacity-0 [text-wrap:balance] md:text-2xl font-extralight px-2 pt-5 pb-20"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              As simple as downloading an app
            </p>

            <ItemizedList items={steps} />
            <FeaturesList />
          </div>

          <div className="my-20">
            <LineSeparator />
          </div>

          <div className="z-10 w-full xl:px-20 pt-20 pb-10">
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
