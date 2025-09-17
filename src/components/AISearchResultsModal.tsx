import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Event } from "@/data/events";
import { EventCard } from "./EventCard";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface AISearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: Event[];
  query: string;
}

export const AISearchResultsModal = ({ isOpen, onClose, results, query }: AISearchResultsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl dialog-glow text-white max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Search Results for "{query}"</DialogTitle>
          <DialogDescription className="text-white/70">
            Found {results.length} event{results.length !== 1 && 's'} matching your search.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-2 -mr-4">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {results.map((event) => {
                const now = new Date();
                
                const eventStartDate = new Date(event.startDate);
                const [startHours, startMinutes] = event.startTime.split(':').map(Number);
                if (!isNaN(eventStartDate.getTime())) {
                  eventStartDate.setUTCHours(startHours, startMinutes);
                }

                const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
                const [endHours, endMinutes] = event.endTime.split(':').map(Number);
                if (!isNaN(eventEndDate.getTime())) {
                  eventEndDate.setUTCHours(endHours, endMinutes);
                }

                let status: 'Upcoming' | 'Ongoing' | null = null;
                if (now < eventStartDate) {
                  status = 'Upcoming';
                } else if (now >= eventStartDate && now <= eventEndDate) {
                  status = 'Ongoing';
                }

                return (
                  <div key={event.contractAddress} className="relative">
                    <Link to={`/event/${event.contractAddress}`} onClick={onClose}>
                      <EventCard event={event} />
                    </Link>
                    {status && (
                      <Badge
                        variant="outline"
                        className={`absolute top-6 right-6 pointer-events-none ${
                          status === 'Ongoing'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {status}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-white/70 py-16">
              The AI couldn't find any events matching your search. Try a different query!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};