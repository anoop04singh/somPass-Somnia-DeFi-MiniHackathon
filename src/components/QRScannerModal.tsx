import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (ticketId: string) => void;
}

type ScanStatus = "scanning" | "success" | "error";

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) => {
  const [status, setStatus] = useState<ScanStatus>("scanning");
  const [scannedTicket, setScannedTicket] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStatus("scanning");
      setScannedTicket("");
      // Simulate a scan after a delay
      const timer = setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate
        if (isSuccess) {
          const ticketId = `t-sim-${Math.floor(1000 + Math.random() * 9000)}`;
          setStatus("success");
          setScannedTicket(ticketId);
          onScanSuccess(ticketId);
        } else {
          setStatus("error");
          setScannedTicket("Invalid QR Code");
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onScanSuccess]);

  const renderContent = () => {
    switch (status) {
      case "scanning":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-64 h-64 bg-black/20 rounded-lg overflow-hidden">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 animate-scan"></div>
              <QrCode className="w-32 h-32 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white/80">Point camera at QR code...</p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle className="w-24 h-24 text-green-400" />
            <h3 className="text-2xl font-bold">Check-in Successful</h3>
            <p className="text-white/80">Ticket ID: {scannedTicket}</p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="w-24 h-24 text-red-400" />
            <h3 className="text-2xl font-bold">Invalid Ticket</h3>
            <p className="text-white/80">This QR code is not valid or has already been used.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dialog-glow text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Scan Ticket QR Code</DialogTitle>
        </DialogHeader>
        <div className="py-6">{renderContent()}</div>
        {status !== "scanning" && (
           <Button onClick={onClose} className="w-full bg-white text-green-900 font-bold hover:bg-gray-200">
             Close
           </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};