# SomPass: Decentralized Event Ticketing Platform

![SomPass](public/SompassLogoRemovebg.png)

**SomPass** is a cutting-edge, fully decentralized event ticketing platform built on the **Somnia network**. It leverages blockchain technology, NFTs, and decentralized storage to create a transparent, secure, and efficient ecosystem for event organizers and attendees.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Architecture & Workflow](#application-architecture--workflow)
- [High-Level Architecture](#high-level-architecture)
- [Event Creation Workflow](#event-creation-workflow)
- [Ticket Purchase & NFT Minting](#ticket-purchase--nft-minting)
- [Attendee Check-in Workflow](#attendee-check-in-workflow)
- [Smart Contract Design](#smart-contract-design)
- [`EventFactory.sol`](#eventfactorysol)
- [`Event.sol`](#eventsol)
- [Subgraph Implementation](#subgraph-implementation)
- [Why a Subgraph?](#why-a-subgraph)
- [How It Works](#how-it-works)
- [IPFS for Metadata](#ipfs-for-metadata)
- [QR Code System](#qr-code-system)
- [Getting Started](#getting-started)
- [Future Improvements](#future-improvements)

---

## Features

### For Attendees

- **Discover Events**: Browse a rich catalog of upcoming and past events.
- **Connect Wallet**: Seamlessly connect any EVM-compatible wallet (e.g., MetaMask).
- **Purchase NFT Tickets**: Buy event tickets as unique NFTs, ensuring true ownership.
- **Manage Tickets**: View all your tickets in one place, each with a unique QR code for entry.

### For Organizers

- **Create Events**: Easily create new events, uploading metadata and images to IPFS.
- **Manage Events**: Track ticket sales and attendance in a dedicated dashboard.
- **Secure Check-in**: Scan attendee QR codes to validate tickets and check them in on-chain.
- **Decentralized Control**: Full control over event parameters like ticket price and supply.

---

## Tech Stack

| Category             | Technology                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Frontend**         | [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling**          | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Blockchain**       | [Somnia Network](https://somnia.network/), [Solidity](https://soliditylang.org/)                |
| **Web3 Integration** | [ethers.js](https://ethers.io/)                                                                        |
| **Data Indexing**    | **Somnia Subgraphs** (powered by Ormi Labs)                                                            |
| **Decentralized Storage** | [IPFS](https://ipfs.tech/) via [Pinata](https://www.pinata.cloud/)                                       |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/)                                                               |

---

## Application Architecture & Workflow

### High-Level Architecture

The application is designed with a decentralized-first approach. The frontend interacts directly with smart contracts for core logic, IPFS for data storage, and Somnia Subgraphs for efficient data querying.

```+----------------------+          1. Create Event          +-----------------------------+
|  Browser Frontend    | -------------------------------> | EventFactory Contract       |
|  (User / Organizer)  |                                  | (Somnia Network)            |
+----------------------+                                  +-----------------------------+
| 2. Upload Metadata
v
+----------------------+
| IPFS / Pinata        |
| (Metadata storage)   |
+----------------------+

+-----------------------------+   3. Deploys    +-------------------------------+
| EventFactory Contract       | ------------->  | Event Contracts - ERC721      |
+-----------------------------+                 +-------------------------------+
|
| 4. Emits Events
v
+-------------------------------+
| Somnia Subgraphs for Indexing |
+-------------------------------+
|
| 5. Serves Data via GraphQL
v
+-------------------------------+
| Browser Frontend              |
+-------------------------------+
|
| 6. Buy / Manage Tickets
v
+-------------------------------+
| Event Contracts - ERC721      |
+-------------------------------+

```

### Event Creation Workflow

1.  **Data Entry**: An organizer fills out the "Create Event" form in the UI.
2.  **Image Upload**: The event banner and organizer logo are uploaded to IPFS via Pinata. This returns unique Content Identifiers (CIDs).
3.  **Metadata Compilation**: A JSON object containing all event details (title, date, location, image CIDs) is created.
4.  **Metadata Upload**: This JSON object is also uploaded to IPFS, creating a single, immutable metadata CID.
5.  **Contract Interaction**: The frontend calls the `createEvent` function on the `EventFactory` smart contract, passing the metadata CID, ticket price, and total supply.
6.  **Deployment**: The `EventFactory` deploys a new, unique `Event.sol` (ERC721) contract for this specific event and emits an `EventCreated` event.

### Ticket Purchase & NFT Minting

1.  **User Action**: An attendee clicks "Get Ticket" on an event's detail page.
2.  **Transaction**: The frontend initiates a transaction by calling the `buyTicket` function on that specific event's smart contract, sending the required amount of SOM tokens.
3.  **Minting**: The `Event.sol` contract validates the payment, mints a new NFT with a unique `tokenId`, and assigns it to the attendee's wallet address.
4.  **Event Emission**: The contract emits a `Transfer` event (from the zero address to the buyer), which is the standard for ERC721 mints.

### Attendee Check-in Workflow

1.  **QR Display**: The attendee navigates to "My Tickets" and displays the QR code for their ticket.
2.  **Scanning**: The event organizer uses the "Scan QR Code" feature in the dashboard, which opens a camera view.
3.  **Data Extraction**: The scanner reads the QR code, which contains a JSON payload like `{ "eventId": "0x...", "ticketId": "1" }`.
4.  **Validation & Transaction**:

    - The app first verifies that the organizer is authorized to manage the scanned `eventId`.
    - It then calls the `checkIn` function on the corresponding `Event.sol` contract with the `ticketId`.

1.  **On-Chain Update**: The smart contract marks the ticket as checked-in (`isCheckedIn = true`) and emits a `TicketCheckedIn` event. This prevents the same ticket from being used twice.

---

## Smart Contract Design

The contract architecture uses the Factory Pattern for gas efficiency and scalability.

### `EventFactory.sol`

This is a singleton contract responsible for creating and tracking all events on the platform.

- **Purpose**: To act as a registry and deployment hub for new events.
- **Key Function**: `createEvent(string memory metadataCID, uint256 ticketPrice, uint256 ticketSupply)`
- **Efficiency**: Users pay a predictable, low gas fee to create an event, as the factory's logic is simple. It keeps track of all deployed event contract addresses.

### `Event.sol`

Each event is its own standalone ERC721 contract, ensuring separation of concerns.

- **Standard**: Inherits from OpenZeppelin's `ERC721Enumerable.sol` to represent each ticket as a unique NFT.
- **Key Functions**:
    - `buyTicket()`: Handles the logic for purchasing/minting a ticket.
    - `checkIn(uint256 tokenId)`: Allows the organizer to mark a ticket as used. It includes an `onlyOwner` modifier to ensure only the event creator can call it.
- **Scalability**: Since each event is a separate contract, the platform can support countless events without bloating a single master contract.

---

## Subgraph Implementation

### Why a Subgraph?

Reading data directly from the blockchain is slow, expensive, and not scalable for complex queries (e.g., "get all tickets owned by this user" or "find all events created by this organizer"). **Somnia Subgraphs** index blockchain data and serve it through a high-performance GraphQL API, making the frontend fast and responsive.

### How It Works

Our subgraph listens to events emitted by our smart contracts and organizes the data into easily queryable entities.

```

+-----------------------------------+
|   On-Chain                       |
|-----------------------------------|
|                                   |
|  +-----------------------------+  |
|  | EventFactory &              |  |
|  | Event Contracts             |  |
|  +-----------------------------+  |
|                | Emits Events     |
+----------------|------------------+
v
+-----------+
| Event Logs|
+-----------+

+-----------------------------------+
| Off-Chain (Somnia Subgraphs)      |
|-----------------------------------|
|                                   |
|  +-----------------------------+  |
|  | Subgraph Node               |  |
|  +-----------------------------+  |
|                | Ingests          |
+----------------|------------------+
v
+-----------+
| Event Logs|
+-----------+
|
| Processes via mapping.ts
v
+---------------------+
| Indexed Data Store  |
+---------------------+
|
| Serves
v
+---------------------+
| GraphQL API         |
+---------------------+

+-----------------------------------+
| Client                           |
|-----------------------------------|
|                                   |
|  +-----------------------------+  |
|  | SomPass Frontend            |  |
|  +-----------------------------+  |
|                | Queries          |
+----------------|------------------+
v
+---------------------+
| GraphQL API         |
+---------------------+

```

- **`subgraph.yaml` (The Manifest)**: This file tells the Subgraph Node which contracts to watch. We define the `EventFactory` as a primary data source. Crucially, we use a `template` for the `Event` contract. When `handleEventCreated` is triggered, it dynamically creates a new data source to start indexing the newly deployed event contract.
- **`schema.graphql`**: Defines the shape of our data. We have two main entities: `Event` and `Ticket`.
- **`mapping.ts` (The Handlers)**: This is the core logic that translates blockchain events into stored entities.
    - `handleEventCreated`: Creates a new `Event` entity and instantiates the dynamic template.
    - `handleTransfer`: If it's a mint, it creates a `Ticket` entity and links it to the parent `Event`.
    - `handleTicketCheckedIn`: Loads the relevant `Ticket` entity and updates its `isCheckedIn` status.

---

## IPFS for Metadata

All event metadata (title, description, images) is stored on IPFS to keep the platform decentralized and to avoid the high cost of storing large data on-chain.

- **Process**: We use the Pinata service to easily "pin" our data to the IPFS network, ensuring it remains available.
- **On-Chain Link**: The only thing stored on the smart contract is the final metadata CID. The frontend fetches this CID, retrieves the JSON from an IPFS gateway, and then renders the event details.

**Example `EventMetadata` JSON object uploaded to IPFS:**

```

{
"title": "Somnia Genesis Conference",
"startDate": "2024-12-01T00:00:00.000Z",
"endDate": "2024-12-02T00:00:00.000Z",
"startTime": "09:00",
"endTime": "17:00",
"location": "Lisbon, Portugal",
"locationDetail": "Lisbon Congress Centre",
"description": "The first annual conference for developers and creators in the Somnia ecosystem.",
"imageUrl": "ipfs://QmXaYb.../event_banner.png",
"organizers": [
{
"name": "Somnia Foundation",
"logoUrl": "ipfs://QmR3fG.../somnia_logo.png"
}
],
"purchaseLimit": 2
}

```

---

## QR Code System

The QR code is the key to the check-in process, bridging the digital NFT ticket with physical event access.

- **Generation**: The QR code is generated client-side in the "My Tickets" page using the `qrcode.react` library.
- **Data Payload**: To keep it simple and efficient, the QR code contains a stringified JSON object with the minimum data required for validation.

**Example QR Code Data:**

```

{
"eventId": "0x9033f9e52E26Ed90D02192ec84E116479a983463",
"ticketId": "1"
}

```

- **`eventId`**: The contract address of the event.
- **`ticketId`**: The unique token ID of the NFT ticket.

This design ensures that no sensitive information is exposed. The validation happens on-chain, making the process trustless and secure.

---

## Getting Started

To run this project locally, follow these steps:

**Prerequisites:**

- Node.js (v18 or later)
- A package manager (npm, yarn, or pnpm)
- A browser with a Web3 wallet extension (e.g., MetaMask) configured for the Somnia Testnet.

**Installation:**

1.  Clone the repository:

```

git clone <repository-url>
cd sompass-project

```

1.  Install dependencies:

```

npm install

```

1.  Set up environment variables. Create a `.env` file by copying `.env.example`:

```

cp .env.example .env

```

Fill in your Pinata API keys in the `.env` file:

```

VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key

```

1.  Run the development server:

```

npm run dev
```

The application will be available at `http://localhost:8080`.

---

## Future Improvements

- **Secondary Marketplace**: Allow users to buy and sell tickets on an open, secondary market.
- **Enhanced Analytics**: Provide organizers with more detailed dashboards on sales trends and attendee demographics.
- **Event Notifications**: Implement a notification system for event updates or reminders.
- **Multi-chain Support**: Expand the platform to other EVM-compatible chains.
- **Customizable Tickets**: Allow organizers to create different ticket tiers (e.g., VIP, General Admission).