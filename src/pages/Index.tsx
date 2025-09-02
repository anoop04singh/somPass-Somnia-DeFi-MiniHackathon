import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/data/events";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
      }}
    >
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {mockEvents.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id}>
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;