import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Discover" },
    { href: "/create", label: "Create Event" },
    { href: "/my-tickets", label: "My Tickets" },
  ];

  return (
    <header className="absolute top-0 z-50 w-full text-white">
      <div className="container mx-auto flex items-center justify-between p-4 h-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-semibold tracking-tight opacity-90">
            SomPas
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm transition-opacity ${
                  location.pathname === item.href
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-70 hover:opacity-100 transition-opacity"
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