import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export const Loader = () => {
  return (
    <div
      className="fixed inset-0 z-[999] flex justify-center items-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export const PosterCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <Card
      className={cn("w-full p-0 border-0 overflow-hidden", className)}
      style={{
        aspectRatio: "2/3", // Maintain poster aspect ratio
      }}
    >
      <Skeleton className="w-full h-full" />
    </Card>
  );
};

export const GenreCardSkeleton = () => {
  return <Skeleton className="shrink-0 h-12 w-28 md:h-14 md:w-32 rounded-lg" />;
};

export const PosterRowSkeleton = ({ title }: { title?: string }) => {
  return (
    <div className="mb-8 md:mb-10 space-y-4">
      {title && <Skeleton className="h-8 w-48 mx-4 md:mx-6" />}
      <div className="flex gap-4 md:gap-6 px-4 md:px-6 overflow-x-auto pb-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <PosterCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
