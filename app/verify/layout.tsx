import '../globals.css';
import React, {Suspense} from 'react';
import Navbar from '@/components/layout/navbar';
import {Toaster} from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster />
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <Suspense fallback="...">
        <Navbar darkTheme={false} withNavBar={false} />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
