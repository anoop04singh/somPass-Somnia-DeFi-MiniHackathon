import { Card } from "@/components/ui/card";
import { Calendar, MapPin, QrCode } from "lucide-react";
import { Ticket } from "@/data/tickets";
import { Link } from "react-router-dom";

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const { event } = ticket;
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full sm:w-48 h-48 sm:h-auto object-cover"
        />
        <div className="flex flex-col justify-between p-4 flex-grow">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              <Link to={`/event/${event.id}`} className="hover:underline">
                {event.title}
              </Link>
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Purchased on: {ticket.purchaseDate}
          </div>
        </div>
        <div className="flex items-center justify-center p-4 bg-muted/50 border-t sm:border-t-0 sm:border-l">
          {/* This would be replaced by a real QR code in a full implementation */}
          <QrCode className="w-16 h-16 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
};