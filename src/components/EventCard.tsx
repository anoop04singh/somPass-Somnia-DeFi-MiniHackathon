import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Event } from "@/data/events";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const primaryOrganizer = event.organizers[0];

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col group border-none bg-transparent shadow-none">
      <CardHeader className="p-0 mb-4">
        <div className="overflow-hidden rounded-xl">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <p className="text-sm font-semibold text-primary mb-1">{event.date.toUpperCase()}</p>
        <CardTitle className="text-lg font-bold mb-2 leading-tight">
          {event.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 pt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={primaryOrganizer.logoUrl} alt={primaryOrganizer.name} />
            <AvatarFallback>{primaryOrganizer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{primaryOrganizer.name}</span>
        </div>
      </CardFooter>
    </Card>
  );
};