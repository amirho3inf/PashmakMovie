import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";

import { useQuery } from "@tanstack/react-query";

const Genres = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: api.getAllGenres,
  });

  return (
    <>
      <h1 className="font-bold text-2xl">ژانرها</h1>

      <ScrollArea className="mt-4">
        <div className="flex gap-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className="w-20 h-10 bg-muted" />
              ))
            : data?.map((genre) => (
                <Button key={genre.id} variant="outline">
                  {genre.title}
                </Button>
              ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default Genres;
