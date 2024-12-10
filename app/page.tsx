import Card from "@/components/home/card";
import { VERIFICATION_URL } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { nFormatter } from "@/lib/utils";

export default async function Home() {
  // const { stargazers_count: stars } = await fetch(
  //   "https://api.github.com/repos/steven-tey/precedent",
  //   {
  //     ...(process.env.GITHUB_OAUTH_TOKEN && {
  //       headers: {
  //         Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
  //         "Content-Type": "application/json",
  //       },
  //     }),
  //     // data will revalidate every 24 hours
  //     next: { revalidate: 86400 },
  //   },
  // )
  //   .then((res) => res.json())
  //   .catch((e) => console.log(e));

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Is this picture authentic?
        </h1>
        <p
          className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          In the sea of deepfakes and AI-generated media it's hard to tell what's authentic these days.
        </p>
        <p
          className="mt-8 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          With Safehill, you can match any image with our records to verify its provenance!
        </p>
        <div
          className="mx-auto mt-8 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <a
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-lg text-white transition-colors hover:bg-white hover:text-black"
            href={VERIFICATION_URL}
            // target="_blank"
            rel="noopener noreferrer"
          >
            <p>Give it a try!</p>
          </a>
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
            demo={
              title === "Beautiful, reusable components" ? (
                <ComponentGrid />
              ) : (
                demo
              )
            }
          />
        ))}
      </div>
    </>
  );
}

const features = [
  {
    title: "Public images",
    description:
      "Authenticated by famous brands and companies partnering with Safehill",
    demo: <WebVitals/>,
  },
  {
    title: "Total images",
    description:
      "Authenticated privately by anyone using Safehill",
    demo: (
      <div className="relative h-full w-full">
        <svg className="absolute inset-0 m-auto" viewBox="0 0 100 100" width="140" height="140">
          <circle strokeWidth="7" strokeDasharray="1px 1px" strokeLinecap="round" transform="rotate(-90 50 50)" cx="50" cy="50" r="45" fill="#211233" stroke="#211233" pathLength="1" strokeDashoffset="0px"></circle>
        </svg>
        <p className="absolute inset-0 mx-auto flex items-center justify-center font-display text-5xl text-green-500">1.2M</p>
        </div>
    )
  },
  {
    title: "Partner with us!",
    description:
      "[Get in touch](mailto:hi@safehill.io). Become a verified partner to authenticate public images!",
    demo: (
      <div className="relative h-full w-full">
        <svg className="absolute inset-0 m-auto" viewBox="0 0 100 100" width="140" height="140">
          <circle strokeWidth="7" strokeDasharray="1px 1px" strokeLinecap="round" transform="rotate(-90 50 50)" cx="50" cy="50" r="45" fill="#D4FF33" stroke="#D4FF33" pathLength="1" strokeDashoffset="0px"></circle>
        </svg>
        <p className="absolute inset-0 mx-auto flex items-center justify-center font-display text-5xl text-green-500">🤙</p>
      </div>
    ),
  }
];
