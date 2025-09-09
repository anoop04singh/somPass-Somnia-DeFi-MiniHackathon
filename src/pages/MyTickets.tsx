import { Header } from "@/components/Header";
import { TicketCard } from "@/components/TicketCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { motion } from "framer-motion";
import {
  pageTransition,
  containerVariants,
  itemVariants,
} from "@/lib/animations";
import { useTicketStore } from "@/store/ticketStore";

const MyTickets = () => {
  const tickets = useTicketStore((state) => state.tickets);

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
      <main className="container mx-auto px-6 py-10 pt-28 flex-grow">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold tracking-tight mb-8"
        >
          My Tickets
        </motion.h1>
        {tickets.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {tickets.map((ticket) => (
              <motion.div key={ticket.id} variants={itemVariants}>
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-lg bg-white/5">
            <Ticket className="w-16 h-16 text-white/40 mb-4" />
            <h2 className="text-2xl font-semibold">No tickets yet!</h2>
            <p className="text-white/60 mt-2 mb-6 max-w-sm">
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
    </motion.div>
  );
};

export default MyTickets;