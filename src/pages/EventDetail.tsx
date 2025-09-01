import { useParams, Link } from "react-router-dom";
import { mockEvents } from "@/data/events";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  Share2,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showSuccess } from "@/utils/toast";
import NotFound from "./NotFound";

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
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all events
            </Link>
          </div>
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full aspect-square object-cover rounded-2xl shadow-lg"
              />
              <div>
                <h3 className="font-semibold text-lg mb-4">Hosted By</h3>
                <ul className="space-y-4">
                  {event.organizers.map((organizer) => (
                    <li key={organizer.name} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={organizer.logoUrl}
                          alt={organizer.name}
                        />
                        <AvatarFallback>
                          {organizer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{organizer.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-background rounded-lg p-3 mt-1 border">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.date}</p>
                    <p className="text-muted-foreground text-sm">{`${event.startTime} - ${event.endTime}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-background rounded-lg p-3 mt-1 border">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.location}</p>
                    <p className="text-muted-foreground text-sm">
                      {event.locationDetail}
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-background shadow-sm mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="font-semibold text-lg">
                      {event.ticketPrice === 0
                        ? "Free"
                        : `${event.ticketPrice} SOM`}
                    </div>
                    <Button onClick={handleBuyTicket} size="lg" className="w-full sm:w-auto">
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Ticket
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {event.ticketSupply - event.attendees} spots left
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" /> Add to Calendar
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" /> Invite a Friend
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  About this event
                </h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;