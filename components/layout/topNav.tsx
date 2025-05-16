'use client';

import React, {useState} from 'react';
import {Bars3Icon as MenuIcon, MagnifyingGlassIcon, XMarkIcon as XIcon,} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {CalendarDaysIcon} from "lucide-react";

export default function TopNav({ darkTheme }: { darkTheme: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Desktop Navigation */}
      <div className="hidden sm:flex justify-end items-center gap-4">
        {darkTheme && (
          <Link
            href="/authenticate"
            className="flex gap-2 px-6 py-2 bg-purple-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
          >
            Authenticator
            <MagnifyingGlassIcon className="w-5 h-5" />
          </Link>
        )}
        <Link
          href="https://tally.so/r/3qoGxg"
          className="flex gap-2 px-6 py-2 bg-yellow-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
        >
          Get in touch
          <CalendarDaysIcon className="w-5 h-5" />
        </Link>
        <Link
          href="/privacy"
          className={`px-2 py-2 bg-white/0 font-normal ${darkTheme ? "text-white" : "text-gray-600"} text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-white/100 hover:text-black`}
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className={`px-2 py-2 bg-white/0 font-normal ${darkTheme ? "text-white" : "text-gray-600"} text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-white/100 hover:text-black`}
        >
          Terms of Use
        </Link>
      </div>

      {/* Hamburger Menu */}
      <button
        className={
          darkTheme ? 'sm:hidden text-gray-200' : 'sm:hidden text-gray-600'
        }
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <XIcon className="h-8 w-8" />
        ) : (
          <MenuIcon className="h-8 w-8" />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } absolute top-16 left-0 w-full bg-black/90 backdrop-blur-xl text-white transition-all duration-50 ease-in-out overflow-hidden`}
      >
        <ul className="flex flex-col items-center text-center gap-2 py-4 px-4">
          <li className="w-full px-6 py-3 bg-purple-100 rounded-lg text-sm text-black font-normal shadow-md transition-all duration-50 hover:bg-purple-100/100 hover:text-gray-800">
            <Link href="/authenticate">Safehill Authenticator</Link>
          </li>
          <li className="w-full px-6 py-3 bg-yellow-100 rounded-lg text-sm text-black font-normal shadow-md transition-all duration-50 hover:bg-orange-100/100 hover:text-gray-800">
            <Link href="https://tally.so/r/3qoGxg">Get in touch</Link>
          </li>
          <li className="w-full px-6 py-3 bg-white/0 rounded-lg text-sm font-normal shadow-md transition-all duration-50 hover:bg-white/30">
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li className="w-full px-6 py-3 bg-white/0 rounded-lg text-sm font-normal shadow-md transition-all duration-50 hover:bg-white/30">
            <Link href="/terms">Terms of Use</Link>
          </li>
        </ul>
      </div>
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
  );
}
