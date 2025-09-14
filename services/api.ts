import type { HomeData, Poster, Season, SearchResponse, FilterOptions, SortOption, Genre, Country } from '../types';
import { getApiBaseUrl } from './config';

// The API key is now hardcoded as per the user's request.
const API_KEY = "4F5A9C3D9A86FA54EACEDDD635185";

async function fetcher<T>(endpoint: string): Promise<T> {
  const proxyUrl = 'https://corsproxy.io/?';
  const baseUrl = getApiBaseUrl();
  const finalUrl = `${proxyUrl}${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw error;
  }
}

async function getFilteredContent(type: 'movie' | 'serie', filters: FilterOptions, page: number = 0): Promise<Poster[]> {
    const order = filters.sort;
    const genre = filters.genre === 'all' ? 0 : filters.genre;

    let endpoint = '';

    // This path structure is based on the openapi.json spec.
    // It changes depending on the sorting method.
    if (order === 'created') {
        // This endpoint uses the genre as a path parameter.
        endpoint = `/${type}/by/filtres/${genre}/created/${page}/${API_KEY}/`;
    } else {
        // The other sorting endpoints have '0' hardcoded where the genre would be.
        endpoint = `/${type}/by/filtres/0/${order}/${page}/${API_KEY}/`;
    }

    return fetcher<Poster[]>(endpoint);
}

export const api = {
  getHome: (): Promise<HomeData> => fetcher(`/first/${API_KEY}/`),
  getAllGenres: (): Promise<Genre[]> => fetcher(`/genre/all/${API_KEY}/`),
  getAllCountries: (): Promise<Country[]> => fetcher(`/country/all/${API_KEY}/`),
  getMovie: (id: number): Promise<Poster> => fetcher(`/movie/by/${id}/${API_KEY}/`),
  getSeasons: (seriesId: number): Promise<Season[]> => fetcher(`/season/by/serie/${seriesId}/${API_KEY}/`),
  
  getMovies: (filters: FilterOptions, page: number = 0): Promise<Poster[]> => {
    return getFilteredContent('movie', filters, page);
  },
  getSeries: (filters: FilterOptions, page: number = 0): Promise<Poster[]> => {
    return getFilteredContent('serie', filters, page);
  },

  getPostersByFilters: (filters: FilterOptions, page: number = 0): Promise<Poster[]> => {
    const genreId = filters.genre === 'all' ? 0 : filters.genre;
    const countryId = filters.country === 'all' || !filters.country ? 0 : filters.country;
    const endpoint = `/poster/by/filtres/${genreId}/${countryId}/${filters.sort}/${page}/${API_KEY}/`;
    return fetcher<Poster[]>(endpoint);
  },
  
  search: (query: string): Promise<SearchResponse> => fetcher(`/search/${encodeURIComponent(query)}/${API_KEY}/`),
};