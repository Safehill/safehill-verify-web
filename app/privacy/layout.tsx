import '../globals.css';
import { Suspense } from 'react';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <Suspense fallback="...">
        <Navbar darkTheme={false} withNavBar={false} currentPage="privacy" />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <Footer darkTheme={false} />
    </>
  );
}
