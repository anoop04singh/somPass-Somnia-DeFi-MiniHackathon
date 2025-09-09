import { create } from "zustand";
import { Event, mockEvents } from "@/data/events";

interface NewEventData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

interface EventStore {
  events: Event[];
  addEvent: (eventData: NewEventData) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: mockEvents,
  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: `e${Date.now()}`,
      locationDetail: "Virtual",
      attendees: 0,
      imageUrl: "/placeholder.svg",
      organizers: [{ name: "My Organization", logoUrl: "/placeholder.svg" }],
      ticketPrice: 0,
      ticketSupply: 1000,
    };
    set((state) => ({ events: [newEvent, ...state.events] }));
  },
}));