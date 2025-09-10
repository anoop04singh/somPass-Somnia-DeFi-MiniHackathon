import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { pageTransition, containerVariants, itemVariants } from "@/lib/animations";
import { DashboardEventCard } from "@/components/DashboardEventCard";
import { useWeb3Store } from "@/store/web3Store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "@/data/events";
import { Skeleton } from "@/components/ui/skeleton";
import { querySubgraph, mapSubgraphEventToEvent, SubgraphEvent } from "@/lib/subgraph";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { QRScannerModal } from "@/components/QRScannerModal";
import { ethers } from "ethers";
import { EVENT_ABI } from "@/lib/constants";
import { showSuccess, showError } from "@/utils/toast";

const fetchOrganizerEvents = async (account: string | null): Promise<Event[]> => {
  if (!account) return [];
  const query = `
    query GetOrganizerEvents($organizer: Bytes!) {
      events(where: { organizer: $organizer }, orderBy: createdAtTimestamp, orderDirection: desc) {
        id
        metadataCID
        organizer
        ticketPrice
        ticketSupply
        totalTicketsSold
      }
    }
  `;
  const response = await querySubgraph<{ events: SubgraphEvent[] }>(query, { organizer: account.toLowerCase() });
  return Promise.all(response.events.map(mapSubgraphEventToEvent));
};

const Dashboard = () => {
  const { account, isConnected, signer } = useWeb3Store();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: organizerEvents, isLoading } = useQuery({
    queryKey: ["organizerEvents", account],
    queryFn: () => fetchOrganizerEvents(account),
    enabled: isConnected && !!account,
  });

  const checkInMutation = useMutation({
    mutationFn: async ({ eventId, ticketId }: { eventId: string, ticketId: string }) => {
      if (!signer || !account) throw new Error("Wallet not connected.");

      // 1. Verify organizer permission from the subgraph
      const eventDetailsQuery = `
        query GetEventOrganizer($id: ID!) {
          event(id: $id) { organizer }
        }
      `;
      const eventResponse = await querySubgraph<{ event: { organizer: string } | null }>(eventDetailsQuery, { id: eventId.toLowerCase() });

      if (!eventResponse.event || eventResponse.event.organizer.toLowerCase() !== account.toLowerCase()) {
        throw new Error("You are not authorized for this event.");
      }

      // 2. Check if ticket is already checked in
      const fullTicketId = `${eventId.toLowerCase()}-${ticketId}`;
      const ticketQuery = `
        query GetTicketStatus($ticketId: ID!) {
          ticket(id: $ticketId) { isCheckedIn }
        }
      `;
      const ticketResponse = await querySubgraph<{ ticket: { isCheckedIn: boolean } | null }>(ticketQuery, { ticketId: fullTicketId });

      if (ticketResponse.ticket?.isCheckedIn) {
        throw new Error(`Ticket #${ticketId} has already been checked in.`);
      }

      // 3. Perform the check-in transaction
      const eventContract = new ethers.Contract(eventId, EVENT_ABI, signer);
      const tx = await eventContract.checkIn(ticketId);
      await tx.wait();
      return { eventId, ticketId };
    },
    onSuccess: ({ eventId, ticketId }) => {
      showSuccess(`Ticket #${ticketId} checked in successfully!`);
      queryClient.invalidateQueries({ queryKey: ["organizerEvents", account] });
      queryClient.invalidateQueries({ queryKey: ["attendees", eventId] });
    },
    onError: (error: any) => {
      showError(error.message || "Check-in failed.");
    },
  });

  const handleGlobalScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    try {
      const { eventId, ticketId } = JSON.parse(decodedText);
      if (!eventId || !ticketId) throw new Error("Invalid QR code format.");
      checkInMutation.mutate({ eventId, ticketId });
    } catch (error) {
      showError("Invalid or unreadable QR code.");
    }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen text-white"
      >
        <Header />
        <main className="container mx-auto px-6 py-10 pt-28 flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight"
            >
              Organizer Dashboard
            </motion.h1>
            {isConnected && (
              <Button size="lg" className="w-full md:w-auto bg-amber-400 text-amber-950 font-bold hover:bg-amber-500" onClick={() => setIsScannerOpen(true)}>
                <QrCode className="w-5 h-5 mr-2" /> Scan Ticket
              </Button>
            )}
          </div>
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
      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanSuccess={handleGlobalScanSuccess} 
      />
    </>
  );
};

export default Dashboard;