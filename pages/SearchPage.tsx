import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSearch } from "../hooks/queries";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";
import type { Poster } from "../types";
import { PosterCard } from "../components/PosterCard";
import { PosterCardSkeleton } from "../components/Loader";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { SearchIcon } from "../components/icons";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [searchedQuery, setSearchedQuery] = useState(queryParam);
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading, error } = useSearch(searchedQuery);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchedQuery) {
      setSearchParams({ q: searchedQuery }, { replace: true });
    }
  }, [searchedQuery, setSearchParams]);

  const handleSearch = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!query.trim()) return;
      setSearchedQuery(query.trim());
    },
    [query]
  );

  const handleSelectItem = (item: Poster) => {
    navigate(`/detail/${item.id}`);
  };

  const handleToggleFavorite = (item: Poster) => {
    const isFav = favorites.some((fav) => fav.id === item.id);
    toggleFavoriteMutation.mutate({ item, isFavorite: isFav });
  };

  return (
    <div className="space-y-8 py-6 md:py-10 px-4 md:px-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          جستجو
        </h1>
        <p className="text-muted-foreground">
          جستجوی فیلم‌ها و سریال‌های مورد علاقه شما
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی فیلم، سریال و..."
            className="pr-12 text-lg h-12 md:h-14"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-4"
          disabled={!query.trim()}
        >
          جستجو
        </Button>
      </form>

      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <PosterCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              جستجو ناموفق بود. لطفا دوباره تلاش کنید.
            </p>
          </CardContent>
        </Card>
      )}

      {results && results.posters.length > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {results.posters.length} نتیجه یافت شد
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
            {results.posters.map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onSelect={handleSelectItem}
                isFavorite={favorites.some((fav) => fav.id === item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </>
      )}

      {searchedQuery &&
        !isLoading &&
        (!results || results.posters.length === 0) && (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                نتیجه‌ای برای "{searchedQuery}" یافت نشد.
              </p>
              <p className="text-sm text-muted-foreground">
                لطفاً عبارت جستجوی خود را تغییر دهید و دوباره امتحان کنید.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
