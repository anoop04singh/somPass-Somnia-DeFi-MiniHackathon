import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, User, Wallet, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showSuccess } from "@/utils/toast";
import { ProfileModal } from "./ProfileModal";

export const Header = () => {
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Discover" },
    { href: "/create", label: "Create Event" },
    { href: "/my-tickets", label: "My Tickets" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <>
      <header className="absolute top-0 z-50 w-full text-white">
        <div className="container mx-auto flex items-center justify-between p-4 h-20">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight opacity-90"
            >
              SomPas
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm transition-opacity ${
                    location.pathname === item.href || (item.href === "/dashboard" && location.pathname.startsWith("/dashboard"))
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
              onClick={() => showSuccess("Search feature coming soon!")}
            >
              <Search size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => showSuccess("Notifications will appear here!")}
            >
              <Bell size={18} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white text-green-900 font-bold">
                      S
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-black/50 backdrop-blur-lg border-white/20 text-white"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Satoshi</p>
                    <p className="text-xs leading-none text-white/70">
                      satoshi@somnia.net
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem
                  onSelect={() => setIsProfileModalOpen(true)}
                  className="focus:bg-white/10 focus:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => showSuccess("Connecting wallet...")}
                  className="focus:bg-white/10 focus:text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Connect Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => showSuccess("Settings page coming soon!")}
                  className="focus:bg-white/10 focus:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem
                  onClick={() => showSuccess("Logged out successfully!")}
                  className="focus:bg-white/10 focus:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};