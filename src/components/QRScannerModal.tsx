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
    if (!isOpen) return;

    const scanner = new Html5QrcodeScanner(
      QR_SCANNER_ID,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false // verbose
    );

    const handleSuccess: QrcodeSuccessCallback = (decodedText, _) => {
      scanner.clear();
      onScanSuccess(decodedText);
    };

    const handleError = (errorMessage: string, error: Html5QrcodeError) => {
      // Errors are frequent (e.g., QR not in view), so we can ignore them for a cleaner UX
      // console.error("QR Scanner Error:", errorMessage, error);
    };

    scanner.render(handleSuccess, handleError);

    return () => {
      // Ensure scanner is cleared when modal is closed or component unmounts
      if (scanner && scanner.getState()) {
        scanner.clear().catch(err => console.error("Failed to clear scanner:", err));
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
          <div id={QR_SCANNER_ID} className="w-full h-full"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};