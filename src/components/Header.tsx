import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, User, Wallet, LogOut } from "lucide-react";
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
import { useWeb3Store } from "@/store/web3Store";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { AddressAvatar } from "./AddressAvatar";

export const Header = () => {
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { disconnectWallet, isConnected, account, openConnectModal } = useWeb3Store();

  const navItems = [
    { href: "/", label: "Discover" },
    { href: "/create", label: "Create Event" },
    { href: "/my-tickets", label: "My Tickets" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <>
      <header className="fixed top-0 z-50 w-full text-white bg-black/10 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between p-4 h-20">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)] transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.9)]"
            >
              SomPass
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
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 p-0 rounded-full"
                  >
                    {account && <AddressAvatar address={account} className="h-8 w-8" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 dialog-glow text-white"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Connected</p>
                      <p className="text-xs leading-none text-white/70 truncate">
                        {account}
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
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => {
                      disconnectWallet();
                      showSuccess("Logged out successfully!");
                    }}
                    className="focus:bg-white/10 focus:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={openConnectModal}
                className="bg-amber-400 text-amber-950 font-bold hover:bg-amber-500"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ConnectWalletModal />
    </>
  );
};