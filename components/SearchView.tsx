import React, { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api';
import type { Poster, SearchResponse } from '../types';
import { PosterCard } from './PosterCard';
import { Loader } from './Loader';
import { SearchIcon } from './icons';

interface SearchViewProps {
  onSelectItem: (item: Poster) => void;
  favorites: Poster[];
  onToggleFavorite: (item: Poster) => void;
}

export const SearchView = ({ onSelectItem, favorites, onToggleFavorite }: SearchViewProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await api.search(query);
      setResults(data);
    } catch (err) {
      setError('جستجو ناموفق بود. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">جستجو</h1>
      <form onSubmit={handleSearch} className="relative mb-12">
        <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 md:right-6 md:w-8 md:h-8 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی فیلم، سریال و..."
          className="w-full bg-gray-800 text-white text-xl md:text-3xl py-4 pr-12 md:py-5 md:pr-20 pl-6 rounded-lg border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
        />
      </form>

      {loading && <Loader />}
      {error && <p className="text-red-500 text-xl md:text-2xl text-center">{error}</p>}
      
      {results && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
          {results.posters.map(item => (
            <PosterCard 
              key={item.id} 
              item={item} 
              onSelect={onSelectItem} 
              isFavorite={favorites.some(fav => fav.id === item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
      
      {searched && !loading && (!results || results.posters.length === 0) && (
        <div className="text-center text-gray-400 text-xl md:text-3xl mt-20">
            نتیجه‌ای برای "{query}" یافت نشد.
        </div>
      )}
    </div>
  );
};