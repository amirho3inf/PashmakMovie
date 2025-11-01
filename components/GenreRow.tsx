import React from "react";
import type { Genre } from "../types";
import { GenreCard } from "./GenreCard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface GenreRowProps {
  title: string;
  items: Genre[];
  onSelectItem: (genre: Genre) => void;
}

export const GenreRow = ({ title, items, onSelectItem }: GenreRowProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-10 space-y-4">
      <h2
        className={cn(
          "text-2xl md:text-3xl font-bold text-foreground",
          "px-4 md:px-6"
        )}
      >
        {title}
      </h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 md:gap-4 pb-4 px-4 md:px-6">
          {items.map((item, index) => (
            <GenreCard
              key={`${title}-${item.id}-${index}`}
              genre={item}
              onSelect={onSelectItem}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
