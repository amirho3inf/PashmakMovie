import React from "react";
import type { Genre, Country, FilterOptions, SortOption } from "../types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  genres: (Omit<Genre, "id"> & { id: "all" | number })[];
  countries: (Omit<Country, "id" | "image"> & { id: "all" | number })[];
  filters: FilterOptions;
  onPillClick: (filterType: "genre" | "sort" | "country") => void;
  showGenreFilter?: boolean;
  showCountryFilter?: boolean;
}

const SORT_OPTIONS_FOR_UI: { value: SortOption; label: string }[] = [
  { value: "created", label: "جدیدترین" },
  { value: "year", label: "سال ساخت" },
  { value: "imdb", label: "امتیاز IMDB" },
  { value: "views", label: "پربازدیدترین" },
];

const FilterPill = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    variant="outline"
    className={cn(
      "h-auto py-2 px-4 md:py-2.5 md:px-6",
      "text-base md:text-lg font-semibold",
      "hover:bg-accent hover:text-accent-foreground",
      "transition-all duration-200"
    )}
  >
    <span className="text-muted-foreground mr-2">{label}:</span>
    <Badge variant="secondary" className="text-sm">
      {value}
    </Badge>
  </Button>
);

export const FilterBar = ({
  genres,
  countries,
  filters,
  onPillClick,
  showGenreFilter = true,
  showCountryFilter = true,
}: FilterBarProps) => {
  const getGenreTitle = (id: number | "all") => {
    if (id === "all") return "همه";
    return genres.find((g) => g.id === id)?.title || "همه";
  };

  const getCountryTitle = (id: number | "all") => {
    if (id === "all") return "همه";
    return countries.find((c) => c.id === id)?.title || "همه";
  };

  const getSortTitle = (value: SortOption) => {
    return (
      SORT_OPTIONS_FOR_UI.find((opt) => opt.value === value)?.label ||
      "جدیدترین"
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4 px-4 md:px-6">
      {showGenreFilter && (
        <FilterPill
          label="ژانر"
          value={getGenreTitle(filters.genre)}
          onClick={() => onPillClick("genre")}
        />
      )}
      {showCountryFilter && (
        <FilterPill
          label="کشور"
          value={getCountryTitle(filters.country)}
          onClick={() => onPillClick("country")}
        />
      )}
      <FilterPill
        label="مرتب‌سازی"
        value={getSortTitle(filters.sort)}
        onClick={() => onPillClick("sort")}
      />
    </div>
  );
};
