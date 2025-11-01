import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useMovie, useSeasons } from "../hooks/queries";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";
import { useAddRecentlyWatched } from "../hooks/useRecentlyWatched";
import type { Source, Episode } from "../types";
import { Loader, PosterCardSkeleton } from "../components/Loader";
import { Skeleton } from "../components/ui/skeleton";
import { StarIcon, BackIcon, HeartIcon } from "../components/icons";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { OpenWithModal } from "../components/OpenWithModal";
import { VideoPlayer } from "../components/VideoPlayer";
import { Download, Play, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = id ? Number(id) : 0;

  const {
    data: item,
    isLoading: itemLoading,
    error: itemError,
  } = useMovie(movieId);
  const { data: seasons = [], isLoading: seasonsLoading } = useSeasons(
    item?.type === "serie" ? movieId : 0
  );
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();
  const addRecentlyWatchedMutation = useAddRecentlyWatched();

  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [activeMedia, setActiveMedia] = useState<{
    source: Source;
    episode?: Episode;
  } | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  React.useEffect(() => {
    if (seasons.length > 0 && !selectedSeasonId) {
      setSelectedSeasonId(seasons[0].id);
    }
  }, [seasons, selectedSeasonId]);

  const isLoading = itemLoading || (item?.type === "serie" && seasonsLoading);
  const isFavorite = item ? favorites.some((fav) => fav.id === item.id) : false;

  const handlePlayClick = (source: Source, episode?: Episode) => {
    if (item) {
      addRecentlyWatchedMutation.mutate(item);
    }
    setActiveMedia({ source, episode });
    setShowPlayer(false);
  };

  const renderPlayButtons = (playSources: Source[], episode?: Episode) => {
    if (playSources.length === 0)
      return (
        <p className="text-muted-foreground text-sm">
          موردی برای پخش وجود ندارد.
        </p>
      );

    return (
      <div className="flex flex-wrap gap-3">
        {playSources.map((source) => (
          <Button
            key={source.id}
            onClick={() => handlePlayClick(source, episode)}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            پخش {source.quality}
          </Button>
        ))}
      </div>
    );
  };

  const renderDownloadButtons = (downloadSources: Source[]) => {
    if (downloadSources.length === 0)
      return (
        <p className="text-muted-foreground text-sm">
          موردی برای دانلود وجود ندارد.
        </p>
      );

    return (
      <div className="flex flex-wrap gap-3">
        {downloadSources.map((source) => (
          <Button
            key={source.id}
            variant="outline"
            size="lg"
            asChild
            className="gap-2"
          >
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Download className="w-4 h-4" />
              دانلود {source.quality}
            </a>
          </Button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full relative min-h-screen">
        <Skeleton className="absolute inset-0 h-[50vh] md:h-[70vh]" />
        <div className="relative z-10 pt-[30vh] md:pt-[35vh] p-4 md:p-10 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <Skeleton className="w-40 h-56 md:w-56 md:h-80 lg:w-64 lg:h-96 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive text-lg">
            {itemError
              ? "خطا در بارگذاری جزئیات."
              : "موردی برای نمایش وجود ندارد."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-4"
          >
            بازگشت
          </Button>
        </CardContent>
      </Card>
    );
  }

  const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);
  const modalTitle =
    activeMedia && item
      ? `${item.title}${selectedSeason ? ` - ${selectedSeason.title}` : ""}${
          activeMedia.episode?.title ? ` - ${activeMedia.episode.title}` : ""
        }`
      : "";

  return (
    <div className="relative min-h-screen">
      {activeMedia && !showPlayer && (
        <OpenWithModal
          sourceUrl={activeMedia.source.url}
          title={modalTitle}
          onClose={() => setActiveMedia(null)}
          onSelectBrowserPlayer={() => setShowPlayer(true)}
        />
      )}
      {activeMedia && showPlayer && item && (
        <VideoPlayer
          sourceUrl={activeMedia.source.url}
          title={modalTitle}
          onClose={() => {
            setShowPlayer(false);
            setActiveMedia(null);
          }}
        />
      )}

      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-4 right-4 md:top-8 md:right-8 z-30",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-destructive hover:text-destructive-foreground",
          "shadow-lg"
        )}
        aria-label="بازگشت"
      >
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
      </Button>

      <div className="absolute inset-0 h-[50vh] md:h-[70vh]">
        <img
          src={item.cover}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 pt-[30vh] md:pt-[35vh] p-4 md:p-10 space-y-8">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 w-40 md:w-56 lg:w-64 -mt-20 md:-mt-40 self-center">
                <img
                  src={item.image}
                  alt={`Poster for ${item.title}`}
                  className="w-full h-auto rounded-lg shadow-2xl object-cover border-2 border-border"
                />
              </div>

              <div className="flex-1 text-center md:text-right space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                    {item.title}
                  </h1>
                  <Button
                    onClick={() =>
                      toggleFavoriteMutation.mutate({ item, isFavorite })
                    }
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-12 w-12",
                      isFavorite && "text-destructive"
                    )}
                    aria-label={
                      isFavorite
                        ? "حذف از علاقه‌مندی‌ها"
                        : "افزودن به علاقه‌مندی‌ها"
                    }
                  >
                    <HeartIcon
                      className={cn(
                        "w-6 h-6 md:w-7 md:h-7",
                        isFavorite && "fill-destructive stroke-destructive"
                      )}
                    />
                  </Button>
                </div>

                <div className="flex items-center justify-center md:justify-start flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                  <span className="font-medium">{item.year}</span>
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{item.imdb}</span>
                  </span>
                  <span>{item.duration}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.classification || "N/A"}
                  </Badge>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {item.genres.map((g) => (
                    <Badge key={g.id} variant="secondary">
                      {g.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {item.type === "movie" && item.sources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>پخش و دانلود</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">پخش آنلاین</h3>
                {renderPlayButtons(item.sources)}
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">دانلود</h3>
                {renderDownloadButtons(item.sources)}
              </div>
            </CardContent>
          </Card>
        )}

        {item.type === "serie" && seasons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>فصل‌ها و قسمت‌ها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2 border-b overflow-x-auto pb-2">
                {seasons.map((season) => (
                  <Button
                    key={season.id}
                    onClick={() => setSelectedSeasonId(season.id)}
                    variant={
                      selectedSeasonId === season.id ? "default" : "ghost"
                    }
                    className={cn(
                      "rounded-t-lg rounded-b-none",
                      selectedSeasonId === season.id &&
                        "border-b-2 border-primary"
                    )}
                  >
                    {season.title}
                  </Button>
                ))}
              </div>

              {selectedSeason && (
                <div className="space-y-3">
                  {selectedSeason.episodes.map((episode) => (
                    <Card key={episode.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-shrink-0 min-w-[150px]">
                            <h4 className="font-semibold text-base md:text-lg text-foreground">
                              {episode.title}
                            </h4>
                            {episode.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {episode.description}
                              </p>
                            )}
                            {episode.duration && (
                              <p className="text-xs text-muted-foreground mt-1">
                                مدت زمان: {episode.duration}
                              </p>
                            )}
                          </div>

                          {episode.sources && episode.sources.length > 0 && (
                            <div className="flex flex-wrap items-center justify-end gap-2 flex-1">
                              {episode.sources.map((source) => (
                                <Button
                                  key={`${source.id}-play`}
                                  onClick={() =>
                                    handlePlayClick(source, episode)
                                  }
                                  variant="default"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Play className="w-4 h-4" />
                                  پخش {source.quality}
                                </Button>
                              ))}
                              {episode.sources.map((source) => (
                                <Button
                                  key={`${source.id}-download`}
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="gap-2"
                                >
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    <Download className="w-4 h-4" />
                                    دانلود {source.quality}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {item.description && (
          <Card>
            <CardHeader>
              <CardTitle>خلاصه داستان</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
