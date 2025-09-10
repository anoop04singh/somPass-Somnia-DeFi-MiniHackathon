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
    <Card className="card-glow overflow-hidden rounded-xl">
      <div className="flex flex-col sm:flex-row">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full sm:w-48 h-48 sm:h-auto object-cover"
        />
        <div className="flex flex-col justify-between p-6 flex-grow">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">
              <Link to={`/event/${event.contractAddress}`} className="hover:underline">
                {event.title}
              </Link>
            </h2>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{`${event.date} at ${event.startTime}`}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-white/60">
            Ticket ID: {ticket.id}
          </div>
        </div>
        <div className="flex items-center justify-center p-6 bg-white/5 border-t sm:border-t-0 sm:border-l border-white/10">
          <div className="flex flex-col items-center gap-2 text-center">
            <QrCode className="w-20 h-20 text-white/60" />
            <span className="text-xs text-white/60"># {ticket.id}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};