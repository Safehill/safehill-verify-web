'use client';

import Link from 'next/link';
import useScroll from '@/lib/hooks/use-scroll';
import TopNav from './topNav';

export default function NavBar({
  darkTheme,
  withNavBar,
  currentPage,
}: {
  darkTheme: boolean;
  withNavBar: boolean;
  currentPage: string;
}) {
  const scrolled = useScroll(50);

  return (
    <div
      className={`fixed top-0 flex w-full justify-center ${
        scrolled
          ? 'border-gray-800 bg-white/10 backdrop-blur-xl'
          : 'bg-white/0'
      } z-30 transition-all`}
    >
      <div className="ml-2 mr-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center font-display text-xl">
          <img
            src={
              darkTheme ? '/images/snoog-white.png' : '/images/snoog-black.png'
            }
            alt="Logo"
            className="w-[30px] object-cover object-top py-3 mx-2"
          />
          <p className={darkTheme ? 'text-white' : 'text-black'}>Safehill</p>
        </Link>

        {withNavBar ? <TopNav darkTheme={darkTheme} currentPage={currentPage}/> : <></>}
      </div>
    </div>
  );
}
