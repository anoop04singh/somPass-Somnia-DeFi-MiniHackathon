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
              {results.map((event) => (
                <Link to={`/event/${event.contractAddress}`} key={event.contractAddress} onClick={onClose}>
                  <EventCard event={event} />
                </Link>
              ))}
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