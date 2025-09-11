import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useWeb3Store } from "@/store/web3Store";
import { AddressAvatar } from "./AddressAvatar";

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
          <DialogTitle className="text-white text-center">User Profile</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Your connected account details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            {account && <AddressAvatar address={account} className="h-24 w-24" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-white/80 text-center block">
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
            className="w-full bg-transparent border-white/30 hover:bg-white/10"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};