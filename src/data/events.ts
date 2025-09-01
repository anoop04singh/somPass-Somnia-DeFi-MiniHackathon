export type Organizer = {
  name: string;
  logoUrl: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationDetail: string;
  attendees: number;
  imageUrl: string;
  description: string;
  organizers: Organizer[];
  ticketPrice: number;
  ticketSupply: number;
};

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Somnia Network Hackathon",
    date: "Saturday, Dec 15",
    startTime: "10:00 AM",
    endTime: "6:00 PM",
    location: "Somnia Virtual Campus",
    locationDetail: "Virtual",
    attendees: 128,
    imageUrl: "/placeholder.svg",
    description:
      "Join us for a week of intense hacking and building on the Somnia network. Compete for a prize pool of over $50,000! This is a great opportunity to learn about decentralized AI, build innovative dApps, and connect with the Somnia community.",
    organizers: [
      { name: "Somnia Foundation", logoUrl: "/placeholder.svg" },
      { name: "Dev University", logoUrl: "/placeholder.svg" },
    ],
    ticketPrice: 0,
    ticketSupply: 500,
  },
  {
    id: "2",
    title: "Web3 & AI Meetup",
    date: "Friday, Dec 20",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    location: "JW Marriott Hotel",
    locationDetail: "New York, NY",
    attendees: 75,
    imageUrl: "/placeholder.svg",
    description:
      "An exclusive meetup for developers, founders, and enthusiasts at the intersection of Web3 and AI. Featuring keynote speakers from leading projects and networking opportunities.",
    organizers: [{ name: "NYC Web3 Hub", logoUrl: "/placeholder.svg" }],
    ticketPrice: 25,
    ticketSupply: 150,
  },
  {
    id: "3",
    title: "Decentralized Future Conference",
    date: "Friday, Jan 10",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    location: "Global Virtual Summit",
    locationDetail: "Virtual",
    attendees: 500,
    imageUrl: "/placeholder.svg",
    description:
      "A global virtual conference exploring the future of decentralization. Topics include DeFi, DAOs, metaverse, and the role of AI in a trustless world. Get your early bird tickets now!",
    organizers: [{ name: "Future Events Inc.", logoUrl: "/placeholder.svg" }],
    ticketPrice: 99,
    ticketSupply: 2000,
  },
  {
    id: "4",
    title: "Intro to Solidity Bootcamp",
    date: "Saturday, Jan 18",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    location: "Online Workshop",
    locationDetail: "Virtual",
    attendees: 210,
    imageUrl: "/placeholder.svg",
    description:
      "A 2-day intensive bootcamp for beginners looking to learn Solidity and smart contract development. No prior blockchain experience required. All you need is a passion for building!",
    organizers: [{ name: "Dev University", logoUrl: "/placeholder.svg" }],
    ticketPrice: 150,
    ticketSupply: 300,
  },
];