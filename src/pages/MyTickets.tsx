import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TicketCard } from "@/components/TicketCard";
import { mockUserTickets } from "@/data/tickets";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MyTickets = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
        {mockUserTickets.length > 0 ? (
          <div className="space-y-6">
            {mockUserTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No tickets yet!</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              When you buy a ticket for an event, it will show up here.
            </p>
            <Button asChild>
              <Link to="/">Discover Events</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyTickets;