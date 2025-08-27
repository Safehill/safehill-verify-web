'use client';

import InstructionsView from '@/components/login/InstructionsView';
import ScanQRCodeView from '@/components/login/ScanQRCodeView';
import { Button } from '@/components/shared/button';
import { Card } from '@/components/shared/card';
import { API_BASE_URL } from '@/lib/api/api';
import { useSessionWebSocket } from '@/lib/api/socket';
import { useAuth } from '@/lib/auth/auth-context';
import { arrayBufferToBase64 } from '@/lib/crypto/base64';
import { cryptoKeyToBase64, encryptWithKey } from '@/lib/crypto/keys';
import { ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Session timeout in seconds (2 minutes)
const CODE_VALIDITY_IN_SECONDS = 120;

export default function LoginPage() {
  const { setAuthedSession } = useAuth();

  const router = useRouter();
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(CODE_VALIDITY_IN_SECONDS);
  const [progress, setProgress] = useState(100);

  const {
    session: websocketSession,
    symmetricKey,
    authenticatedUser,
    setAuthenticatedUser,
    error: webSocketError,
    retry,
  } = useSessionWebSocket();

  // Countdown timer for session expiration
  useEffect(() => {
    if (!qrPayload || !!authenticatedUser) {
      return;
    }

    // Start countdown
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Reset session when timer expires
          setQrPayload(null);
          setShowQRCode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrPayload, authenticatedUser]);

  // Authenticate when the user credentials are available
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    // console.log('Authentication successful');

    // TODO: Set real expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    // Store authentication credentials in memory via context
    setAuthedSession({
      bearerToken: authenticatedUser.authToken,
      privateKey: authenticatedUser.privateKey,
      signature: authenticatedUser.privateSignature,
      user: authenticatedUser.user,
      expiresAt: expirationDate.getTime(),
    });

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/authed');
    }, 500);
  }, [authenticatedUser, router, setAuthedSession]);

  // Update progress bar based on time remaining
  useEffect(() => {
    setProgress((timeRemaining / CODE_VALIDITY_IN_SECONDS) * 100);
  }, [timeRemaining]);

  // Start again
  const initialize = () => {
    setAuthenticatedUser(null);
    setQrPayload(null);
    setShowQRCode(false);
  };

  // Generate the QR code to scan
  const generateQRCode = async () => {
    if (!websocketSession) {
      throw new Error('Socket session was not initialized');
    }
    if (!symmetricKey) {
      throw new Error('Encryption key was not created');
    }
    setShowQRCode(true);

    const keyBase64 = await cryptoKeyToBase64(symmetricKey);
    const { ciphertext, iv } = await encryptWithKey(
      symmetricKey,
      websocketSession.requestorIp
    );
    const ctBase64 = arrayBufferToBase64(ciphertext);
    const ivBase64 = arrayBufferToBase64(iv.buffer);
    const qrPayload = `${API_BASE_URL}/sa/web-auth/${websocketSession.sessionId}?key=${keyBase64}&oct=${ctBase64}&oiv=${ivBase64}`;
    setQrPayload(qrPayload);

    setTimeRemaining(CODE_VALIDITY_IN_SECONDS);
  };

  return (
    <div className="opacity-95 w-full">
      <Card className="w-full max-w-md md:max-w-lg m-auto text-center min-w-5">
        {showQRCode ? (
          <>
            <h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display drop-shadow-sm [text-wrap:balance] text-2xl md:text-3xl leading-[3rem] md:leading-[5rem]">
              Scan this code
            </h1>
            <div className="flex flex-col items-center space-y-4">
              {qrPayload && (
                <ScanQRCodeView
                  qrCodePayload={qrPayload}
                  timeRemaining={timeRemaining}
                  progress={progress}
                  authenticatedUser={authenticatedUser}
                  generateQRCode={generateQRCode}
                  onBack={initialize}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display drop-shadow-sm [text-wrap:balance] text-2xl md:text-3xl leading-[3rem] md:leading-[3rem]">
              Log in to Safehill
            </h1>
            {webSocketError ? (
              <div className="space-y-8 pb-5">
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-5 text-sm bg-red-100 text-red-700 p-10">
                  Sorry, there was a problem connecting to the server
                  <br />
                  {webSocketError}
                </div>
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-5 text-lg">
                  Please try again
                  <ArrowDown />
                </div>
                <Button variant="default" onClick={retry} className="gap-2">
                  Retry Connecting
                </Button>
              </div>
            ) : (
              <>
                <InstructionsView
                  websocketSession={websocketSession}
                  generateQRCode={generateQRCode}
                />

                {/* Development-only bypass link */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-3">
                      Development Mode Only
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dev-login')}
                      className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                      ⚠️ Development Login Bypass
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
