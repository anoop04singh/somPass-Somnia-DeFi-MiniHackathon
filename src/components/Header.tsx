import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 text-white">
      <div className="container mx-auto flex items-center justify-between p-4 h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            SomPas
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              Discover
            </Link>
            <Link
              to="/create"
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              Create Event
            </Link>
            <Link
              to="/my-tickets"
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              My Tickets
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-70 hover:opacity-100 hover:bg-white/10"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-70 hover:opacity-100 hover:bg-white/10"
          >
            <Bell size={18} />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-white text-green-900 font-bold">
              S
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};