import type {
  HomeData,
  Poster,
  Season,
  SearchResponse,
  FilterOptions,
  SortOption,
  Genre,
  Country,
} from "../types";
import { getApiBaseUrl } from "./config";

// The API key is now hardcoded as per the user's request.
const API_KEY = "4F5A9C3D9A86FA54EACEDDD635185";

// CORS proxies to try in order
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

/**
 * Fetches data from the API with CORS proxy fallback
 */
async function fetcher<T>(endpoint: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const fullUrl = `${baseUrl}${endpoint}`;

  // Try direct fetch first (works if CORS is enabled)
  try {
    const response = await fetch(fullUrl);
    if (response.ok) {
      const data = await response.json();
      return data as T;
    }
  } catch (error) {
    // Direct fetch failed, try proxies
    console.log("Direct fetch failed, trying proxies...");
  }

  // Try each proxy
  let lastError: Error | null = null;

  for (const proxyUrl of CORS_PROXIES) {
    try {
      const proxiedUrl = `${proxyUrl}${fullUrl}`;
      const response = await fetch(proxiedUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data as T;
      } else if (response.status === 403) {
        // This proxy is blocked, try next one
        console.log(`Proxy blocked (403), trying next...`);
        continue;
      } else {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      lastError = error as Error;
      // Try next proxy
      continue;
    }
  }

  // All proxies failed
  const errorMessage = lastError
    ? `Failed to fetch from ${endpoint}: ${lastError.message}`
    : `Failed to fetch from ${endpoint}: All proxies failed`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

async function getFilteredContent(
  type: "movie" | "serie",
  filters: FilterOptions,
  page: number = 0
): Promise<Poster[]> {
  const order = filters.sort;
  const genre = filters.genre === "all" ? 0 : filters.genre;

  // FIX: The genre filter was being ignored for all sort options except 'created' on movie/serie pages.
  // The API endpoint has been corrected to apply the genre filter consistently regardless of the sort order.
  const endpoint = `/${type}/by/filtres/${genre}/${order}/${page}/${API_KEY}/`;

  return fetcher<Poster[]>(endpoint);
}

export const api = {
  getHome: (): Promise<HomeData> => fetcher(`/first/${API_KEY}/`),
  getAllGenres: (): Promise<Genre[]> => fetcher(`/genre/all/${API_KEY}/`),
  getAllCountries: (): Promise<Country[]> =>
    fetcher(`/country/all/${API_KEY}/`),
  getMovie: (id: number): Promise<Poster> =>
    fetcher(`/movie/by/${id}/${API_KEY}/`),
  getSeasons: (seriesId: number): Promise<Season[]> =>
    fetcher(`/season/by/serie/${seriesId}/${API_KEY}/`),

  getMovies: (filters: FilterOptions, page: number = 0): Promise<Poster[]> => {
    return getFilteredContent("movie", filters, page);
  },
  getSeries: (filters: FilterOptions, page: number = 0): Promise<Poster[]> => {
    return getFilteredContent("serie", filters, page);
  },

  getPostersByFilters: (
    filters: FilterOptions,
    page: number = 0
  ): Promise<Poster[]> => {
    const genreId = filters.genre === "all" ? 0 : filters.genre;
    const countryId =
      filters.country === "all" || !filters.country ? 0 : filters.country;
    const endpoint = `/poster/by/filtres/${genreId}/${countryId}/${filters.sort}/${page}/${API_KEY}/`;
    return fetcher<Poster[]>(endpoint);
  },

  search: (query: string): Promise<SearchResponse> =>
    fetcher(`/search/${encodeURIComponent(query)}/${API_KEY}/`),
};
