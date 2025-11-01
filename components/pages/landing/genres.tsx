import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGenres } from "@/hooks/queries";
import { useNavigate, useLocation } from "react-router";

const Genres = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: genres, isLoading } = useGenres();

  // Extract genreId from current path if on genre page
  const genreIdMatch = location.pathname.match(/^\/genre\/(\d+)$/);
  const currentGenreId = genreIdMatch ? genreIdMatch[1] : "all";

  const handleGenreChange = (value: string) => {
    if (value === "all") {
      navigate("/");
    } else {
      navigate(`/genre/${value}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">ژانرها</h2>
      </div>

      {isLoading ? (
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-32" />
          ))}
        </div>
      ) : (
        <Select value={currentGenreId} onValueChange={handleGenreChange}>
          <SelectTrigger className="w-full sm:w-80 bg-background border-border hover:bg-accent/50 transition-all duration-200 shadow-sm">
            <SelectValue placeholder="انتخاب ژانر" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all" className="cursor-pointer hover:bg-accent">
              <span className="font-medium">همه ژانرها</span>
            </SelectItem>
            {genres?.map((genre) => (
              <SelectItem
                key={genre.id}
                value={String(genre.id)}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                {genre.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default Genres;
