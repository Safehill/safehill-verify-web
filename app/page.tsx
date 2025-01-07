import { Suspense } from 'react';
import Navbar from '@/components/layout/navbar';
import ItemizedList from '@/components/home/ItemizedList';
import CenteredItems from '@/components/home/CenteredItems';
import BottomNav from '@/components/layout/bottomNav';
import { HandRaised } from '@/components/shared/icons';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

export default async function Home() {
  const steps = [
    {
      icon: null,
      title: 'Create your fingerprint',
      content: (
        <>
          <div className="flex flex-col sm:flex-row justify-start gap-4 my-10">
            <a
              href="https://apps.apple.com/us/app/snoog/id1624088867"
              className="flex-shrink-0"
            >
              <img
                src="/images/app-store.png"
                alt="App Store download"
                className="w-[180px] sm:w-[240px]"
              />
            </a>
            <a target="_blank" className="flex-shrink-0">
              <img
                src="/images/play-store.png"
                alt="Google Play Store download"
                className="w-[180px] sm:w-[240px]"
              />
            </a>
          </div>
          Use our app to create your personal fingerprint.
          <br />
          Your fingerprint is your digital identity, and as such it only exists
          on your devices. It is never sent to or stored on our servers.
        </>
      ),
    },
    {
      icon: null,
      title: 'Protect your assets',
      content: (
        <>
          Start adding your assets to your secure library.
          <br />
          For anything you add, we verify authenticity and make you the owner.
        </>
      ),
    },
    {
      icon: null,
      title: 'Let us worry about the rest',
      content: (
        <>
          Out of the box, you get:
          <br />
          <br />
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-green-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              💾 The most secure storage
            </h1>
            For your proprietary content. Our best-in-class security standards
            guarantee that <b className="text-green-300">NO-ONE</b> other than
            people with explicit access can ever decrypt confidential content.
            Not even Safehill.
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-pink-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              💼 Accurate controls for distribution
            </h1>{' '}
            If your content is confidential, you can decide to prevent
            re-shares, screenshots, etc. when sharing it privately.
            <div className="flex flex-col sm:flex-row gap-4 my-10">
              <img
                src="/images/share-choice-1.png"
                alt="Sharing options"
                className="w-[245px] rounded-xl shadow-lg"
              />
              <img
                src="/images/share-choice-2.png"
                alt="Sharing options"
                className="w-[245px] rounded-xl shadow-lg"
              />
            </div>
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-cyan-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              🔎 A way make your content traceable
            </h1>
            We fingerprint every piece of content so that we can determine if
            anything available online matches your content, even when it’s
            altered.
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-orange-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              🤖 Protection against AI-generated content
            </h1>
            Our simple yet powerful API protects proprietary data from being
            used for training AI models, and helps LLMs steer away from
            copyrights and IP infrigments.
          </div>
          <div className="bg-teal-300/5 px-5 py-3 rounded-xl mb-7 py-5">
            <h1 className="text-left text-yellow-300 [text-wrap:balance] text-xl md:text-2xl font-display mb-5">
              🙋🏽 A way to discover content credentials
            </h1>
            Assets’ history and ownership can be checked by anyone using our{' '}
            <Link
              href="/authenticate"
              className="font-bold underline text-orange-100 opacity-90"
            >
              authenticator tool
            </Link>
            .
          </div>
        </>
      ),
    },
  ];

  const whys = [
    {
      icon: '🧑‍🎨',
      title: 'Just focus on making great content',
      content: (
        <div>
          Spend less time worrying about protecting your valuable work, and more
          on what you do best: creating and sharing great content!
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
      content: (
        <div>
          Because you can control the distribution of your content and because
          of our high security standards, you are protected from any data or
          security breach, from either authorized or unauthorized access.
          <br />
          <br />
          Sharing password-protected links is a thing of the past!
        </div>
      ),
    },
    {
      icon: '🪄',
      title: 'Stop worrying about AI-generated content',
      content: (
        <div>
          We love AI generated images and videos!
          <br />
          <br />
          We love them even more when they can be used safely with no risk of
          infringing copyrights.
          {/* <br />
          <br />
          If AI regulations are the cure, we provide preventive care! */}
        </div>
      ),
    },
    {
      icon: '⏭',
      title: 'Increase your speed to market',
      content: (
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
            className="animate-fade-up bg-gradient-to-br from-yellow-100 to-purple-300 bg-clip-text text-center font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] px-6 sm:px-8 md:leading-[5.5rem] pb-4"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Do you know how your data is being used?
          </h1>
          <p
            className="mt-8 animate-fade-up text-center text-orange-300 opacity-0 [text-wrap:balance] text-2xl sm:text-2xl md:text-2xl font-bold px-2"
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
          >
            AI is everywhere, and it’s trained using your data, too!
          </p>

          <div>
            <p
              className="mt-8 animate-fade-up text-center text-gray-200 opacity-0 [text-wrap:balance] md:text-xl font-light px-2"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Effortlessly protect your IP from unintended use.
              <br />
              Stop worrying about breaches and AI-generated deepfakes.
            </p>
          </div>

          <div className="relative flex justify-center items-center sm:mt-10 md:mt-20 sm:mb-5 md:mb-20 px-4">
            <img
              className="w-full h-auto max-w-screen-md"
              style={{
                height: '600px',
              }}
              alt="home-glow-background"
              src="/images/aura.png"
            />

            <img
              className="absolute w-full sm:w-3/4 md:w-1/2 lg:w-auto h-auto max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg"
              style={{
                opacity: 0.9,
              }}
              src="/images/rafa-example-3.png"
              alt="Example asset tracking Nike & Rafa"
            />
          </div>

          <div id="download">
            <ItemizedList items={steps} />
          </div>

          <div className="z-10 w-full xl:px-20 pt-40 pb-20">
            <h1
              className="animate-fade-up bg-gradient-to-br from-white to-gray-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              Why use Safehill
            </h1>

            <div className="px-5 sm:px-8 md:px-20 lg:px-30 pt-10 pb-20">
              <p
                className="animate-fade-up bg-gradient-to-br from-white to-gray-500 bg-clip-text text-center text-base font-display tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-xl px-5 py-5"
                style={{
                  animationDelay: '0.15s',
                  animationFillMode: 'forwards',
                }}
              >
                Safehill protects and manages your digital content rights.
                <br />
                So you can focus on what’s more important.
              </p>
            </div>

            <CenteredItems items={whys} />
          </div>
        </div>
        <div className="flex flex-row z-10 w-full justify-center items-center my-40 px-2">
          <span className="px-4 py-2 text-white text-lg">
            Have any questions?
          </span>
          <Link
            href="https://tally.so/r/3qoGxg"
            className="px-6 py-2 bg-orange-100/80 font-display text-black text-base rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
          >
            Talk to us
          </Link>
        </div>
        <BottomNav />
      </main>
      <Footer darkTheme={true} />
    </>
  );
}
