import { useParams, Link } from "react-router-dom";
import { mockEvents } from "@/data/events";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, Users, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all events
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
            />
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-2">About this event</h2>
              <p>{event.description}</p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Get Your Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Price</span>
                  <span>
                    {event.ticketPrice === 0
                      ? "Free"
                      : `${event.ticketPrice} SOM`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Tickets Left</span>
                  <span>
                    {event.ticketSupply - event.attendees} / {event.ticketSupply}
                  </span>
                </div>
                <Button className="w-full" onClick={handleBuyTicket}>
                  <Ticket className="w-4 h-4 mr-2" />
                  Buy Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;