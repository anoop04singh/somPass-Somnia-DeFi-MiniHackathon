export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  imageUrl: string;
  description: string;
  organizer: string;
  ticketPrice: number;
  ticketSupply: number;
};

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Somnia Network Hackathon",
    date: "Dec 15, 2024",
    location: "Virtual",
    attendees: 128,
    imageUrl: "/placeholder.svg",
    description:
      "Join us for a week of intense hacking and building on the Somnia network. Compete for a prize pool of over $50,000! This is a great opportunity to learn about decentralized AI, build innovative dApps, and connect with the Somnia community.",
    organizer: "Somnia Foundation",
    ticketPrice: 0,
    ticketSupply: 500,
  },
  {
    id: "2",
    title: "Web3 & AI Meetup",
    date: "Dec 20, 2024",
    location: "New York, NY",
    attendees: 75,
    imageUrl: "/placeholder.svg",
    description:
      "An exclusive meetup for developers, founders, and enthusiasts at the intersection of Web3 and AI. Featuring keynote speakers from leading projects and networking opportunities.",
    organizer: "NYC Web3 Hub",
    ticketPrice: 25,
    ticketSupply: 150,
  },
  {
    id: "3",
    title: "Decentralized Future Conference",
    date: "Jan 10, 2025",
    location: "Virtual",
    attendees: 500,
    imageUrl: "/placeholder.svg",
    description:
      "A global virtual conference exploring the future of decentralization. Topics include DeFi, DAOs, metaverse, and the role of AI in a trustless world. Get your early bird tickets now!",
    organizer: "Future Events Inc.",
    ticketPrice: 99,
    ticketSupply: 2000,
  },
  {
    id: "4",
    title: "Intro to Solidity Bootcamp",
    date: "Jan 18, 2025",
    location: "Online Workshop",
    attendees: 210,
    imageUrl: "/placeholder.svg",
    description:
      "A 2-day intensive bootcamp for beginners looking to learn Solidity and smart contract development. No prior blockchain experience required. All you need is a passion for building!",
    organizer: "Dev University",
    ticketPrice: 150,
    ticketSupply: 300,
  },
];