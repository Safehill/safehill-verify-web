import './globals.css';
import cx from 'classnames';
import {inter, sfPro} from './fonts';
import {Analytics as VercelAnalytics} from '@vercel/analytics/react';
import {AuthProvider} from "@/lib/auth/auth-context";
import {QueryProvider} from "@/lib/query-provider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
