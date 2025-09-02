import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertStore } from "@/hooks/use-alert";

export const AlertProvider = () => {
  const {
    isOpen,
    type,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    hideAlert,
  } = useAlertStore();

  const handleConfirm = () => {
    onConfirm?.();
    hideAlert();
  };

  const handleCancel = () => {
    onCancel?.();
    hideAlert();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={hideAlert}>
      <AlertDialogContent className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {type === "confirmation" && (
            <AlertDialogCancel
              onClick={handleCancel}
              className="bg-transparent border-white/30 hover:bg-white/10"
            >
              {cancelText || "Cancel"}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-white text-green-900 hover:bg-gray-200"
          >
            {confirmText || (type === "confirmation" ? "Confirm" : "OK")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};