import QRCode from "react-qr-code";
import {Progress} from "@/components/shared/progress";
import {ArrowRight, RefreshCw} from "lucide-react";
import {Button} from "@/components/shared/button";
import {AuthenticatedUser} from "@/lib/api/models/AuthenticatedUser";

const ScanQRCodeView = ({qrCodePayload, timeRemaining, progress, authenticatedUser, generateQRCode, onBack}: {
  qrCodePayload: string,
  timeRemaining: number,
  progress: number,
  authenticatedUser: AuthenticatedUser | null,
  generateQRCode: () => void,
  onBack: () => void,
}) => {
  return (
    <div className="flex flex-col items-center space-y-6 text-md">
      {qrCodePayload ? (
        <>
          <p className="text-center text-muted-foreground">
            Point your device&#39;s camera to this code.
            <br />
            <br />
            You can also open the mobile app and go to
            <br />
            <b>Profile &gt; Login on the Web</b>
            <br />
            to scan it
          </p>

          <div className="bg-white p-4 rounded-lg">
            <QRCode
              value={qrCodePayload}
              size={200}
              level="H"
            />
          </div>

          {/* Session timeout indicator */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>This code will expire in:</span>
              <span className="font-medium">{timeRemaining} seconds</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {!!authenticatedUser ? (
            <div className="flex items-center gap-2 text-green-600">
              <div className="animate-pulse">Authentication successful! Redirecting...</div>
              <ArrowRight className="h-4 w-4" />
            </div>
          ) : timeRemaining === 0 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-amber-600">Session expired</p>
              <Button onClick={generateQRCode} size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate New Code
              </Button>
            </div>
          )}

          {/* Back button */}
          {!authenticatedUser && (
            <div className="w-full py-5">
              <Button variant="outline" size="sm" onClick={onBack} className="mt-2">
                Go Back
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          Loading QR Code...
        </div>
      )}
    </div>
  );
};

export default ScanQRCodeView;