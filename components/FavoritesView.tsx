import React from 'react';
import type { Poster } from '../types';
import { PosterCard } from './PosterCard';
import { HeartIcon } from './icons';

interface FavoritesViewProps {
  favorites: Poster[];
  onSelectItem: (item: Poster) => void;
  onToggleFavorite: (item: Poster) => void;
}

export const FavoritesView = ({ favorites, onSelectItem, onToggleFavorite }: FavoritesViewProps) => {
  return (
    <div className="p-4 md:p-10 pt-8 md:pt-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">علاقه‌مندی‌ها</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
          {favorites.map(item => (
            <PosterCard 
              key={item.id} 
              item={item} 
              onSelect={onSelectItem}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-xl md:text-3xl mt-20 flex flex-col items-center justify-center h-[50vh]">
            <HeartIcon className="w-20 h-20 mb-4 text-gray-500" />
            <p>هنوز هیچ موردی به علاقه‌مندی‌ها اضافه نشده است.</p>
        </div>
      )}
    </div>
  );
};
