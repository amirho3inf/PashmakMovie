import React from "react";
import type { Genre } from "../types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface GenreCardProps {
  genre: Genre;
  onSelect: (genre: Genre) => void;
}

export const GenreCard = React.forwardRef<HTMLButtonElement, GenreCardProps>(
  ({ genre, onSelect }, ref) => {
    return (
      <Button ref={ref} variant="outline" onClick={() => onSelect(genre)}>
        {genre.title}
      </Button>
    );
  }
);

GenreCard.displayName = "GenreCard";
