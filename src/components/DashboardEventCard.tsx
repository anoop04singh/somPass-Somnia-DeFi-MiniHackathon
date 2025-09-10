import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/data/events";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardEventCardProps {
  event: Event;
}

export const DashboardEventCard = ({ event }: DashboardEventCardProps) => {
  const ticketsSold = event.attendees;
  const capacity = event.ticketSupply;
  const attendancePercentage = capacity > 0 ? ((ticketsSold / capacity) * 100).toFixed(0) : 0;

  return (
    <Card className="card-glow rounded-xl text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-white/60 mt-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{event.date}</span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-white/60">Tickets Sold</span>
          <span className="text-lg font-bold">{ticketsSold} / {capacity}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white/60">Attendance</span>
          <span className="text-lg font-bold">{attendancePercentage}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-amber-400 text-amber-950 font-bold hover:bg-amber-500">
          <Link to={`/dashboard/event/${event.contractAddress}`}>Manage Event</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};