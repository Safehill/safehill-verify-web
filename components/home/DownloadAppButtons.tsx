import React from "react";

export function DownloadAppButtons(props: { className: string; }) {
  return (
    <>
      <a
        href="https://apps.apple.com/us/app/snoog/id1624088867"
        className="flex-shrink-0"
      >
        <img
          src="/images/app-store.png"
          alt="App Store download"
          className={props.className}
        />
      </a>
      <a target="_blank" className="flex-shrink-0">
        <img
          src="/images/play-store.png"
          alt="Google Play Store download"
          className={props.className}
        />
      </a>
    </>
  )
}