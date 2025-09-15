import React from 'react';
import type { Country } from '../types';

interface CountryCardProps {
  country: Country;
  onSelect: (country: Country) => void;
}

export const CountryCard = React.forwardRef<HTMLDivElement, CountryCardProps>(({ country, onSelect }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(country);
    }
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="group relative flex-shrink-0 w-36 h-24 md:w-48 md:h-28 rounded-lg overflow-hidden cursor-pointer 
                 transition-transform duration-300 ease-in-out transform 
                 focus:outline-none focus:ring-4 focus:ring-red-500 focus:scale-105 hover:scale-105 z-10 hover:z-20 focus:z-20
                 flex items-center justify-center p-4 bg-gray-800"
      onClick={() => onSelect(country)}
      onKeyDown={handleKeyDown}
    >
      <img src={country.image} alt={country.title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
      <h3 className="relative text-white text-lg md:text-xl font-bold text-center">{country.title}</h3>
    </div>
  );
});