import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type {
  HomeData,
  Genre,
  Country,
  Poster,
  Season,
  SearchResponse,
  FilterOptions,
} from "../types";

// Query keys factory for consistent cache management
export const queryKeys = {
  home: ["home"] as const,
  genres: ["genres"] as const,
  countries: ["countries"] as const,
  movie: (id: number) => ["movie", id] as const,
  seasons: (seriesId: number) => ["seasons", seriesId] as const,
  movies: (filters: FilterOptions, page: number) =>
    ["movies", filters, page] as const,
  moviesInfinite: (filters: FilterOptions) =>
    ["movies", "infinite", filters] as const,
  series: (filters: FilterOptions, page: number) =>
    ["series", filters, page] as const,
  seriesInfinite: (filters: FilterOptions) =>
    ["series", "infinite", filters] as const,
  postersByFilters: (filters: FilterOptions, page: number) =>
    ["posters", filters, page] as const,
  postersByFiltersInfinite: (filters: FilterOptions) =>
    ["posters", "infinite", filters] as const,
  search: (query: string) => ["search", query] as const,
};

/**
 * Fetch home page data (genres with posters and countries)
 */
export function useHomeData() {
  return useQuery<HomeData>({
    queryKey: queryKeys.home,
    queryFn: () => api.getHome(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch all genres
 */
export function useGenres() {
  return useQuery<Genre[]>({
    queryKey: queryKeys.genres,
    queryFn: () => api.getAllGenres(),
    staleTime: 10 * 60 * 1000, // 10 minutes (genres don't change often)
  });
}

/**
 * Fetch all countries
 */
export function useCountries() {
  return useQuery<Country[]>({
    queryKey: queryKeys.countries,
    queryFn: () => api.getAllCountries(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch movie details by ID
 */
export function useMovie(id: number) {
  return useQuery<Poster>({
    queryKey: queryKeys.movie(id),
    queryFn: () => api.getMovie(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch seasons for a series
 */
export function useSeasons(seriesId: number) {
  return useQuery<Season[]>({
    queryKey: queryKeys.seasons(seriesId),
    queryFn: () => api.getSeasons(seriesId),
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch filtered movies with pagination (for single page)
 */
export function useMovies(filters: FilterOptions, page: number = 0) {
  return useQuery<Poster[]>({
    queryKey: queryKeys.movies(filters, page),
    queryFn: () => api.getMovies(filters, page),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch filtered movies with infinite scroll
 */
export function useMoviesInfinite(filters: FilterOptions) {
  return useInfiniteQuery<Poster[]>({
    queryKey: queryKeys.moviesInfinite(filters),
    queryFn: ({ pageParam = 0 }) => api.getMovies(filters, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has items, return the next page number
      return lastPage.length > 0 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch filtered series with pagination (for single page)
 */
export function useSeries(filters: FilterOptions, page: number = 0) {
  return useQuery<Poster[]>({
    queryKey: queryKeys.series(filters, page),
    queryFn: () => api.getSeries(filters, page),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch filtered series with infinite scroll
 */
export function useSeriesInfinite(filters: FilterOptions) {
  return useInfiniteQuery<Poster[]>({
    queryKey: queryKeys.seriesInfinite(filters),
    queryFn: ({ pageParam = 0 }) => api.getSeries(filters, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch filtered posters by filters with pagination (for single page)
 */
export function usePostersByFilters(filters: FilterOptions, page: number = 0) {
  return useQuery<Poster[]>({
    queryKey: queryKeys.postersByFilters(filters, page),
    queryFn: () => api.getPostersByFilters(filters, page),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch filtered posters by filters with infinite scroll
 */
export function usePostersByFiltersInfinite(filters: FilterOptions) {
  return useInfiniteQuery<Poster[]>({
    queryKey: queryKeys.postersByFiltersInfinite(filters),
    queryFn: ({ pageParam = 0 }) =>
      api.getPostersByFilters(filters, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Search for movies and series
 * Note: Debouncing should be handled in the component using this hook
 */
export function useSearch(query: string) {
  return useQuery<SearchResponse>({
    queryKey: queryKeys.search(query),
    queryFn: () => api.search(query),
    enabled: query.trim().length > 0,
    staleTime: 1 * 60 * 1000,
  });
}
