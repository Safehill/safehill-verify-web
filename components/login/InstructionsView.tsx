import { ArrowDown, QrCode } from 'lucide-react';
import React from 'react';
import { DownloadAppButtons } from '@/components/home/DownloadAppButtons';
import { Button } from '@/components/shared/button';
import { LoadingCircle } from '@/components/shared/icons';
import SafehillAppLogo from '@/components/shared/SafehillAppLogo';
import type { AuthSessionInitializationMessage } from '@/lib/api/models/ws/messages';

const InstructionsView = ({
  websocketSession,
  generateQRCode,
}: {
  websocketSession: AuthSessionInitializationMessage | null | undefined;
  generateQRCode: () => void;
}) => {
  return (
    <div className="space-y-8 pb-5 text-md">
      <div className="flex flex-col items-center space-y-4">
        <SafehillAppLogo variant="small" />
      </div>

      <div className="flex flex-col items-center justify-center text-muted-foreground gap-5">
        To log in, tap on the button below
        <br />
        then point your device&apos;s camera to the QR code
        <ArrowDown />
      </div>
      <div className="">
        {websocketSession ? (
          <Button
            variant="default"
            onClick={generateQRCode}
            className="gap-2 w-52"
          >
            <QrCode className="h-4 w-4" />
            Generate QR Code
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={generateQRCode}
            className="gap-2 w-52"
            disabled={true}
          >
            <LoadingCircle />
            Connecting
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground pt-5">
        The Safehill app will launch on your device
        <br />
        which will securely log you in
      </p>
      <p className="text-center text-sm text-muted-foreground pt-5">
        If you don&#39;t have the app on your device yet, download it now
      </p>
      <div className="flex gap-4 justify-center">
        <DownloadAppButtons className="w-[160px] transition-all duration-50 hover:scale-105" />
      </div>
    </div>
  );
};

export default InstructionsView;
