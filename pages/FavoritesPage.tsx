import React from "react";
import { useNavigate } from "react-router";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";
import type { Poster } from "../types";
import { PosterCard } from "../components/PosterCard";
import { PosterCardSkeleton } from "../components/Loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { HeartIcon } from "../components/icons";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { data: favorites = [], isLoading } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleSelectItem = (item: Poster) => {
    navigate(`/detail/${item.id}`);
  };

  const handleToggleFavorite = (item: Poster) => {
    toggleFavoriteMutation.mutate({ item, isFavorite: true });
  };

  return (
    <div className="space-y-8 py-6 md:py-10 px-4 md:px-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          علاقه‌مندی‌ها
        </h1>
        <p className="text-muted-foreground">
          {favorites.length > 0
            ? `${favorites.length} مورد در لیست علاقه‌مندی‌های شما`
            : "لیست علاقه‌مندی‌های شما خالی است"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <PosterCardSkeleton key={index} />
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
          {favorites.map((item) => (
            <PosterCard
              key={item.id}
              item={item}
              onSelect={handleSelectItem}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="rounded-full bg-muted p-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  هنوز هیچ موردی به علاقه‌مندی‌ها اضافه نشده است
                </h3>
                <p className="text-sm text-muted-foreground">
                  برای افزودن به علاقه‌مندی‌ها، روی آیکون قلب در کارت فیلم‌ها
                  کلیک کنید
                </p>
              </div>
              <Button onClick={() => navigate("/")} variant="outline">
                بازگشت به خانه
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
