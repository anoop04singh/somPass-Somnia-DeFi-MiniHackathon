import { Header } from "@/components/Header";
import { EventCard, Event } from "@/components/EventCard";
import { Footer } from "@/components/Footer";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Somnia Network Hackathon",
    date: "Dec 15, 2024",
    location: "Virtual",
    attendees: 128,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Web3 & AI Meetup",
    date: "Dec 20, 2024",
    location: "New York, NY",
    attendees: 75,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Decentralized Future Conference",
    date: "Jan 10, 2025",
    location: "Virtual",
    attendees: 500,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Intro to Solidity Bootcamp",
    date: "Jan 18, 2025",
    location: "Online Workshop",
    attendees: 210,
    imageUrl: "/placeholder.svg",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;