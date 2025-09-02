import { create } from "zustand";

type AlertType = "confirmation" | "error";

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  showConfirmation: (options: ConfirmationOptions) => void;
  showError: (options: ErrorOptions) => void;
  hideAlert: () => void;
}

interface ConfirmationOptions {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ErrorOptions {
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  type: "confirmation",
  title: "",
  description: "",
  showConfirmation: (options) =>
    set({ ...options, type: "confirmation", isOpen: true }),
  showError: (options) =>
    set({
      ...options,
      type: "error",
      isOpen: true,
      onCancel: undefined,
      cancelText: undefined,
    }),
  hideAlert: () =>
    set({ isOpen: false, onConfirm: undefined, onCancel: undefined }),
}));