import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/navbar";
// import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Is this picture authentic?",
  description:
    "In the sea of deepfakes and AI-generated media it's hard to tell what's authentic these days. If someone has claimed rights to a picture we'll be able to tell its provenance and history!",
  metadataBase: new URL("https://safehill.info"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>
      <html lang="en">
        <body className={cx(sfPro.variable, inter.variable)}>
          <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
          <Suspense fallback="...">
            <Navbar />
          </Suspense>
          <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
            {children}
          </main>
          <Footer />
          <VercelAnalytics />
        </body>
      </html>
    // </ClerkProvider>
  );
}
