import React from 'react';
import type { Genre, Country, FilterOptions, SortOption } from '../types';

interface FilterBarProps {
  genres: (Omit<Genre, 'id'> & {id: 'all' | number})[];
  countries: (Omit<Country, 'id' | 'image'> & {id: 'all' | number})[];
  filters: FilterOptions;
  onPillClick: (filterType: 'genre' | 'sort' | 'country') => void;
  showGenreFilter?: boolean;
  showCountryFilter?: boolean;
}

const SORT_OPTIONS_FOR_UI: { value: SortOption; label: string }[] = [
  { value: 'created', label: 'جدیدترین' },
  { value: 'year', label: 'سال ساخت' },
  { value: 'imdb', label: 'امتیاز IMDB' },
  { value: 'views', label: 'پربازدیدترین' },
];

const FilterPill = ({ label, value, onClick }: { label: string, value: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 text-gray-200 text-base md:text-xl font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg border-2 border-transparent hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:bg-gray-700 transition-all"
  >
    <span className="text-gray-400">{label}:</span> {value}
  </button>
);

export const FilterBar = ({ genres, countries, filters, onPillClick, showGenreFilter = true, showCountryFilter = true }: FilterBarProps) => {

  const getGenreTitle = (id: number | 'all') => {
    if (id === 'all') return 'همه';
    return genres.find(g => g.id === id)?.title || 'همه';
  };

  const getCountryTitle = (id: number | 'all') => {
    if (id === 'all') return 'همه';
    return countries.find(c => c.id === id)?.title || 'همه';
  };

  const getSortTitle = (value: SortOption) => {
    return SORT_OPTIONS_FOR_UI.find(opt => opt.value === value)?.label || 'جدیدترین';
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-3 md:gap-6 px-4 md:px-10 mb-8">
      {showGenreFilter && <FilterPill label="ژانر" value={getGenreTitle(filters.genre)} onClick={() => onPillClick('genre')} />}
      {showCountryFilter && <FilterPill label="کشور" value={getCountryTitle(filters.country)} onClick={() => onPillClick('country')} />}
      <FilterPill label="مرتب‌سازی" value={getSortTitle(filters.sort)} onClick={() => onPillClick('sort')} />
    </div>
  );
};