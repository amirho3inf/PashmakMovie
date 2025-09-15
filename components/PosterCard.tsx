import React from 'react';
import type { Poster } from '../types';
import { StarIcon, HeartIcon } from './icons';

interface PosterCardProps {
  item: Poster;
  onSelect: (item: Poster) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: Poster) => void;
}

export const PosterCard = React.forwardRef<HTMLDivElement, PosterCardProps>(({ item, onSelect, isFavorite, onToggleFavorite }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleFavorite(item);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="group relative flex-shrink-0 w-36 h-56 md:w-48 md:h-72 rounded-lg overflow-hidden cursor-pointer 
                 transition-transform duration-300 ease-in-out transform 
                 focus:outline-none focus:ring-4 focus:ring-red-500 focus:scale-105 hover:scale-105 z-10 hover:z-20 focus:z-20"
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        className="absolute top-2 left-2 z-30 p-2 bg-black/60 rounded-full text-white transition-all duration-200 hover:bg-red-600/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <HeartIcon className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'text-white'}`} />
      </button>

      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-100 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute bottom-0 right-0 p-2 md:p-3 text-right w-full">
        <h3 className="text-white text-md md:text-lg font-bold truncate">{item.title}</h3>
        <div className="flex items-center justify-end space-x-2 space-x-reverse text-xs md:text-sm text-gray-300 mt-1">
          <span>{item.year}</span>
          <span className="flex items-center">
            <StarIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-1" />
            {item.imdb}
          </span>
        </div>
      </div>
    </div>
  );
});