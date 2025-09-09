import { Header } from "@/components/Header";
import { TicketCard } from "@/components/TicketCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket as TicketIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  pageTransition,
  containerVariants,
  itemVariants,
} from "@/lib/animations";
import { useWeb3Store } from "@/store/web3Store";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, EVENT_ABI } from "@/lib/constants";
import { Ticket } from "@/data/tickets";
import { Event } from "@/data/events";
import { getIPFSUrl } from "@/lib/ipfs";
import { Skeleton } from "@/components/ui/skeleton";

const fetchMyTickets = async (account: string | null): Promise<Ticket[]> => {
  if (!window.ethereum || !account) return [];

  const provider = new ethers.BrowserProvider(window.ethereum);
  const factoryContract = new ethers.Contract(EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, provider);
  const eventAddresses: string[] = await factoryContract.getAllEvents();

  const allTickets: Ticket[] = [];

  for (const address of eventAddresses) {
    const eventContract = new ethers.Contract(address, EVENT_ABI, provider);
    const balance = await eventContract.balanceOf(account);

    if (Number(balance) > 0) {
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

      const eventDetails: Event = {
        ...metadata,
        contractAddress: address,
        ticketPrice: Number(ethers.formatEther(ticketPrice)),
        ticketSupply: Number(ticketSupply),
        attendees: Number(attendees),
        organizerAddress,
      };

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await eventContract.tokenOfOwnerByIndex(account, i);
        allTickets.push({
          id: tokenId.toString(),
          event: eventDetails,
          eventId: address,
        });
      }
    }
  }
  return allTickets;
};

const MyTickets = () => {
  const { account, isConnected } = useWeb3Store();
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["myTickets", account],
    queryFn: () => fetchMyTickets(account),
    enabled: isConnected && !!account,
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
          className="text-5xl font-bold tracking-tight mb-8"
        >
          My Tickets
        </motion.h1>
        {!isConnected ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-semibold">Connect your wallet</h2>
            <p className="text-white/60 mt-2">Please connect your wallet to see your tickets.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
            <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
          </div>
        ) : tickets && tickets.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {tickets.map((ticket) => (
              <motion.div key={`${ticket.eventId}-${ticket.id}`} variants={itemVariants}>
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-lg bg-white/5">
            <TicketIcon className="w-16 h-16 text-white/40 mb-4" />
            <h2 className="text-2xl font-semibold">No tickets yet!</h2>
            <p className="text-white/60 mt-2 mb-6 max-w-sm">
              When you buy a ticket for an event, it will show up here.
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