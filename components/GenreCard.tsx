
import React from 'react';
import type { Genre } from '../types';

interface GenreCardProps {
  genre: Genre;
  onSelect: (genre: Genre) => void;
}

export const GenreCard = React.forwardRef<HTMLDivElement, GenreCardProps>(({ genre, onSelect }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(genre);
    }
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="group relative flex-shrink-0 px-8 py-8 rounded-lg overflow-hidden cursor-pointer 
                 transition-transform duration-300 ease-in-out transform 
                 focus:outline-none focus:ring-4 focus:ring-red-500 focus:scale-105 hover:scale-105 z-10 hover:z-20 focus:z-20
                 flex items-center justify-center p-4 bg-gray-800 hover:bg-gray-700"
      onClick={() => onSelect(genre)}
      onKeyDown={handleKeyDown}
    >
      <h3 className="relative text-white text-xl font-bold text-center">{genre.title}</h3>
    </div>
  );
});