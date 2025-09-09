import { Event, EventMetadata } from "@/data/events";
import { getIPFSUrl } from "./ipfs";
import { ethers } from "ethers";

const SUBGRAPH_URL = "https://api.subgraph.somnia.network/api/public/2fa4ad73-dae8-47a2-8b88-5e758e66eb86/subgraphs/eventfactory2/0.2/gn";

export const querySubgraph = async <T>(query: string, variables?: Record<string, any>): Promise<T> => {
  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Subgraph query failed: ${response.statusText}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    console.error('Subgraph errors:', errors);
    throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
  }

  return data;
};

// This is the shape of the Event data returned by the subgraph
export interface SubgraphEvent {
  id: string; // contract address
  metadataCID: string;
  organizer: string;
  ticketPrice: string;
  ticketSupply: string;
  totalTicketsSold: string;
}

// This function takes a raw event from the subgraph, fetches its metadata from IPFS,
// and maps it to the frontend's 'Event' type.
export const mapSubgraphEventToEvent = async (subgraphEvent: SubgraphEvent): Promise<Event> => {
  const metadataUrl = getIPFSUrl(subgraphEvent.metadataCID);
  const metadataResponse = await fetch(metadataUrl);
  const metadata: EventMetadata = await metadataResponse.json();

  return {
    ...metadata,
    contractAddress: subgraphEvent.id,
    organizerAddress: subgraphEvent.organizer,
    ticketPrice: Number(ethers.formatEther(subgraphEvent.ticketPrice)),
    ticketSupply: Number(subgraphEvent.ticketSupply),
    attendees: Number(subgraphEvent.totalTicketsSold),
  };
};