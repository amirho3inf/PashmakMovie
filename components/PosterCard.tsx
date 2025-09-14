
import React from 'react';
import type { Poster } from '../types';
import { StarIcon } from './icons';

interface PosterCardProps {
  item: Poster;
  onSelect: (item: Poster) => void;
}

export const PosterCard = React.forwardRef<HTMLDivElement, PosterCardProps>(({ item, onSelect }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="group relative flex-shrink-0 w-48 h-72 rounded-lg overflow-hidden cursor-pointer 
                 transition-transform duration-300 ease-in-out transform 
                 focus:outline-none focus:ring-4 focus:ring-red-500 focus:scale-105 hover:scale-105 z-10 hover:z-20 focus:z-20"
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
    >
      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-100 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 p-3 text-right w-full">
        <h3 className="text-white text-lg font-bold truncate">{item.title}</h3>
        <div className="flex items-center justify-end space-x-2 space-x-reverse text-sm text-gray-300 mt-1">
          <span>{item.year}</span>
          <span className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            {item.imdb}
          </span>
        </div>
      </div>
    </div>
  );
});