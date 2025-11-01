import React, {
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  useGenres,
  useCountries,
  useMoviesInfinite,
  useSeriesInfinite,
  usePostersByFiltersInfinite,
} from "../hooks/queries";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";
import type { Poster, FilterOptions, SortOption } from "../types";
import { PosterCard } from "./PosterCard";
import { PosterCardSkeleton } from "./Loader";
import { Skeleton } from "./ui/skeleton";
import { FilterBar } from "./FilterBar";
import { FilterModal } from "./FilterModal";
import { ScrollContainerContext } from "../contexts/ScrollContainerContext";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface BrowsePageContentProps {
  type: "movie" | "series" | "all" | "anime";
  initialGenreId?: number;
  initialCountryId?: number;
}

const SORT_OPTIONS: { id: SortOption; title: string }[] = [
  { id: "views", title: "پربازدیدترین" },
  { id: "created", title: "جدیدترین" },
  { id: "year", title: "سال ساخت" },
  { id: "imdb", title: "امتیاز IMDB" },
];

export function BrowsePageContent({
  type,
  initialGenreId,
  initialCountryId,
}: BrowsePageContentProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();
  const { data: genresData = [] } = useGenres();
  const { data: countriesData = [] } = useCountries();
  const scrollContainerRef = useContext(ScrollContainerContext);

  // Get filter values from URL params or defaults
  const genreParam = searchParams.get("genre");
  const countryParam = searchParams.get("country");
  const sortParam = searchParams.get("sort") as SortOption;

  const [filters, setFilters] = useState<FilterOptions>({
    genre:
      initialGenreId ||
      (genreParam ? Number(genreParam) : type === "anime" ? 3 : "all"),
    country: initialCountryId || (countryParam ? Number(countryParam) : "all"),
    sort: sortParam || "views",
  });

  const [activeFilter, setActiveFilter] = useState<
    "genre" | "sort" | "country" | null
  >(null);

  // Update filters when initialGenreId or initialCountryId changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      genre: initialGenreId !== undefined ? initialGenreId : prev.genre,
      country: initialCountryId !== undefined ? initialCountryId : prev.country,
    }));
  }, [initialGenreId, initialCountryId]);

  // Update URL params when filters change (but not when initial values are set)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.genre !== "all") params.set("genre", String(filters.genre));
    if (filters.country !== "all")
      params.set("country", String(filters.country));
    if (filters.sort !== "views") params.set("sort", filters.sort);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Prepare genres and countries with "all" option
  const genres = [{ id: "all" as const, title: "همه" }, ...genresData];
  const countries = [
    { id: "all" as const, title: "همه" },
    ...countriesData.map(({ id, title }) => ({ id, title })),
  ];

  // Select the appropriate query hook based on type
  const moviesQuery = useMoviesInfinite(filters);
  const seriesQuery = useSeriesInfinite(filters);
  const postersQuery = usePostersByFiltersInfinite(filters);

  const query =
    type === "movie"
      ? moviesQuery
      : type === "series"
      ? seriesQuery
      : postersQuery;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = query;

  // Flatten all pages into a single array
  const items = data?.pages.flat() ?? [];

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage || isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          root: scrollContainerRef?.current || null,
          rootMargin: "200px",
        }
      );
      if (node) observer.current.observe(node);
    },
    [
      isFetchingNextPage,
      isLoading,
      hasNextPage,
      fetchNextPage,
      scrollContainerRef,
    ]
  );

  const handleSelectItem = (item: Poster) => {
    navigate(`/detail/${item.id}`);
  };

  const handleToggleFavorite = (item: Poster) => {
    const isFav = favorites.some((fav) => fav.id === item.id);
    toggleFavoriteMutation.mutate({ item, isFavorite: isFav });
  };

  const handleModalSelect = (value: string | number) => {
    if (activeFilter) {
      if (
        activeFilter === "genre" ||
        activeFilter === "sort" ||
        activeFilter === "country"
      ) {
        setFilters((prev) => ({ ...prev, [activeFilter]: value }));
      }
    }
    setActiveFilter(null);
  };

  const getModalOptions = () => {
    switch (activeFilter) {
      case "genre":
        return genres;
      case "country":
        return countries;
      case "sort":
        return SORT_OPTIONS;
      default:
        return [];
    }
  };

  const getModalSelectedValue = () => {
    if (!activeFilter) return "all";
    return filters[activeFilter];
  };

  const title =
    type === "movie"
      ? "فیلم‌ها"
      : type === "series"
      ? "سریال‌ها"
      : type === "anime"
      ? "انیمه و انیمیشن"
      : "همه";

  return (
    <div className="space-y-8 py-6 md:py-10">
      <div className="space-y-2 px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {items.length > 0 && `${items.length} مورد یافت شد`}
        </p>
      </div>

      {activeFilter && (
        <FilterModal
          title={`انتخاب ${
            activeFilter === "genre"
              ? "ژانر"
              : activeFilter === "country"
              ? "کشور"
              : "مرتب-سازی"
          }`}
          options={getModalOptions()}
          selectedValue={getModalSelectedValue()}
          onSelect={handleModalSelect}
          onClose={() => setActiveFilter(null)}
        />
      )}

      <FilterBar
        genres={genres}
        countries={countries}
        filters={filters}
        onPillClick={setActiveFilter}
        showGenreFilter={type !== "anime"}
        showCountryFilter={type === "all" || type === "anime"}
      />

      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6 px-4 md:px-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <PosterCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              محتوایی یافت نشد یا در بارگذاری خطا رخ داد.
            </p>
          </CardContent>
        </Card>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
            {items.map((item, index) => (
              <PosterCard
                ref={items.length === index + 1 ? lastItemRef : null}
                key={`${item.id}-${index}`}
                item={item}
                onSelect={handleSelectItem}
                isFavorite={favorites.some((fav) => fav.id === item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
          {isFetchingNextPage && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
              {Array.from({ length: 4 }).map((_, index) => (
                <PosterCardSkeleton key={`loading-${index}`} />
              ))}
            </div>
          )}
        </>
      ) : (
        !isLoading && (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground text-lg">
                محتوایی با این فیلترها یافت نشد.
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
