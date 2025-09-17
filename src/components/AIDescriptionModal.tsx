import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface AIDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  generatedText: string;
  onReplace: (newText: string) => void;
  isLoading: boolean;
}

export const AIDescriptionModal = ({ isOpen, onClose, originalText, generatedText, onReplace, isLoading }: AIDescriptionModalProps) => {
  
  const handleReplace = () => {
    onReplace(generatedText);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl dialog-glow text-white max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Wand2 className="text-amber-400" /> AI Enhanced Description
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Review the AI-generated description. You can replace your original text if you like it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-0">
          <div className="flex flex-col flex-grow">
            <h3 className="font-semibold mb-2">Your Text</h3>
            <ScrollArea className="bg-black/20 rounded-md p-4 border border-white/10 flex-grow">
              <p className="text-sm whitespace-pre-wrap">{originalText || "You haven't written anything yet."}</p>
            </ScrollArea>
          </div>
          <div className="flex flex-col flex-grow">
            <h3 className="font-semibold mb-2">AI Enhanced</h3>
            <ScrollArea className="bg-black/20 rounded-md p-4 border border-amber-400/30 flex-grow">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoaderCircle className="w-8 h-8 animate-spin text-amber-400" />
                </div>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none break-words">
                  <ReactMarkdown>{generatedText}</ReactMarkdown>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="bg-transparent border-white/30 hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={handleReplace} className="bg-amber-400 text-amber-950 hover:bg-amber-500" disabled={isLoading || !generatedText}>
            Use this Description
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};