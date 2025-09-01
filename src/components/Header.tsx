import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          SomPas
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Discover
          </Link>
          <Link
            to="/create"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Create Event
          </Link>
        </nav>
        <Button>Connect Wallet</Button>
      </div>
    </header>
  );
};