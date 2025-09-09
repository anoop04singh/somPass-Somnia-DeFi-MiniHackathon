import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  EventCreated,
} from "../generated/EventFactory/EventFactory";
import {
  Transfer,
  TicketCheckedIn,
} from "../generated/templates/Event/Event";
import { Event, Ticket } from "../generated/schema";
import { Event as EventTemplate } from "../generated/templates";

// Handles the EventCreated event from the EventFactory contract
export function handleEventCreated(event: EventCreated): void {
  // FIX: Use the hex string for the ID to make the entity mutable.
  let eventId = event.params.eventContract.toHexString();
  let eventEntity = new Event(eventId);

  // Populate the entity with data from the event
  eventEntity.organizer = event.params.organizer;
  eventEntity.metadataCID = event.params.metadataCID;
  eventEntity.ticketPrice = event.params.ticketPrice;
  eventEntity.ticketSupply = event.params.ticketSupply;
  eventEntity.totalTicketsSold = BigInt.fromI32(0);
  eventEntity.createdAtTimestamp = event.block.timestamp;
  eventEntity.createdAtBlockNumber = event.block.number;

  // Save the new Event entity
  eventEntity.save();

  // Start indexing the new Event contract by creating a dynamic data source from the template
  EventTemplate.create(event.params.eventContract);
}

// Handles the Transfer event from an Event contract (ERC721 standard)
export function handleTransfer(event: Transfer): void {
  // Create a unique ID for the ticket: {eventAddress}-{tokenId}
  let ticketId =
    event.address.toHexString() + "-" + event.params.tokenId.toString();
  
  // FIX: Get the event's string ID.
  let eventId = event.address.toHexString();

  // Check if this is a mint event (from the zero address)
  if (event.params.from == Address.zero()) {
    // This is a new ticket being bought/minted
    let ticket = new Ticket(ticketId);
    ticket.tokenId = event.params.tokenId;
    ticket.owner = event.params.to;
    // FIX: The 'event' field expects the Event's string ID.
    ticket.event = eventId;
    ticket.isCheckedIn = false;
    ticket.mintedAtTimestamp = event.block.timestamp;
    ticket.mintedAtBlockNumber = event.block.number;
    ticket.save();

    // Update the totalTicketsSold count on the parent Event
    // FIX: Load the event using its string ID.
    let eventEntity = Event.load(eventId);
    if (eventEntity) {
      eventEntity.totalTicketsSold = eventEntity.totalTicketsSold.plus(
        BigInt.fromI32(1)
      );
      eventEntity.save();
    }
  } else {
    // This is a transfer from one user to another
    let ticket = Ticket.load(ticketId);
    if (ticket) {
      ticket.owner = event.params.to;
      ticket.save();
    }
  }
}

// Handles the TicketCheckedIn event from an Event contract
export function handleTicketCheckedIn(event: TicketCheckedIn): void {
  // Create the unique ID for the ticket
  let ticketId =
    event.address.toHexString() + "-" + event.params.tokenId.toString();
  
  // Load the existing ticket
  let ticket = Ticket.load(ticketId);

  // Update its check-in status and timestamp
  if (ticket) {
    ticket.isCheckedIn = true;
    ticket.checkInTimestamp = event.block.timestamp;
    ticket.save();
  }
}