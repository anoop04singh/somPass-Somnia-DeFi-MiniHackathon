import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Html5QrcodeScanner, Html5QrcodeError, QrcodeSuccessCallback } from "html5-qrcode";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const QR_SCANNER_ID = "qr-code-scanner";

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let scanner: Html5QrcodeScanner | null = null;

    // The Dialog component takes a moment to render its content to the DOM.
    // We'll use a short timeout to ensure the container element exists before initializing the scanner.
    const timerId = setTimeout(() => {
      try {
        scanner = new Html5QrcodeScanner(
          QR_SCANNER_ID,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false // verbose
        );

        const handleSuccess: QrcodeSuccessCallback = (decodedText, _) => {
          onScanSuccess(decodedText);
        };

        const handleError = (errorMessage: string, error: Html5QrcodeError) => {
          // This callback is called frequently when no QR code is in view.
          // We can safely ignore these errors for a cleaner user experience.
        };

        scanner.render(handleSuccess, handleError);
      } catch (error) {
        console.error("Failed to initialize QR scanner:", error);
      }
    }, 100); // A 100ms delay is usually sufficient.

    // This cleanup function will run when the modal is closed or the component unmounts.
    return () => {
      clearTimeout(timerId);
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner.", error);
        });
      }
    };
  }, [isOpen, onScanSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dialog-glow text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Scan Ticket QR Code</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          {/* This div is the target for the scanner */}
          <div id={QR_SCANNER_ID} className="w-full h-full"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};