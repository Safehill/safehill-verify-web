'use client';

import React, {useState} from 'react';
import {Bars3Icon as MenuIcon, MagnifyingGlassIcon, XMarkIcon as XIcon,} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {CalendarDaysIcon, LogInIcon} from "lucide-react";

export default function TopNav({ darkTheme, currentPage }: { darkTheme: boolean, currentPage: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Desktop Navigation */}
      <div className="hidden sm:flex justify-end items-center gap-2">
        {currentPage === "home" && (
          <Link
            href="/authenticate"
            className="flex gap-2 px-4 py-2 bg-purple-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
          >
            Authenticator
            <MagnifyingGlassIcon className="w-5 h-5" />
          </Link>
        )}
        {currentPage === "home" && (
          <Link
            href="https://tally.so/r/3qoGxg"
            className="flex gap-2 px-4 py-2 bg-yellow-100 /80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg hover:bg-orange/80 hover:text-gray-800"
          >
            Get in touch
            <CalendarDaysIcon className="w-5 h-5" />
          </Link>
        )}
        {currentPage !== "login" && (
          <Link
            href="/login"
            className={`flex gap-2 px-4 py-2 bg-white/0 font-normal ${darkTheme ? "text-white" : "text-gray-800"} text-sm rounded-lg transform transition-all duration-100 hover:scale-105 hover:shadow-lg ${darkTheme ? "hover:bg-white/20" : "hover:bg-primary hover:text-white"}`}
          >
            Sign in
            <LogInIcon className="w-5 h-5" />
          </Link>
        )}
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
        } absolute top-16 left-0 w-full bg-gradient-to-b from-deepTeal to-mutedTeal/90 backdrop-blur-xl text-white transition-all duration-50 ease-in-out overflow-hidden md:opacity-0`}
      >
        <ul className="flex flex-col items-center text-center gap-2 py-4 px-4">
          {currentPage === "home" && (
            <li className="w-full px-6 py-3 bg-purple-100 rounded-lg text-sm text-black font-normal shadow-md transition-all duration-50 hover:bg-purple-100/100 hover:text-gray-800">
              <Link
                href="/authenticate"
                className="flex items-center justify-center gap-x-2"
              >
                Authenticator
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Link>
            </li>
          )}
          {currentPage === "home" && (
            <li className="w-full px-6 py-3 bg-yellow-100 rounded-lg text-sm text-black font-normal shadow-md transition-all duration-50 hover:bg-orange-100/100 hover:text-gray-800">
              <Link
                href="https://tally.so/r/3qoGxg"
                className="flex items-center justify-center gap-x-2"
              >
                Get in touch
                <CalendarDaysIcon className="w-5 h-5" />
              </Link>
            </li>
          )}
          {currentPage !== "login" && (
            <li className="w-full px-6 py-3 rounded-lg text-sm font-normal hover:shadow-md transition-all duration-50 hover:bg-white/30">
              <Link href="/login">Sign in</Link>
            </li>
          )}
          <li className="w-full px-6 py-3 rounded-lg text-sm font-normal hover:shadow-md transition-all duration-50 hover:bg-white/30">
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li className="w-full px-6 py-3 rounded-lg text-sm font-normal hover:shadow-md transition-all duration-50 hover:bg-white/30">
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
