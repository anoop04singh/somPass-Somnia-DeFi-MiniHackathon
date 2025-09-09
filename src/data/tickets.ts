import { Event } from "./events";

export type Ticket = {
  id: string; // This will be the tokenId
  event: Event;
  eventId: string; // This is the event contract address
};