import React from 'react';
import type { Country } from '../types';
import { CountryCard } from './CountryCard';

interface CountryRowProps {
  title: string;
  items: Country[];
  onSelectCountry: (country: Country) => void;
}

export const CountryRow = ({ title, items, onSelectCountry }: CountryRowProps) => {
    if (!items || items.length === 0) {
        return null;
    }

  return (
    <div className="mb-8 md:mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-4 px-4 md:px-10">{title}</h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden py-4 px-4 md:px-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {items.map((item) => (
          <CountryCard key={item.id} country={item} onSelect={onSelectCountry} />
        ))}
      </div>
    </div>
  );
};