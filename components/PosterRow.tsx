import React from 'react';
import type { Poster } from '../types';
import { PosterCard } from './PosterCard';

interface PosterRowProps {
  title: string;
  items: Poster[];
  onSelectItem: (item: Poster) => void;
  favorites: Poster[];
  onToggleFavorite: (item: Poster) => void;
}

export const PosterRow = ({ title, items, onSelectItem, favorites, onToggleFavorite }: PosterRowProps) => {
    if (!items || items.length === 0) {
        return null;
    }

  return (
    <div className="mb-8 md:mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-4 px-4 md:px-10">{title}</h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden py-4 px-4 md:px-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {items.map((item) => (
          <PosterCard 
            key={item.id} 
            item={item} 
            onSelect={onSelectItem} 
            isFavorite={favorites.some(fav => fav.id === item.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};