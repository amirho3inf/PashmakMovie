import React from "react";
import { useNavigate } from "react-router";
import { useHomeData, useGenres } from "../hooks/queries";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";
import { useRecentlyWatched } from "../hooks/useRecentlyWatched";
import type { Poster, Genre, Country } from "../types";
import { PosterRow } from "../components/PosterRow";
import { CountryRow } from "../components/CountryRow";
import { GenreRow } from "../components/GenreRow";
import { PosterRowSkeleton } from "../components/Loader";
import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    data: homeData,
    isLoading: homeLoading,
    error: homeError,
  } = useHomeData();
  const { data: allGenres, isLoading: genresLoading } = useGenres();
  const { data: favorites = [] } = useFavorites();
  const { data: recentlyWatched = [] } = useRecentlyWatched();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleSelectItem = (item: Poster) => {
    navigate(`/detail/${item.id}`);
  };

  const handleSelectGenre = (genre: Genre) => {
    navigate(`/genre/${genre.id}`);
  };

  const handleSelectCountry = (country: Country) => {
    navigate(`/country/${country.id}`);
  };

  const handleToggleFavorite = (item: Poster) => {
    const isFav = favorites.some((fav) => fav.id === item.id);
    toggleFavoriteMutation.mutate({ item, isFavorite: isFav });
  };

  const loading = homeLoading || genresLoading;

  if (homeError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                خطا در بارگذاری محتوا. لطفاً بعداً دوباره امتحان کنید.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 py-4 sm:py-6 md:py-10">
      {/* Genres Section */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-4 md:mx-6" />
          <div className="flex gap-3 md:gap-4 px-4 md:px-6 overflow-x-auto pb-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-12 w-28 md:h-14 md:w-32 rounded-lg shrink-0"
              />
            ))}
          </div>
        </div>
      ) : (
        allGenres &&
        allGenres.length > 0 && (
          <GenreRow
            title="ژانرها"
            items={allGenres}
            onSelectItem={handleSelectGenre}
          />
        )
      )}

      {/* Recently Watched Section */}
      {loading ? (
        <PosterRowSkeleton title="اخیراً تماشا شده" />
      ) : (
        recentlyWatched.length > 0 && (
          <PosterRow
            title="اخیراً تماشا شده"
            items={recentlyWatched}
            onSelectItem={handleSelectItem}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      )}

      {/* Genre Rows */}
      {loading ? (
        <>
          <PosterRowSkeleton />
          <PosterRowSkeleton />
          <PosterRowSkeleton />
        </>
      ) : (
        homeData &&
        [...homeData.genres]
          .reverse()
          .map((genre) => (
            <PosterRow
              key={genre.id}
              title={genre.title}
              items={genre.posters}
              onSelectItem={handleSelectItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
      )}

      {/* Countries Section */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-4 md:mx-6" />
          <div className="flex gap-4 md:gap-6 px-4 md:px-6 overflow-x-auto pb-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-36 md:h-28 md:w-48 rounded-lg shrink-0"
              />
            ))}
          </div>
        </div>
      ) : (
        homeData?.countries &&
        homeData.countries.length > 0 && (
          <CountryRow
            title="کشورها"
            items={homeData.countries}
            onSelectCountry={handleSelectCountry}
          />
        )
      )}
    </div>
  );
}
