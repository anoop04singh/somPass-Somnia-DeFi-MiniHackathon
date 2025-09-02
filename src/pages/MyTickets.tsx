import { Header } from "@/components/Header";
import { TicketCard } from "@/components/TicketCard";
import { mockUserTickets } from "@/data/tickets";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

const MyTickets = () => {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
      }}
    >
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <h1 className="text-4xl font-bold tracking-tight mb-8">My Tickets</h1>
        {mockUserTickets.length > 0 ? (
          <div className="space-y-6">
            {mockUserTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
            <Ticket className="w-16 h-16 text-white/50 mb-4" />
            <h2 className="text-2xl font-semibold">No tickets yet!</h2>
            <p className="text-white/70 mt-2 mb-6 max-w-sm">
              When you buy a ticket for an event, it will show up here where you
              can easily access it.
            </p>
            <Button
              asChild
              className="bg-white text-green-900 font-bold hover:bg-gray-200"
            >
              <Link to="/">Discover Events</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTickets;