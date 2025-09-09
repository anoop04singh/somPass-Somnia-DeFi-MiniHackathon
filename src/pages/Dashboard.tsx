import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { pageTransition, containerVariants, itemVariants } from "@/lib/animations";
import { DashboardEventCard } from "@/components/DashboardEventCard";
import { useWeb3Store } from "@/store/web3Store";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, EVENT_ABI } from "@/lib/constants";
import { Event } from "@/data/events";
import { getIPFSUrl } from "@/lib/ipfs";
import { Skeleton } from "@/components/ui/skeleton";

const fetchEvents = async (): Promise<Event[]> => {
  if (!window.ethereum) return [];
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

const Dashboard = () => {
  const { account, isConnected } = useWeb3Store();
  const { data: allEvents, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const organizerEvents = allEvents?.filter(
    (event) => event.organizerAddress.toLowerCase() === account?.toLowerCase()
  );

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
          Organizer Dashboard
        </motion.h1>
        {!isConnected ? (
           <div className="text-center py-24">
             <h2 className="text-2xl font-semibold">Connect your wallet</h2>
             <p className="text-white/60 mt-2">Please connect your wallet to see your dashboard.</p>
           </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl bg-white/10" />)}
          </div>
        ) : organizerEvents && organizerEvents.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {organizerEvents.map((event) => (
              <motion.div key={event.contractAddress} variants={itemVariants}>
                <DashboardEventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-white/70">You have not created any events yet.</p>
        )}
      </main>
    </motion.div>
  );
};

export default Dashboard;