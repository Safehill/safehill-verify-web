import { Suspense } from 'react';
import Navbar from '@/components/layout/navbar';
import ItemizedList from '@/components/home/ItemizedList';
import CenteredItems from '@/components/home/CenteredItems';

export default async function Home() {
  const steps = [
    {
      icon: null,
      title: 'Create your unique fingerprint',
      content: (
        <>
          Use our app to create your user’s fingerprint.
          <br />
          Because your fingerprint belongs only to you, it is never sent to or
          stored on any server.
          <div className="flex items-left mt-10">
            <a href="https://apps.apple.com/us/app/snoog/id1624088867">
              <img
                src="/images/app-stores.png"
                alt="App Store download"
                className="w-[240px] h-[90px] object-cover object-top mb-6"
              />
            </a>
            <a href="">
              <img
                src="/images/app-stores.png"
                alt="Google Play Store download"
                className="w-[240px] h-[90px] object-cover object-bottom mt-6"
              />
            </a>
          </div>
        </>
      ),
    },
    {
      icon: null,
      title: 'Protect your assets',
      content: (
        <>
          Start adding your assets to your dedicated secure store.
          <br />
          We make sure they are authentic and - if so - you become the official
          owner.
          <br />
          <br />
          Neither Safehill nor anyone other than you can decrypt your assets at
          this point. Their fingerprints are embedded in the content, and added
          it to our repository.
          <br />
          <br />
          Content that looks similar to yours will have a similar fingerprint.
        </>
      ),
    },
    {
      icon: null,
      title: 'Let us worry about the rest',
      content: (
        <>
          <h1 className="text-left text-green-300 [text-wrap:balance] md:text-2xl font-bold">
            Secure storage
          </h1>
          Our best-in-class security standards guarantee that <b>NO-ONE</b>{' '}
          other than people with explicit access can ever decrypt confidential
          assets. Not even Safehill.
          <h1 className="mt-8 text-left text-pink-300 [text-wrap:balance] md:text-2xl font-bold">
            Control over distribution
          </h1>{' '}
          You can prevent re-shares, screenshots, etc., leaving you in control.
          <div className="flex flex-row items-center gap-4 my-10 ml-10">
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
          <h1 className="mt-8 text-left text-cyan-300 [text-wrap:balance] md:text-2xl font-bold">
            Tracking
          </h1>
          We use asset fingerprints to track content and update its history,
          wherever it goes.
          <h1 className="mt-8 text-left text-orange-300 [text-wrap:balance] md:text-2xl font-bold">
            Monitoring
          </h1>
          We are alert on rights or privacy violations, and notify you when we
          think those have been breached.
          <h1 className="mt-8 text-left text-yellow-300 [text-wrap:balance] md:text-2xl font-bold">
            Transparency
          </h1>
          Assets’ history and ownership can be checked by anyone using our{' '}
          <a
            href="/authenticate"
            className="font-bold underline text-orange-100 opacity-90"
          >
            authentication tool
          </a>
          .
          <br />
        </>
      ),
    },
  ];

  const whys = [
    {
      icon: '🧑‍🎨',
      title: 'Focus on making great content, not on protecting it',
      content: (
        <div>
          Spend less time worrying about transfering high quality assets, and
          more on what you do best.
          <br />
          Creating great content and collaborating more.
          <br />
          <br />
          In the unlikely event someone uses content you own online, or AI
          generates content too similar to yours, you will be thankful you
          decided to be fully protected!
        </div>
      ),
    },
    {
      icon: '🔗',
      title: 'Collaborate more freely',
      content: (
        <div>
          Confidential shares let you fully control distribution of your
          content.
          <br />
          <br />
          Because of Safehill’s top-notch security standard,
          <br />
          you are protected from any breach happening via authorized or
          unauthorized access.
          <br />
          <br />
          It is time to forget those password protected links.
        </div>
      ),
    },
    // {
    //   icon: '⏭',
    //   title: 'Shorten your time to market',
    //   content: <div>TBD</div>,
    // },
  ];

  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-deepTeal to-mutedTeal" />
      <Suspense fallback="...">
        <Navbar darkTheme={true} />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center pt-32">
        <div className="z-10 w-full xl:px-20">
          <h1
            className="animate-fade-up bg-gradient-to-br from-purple-300 to-yellow-200 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-9xl py-10"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            ✋🏿
          </h1>
          <h1
            className="animate-fade-up bg-gradient-to-br from-white to-gray-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] px-5"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Do you know how your data is being used?
          </h1>
          <p
            className="mt-8 animate-fade-up text-center text-orange-300 opacity-0 [text-wrap:balance] md:text-2xl font-bold"
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
          >
            AI is everywhere, and it’s trained using your data, too!
          </p>

          <div>
            <p
              className="mt-8 animate-fade-up text-center text-gray-200 opacity-0 [text-wrap:balance] md:text-xl font-light"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              Effortlessly protect your content from unintended use.
              <br />
              Stop worrying about breaches or deepfakes.
            </p>
          </div>

          <div className="relative flex justify-center items-center mt-20 mb-40">
            <img
              className="w-full h-auto"
              style={{
                height: '600px',
                width: '100%',
                marginTop: '-50px', // Adjust this to control the overlap }}
              }}
              alt="home-glow-background"
              src="images/aura.png"
            />

            <img
              className="absolute max-w-full sm:w-3/4 md:w-1/2 lg:w-auto h-auto rounded-xl shadow-lg"
              style={{
                maxWidth: '420px',
                opacity: 0.9,
              }}
              src="/images/rafa-example-2.png"
              alt="Example asset tracking Nike & Rafa"
            />
          </div>

          <div
            style={{
              marginTop: '-100px', // Adjust this to control the overlap
            }}
          >
            <ItemizedList items={steps} />
          </div>

          <div className="z-10 w-full xl:px-20 py-40">
            <h1
              className="animate-fade-up bg-gradient-to-br from-white to-gray-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] px-5"
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              Why use Safehill
            </h1>

            <div>
              <p
                className="mt-8 mb-20 animate-fade-up text-center text-gray-200 opacity-0 [text-wrap:balance] md:text-xl font-light"
                style={{
                  animationDelay: '0.25s',
                  animationFillMode: 'forwards',
                }}
              >
                Safehill manages your digital content rights and attribution.
                <br />
                So you can focus on making great content.
              </p>
            </div>

            <CenteredItems items={whys} />
          </div>
        </div>
      </main>
    </>
  );
}
