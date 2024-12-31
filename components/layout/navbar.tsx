'use client';

import Image from 'next/image';
import Link from 'next/link';
import useScroll from '@/lib/hooks/use-scroll';
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from 'lucide-react';

export default function NavBar({ darkTheme }: { darkTheme: boolean }) {
  const scrolled = useScroll(50);

  return (
    <>
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? 'border-b border-gray-800 bg-white/10 backdrop-blur-xl'
            : 'bg-white/0'
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center font-display text-2xl">
            <img
              src={
                darkTheme
                  ? '/images/snoog-white.png'
                  : '/images/snoog-black.png'
              }
              alt="Logo"
              className="w-[35px] object-cover object-top py-5 mx-3 shadow-lg"
            />
            <p className={darkTheme ? 'text-white' : 'text-black'}>Safehill</p>
          </Link>
          {/* <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Dashboard"
                  labelIcon={<LayoutDashboard className="h-4 w-4" />}
                  href="/"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn> */}
        </div>
      </div>
    </>
  );
}
