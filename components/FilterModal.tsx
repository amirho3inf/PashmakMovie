import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface Option {
  id: number | string;
  title: string;
}

interface FilterModalProps {
  title: string;
  options: Option[];
  selectedValue: number | string;
  onSelect: (value: number | string) => void;
  onClose: () => void;
}

export const FilterModal = ({
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: FilterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const selectedElement = modalRef.current?.querySelector<HTMLElement>(
      `[data-value="${selectedValue}"]`
    );
    if (selectedElement) {
      selectedElement.focus();
    } else {
      modalRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, selectedValue]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl md:text-3xl">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div ref={modalRef} className="space-y-2">
            {options.map((option) => (
              <Button
                key={option.id}
                tabIndex={0}
                data-value={option.id}
                onClick={() => onSelect(option.id)}
                variant={selectedValue === option.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-lg md:text-xl font-semibold h-auto py-4 px-4",
                  "hover:bg-accent",
                  selectedValue === option.id &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {option.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
