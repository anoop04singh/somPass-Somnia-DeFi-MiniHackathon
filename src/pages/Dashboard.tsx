import { Header } from "@/components/Header";
import { mockEvents } from "@/data/events";
import { motion } from "framer-motion";
import { pageTransition, containerVariants, itemVariants } from "@/lib/animations";
import { DashboardEventCard } from "@/components/DashboardEventCard";

const Dashboard = () => {
  // Assuming the logged-in user organized these events
  const organizerEvents = mockEvents.slice(0, 2);

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
          className="text-5xl font-bold tracking-tight mb-8"
        >
          Organizer Dashboard
        </motion.h1>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {organizerEvents.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <DashboardEventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Dashboard;