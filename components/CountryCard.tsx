import React from "react";
import type { Country } from "../types";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface CountryCardProps {
  country: Country;
  onSelect: (country: Country) => void;
}

export const CountryCard = React.forwardRef<HTMLDivElement, CountryCardProps>(
  ({ country, onSelect }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(country);
      }
    };

    return (
      <Card
        ref={ref}
        tabIndex={0}
        onClick={() => onSelect(country)}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative shrink-0 w-36 h-24 md:w-48 md:h-28",
          "overflow-hidden cursor-pointer border-2 p-0",
          "transition-all duration-300 ease-out",
          "hover:scale-105 hover:shadow-lg hover:shadow-primary/20",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "active:scale-[0.98]"
        )}
      >
        <div className="relative w-full h-full">
          <img
            src={country.image}
            alt={country.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-[2px]" />
          <div className="relative z-10 h-full flex items-center justify-center p-4">
            <h3 className="text-foreground text-base md:text-lg font-bold text-center drop-shadow-sm">
              {country.title}
            </h3>
          </div>
        </div>
      </Card>
    );
  }
);

CountryCard.displayName = "CountryCard";
