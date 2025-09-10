import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useWeb3Store } from "@/store/web3Store";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { account } = useWeb3Store();
  const walletAddress = account || "No wallet connected";

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      showSuccess("Wallet address copied!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dialog-glow text-white">
        <DialogHeader>
          <DialogTitle className="text-white">User Profile</DialogTitle>
          <DialogDescription className="text-white/70">
            Your connected account details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-amber-400 text-amber-950 font-bold text-2xl">
                {account?.substring(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg">Connected User</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-white/80">
              Wallet Address
            </label>
            <div className="flex items-center justify-between rounded-md border border-white/20 bg-black/20 px-3 py-2">
              <p className="text-sm font-mono truncate">{walletAddress}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyAddress}
                className="hover:bg-white/20"
                disabled={!account}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-transparent border-white/30 hover:bg-white/10"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};