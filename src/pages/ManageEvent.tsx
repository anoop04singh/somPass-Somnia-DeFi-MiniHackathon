import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, QrCode } from "lucide-react";
import { Event } from "@/data/events";
import { Attendee } from "@/data/attendees";
import { showSuccess, showError } from "@/utils/toast";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { QRScannerModal } from "@/components/QRScannerModal";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { EVENT_ABI } from "@/lib/constants";
import { useWeb3Store } from "@/store/web3Store";
import { Skeleton } from "@/components/ui/skeleton";
import { querySubgraph, mapSubgraphEventToEvent, SubgraphEvent } from "@/lib/subgraph";

interface SubgraphAttendee {
  tokenId: string;
  owner: string;
  isCheckedIn: boolean;
}

const fetchEventDetail = async (address: string): Promise<Event | null> => {
  if (!address) return null;
  const query = `
    query GetEvent($id: ID!) {
      event(id: $id) {
        id
        metadataCID
        organizer
        ticketPrice
        ticketSupply
        totalTicketsSold
      }
    }
  `;
  try {
    const response = await querySubgraph<{ event: SubgraphEvent | null }>(query, { id: address.toLowerCase() });
    if (!response.event) return null;
    return await mapSubgraphEventToEvent(response.event);
  } catch (error) {
    console.error("Failed to fetch event details from subgraph:", error);
    return null;
  }
};

const fetchAttendees = async (address: string): Promise<Attendee[]> => {
  const query = `
    query GetAttendees($eventId: String!) {
      tickets(where: { event: $eventId }, orderBy: tokenId, orderDirection: asc) {
        tokenId
        owner
        isCheckedIn
      }
    }
  `;
  const response = await querySubgraph<{ tickets: SubgraphAttendee[] }>(query, { eventId: address.toLowerCase() });
  return response.tickets.map(t => ({
    tokenId: t.tokenId,
    walletAddress: t.owner,
    isCheckedIn: t.isCheckedIn,
  }));
};

const ManageEvent = () => {
  const { address } = useParams<{ address: string }>();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { signer } = useWeb3Store();
  const queryClient = useQueryClient();

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ["event", address],
    queryFn: () => fetchEventDetail(address!),
    enabled: !!address,
  });

  const { data: attendees, isLoading: areAttendeesLoading } = useQuery({
    queryKey: ["attendees", address],
    queryFn: () => fetchAttendees(address!),
    enabled: !!address,
  });

  const checkInMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      if (!signer || !address) throw new Error("Wallet not connected or event address missing.");
      const eventContract = new ethers.Contract(address, EVENT_ABI, signer);
      const tx = await eventContract.checkIn(tokenId);
      await tx.wait();
    },
    onSuccess: (_, tokenId) => {
      showSuccess(`Ticket #${tokenId} checked in successfully!`);
      queryClient.invalidateQueries({ queryKey: ["attendees", address] });
    },
    onError: (error: any) => {
      const message = error?.reason || error.message || "Check-in failed.";
      showError(message);
    },
  });

  const handleCheckInToggle = (tokenId: string, isCheckedIn: boolean) => {
    if (!isCheckedIn) { // Prevent un-checking in
      checkInMutation.mutate(tokenId);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    try {
      const { eventId, ticketId } = JSON.parse(decodedText);

      if (!eventId || !ticketId) {
        throw new Error("Invalid QR code format.");
      }

      if (eventId.toLowerCase() !== address?.toLowerCase()) {
        showError("This ticket is for a different event.");
        return;
      }

      const attendee = attendees?.find(a => a.tokenId === ticketId);
      if (!attendee) {
        showError("This ticket is not valid for this event.");
        return;
      }

      if (attendee.isCheckedIn) {
        showError(`Ticket #${ticketId} has already been checked in.`);
        return;
      }

      checkInMutation.mutate(ticketId);

    } catch (error) {
      showError("Invalid or unreadable QR code.");
      console.error("QR parse error:", error);
    }
  };

  if (isEventLoading) return <div>Loading...</div>;
  if (!event) return <NotFound />;

  const checkedInCount = attendees?.filter(a => a.isCheckedIn).length || 0;
  const totalAttendees = attendees?.length || 0;

  return (
    <>
      <motion.div
        initial="initial" animate="animate" exit="exit" variants={pageTransition}
        className="min-h-screen text-white"
      >
        <Header />
        <main className="container mx-auto px-6 py-10 pt-28 flex-grow">
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
              <p className="text-white/70 mt-1">Attendee Management</p>
            </div>
            <Button size="lg" className="w-full md:w-auto bg-amber-400 text-amber-950 font-bold hover:bg-amber-500" onClick={() => setIsScannerOpen(true)}>
              <QrCode className="w-5 h-5 mr-2" /> Scan QR Code
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl mb-6">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-white/70">Total Attendees</p>
                <p className="text-3xl font-bold">{totalAttendees}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Checked In</p>
                <p className="text-3xl font-bold">{checkedInCount}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Attendance Rate</p>
                <p className="text-3xl font-bold">
                  {totalAttendees > 0 ? ((checkedInCount / totalAttendees) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10"><h2 className="font-semibold">Attendee List</h2></div>
            {areAttendeesLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-full bg-white/10" />
                <Skeleton className="h-8 w-full bg-white/10" />
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {attendees?.map(attendee => (
                  <li key={attendee.tokenId} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium font-mono text-sm">{attendee.walletAddress}</p>
                      <p className="text-xs text-white/60">Ticket ID: #{attendee.tokenId}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${attendee.isCheckedIn ? 'text-amber-400' : 'text-white/60'}`}>
                        {attendee.isCheckedIn ? 'Checked In' : 'Pending'}
                      </span>
                      <Switch
                        checked={attendee.isCheckedIn}
                        onCheckedChange={() => handleCheckInToggle(attendee.tokenId, attendee.isCheckedIn)}
                        disabled={attendee.isCheckedIn || checkInMutation.isPending}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </motion.div>
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleScanSuccess} />
    </>
  );
};

export default ManageEvent;