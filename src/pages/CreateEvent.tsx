"use client";

import React, { useState } from "react";
import {
  Camera,
  Globe,
  Ticket,
  UserCheck,
  Users,
  X,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { showError, showSuccess } from "@/utils/toast";

// A custom header component specific to this page, based on the HTML file
const CreateEventHeader = () => (
  <header className="flex justify-between items-center p-4 md:p-6 text-white">
    <div className="flex items-center gap-8">
      <a href="/" className="text-lg font-medium">
        ✦
      </a>
      <nav className="hidden md:flex items-center gap-8">
        <a
          href="#"
          className="flex items-center gap-2 text-sm font-medium opacity-100"
        >
          📅 Events
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          📆 Calendars
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          🔍 Discover
        </a>
      </nav>
    </div>
    <div className="flex items-center gap-4 md:gap-6">
      <Button
        variant="ghost"
        size="icon"
        className="opacity-70 hover:opacity-100 hover:bg-white/10"
      >
        <Search size={18} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-70 hover:opacity-100 hover:bg-white/10"
      >
        <Bell size={18} />
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-white text-green-900 font-bold">
          S
        </AvatarFallback>
      </Avatar>
    </div>
  </header>
);

const CreateEvent = () => {
  const [eventName, setEventName] = useState("Event Name");
  const [isEditingName, setIsEditingName] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEventName(e.target.value || "Event Name");
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    showSuccess("Event created successfully! (Simulation)");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
      }}
      className="min-h-screen text-white font-sans"
    >
      <CreateEventHeader />
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Side - Image Section */}
          <div className="space-y-4 sticky top-10">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.05) 2px, rgba(255, 255, 255, 0.05) 20px)",
                }}
              ></div>
              <h2 className="text-3xl font-bold tracking-widest z-10">
                YOU ARE INVITED
              </h2>
              <Button
                size="icon"
                className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 rounded-full h-11 w-11"
              >
                <Camera size={20} />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="opacity-80">Theme</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-purple-300 to-white"></div>
                <span>Minimal</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20"
              >
                <Settings size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-red-400"></AvatarFallback>
                </Avatar>
                <span className="text-base">Personal Calendar</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md text-sm cursor-pointer">
                <Globe size={14} />
                <span>Public</span>
              </div>
            </div>

            {isEditingName ? (
              <Input
                type="text"
                defaultValue={eventName}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="text-5xl font-bold bg-transparent border-white/30 h-auto p-2 focus-visible:ring-white"
              />
            ) : (
              <h1
                onClick={() => setIsEditingName(true)}
                className="text-5xl font-bold cursor-pointer min-h-[60px]"
              >
                {eventName}
              </h1>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-5 h-5 bg-white/30 rounded-full"></div>
                  <span className="opacity-80 w-12">Start</span>
                  <Input
                    type="date"
                    className="bg-white/10 border-white/20"
                    defaultValue="2024-09-02"
                  />
                  <Input
                    type="time"
                    className="bg-white/10 border-white/20"
                    defaultValue="00:00"
                  />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                  <span className="opacity-80 w-12">End</span>
                  <Input
                    type="date"
                    className="bg-white/10 border-white/20"
                    defaultValue="2024-09-02"
                  />
                  <Input
                    type="time"
                    className="bg-white/10 border-white/20"
                    defaultValue="01:00"
                  />
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="📍 Add Event Location"
                  className="bg-white/10 border-white/20 placeholder:text-white/60 h-12"
                />
                <p className="text-sm opacity-60 mt-1">
                  Offline location or virtual link
                </p>
              </div>

              <Textarea
                placeholder="📝 Add Description"
                className="bg-white/10 border-white/20 placeholder:text-white/60 min-h-[100px]"
              />

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2 opacity-90">
                  Event Options
                </h3>
                <div className="border-y border-white/10">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <Ticket size={20} className="opacity-70" />
                      <span>Tickets</span>
                    </div>
                    <span className="opacity-80">Free 🔗</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <UserCheck size={20} className="opacity-70" />
                      <span>Require Approval</span>
                    </div>
                    <Switch
                      checked={requireApproval}
                      onCheckedChange={setRequireApproval}
                    />
                  </div>
                  <div className="flex items-center justify-between py-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <Users size={20} className="opacity-70" />
                      <span>Capacity</span>
                    </div>
                    <span className="opacity-80">Unlimited 🔗</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-green-900 font-bold text-base h-12 hover:bg-gray-200"
              >
                Create Event
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;