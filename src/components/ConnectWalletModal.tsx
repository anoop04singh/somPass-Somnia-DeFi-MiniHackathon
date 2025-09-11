import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWeb3Store } from "@/store/web3Store";
import { showError } from "@/utils/toast";
import { MetaMaskIcon, CoinbaseWalletIcon } from "./WalletIcons";

interface WalletOptionProps {
  name: string;
  icon: React.ReactNode;
  isInstalled: boolean;
  onConnect: () => void;
}

const WalletOption = ({ name, icon, isInstalled, onConnect }: WalletOptionProps) => (
  <button
    onClick={onConnect}
    className="flex items-center justify-between w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
  >
    <div className="flex items-center gap-4">
      {icon}
      <span className="font-semibold">{name}</span>
    </div>
    {isInstalled && <span className="text-xs text-green-400 font-medium">Installed</span>}
  </button>
);

export const ConnectWalletModal = () => {
  const { isConnectModalOpen, closeConnectModal, connectWallet } = useWeb3Store();
  const isMetaMaskInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;

  return (
    <Dialog open={isConnectModalOpen} onOpenChange={closeConnectModal}>
      <DialogContent className="sm:max-w-md dialog-glow text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-lg font-semibold">
            Connect your wallet
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <WalletOption
            name="MetaMask"
            icon={<MetaMaskIcon />}
            isInstalled={isMetaMaskInstalled}
            onConnect={connectWallet}
          />
          <WalletOption
            name="Coinbase Wallet"
            icon={<CoinbaseWalletIcon />}
            isInstalled={false}
            onConnect={() => showError("Coinbase Wallet support is coming soon!")}
          />
        </div>
        <p className="text-xs text-center text-white/60 px-4 pt-2">
          By connecting a wallet, you agree to SomPass's Terms of Service and acknowledge that you have read and understood the disclaimers therein.
        </p>
      </DialogContent>
    </Dialog>
  );
};