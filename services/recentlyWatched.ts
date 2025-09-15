import type { Poster } from '../types';

const RECENTLY_WATCHED_KEY = 'iranflix_recently_watched';
const MAX_RECENT_ITEMS = 10;

export const getRecentlyWatched = (): Poster[] => {
  try {
    const recentlyWatchedJson = localStorage.getItem(RECENTLY_WATCHED_KEY);
    return recentlyWatchedJson ? JSON.parse(recentlyWatchedJson) : [];
  } catch (error) {
    console.error('Error reading recently watched from localStorage', error);
    return [];
  }
};

const saveRecentlyWatched = (items: Poster[]): void => {
  try {
    localStorage.setItem(RECENTLY_WATCHED_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving recently watched to localStorage', error);
  }
};

export const addRecentlyWatched = (item: Poster): void => {
  const recentlyWatched = getRecentlyWatched();
  
  // Remove the item if it already exists to move it to the front
  const filteredList = recentlyWatched.filter(recent => recent.id !== item.id);
  
  // Add the new item to the beginning of the list
  const newList = [item, ...filteredList];
  
  // Limit the list to the max number of items
  const finalList = newList.slice(0, MAX_RECENT_ITEMS);
  
  saveRecentlyWatched(finalList);
};
