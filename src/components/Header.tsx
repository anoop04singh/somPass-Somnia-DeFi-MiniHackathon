import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 h-16">
        <Link to="/" className="text-xl font-bold text-primary tracking-tight">
          SomPas
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Discover
          </Link>
          <Link
            to="/create"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Create Event
          </Link>
          <Link
            to="/my-tickets"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            My Tickets
          </Link>
        </nav>
        <Button variant="outline">Connect Wallet</Button>
      </div>
    </header>
  );
};