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
import { motion } from "framer-motion";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const primaryOrganizer = event.organizers[0];
  const eventDate = new Date(event.date);
  const displayDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : "DATE TBD";

  return (
    <motion.div>
      <Card className="card-glow h-full flex flex-col group p-4">
        <CardHeader className="p-0 mb-4">
          <div className="overflow-hidden rounded-lg">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <p className="text-sm font-semibold text-amber-300/80 mb-1">
            {displayDate}
          </p>
          <CardTitle className="text-lg font-semibold text-white mb-2 leading-tight">
            {event.title}
          </CardTitle>
          <div className="flex items-center text-sm text-white/60">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
        </CardContent>
        <CardFooter className="p-0 pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={primaryOrganizer.logoUrl}
                alt={primaryOrganizer.name}
              />
              <AvatarFallback>
                {primaryOrganizer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-white/60">
              {primaryOrganizer.name}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};