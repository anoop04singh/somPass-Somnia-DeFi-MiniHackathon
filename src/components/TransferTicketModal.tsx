import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket } from "@/data/tickets";
import { useWeb3Store } from "@/store/web3Store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { EVENT_ABI } from "@/lib/constants";
import { showSuccess, showError } from "@/utils/toast";
import { useAlertStore } from "@/hooks/use-alert";
import { LoaderCircle } from "lucide-react";

interface TransferTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const TransferTicketModal = ({ isOpen, onClose, ticket }: TransferTicketModalProps) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const { signer, account } = useWeb3Store();
  const queryClient = useQueryClient();
  const showConfirmation = useAlertStore((state) => state.showConfirmation);

  const transferMutation = useMutation({
    mutationFn: async (toAddress: string) => {
      if (!signer || !account || !ticket) throw new Error("Required information is missing.");
      if (!ethers.isAddress(toAddress)) throw new Error("Invalid recipient address.");
      if (toAddress.toLowerCase() === account.toLowerCase()) throw new Error("You cannot transfer a ticket to yourself.");

      const eventContract = new ethers.Contract(ticket.eventId, EVENT_ABI, signer);
      const tx = await eventContract.safeTransferFrom(account, toAddress, ticket.id);
      await tx.wait();
    },
    onSuccess: () => {
      showSuccess("Ticket transferred successfully!");
      queryClient.invalidateQueries({ queryKey: ["myTickets", account] });
      onClose();
    },
    onError: (error: any) => {
      const message = error?.reason || error.message || "Transfer failed.";
      showError(message);
    },
  });

  const handleTransfer = () => {
    showConfirmation({
      title: "Confirm Ticket Transfer",
      description: `Are you sure you want to transfer Ticket #${ticket?.id} for "${ticket?.event.title}" to the address ${recipientAddress}? This action is irreversible.`,
      confirmText: "Yes, Transfer",
      onConfirm: () => {
        transferMutation.mutate(recipientAddress);
      },
    });
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dialog-glow text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-2xl font-bold">Transfer Ticket</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Transfer ownership of Ticket #{ticket.id} for "{ticket.event.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="recipient-address" className="text-white/80">
              Recipient Wallet Address
            </Label>
            <Input
              id="recipient-address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="bg-black/20 border-white/20 mt-2"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-transparent border-white/30 hover:bg-white/10"
            disabled={transferMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            className="bg-amber-400 text-amber-950 hover:bg-amber-500"
            disabled={!ethers.isAddress(recipientAddress) || transferMutation.isPending}
          >
            {transferMutation.isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
            Transfer Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};