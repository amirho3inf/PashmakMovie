import type { Poster } from '../types';

const FAVORITES_KEY = 'iranflix_favorites';

export const getFavorites = (): Poster[] => {
  try {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage', error);
    return [];
  }
};

const saveFavorites = (favorites: Poster[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage', error);
  }
};

export const addFavorite = (item: Poster): void => {
  const favorites = getFavorites();
  if (!favorites.some(fav => fav.id === item.id)) {
    const newFavorites = [...favorites, item];
    saveFavorites(newFavorites);
  }
};

export const removeFavorite = (itemId: number): void => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(fav => fav.id !== itemId);
  saveFavorites(newFavorites);
};
