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
import { ethers } from "ethers";
import { EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, EVENT_ABI } from "@/lib/constants";
import { Event } from "@/data/events";
import { getIPFSUrl } from "@/lib/ipfs";
import { Skeleton } from "@/components/ui/skeleton";

const fetchEvents = async (): Promise<Event[]> => {
  if (!window.ethereum) {
    console.error("MetaMask is not installed");
    return [];
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const factoryContract = new ethers.Contract(EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, provider);
  const eventAddresses = await factoryContract.getAllEvents();

  const eventsPromises = eventAddresses.map(async (address: string) => {
    const eventContract = new ethers.Contract(address, EVENT_ABI, provider);
    const [metadataCID, ticketPrice, ticketSupply, attendees, organizerAddress] = await Promise.all([
      eventContract.metadataCID(),
      eventContract.ticketPrice(),
      eventContract.maxTickets(),
      eventContract.totalTicketsSold(),
      eventContract.owner(),
    ]);

    const metadataUrl = getIPFSUrl(metadataCID);
    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    return {
      ...metadata,
      contractAddress: address,
      ticketPrice: Number(ethers.formatEther(ticketPrice)),
      ticketSupply: Number(ticketSupply),
      attendees: Number(attendees),
      organizerAddress,
    };
  });

  return Promise.all(eventsPromises);
};

const Index = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

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
          className="text-5xl font-bold mb-10 tracking-tight"
        >
          Upcoming Events
        </motion.h1>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-1/2 bg-white/10" />
              </div>
            ))
          ) : error ? (
            <p className="text-center col-span-full text-red-400">Failed to load events.</p>
          ) : (
            events?.map((event) => (
              <motion.div key={event.contractAddress} variants={itemVariants}>
                <Link to={`/event/${event.contractAddress}`}>
                  <EventCard event={event} />
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Index;