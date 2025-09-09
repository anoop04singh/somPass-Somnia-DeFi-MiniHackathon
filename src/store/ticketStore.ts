import { create } from "zustand";
import { Ticket, mockUserTickets } from "@/data/tickets";
import { Event } from "@/data/events";

interface TicketStore {
  tickets: Ticket[];
  addTicket: (event: Event) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: mockUserTickets,
  addTicket: (event) => {
    const newTicket: Ticket = {
      id: `t${Date.now()}`,
      eventId: event.id,
      purchaseDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2024",
      }),
      event: event,
    };
    set((state) => ({ tickets: [...state.tickets, newTicket] }));
  },
}));