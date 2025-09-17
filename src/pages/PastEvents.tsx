import { useMemo } from "react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  pageTransition,
  containerVariants,
  itemVariants,
} from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/data/events";
import { Skeleton } from "@/components/ui/skeleton";
import { querySubgraph, mapSubgraphEventToEvent, SubgraphEvent } from "@/lib/subgraph";

const fetchEvents = async (): Promise<Event[]> => {
  const query = `
    query GetEvents {
      events(orderBy: createdAtTimestamp, orderDirection: desc) {
        id
        metadataCID
        organizer
        ticketPrice
        ticketSupply
        totalTicketsSold
      }
    }
  `;
  const response = await querySubgraph<{ events: SubgraphEvent[] }>(query);
  return Promise.all(response.events.map(mapSubgraphEventToEvent));
};

const PastEvents = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const pastEvents = useMemo(() => {
    if (!events) {
      return [];
    }

    const past: Event[] = [];
    const now = new Date();

    events.forEach(event => {
      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
      const [endHours, endMinutes] = event.endTime.split(':').map(Number);
      
      if (!isNaN(eventEndDate.getTime())) {
        eventEndDate.setUTCHours(endHours, endMinutes);
      }

      const isEventOver = !isNaN(eventEndDate.getTime()) && eventEndDate < now;

      if (isEventOver) {
        past.push(event);
      }
    });

    return past;
  }, [events]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen text-white"
    >
      <Header />
      <main className="container mx-auto px-6 py-10 pt-28 flex-grow">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold mb-10 tracking-tight"
        >
          Past Events
        </motion.h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-1/2 bg-white/10" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center col-span-full text-red-400">Failed to load events.</p>
        ) : (
          <section>
            {pastEvents.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
              >
                {pastEvents.map((event) => (
                  <motion.div key={event.contractAddress} variants={itemVariants} className="opacity-60 hover:opacity-100 transition-opacity">
                    <Link to={`/event/${event.contractAddress}`}>
                      <EventCard event={event} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-white/70">No past events found.</p>
            )}
          </section>
        )}
      </main>
    </motion.div>
  );
};

export default PastEvents;