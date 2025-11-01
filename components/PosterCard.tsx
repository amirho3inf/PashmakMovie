import React from "react";
import type { Poster } from "../types";
import { StarIcon, HeartIcon } from "./icons";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PosterCardProps {
  item: Poster;
  onSelect: (item: Poster) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: Poster) => void;
}

export const PosterCard = React.forwardRef<HTMLDivElement, PosterCardProps>(
  ({ item, onSelect, isFavorite, onToggleFavorite }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(item);
      }
    };

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onToggleFavorite(item);
    };

    return (
      <Card
        ref={ref}
        tabIndex={0}
        className={cn(
          "group relative w-full",
          "overflow-hidden cursor-pointer border-0 p-0",
          "transition-all duration-300 ease-out",
          "hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/20",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          "active:scale-[0.98]"
        )}
        style={{
          aspectRatio: "2/3", // Maintain poster aspect ratio
        }}
        onClick={() => onSelect(item)}
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            tabIndex={-1}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
            }
            className={cn(
              "absolute top-2 left-2 z-30",
              "h-8 w-8 md:h-9 md:w-9",
              "bg-background/80 backdrop-blur-sm",
              "hover:bg-destructive hover:text-destructive-foreground",
              "transition-all duration-200",
              "shadow-lg"
            )}
          >
            <HeartIcon
              className={cn(
                "w-4 h-4 md:w-5 md:h-5 transition-colors",
                isFavorite
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              )}
            />
          </Button>

          {/* Content Overlay */}
          <div className="absolute bottom-0 right-0 left-0 p-3 md:p-4 text-right space-y-1.5">
            <h3 className="text-white text-sm md:text-base font-semibold truncate drop-shadow-lg">
              {item.title}
            </h3>
            <div className="flex items-center justify-end gap-2 text-xs md:text-sm text-white/90">
              <span className="font-medium">{item.year}</span>
              <span className="flex items-center gap-1 font-medium">
                <StarIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-400 fill-yellow-400" />
                {item.imdb}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

PosterCard.displayName = "PosterCard";
