import React, { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api';
import type { Poster, SearchResponse } from '../types';
import { PosterCard } from './PosterCard';
import { Loader } from './Loader';
import { SearchIcon } from './icons';

interface SearchViewProps {
  onSelectItem: (item: Poster) => void;
}

export const SearchView = ({ onSelectItem }: SearchViewProps) => {
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
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-8">جستجو</h1>
      <form onSubmit={handleSearch} className="relative mb-12">
        <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی فیلم، سریال و..."
          className="w-full bg-gray-800 text-white text-3xl py-5 pr-20 pl-6 rounded-lg border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
        />
      </form>

      {loading && <Loader />}
      {error && <p className="text-red-500 text-2xl text-center">{error}</p>}
      
      {results && (
        <div className="grid grid-cols-[repeat(auto-fill,12rem)] justify-center gap-6">
          {results.posters.map(item => (
            <PosterCard key={item.id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      )}
      
      {searched && !loading && (!results || results.posters.length === 0) && (
        <div className="text-center text-gray-400 text-3xl mt-20">
            نتیجه‌ای برای "{query}" یافت نشد.
        </div>
      )}
    </div>
  );
};
