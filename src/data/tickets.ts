import { Event, mockEvents } from "./events";

export type Ticket = {
  id: string;
  eventId: string;
  purchaseDate: string;
  event: Event;
};

// Find events from mock data to ensure data consistency
const event2 = mockEvents.find((e) => e.id === "2");
const event4 = mockEvents.find((e) => e.id === "4");

export const mockUserTickets: Ticket[] = [];

if (event2) {
  mockUserTickets.push({
    id: "t1",
    eventId: "2",
    purchaseDate: "Nov 30, 2024",
    event: event2,
  });
}

if (event4) {
  mockUserTickets.push({
    id: "t2",
    eventId: "4",
    purchaseDate: "Dec 05, 2024",
    event: event4,
  });
}