import { createBrowserRouter } from "react-router";
import Root from "./root";
import Landing from "./pages/landing";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import AnimePage from "./pages/AnimePage";
import FavoritesPage from "./pages/FavoritesPage";
import GenrePage from "./pages/GenrePage";
import CountryPage from "./pages/CountryPage";
import DetailPage from "./pages/DetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "landing",
        Component: Landing,
      },
      {
        path: "search",
        Component: SearchPage,
      },
      {
        path: "movies",
        Component: MoviesPage,
      },
      {
        path: "series",
        Component: SeriesPage,
      },
      {
        path: "anime",
        Component: AnimePage,
      },
      {
        path: "favorites",
        Component: FavoritesPage,
      },
      {
        path: "genre/:genreId",
        Component: GenrePage,
      },
      {
        path: "country/:countryId",
        Component: CountryPage,
      },
      {
        path: "detail/:id",
        Component: DetailPage,
      },
    ],
  },
]);
