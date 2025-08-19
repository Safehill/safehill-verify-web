'use client';
import Link from 'next/link';
import { Button } from '@/components/shared/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card';
import { useAuth } from '@/lib/auth/auth-context';

export default function Dashboard() {
  const { authedSession } = useAuth();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/login">Logout</Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              Welcome {authedSession?.user.name ?? 'Unknown user'} (
              {authedSession?.user.identifier})
            </CardTitle>
            <CardDescription>
              You&#39;ve successfully logged in via QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Your bearer token is {authedSession?.bearerToken}, your key and
              signature {authedSession?.privateKey ? 'exist' : 'DO NOT exist'}{' '}
              and your session will expire in {authedSession?.expiresAt}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
