import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { api } from '../services/api';
import type { Poster, Genre, Country, FilterOptions, SortOption } from '../types';
import { PosterCard } from './PosterCard';
import { Loader } from './Loader';
import { FilterBar } from './FilterBar';
import { FilterModal } from './FilterModal';
import { ScrollContainerContext } from '../contexts/ScrollContainerContext';

interface BrowseViewProps {
  type: 'movie' | 'series' | 'all' | 'anime';
  onSelectItem: (item: Poster) => void;
  initialGenre?: Genre;
  initialCountry?: Country;
  favorites: Poster[];
  onToggleFavorite: (item: Poster) => void;
}

const SORT_OPTIONS: { id: SortOption; title: string }[] = [
  { id: 'views', title: 'پربازدیدترین' },
  { id: 'created', title: 'جدیدترین' },
  { id: 'year', title: 'سال ساخت' },
  { id: 'imdb', title: 'امتیاز IMDB' },
];

export const BrowseView = ({ type, onSelectItem, initialGenre, initialCountry, favorites, onToggleFavorite }: BrowseViewProps) => {
  const [items, setItems] = useState<Poster[]>([]);
  const [genres, setGenres] = useState<(Omit<Genre, 'id'> & {id: 'all' | number})[]>([]);
  const [countries, setCountries] = useState<(Omit<Country, 'id' | 'image'> & {id: 'all' | number})[]>([]);
  
  const [filters, setFilters] = useState<FilterOptions>({
    genre: type === 'anime' ? 3 : (initialGenre ? initialGenre.id : 'all'),
    country: initialCountry ? initialCountry.id : 'all',
    sort: 'views'
  });
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<'genre' | 'sort' | 'country' | null>(null);

  const scrollContainerRef = useContext(ScrollContainerContext);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
        root: scrollContainerRef?.current || null,
        rootMargin: "200px",
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, scrollContainerRef]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [genresData, countriesData] = await Promise.all([
          api.getAllGenres(),
          api.getAllCountries(),
        ]);
        setGenres([{ id: 'all', title: 'همه' }, ...genresData]);
        // FIX: The `countries` state type doesn't include an `image` property.
        // The "all" object is corrected to not include `image`, and `countriesData` is mapped to only include `id` and `title` to match the state's type.
        setCountries([{ id: 'all', title: 'همه' }, ...countriesData.map(({ id, title }) => ({ id, title }))]);
      } catch (err) {
        setError('خطا در بارگذاری فیلترها.');
        console.error(err);
      } finally {
        setInitialDataLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (initialDataLoading) return;

    setLoading(true);
    setError(null);

    const fetchItems = async () => {
        try {
            const getApiCall = () => {
                switch (type) {
                    case 'movie': return api.getMovies;
                    case 'series': return api.getSeries;
                    case 'anime':
                    case 'all':
                    default:
                        return api.getPostersByFilters;
                }
            };
            const apiCall = getApiCall();
            const response = await apiCall(filters, page);

            if (response.length === 0) {
                setHasMore(false);
            } else {
                setItems(prev => page === 0 ? response : [...prev, ...response]);
            }
        } catch (err) {
            setError('محتوایی یافت نشد یا در بارگذاری خطا رخ داد.');
            if (page === 0) setItems([]); // Only clear if it's the first page failing
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    fetchItems();
  }, [type, filters, page, initialDataLoading]);


  const handleModalSelect = (value: string | number) => {
    if (activeFilter) {
        if (activeFilter === 'genre' || activeFilter === 'sort' || activeFilter === 'country') {
            setFilters(prev => ({ ...prev, [activeFilter!]: value }));
        }
        // Reset pagination when filters change
        setPage(0);
        setItems([]);
        setHasMore(true);
    }
    setActiveFilter(null);
  };
  
  const getModalOptions = () => {
      switch (activeFilter) {
          case 'genre':
              return genres;
          case 'country':
              return countries;
          case 'sort':
              return SORT_OPTIONS;
          default:
              return [];
      }
  };
  
  const getModalSelectedValue = () => {
      if (!activeFilter) return 'all';
      return filters[activeFilter];
  };

  const title = type === 'movie'
    ? 'فیلم‌ها'
    : type === 'series'
    ? 'سریال‌ها'
    : type === 'anime'
    ? 'انیمه و انیمیشن'
    : initialGenre 
    ? `ژانر: ${initialGenre.title}`
    : initialCountry
    ? `کشور: ${initialCountry.title}`
    : 'همه';

  return (
    <div className="pt-8 md:pt-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 px-4 md:px-10">{title}</h1>
      
      {activeFilter && (
        <FilterModal
          title={`انتخاب ${activeFilter === 'genre' ? 'ژانر' : activeFilter === 'country' ? 'کشور' : 'مرتب-سازی'}`}
          options={getModalOptions()}
          selectedValue={getModalSelectedValue()}
          onSelect={handleModalSelect}
          onClose={() => setActiveFilter(null)}
        />
      )}

      {initialDataLoading ? (
        <></>
      ) : (
        <FilterBar
          genres={genres}
          countries={countries}
          filters={filters}
          onPillClick={setActiveFilter}
          showGenreFilter={type !== 'anime'}
          showCountryFilter={type === 'all' || type === 'anime'}
        />
      )}
      
      {loading && items.length === 0 ? (
        <Loader />
      ) : error && items.length === 0 ? (
        <p className="text-red-500 text-xl md:text-2xl text-center px-4 md:px-10">{error}</p>
      ) : items.length > 0 ? (
        <>
          <div className="px-4 md:px-10 grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] sm:grid-cols-[repeat(auto-fill,12rem)] justify-items-center gap-4 md:gap-6">
            {items.map((item, index) => (
              <PosterCard
                ref={items.length === index + 1 ? lastItemRef : null}
                key={`${item.id}-${index}`}
                item={item}
                onSelect={onSelectItem}
                isFavorite={favorites.some(fav => fav.id === item.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
          {loading && (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
            </div>
          )}
        </>
      ) : (
         !loading && (
          <div className="text-center text-gray-400 text-xl md:text-3xl mt-20 px-4 md:px-10">
              محتوایی با این فیلترها یافت نشد.
          </div>
         )
      )}
    </div>
  );
};