import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  Share2,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { EVENT_ABI } from "@/lib/constants";
import { Event } from "@/data/events";
import { useWeb3Store } from "@/store/web3Store";
import { Skeleton } from "@/components/ui/skeleton";
import { querySubgraph, mapSubgraphEventToEvent, SubgraphEvent } from "@/lib/subgraph";

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

const EventDetail = () => {
  const { address } = useParams<{ address: string }>();
  const { signer, isConnected, connectWallet } = useWeb3Store();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", address],
    queryFn: () => fetchEventDetail(address!),
    enabled: !!address,
  });

  const handleBuyTicket = async () => {
    if (!isConnected || !signer || !address) {
      showError("Please connect your wallet first.");
      await connectWallet();
      return;
    }
    if (!event) return;

    const toastId = showLoading("Processing transaction...");
    try {
      const eventContract = new ethers.Contract(address, EVENT_ABI, signer);
      const price = ethers.parseEther(event.ticketPrice.toString());
      const tx = await eventContract.buyTicket({ value: price });
      await tx.wait();
      dismissToast(toastId);
      showSuccess("Ticket purchased successfully!");
    } catch (err) {
      dismissToast(toastId);
      showError("Transaction failed. Please try again.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white p-8 pt-28">
        <Skeleton className="h-8 w-48 mb-12 bg-white/10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <Skeleton className="w-full aspect-square rounded-2xl bg-white/10" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-16 w-3/4 bg-white/10" />
            <Skeleton className="h-8 w-1/2 bg-white/10" />
            <Skeleton className="h-24 w-full bg-white/10" />
            <Skeleton className="h-40 w-full bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return <NotFound />;
  }

  const getEventDateDisplay = () => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    if (isNaN(startDate.getTime())) return "Date to be determined";

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    if (startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString("en-US", options);
    }
    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
  };

  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
  const [endHours, endMinutes] = event.endTime.split(':').map(Number);
  if (!isNaN(eventEndDate.getTime())) {
    eventEndDate.setUTCHours(endHours, endMinutes);
  }
  const isEventOver = !isNaN(eventEndDate.getTime()) && eventEndDate < new Date();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen text-white"
    >
      <Header />
      <main className="flex-grow container mx-auto px-6 py-10 pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all events
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="lg:col-span-1 space-y-8">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full aspect-square object-cover rounded-2xl shadow-lg"
              />
              <div>
                <h3 className="font-semibold text-xl mb-4">Hosted By</h3>
                <ul className="space-y-4">
                  {event.organizers.map((organizer) => (
                    <li
                      key={organizer.name}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={organizer.logoUrl}
                          alt={organizer.name}
                        />
                        <AvatarFallback>
                          {organizer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-white/80">
                        {organizer.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 rounded-lg p-3 mt-1 border border-white/10">
                    <Calendar className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-semibold">{getEventDateDisplay()}</p>
                    <p className="text-white/60 text-sm">{`${event.startTime} - ${event.endTime}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 rounded-lg p-3 mt-1 border border-white/10">
                    <MapPin className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.location}</p>
                    <p className="text-white/60 text-sm">
                      {event.locationDetail}
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/10 shadow-sm mb-8 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="font-semibold text-lg">
                      {event.ticketPrice === 0
                        ? "Free"
                        : `${event.ticketPrice} SOM`}
                    </div>
                    {isEventOver ? (
                      <Button size="lg" disabled className="w-full sm:w-auto bg-gray-500 text-white/80">
                        <Clock className="w-4 h-4 mr-2" />
                        Event Has Ended
                      </Button>
                    ) : (
                      <Button
                        onClick={handleBuyTicket}
                        size="lg"
                        className="w-full sm:w-auto bg-amber-400 text-amber-950 font-bold hover:bg-amber-500"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Get Ticket
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mb-6">
                    {event.ticketSupply - event.attendees} spots left
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full bg-white/10 hover:bg-white/20"
                    onClick={() => showSuccess("Invite link copied to clipboard!")}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Invite a Friend
                  </Button>
                </CardContent>
              </Card>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  About this event
                </h2>
                <p className="text-white/80">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default EventDetail;