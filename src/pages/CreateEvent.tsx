import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CreateEvent = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Event</h1>
          <p className="text-muted-foreground">
            The event creation form will be built here in the next phase,
            following the Luma-inspired design.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEvent;