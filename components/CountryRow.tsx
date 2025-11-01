import React from "react";
import type { Country } from "../types";
import { CountryCard } from "./CountryCard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface CountryRowProps {
  title: string;
  items: Country[];
  onSelectCountry: (country: Country) => void;
}

export const CountryRow = ({
  title,
  items,
  onSelectCountry,
}: CountryRowProps) => {
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
            <CountryCard
              key={`${title}-${item.id}-${index}`}
              country={item}
              onSelect={onSelectCountry}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
