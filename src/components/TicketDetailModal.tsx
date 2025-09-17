import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/data/tickets";
import { QRCode } from "./QRCode";
import { Calendar, MapPin, Send } from "lucide-react";

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onTransferClick: (ticket: Ticket) => void;
}

export const TicketDetailModal = ({ isOpen, onClose, ticket, onTransferClick }: TicketDetailModalProps) => {
  if (!ticket) return null;

  const { event } = ticket;
  const qrCodeValue = JSON.stringify({
    eventId: ticket.eventId,
    ticketId: ticket.id,
  });

  const handleTransfer = () => {
    onTransferClick(ticket);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dialog-glow text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-2xl font-bold">{event.title}</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Present this QR code at the event for entry.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="p-4 bg-white rounded-xl">
            <QRCode value={qrCodeValue} size={220} />
          </div>
          <div className="w-full text-left space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-3 flex-shrink-0 text-white/70" />
              <span>{`${new Date(event.startDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })} at ${event.startTime}`}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-3 flex-shrink-0 text-white/70" />
              <span>{event.location}</span>
            </div>
            <div className="border-t border-white/10 my-2"></div>
            <div className="text-xs text-white/60">
              <span className="font-semibold">Ticket ID:</span> <span className="font-mono">{ticket.id}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleTransfer}
            variant="outline"
            className="w-full bg-transparent border-white/30 hover:bg-white/10"
          >
            <Send className="w-4 h-4 mr-2" />
            Transfer Ticket
          </Button>
          <Button
            onClick={onClose}
            className="w-full bg-amber-400 text-amber-950 hover:bg-amber-500"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};