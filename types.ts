// FIX: Add a shared 'View' type for navigation state to be used across components, resolving type conflicts.
export type View = 'home' | 'search' | 'movies' | 'series' | 'genre' | 'anime' | 'country';

export interface Genre {
  id: number;
  title: string;
}

export interface Country {
  id: number;
  title: string;
  image: string;
}

export interface Source {
  id: number;
  quality: string;
  type: string;
  url: string;
}

export interface Poster {
  id: number;
  title: string;
  type: string; // "movie" or "series"
  description: string;
  year: number;
  imdb: number;
  rating: number;
  comment: boolean;
  duration: string;
  downloadas: string;
  playas: string;
  classification: string;
  image: string;
  cover: string;
  genres: Genre[];
  sources: Source[];
  country: Country[];
}

export interface Slide {
  id: number;
  title: string;
  image: string;
}

export interface GenreWithPosters extends Genre {
  posters: Poster[];
}

export interface HomeData {
  genres: GenreWithPosters[];
  countries: Country[];
}

export interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  downloadas: string;
  playas: string;
  sources: Source[];
}

export interface Season {
  id: number;
  title: string;
  episodes: Episode[];
}

export interface SearchResponse {
    channels: any[];
    posters: Poster[];
}

export type SortOption = 'created' | 'imdb' | 'views' | 'year';

export interface FilterOptions {
  genre: number | 'all';
  country: number | 'all';
  sort: SortOption;
}