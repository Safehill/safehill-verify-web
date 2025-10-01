import './globals.css';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import cx from 'classnames';
import { AuthProvider } from '@/lib/auth/auth-context';
import { QueryProvider } from '@/lib/query-provider';
import { inter, sfPro } from './fonts';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
