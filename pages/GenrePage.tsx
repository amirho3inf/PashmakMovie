import { useParams } from "react-router";
import { BrowsePageContent } from "../components/BrowsePageContent";

export default function GenrePage() {
  const { genreId } = useParams<{ genreId: string }>();
  const genreIdNum = genreId ? Number(genreId) : undefined;

  return <BrowsePageContent type="all" initialGenreId={genreIdNum} />;
}
