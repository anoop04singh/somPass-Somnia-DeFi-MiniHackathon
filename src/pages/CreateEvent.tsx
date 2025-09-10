"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { UploadCloud, Ticket, Users, UserCheck, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { useAlertStore } from "@/hooks/use-alert";
import { useNavigate } from "react-router-dom";
import { useWeb3Store } from "@/store/web3Store";
import { uploadFileToIPFS, uploadMetadataToIPFS, getIPFSUrl } from "@/lib/ipfs";
import { ethers } from "ethers";
import { EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI } from "@/lib/constants";

const CreateEvent = () => {
  // Form state
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketSupply, setTicketSupply] = useState(100);
  const [purchaseLimit, setPurchaseLimit] = useState(1);
  const [organizerName, setOrganizerName] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [organizerLogoFile, setOrganizerLogoFile] = useState<File | null>(null);
  const [organizerLogoPreview, setOrganizerLogoPreview] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const showConfirmation = useAlertStore((state) => state.showConfirmation);
  const navigate = useNavigate();
  const { signer, isConnected, connectWallet } = useWeb3Store();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrganizerLogoFile(file);
      setOrganizerLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !signer) {
      showError("Please connect your wallet to create an event.");
      await connectWallet();
      return;
    }
    if (!imageFile || !organizerLogoFile) {
      showError("Please upload both an event image and an organizer logo.");
      return;
    }

    let toastId = showLoading("Uploading images...");
    try {
      const [imageCID, logoCID] = await Promise.all([
        uploadFileToIPFS(imageFile),
        uploadFileToIPFS(organizerLogoFile),
      ]);
      const imageUrl = getIPFSUrl(imageCID);
      const logoUrl = getIPFSUrl(logoCID);

      dismissToast(toastId);
      toastId = showLoading("Uploading event details...");

      const metadataCID = await uploadMetadataToIPFS({
        title: eventName,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        startTime,
        endTime,
        location,
        locationDetail: "Details to be added",
        description,
        imageUrl,
        organizers: [{ name: organizerName, logoUrl: logoUrl }],
        purchaseLimit,
      });
      
      dismissToast(toastId);
      toastId = showLoading("Waiting for transaction confirmation...");

      const factoryContract = new ethers.Contract(EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI, signer);
      const priceInWei = ethers.parseEther(ticketPrice.toString());
      const tx = await factoryContract.createEvent(metadataCID, priceInWei, ticketSupply);
      await tx.wait();

      dismissToast(toastId);
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
      <main className="max-w-6xl mx-auto px-6 py-10 pt-28">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Create a New Event</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8 sticky top-28">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Event Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                  />
                  <div
                    className="relative aspect-video bg-black/20 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 cursor-pointer hover:border-amber-400/50 hover:bg-black/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-white/60">
                        <UploadCloud className="mx-auto h-12 w-12" />
                        <p className="mt-2">Click to upload</p>
                        <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Ticketing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-price">Ticket Price (SOM)</Label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                      <Input id="ticket-price" type="number" value={ticketPrice} onChange={(e) => setTicketPrice(parseFloat(e.target.value))} className="bg-white/10 border-white/20 pl-10" step="0.01" min="0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                      <Input id="capacity" type="number" value={ticketSupply} onChange={(e) => setTicketSupply(parseInt(e.target.value))} className="bg-white/10 border-white/20 pl-10" min="1" />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="purchase-limit">Tickets per Wallet</Label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                      <Input id="purchase-limit" type="number" value={purchaseLimit} onChange={(e) => setPurchaseLimit(parseInt(e.target.value))} className="bg-white/10 border-white/20 pl-10" min="1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input id="event-name" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="bg-white/10 border-white/20" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white/10 border-white/20" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/10 border-white/20 min-h-[100px]" required />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Organizer</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-2">
                    <Label htmlFor="organizer-name">Organizer Name</Label>
                    <Input id="organizer-name" type="text" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} className="bg-white/10 border-white/20" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Organizer Logo</Label>
                    <div className="flex items-center gap-4">
                      <input type="file" ref={logoFileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                      <div className="relative w-20 h-20 bg-black/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 cursor-pointer hover:border-amber-400/50" onClick={() => logoFileInputRef.current?.click()}>
                        {organizerLogoPreview ? (
                          <img src={organizerLogoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-8 h-8 text-white/60" />
                        )}
                      </div>
                      <Button type="button" variant="outline" className="bg-transparent border-white/30 hover:bg-white/10" onClick={() => logoFileInputRef.current?.click()}>Upload Logo</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event Start</Label>
                      <div className="flex gap-2">
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white/10 border-white/20" required />
                        <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-white/10 border-white/20" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Event End</Label>
                      <div className="flex gap-2">
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white/10 border-white/20" required />
                        <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-white/10 border-white/20" required />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4 pt-8 mt-8 border-t border-white/10">
            <Button type="button" variant="outline" className="w-full lg:w-auto bg-transparent border-white/30 hover:bg-white/10 h-12 text-base" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="w-full lg:w-auto flex-grow bg-amber-400 text-amber-950 font-bold text-base h-12 hover:bg-amber-500">
              Create Event
            </Button>
          </div>
        </form>
      </main>
    </motion.div>
  );
};

export default CreateEvent;