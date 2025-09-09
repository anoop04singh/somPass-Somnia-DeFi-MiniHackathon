import { create } from "zustand";
import { ethers } from "ethers";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// This store will manage the user's wallet connection state throughout the app.
export const useWeb3Store = create<Web3State>((set, get) => ({
  provider: null,
  signer: null,
  account: null,
  isConnected: false,
  connectWallet: async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        set({ provider, signer, account, isConnected: true });

        // Listen for account changes and auto-reconnect or disconnect
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            get().connectWallet();
          } else {
            get().disconnectWallet();
          }
        });

      } catch (error) {
        console.error("Failed to connect wallet:", error);
        get().disconnectWallet();
      }
    } else {
      alert("Please install a web3 wallet like MetaMask.");
    }
  },
  disconnectWallet: () => {
    set({ provider: null, signer: null, account: null, isConnected: false });
  },
}));