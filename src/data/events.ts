// This is the structure of the metadata stored on IPFS
export type EventMetadata = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationDetail: string;
  imageUrl: string;
  description: string;
  organizers: Organizer[];
};

// This is the comprehensive Event object used in the frontend
export type Event = EventMetadata & {
  contractAddress: string;
  ticketPrice: number;
  ticketSupply: number;
  attendees: number; // tickets sold
  organizerAddress: string;
};

export type Organizer = {
  name: string;
  logoUrl: string;
};