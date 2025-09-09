import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  pageTransition,
  containerVariants,
  itemVariants,
} from "@/lib/animations";
import { useEventStore } from "@/store/eventStore";

const Index = () => {
  const events = useEventStore((state) => state.events);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
      }}
    >
      <Header />
      <main className="container mx-auto px-6 py-10 pt-28 flex-grow">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold mb-10 tracking-tight"
        >
          Upcoming Events
        </motion.h1>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link to={`/event/${event.id}`}>
                <EventCard event={event} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Index;