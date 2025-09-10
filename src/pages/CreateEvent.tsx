"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Camera, Globe, Ticket, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { useAlertStore } from "@/hooks/use-alert";
import { useNavigate } from "react-router-dom";
import { useWeb3Store } from "@/store/web3Store";
import { uploadToIPFS } from "@/lib/ipfs";
import { ethers } from "ethers";
import { EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI } from "@/lib/constants";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketSupply, setTicketSupply] = useState(100);

  const showConfirmation = useAlertStore((state) => state.showConfirmation);
  const navigate = useNavigate();
  const { signer, isConnected, connectWallet } = useWeb3Store();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !signer) {
      showError("Please connect your wallet to create an event.");
      await connectWallet();
      return;
    }

    const toastId = showLoading("Uploading event details to IPFS...");
    try {
      const metadataCID = await uploadToIPFS({
        title: eventName,
        date: new Date(startDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        startTime,
        endTime,
        location,
        locationDetail: "Details to be added",
        description,
        organizers: [{ name: "My Organization", logoUrl: "" }],
      });
      
      dismissToast(toastId);
      const creationToastId = showLoading("Waiting for transaction confirmation...");

      const factoryContract = new ethers.Contract(EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, signer);
      const priceInWei = ethers.parseEther(ticketPrice.toString());
      const tx = await factoryContract.createEvent(metadataCID, priceInWei, ticketSupply);
      await tx.wait();

      dismissToast(creationToastId);
      showSuccess("Event created successfully!");
      navigate("/");

    } catch (error) {
      dismissToast(toastId);
      showError("Failed to create event. Please try again.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    showConfirmation({
      title: "Are you sure?",
      description: "Any unsaved changes will be lost.",
      confirmText: "Yes, Cancel",
      onConfirm: () => navigate("/"),
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen text-white"
    >
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-4 sticky top-28">
            <div className="relative aspect-[4/3] bg-black/20 rounded-xl flex items-center justify-center overflow-hidden">
              <h2 className="text-3xl font-bold tracking-widest z-10 text-white/80">
                EVENT IMAGE
              </h2>
              <Button
                size="icon"
                className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 rounded-full h-11 w-11"
                onClick={() => showSuccess("Image upload feature coming soon!")}
              >
                <Camera size={20} />
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-end">
              <div
                className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md text-sm cursor-pointer"
                onClick={() => showSuccess("Privacy settings coming soon!")}
              >
                <Globe size={14} />
                <span>Public</span>
              </div>
            </div>

            <Input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="text-5xl font-bold bg-transparent border-white/20 h-auto p-2 focus-visible:ring-white placeholder:text-white/40"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-5 h-5 bg-white/30 rounded-full"></div>
                  <span className="text-white/80 w-12">Start</span>
                  <Input
                    type="date"
                    className="bg-white/10 border-white/20"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <Input
                    type="time"
                    className="bg-white/10 border-white/20"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                  <span className="text-white/80 w-12">End</span>
                  <Input
                    type="date"
                    className="bg-white/10 border-white/20"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  <Input
                    type="time"
                    className="bg-white/10 border-white/20"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="📍 Add Event Location"
                  className="bg-white/10 border-white/20 placeholder:text-white/60 h-12"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <p className="text-sm text-white/60 mt-1">
                  Offline location or virtual link
                </p>
              </div>

              <Textarea
                placeholder="📝 Add Description"
                className="bg-white/10 border-white/20 placeholder:text-white/60 min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <Card className="bg-transparent border-y border-white/10 rounded-none shadow-none">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Ticket size={20} className="text-white/60" />
                    <span className="text-white/80">Ticket Price (SOM)</span>
                  </div>
                  <Input
                    type="number"
                    className="bg-white/10 border-white/20 w-24"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-white/60" />
                    <span className="text-white/80">Capacity</span>
                  </div>
                  <Input
                    type="number"
                    className="bg-white/10 border-white/20 w-24"
                    value={ticketSupply}
                    onChange={(e) => setTicketSupply(parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent border-white/30 hover:bg-white/10"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-white text-green-900 font-bold text-base h-12 hover:bg-gray-200"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default CreateEvent;