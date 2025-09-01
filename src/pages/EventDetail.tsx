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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full aspect-[1/1] object-cover rounded-2xl mb-8 shadow-lg"
              />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Hosted By</h3>
                <ul className="space-y-3">
                  {event.organizers.map((organizer) => (
                    <li key={organizer.name} className="flex items-center gap-3">
                      <Avatar>
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
            <div className="lg:col-span-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-background rounded-lg p-2 mt-1 border">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.date}</p>
                    <p className="text-muted-foreground text-sm">{`${event.startTime} - ${event.endTime}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-background rounded-lg p-2 mt-1 border">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.location}</p>
                    <p className="text-muted-foreground text-sm">
                      {event.locationDetail}
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-background shadow-lg mb-8">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-semibold text-lg">
                      {event.ticketPrice === 0
                        ? "Free"
                        : `${event.ticketPrice} SOM`}
                    </div>
                    <Button onClick={handleBuyTicket}>
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Ticket
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {event.ticketSupply - event.attendees} spots left
                  </p>
                  <div className="grid grid-cols-2 gap-2">
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
                <h2 className="text-2xl font-semibold mb-2">
                  About this event
                </h2>
                <p>{event.description}</p>
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