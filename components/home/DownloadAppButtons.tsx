import React from 'react';

export function DownloadAppButtons(props: { className: string }) {
  return (
    <>
      <a
        href="https://apps.apple.com/us/app/safehill/id6740229387"
        className="flex-shrink-0"
      >
        <img
          src="/images/app-store.png"
          alt="App Store download"
          className={props.className}
        />
      </a>
      <div className="relative flex-shrink-0 w-fit">
        <img
          src="/images/play-store.png"
          alt="Google Play Store download - Coming Soon"
          className={`${props.className} opacity-40 pointer-events-none cursor-not-allowed`}
        />
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
          Coming Soon
        </span>
      </div>
    </>
  );
}
