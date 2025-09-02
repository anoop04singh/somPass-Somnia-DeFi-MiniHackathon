"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import {
  Camera,
  Globe,
  Ticket,
  UserCheck,
  Users,
  X,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";

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
    showSuccess("Event created successfully! (Simulation)");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
      }}
      className="min-h-screen text-white font-sans"
    >
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-4 sticky top-28">
            <div className="relative aspect-[4/3] bg-black/20 rounded-xl flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.05) 2px, rgba(255, 255, 255, 0.05) 20px)",
                }}
              ></div>
              <h2 className="text-3xl font-bold tracking-widest z-10 text-white/80">
                YOU ARE INVITED
              </h2>
              <Button
                size="icon"
                className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 rounded-full h-11 w-11"
              >
                <Camera size={20} />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/80">Theme</span>
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

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-red-400"></AvatarFallback>
                </Avatar>
                <span className="text-base text-white/80">Personal Calendar</span>
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
                className="text-5xl font-bold bg-transparent border-white/20 h-auto p-2 focus-visible:ring-white"
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
                  <span className="text-white/80 w-12">Start</span>
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
                  <span className="text-white/80 w-12">End</span>
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
                <p className="text-sm text-white/60 mt-1">
                  Offline location or virtual link
                </p>
              </div>

              <Textarea
                placeholder="📝 Add Description"
                className="bg-white/10 border-white/20 placeholder:text-white/60 min-h-[100px]"
              />

              <Card className="bg-transparent border-y border-white/10 rounded-none shadow-none">
                <h3 className="text-lg font-semibold mb-2 text-white/80 sr-only">
                  Event Options
                </h3>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Ticket size={20} className="text-white/60" />
                    <span className="text-white/80">Tickets</span>
                  </div>
                  <span className="text-white/60">Free 🔗</span>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <UserCheck size={20} className="text-white/60" />
                    <span className="text-white/80">Require Approval</span>
                  </div>
                  <Switch
                    checked={requireApproval}
                    onCheckedChange={setRequireApproval}
                  />
                </div>
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-white/60" />
                    <span className="text-white/80">Capacity</span>
                  </div>
                  <span className="text-white/60">Unlimited 🔗</span>
                </div>
              </Card>

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