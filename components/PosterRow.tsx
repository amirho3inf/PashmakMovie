import React from "react";
import type { Poster } from "../types";
import { PosterCard } from "./PosterCard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface PosterRowProps {
  title: string;
  items: Poster[];
  onSelectItem: (item: Poster) => void;
  favorites: Poster[];
  onToggleFavorite: (item: Poster) => void;
}

export const PosterRow = ({
  title,
  items,
  onSelectItem,
  favorites,
  onToggleFavorite,
}: PosterRowProps) => {
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
        <div className="flex gap-4 md:gap-6 pb-4 px-4 md:px-6">
          {items.map((item, index) => (
            <PosterCard
              key={`${title}-${item.id}-${index}`}
              item={item}
              onSelect={onSelectItem}
              isFavorite={favorites.some((fav) => fav.id === item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
