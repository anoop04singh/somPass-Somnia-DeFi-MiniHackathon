import { useParams, Link } from "react-router-dom";
import { mockEvents } from "@/data/events";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showSuccess } from "@/utils/toast";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return <NotFound />;
  }

  const handleBuyTicket = () => {
    showSuccess("Ticket purchased successfully! (Simulation)");
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
      }}
    >
      <Header />
      <main className="flex-grow container mx-auto px-6 py-10 pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all events
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="lg:col-span-1 space-y-8">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full aspect-square object-cover rounded-2xl shadow-lg"
              />
              <div>
                <h3 className="font-semibold text-xl mb-4">Hosted By</h3>
                <ul className="space-y-4">
                  {event.organizers.map((organizer) => (
                    <li
                      key={organizer.name}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={organizer.logoUrl}
                          alt={organizer.name}
                        />
                        <AvatarFallback>
                          {organizer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-white/80">
                        {organizer.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 rounded-lg p-3 mt-1 border border-white/10">
                    <Calendar className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.date}</p>
                    <p className="text-white/60 text-sm">{`${event.startTime} - ${event.endTime}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 rounded-lg p-3 mt-1 border border-white/10">
                    <MapPin className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.location}</p>
                    <p className="text-white/60 text-sm">
                      {event.locationDetail}
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/10 shadow-sm mb-8 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="font-semibold text-lg">
                      {event.ticketPrice === 0
                        ? "Free"
                        : `${event.ticketPrice} SOM`}
                    </div>
                    <Button
                      onClick={handleBuyTicket}
                      size="lg"
                      className="w-full sm:w-auto bg-white text-green-900 font-bold hover:bg-gray-200"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Ticket
                    </Button>
                  </div>
                  <p className="text-sm text-white/60 mb-6">
                    {event.ticketSupply - event.attendees} spots left
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full bg-white/10 hover:bg-white/20"
                    onClick={() => showSuccess("Invite link copied to clipboard!")}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Invite a Friend
                  </Button>
                </CardContent>
              </Card>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  About this event
                </h2>
                <p className="text-white/80">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default EventDetail;