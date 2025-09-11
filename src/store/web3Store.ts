import { create } from "zustand";
import { ethers } from "ethers";
import { showSuccess, showError } from "@/utils/toast";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  isConnected: boolean;
  isConnectModalOpen: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  init: () => void;
}

export const useWeb3Store = create<Web3State>((set, get) => ({
  provider: null,
  signer: null,
  account: null,
  isConnected: false,
  isConnectModalOpen: false,
  openConnectModal: () => set({ isConnectModalOpen: true }),
  closeConnectModal: () => set({ isConnectModalOpen: false }),
  connectWallet: async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        set({ provider, signer, account, isConnected: true, isConnectModalOpen: false });

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            get().connectWallet();
          } else {
            get().disconnectWallet();
          }
        });
        showSuccess("Wallet connected successfully!");
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        showError("Failed to connect wallet.");
        get().disconnectWallet();
      }
    } else {
      showError("Please install a web3 wallet like MetaMask.");
    }
  },
  disconnectWallet: () => {
    set({ provider: null, signer: null, account: null, isConnected: false });
  },
  init: async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          set({ provider, signer, account, isConnected: true });

          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              get().connectWallet();
            } else {
              get().disconnectWallet();
            }
          });
        }
      } catch (error) {
        console.error("Failed to auto-reconnect wallet:", error);
        get().disconnectWallet();
      }
    }
  }
}));