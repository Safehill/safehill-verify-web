import './globals.css';
import cx from 'classnames';
import {inter, sfPro} from './fonts';
import {Analytics as VercelAnalytics} from '@vercel/analytics/react';
import {AuthProvider} from "@/lib/auth/auth-context";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <AuthProvider>{children}</AuthProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
