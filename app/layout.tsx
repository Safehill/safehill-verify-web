import './globals.css';
import cx from 'classnames';
import { sfPro, inter } from './fonts';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
// import { ClerkProvider } from "@clerk/nextjs";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>

    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        {children}
        <VercelAnalytics />
      </body>
    </html>

    // <html lang="en">
    //   <body className={cx(sfPro.variable, inter.variable)}>
    //     <div className="fixed h-screen w-full bg-gradient-to-br from-deepTeal to-mutedTeal" />
    //     <Suspense fallback="...">
    //       <Navbar />
    //     </Suspense>
    //     <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
    //       {children}
    //     </main>
    //     <Footer />
    //     <VercelAnalytics />
    //   </body>
    // </html>
    // </ClerkProvider>
  );
}
