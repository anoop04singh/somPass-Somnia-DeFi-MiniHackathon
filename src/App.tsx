import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import MyTickets from "./pages/MyTickets";
import Dashboard from "./pages/Dashboard";
import ManageEvent from "./pages/ManageEvent";
import NotFound from "./pages/NotFound";
import { AnimatePresence } from "framer-motion";
import { AlertProvider } from "./components/AlertProvider";
import { CursorGlow } from "./components/CursorGlow";
import { useWeb3Store } from "./store/web3Store";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/event/:address" element={<EventDetail />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/event/:address" element={<ManageEvent />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    useWeb3Store.getState().init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorGlow />
        <Toaster />
        <Sonner />
        <AlertProvider />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;