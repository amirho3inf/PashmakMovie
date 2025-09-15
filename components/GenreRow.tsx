import React from 'react';
import type { Genre } from '../types';
import { GenreCard } from './GenreCard';

interface GenreRowProps {
  title: string;
  items: Genre[];
  onSelectItem: (genre: Genre) => void;
}

export const GenreRow = ({ title, items, onSelectItem }: GenreRowProps) => {
    if (!items || items.length === 0) {
        return null;
    }

  return (
    <div className="mb-8 md:mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-4 px-4 md:px-10">{title}</h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden py-4 px-4 md:px-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {items.map((item) => (
          <GenreCard key={item.id} genre={item} onSelect={onSelectItem} />
        ))}
      </div>
    </div>
  );
};