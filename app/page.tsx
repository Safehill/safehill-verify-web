import React, {Suspense} from 'react';
import Navbar from '@/components/layout/navbar';
import ItemizedList from '@/components/home/ItemizedList';
import CenteredItems from '@/components/home/CenteredItems';
import {HandRaised} from '@/components/shared/icons';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import {Item} from "@/components/home/ItemizedListProps";
import LineSeparator from "@/components/home/LineSeparator";
import {ArrowRightCircleIcon, CalendarDaysIcon} from "lucide-react";
import {DownloadAppButtons} from "@/components/home/DownloadAppButtons";

export default function Home() {
  const steps: Item[] = [
    {
      icon: null,
      title: 'Create your fingerprint',
      mainContent: (
        <>
          Use your personal mobile device to create your fingerprint on the Safehill app
          <div className="flex flex-col sm:flex-row justify-start gap-4 mt-10 mb-3">
            <DownloadAppButtons className="w-[160px] sm:w-[200px]"/>
          </div>
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-20">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/images/safehill-app-logo-2.png"
              alt={`Image at /images/safehill-app-logo.png`}
              className="w-80 object-cover"
            />
          </div>
        </div>
      )
    },
    {
      icon: null,
      title: 'Add your fingerprint to your content',
      mainContent: (
        <>
          Simply upload your content to the Safehill cloud.
          <br />
          We will authenticate it and attach a permanent fingerprint to your content.
        </>
      ),
      sideContent: (
        <div className="pl-20 pb-32">
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
          Once fingerprinted assets are in Safehill, you get:
          <br />
          <br />
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-cyan-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              🏦 &nbsp; The most secure vault
            </h1>
            Our best-in-class security standards
            guarantee that <b className="text-cyan-300">NO-ONE</b> other than
            people with explicit access can ever decrypt your content or use it for AI training.
            Not even Safehill.
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-yellow-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              💼 &nbsp; The best controls for distribution
            </h1>{' '}
            If you share content confidentially, you can prevent
            re-shares, screenshots, or any form or redistribution
            <div className="flex flex-col sm:flex-row gap-4 my-10">
              <img
                src="/images/share-choice-3.png"
                alt="Sharing options"
                className="w-[245px] rounded-xl shadow-lg"
              />
              <img
                src="/images/share-choice-4.png"
                alt="Sharing options"
                className="w-[245px] rounded-xl shadow-lg"
              />
            </div>
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-red-400 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              ❌️ &nbsp; The ability to remove all copies
            </h1>{' '}
            You can revoke access and remove all copies of the content you previously shared
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-purple-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              🧬 &nbsp; Traceability
            </h1>
            Fingerprints, not content, can be use to detect misuse, even if the content is altered
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-orange-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              🙋🏽 &nbsp; Attribution from Gen AI
            </h1>
            Generative AI system integrate with Safehill to avoid copyrights and IP infringements
          </div>
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
      icon: '🪄',
      title: 'Stop worrying about AI-generated content',
      mainContent: (
        <div>
          We love AI generated images and videos!
          <br />
          <br />
          We love them even more when we know they can be used safely
          <br />without infringing copyrights.
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
          We handle the complexities of distributing copyrighted content on the
          web,
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
        <Navbar darkTheme={true} withNavBar={true} />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center pt-32">
        <div className="z-10 w-full xl:px-20">
          <h1
            className="animate-fade-up bg-gradient-to-br from-purple-300 to-yellow-200 bg-clip-text text-center font-display text-6xl md:text-9xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] py-10"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            <HandRaised
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto bg-clip-text bg-gradient-to-br from-yellow-200 to-purple-300"
              fill="url(#gradient)"
              width="100%" // or a specific value like "200px"
              height="100%" // or a specific value like "200px"
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#E9D8FD" /> {/* Purple-300 */}
                  <stop offset="100%" stopColor="#FEF9C3" /> {/* Yellow-200 */}
                </linearGradient>
              </defs>
            </svg>
          </h1>

          <h1
            className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[5.5rem] pt-16 pb-8"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Yours. Truly.
          </h1>

          <div className="md:mt-32">
            <p
              className="mt-8 animate-fade-up text-center text-orange-200 opacity-0 [text-wrap:balance] md:text-3xl font-display px-2"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Effortlessly protect your digital property from unintended use
            </p>
            <p
              className="mt-4 animate-fade-up text-center text-purple-100 opacity-0 [text-wrap:balance] md:text-2xl font-extralight px-2"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Stop worrying about <span className="font-bold">security and copyright breaches</span>
              <br />
              made by humans and AI
            </p>
          </div>

          <div className="relative flex justify-center items-center sm:mt-10 md:mt-20 sm:mb-5 md:mb-20 px-4">
            <img
              className="w-full h-auto max-w-screen-md"
              style={{
                height: '900px',
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

          <div id="download" className="z-10 w-full xl:px-20 pt-10">
            <h1
              className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-5xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              How does it work?
            </h1>
            <p
              className="animate-fade-up text-center text-purple-100 opacity-0 [text-wrap:balance] md:text-2xl font-extralight px-2 pt-5 pb-20"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              3 simple steps
            </p>
            <ItemizedList items={steps} />
          </div>

          <div className="my-10">
            <LineSeparator />
          </div>

          <div className="z-10 w-full xl:px-20 pt-20 pb-10">
            <h1
              className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              Why use Safehill
            </h1>

            <div className="px-5 sm:px-8 md:px-20 lg:px-30 pt-10 pb-5">
              <p
                className="mt-8 mb-20 animate-fade-up text-center text-purple-50 opacity-0 [text-wrap:balance] md:text-2xl font-light px-2"
                style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
              >
                Safehill protects and manages your digital content and its
                rights.
                <br />
                So you can focus on what’s more important.
              </p>
            </div>

            <CenteredItems items={whys} />
          </div>
          <div className="my-10">
            <LineSeparator />
          </div>
        </div>

        <div className="z-10 w-full xl:px-20 pt-40">
          <h1
            className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-3xl sm:text-2xl md:text-5xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[4rem] pb-4"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Want to know if an image is copyrighted?
          </h1>
          <div className="pb-20">
            <p
              className="mt-8 mb-5 animate-fade-up text-center text-purple-50 opacity-0 [text-wrap:balance] md:text-2xl font-light px-2"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Use our{" "}
              <Link
                href="/authenticate"
                className="font-bold text-purple-100 opacity-90"
              >
                authenticator tool
              </Link>
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

        <div className="flex flex-row z-10 w-full justify-center items-center mb-40 px-2">
          <span className="px-4 py-2 text-purple-100 text-lg font-default">
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
