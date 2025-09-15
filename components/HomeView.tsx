import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { HomeData, Poster, Genre, Country } from '../types';
import { PosterRow } from './PosterRow';
import { Loader } from './Loader';
import { CountryRow } from './CountryRow';
import { GenreRow } from './GenreRow';

interface HomeViewProps {
  onSelectItem: (item: Poster) => void;
  onSelectGenre: (genre: Genre) => void;
  onSelectCountry: (country: Country) => void;
  favorites: Poster[];
  onToggleFavorite: (item: Poster) => void;
  recentlyWatched: Poster[];
}

export const HomeView = ({ onSelectItem, onSelectGenre, onSelectCountry, favorites, onToggleFavorite, recentlyWatched }: HomeViewProps) => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [homeDataResponse, allGenresResponse] = await Promise.all([
          api.getHome(),
          api.getAllGenres()
        ]);
        setHomeData(homeDataResponse);
        setAllGenres(allGenresResponse);
      } catch (err) {
        setError('خطا در بارگذاری محتوا. لطفاً بعداً دوباره امتحان کنید.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-2xl text-red-500">{error}</div>;
  }

  if (!homeData) {
    return null;
  }

  return (
    <div className="pt-6 md:pt-10">
      <GenreRow
        title="ژانرها"
        items={allGenres}
        onSelectItem={onSelectGenre}
      />
      {recentlyWatched.length > 0 && (
        <PosterRow
          title="اخیراً تماشا شده"
          items={recentlyWatched}
          onSelectItem={onSelectItem}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      {[...homeData.genres].reverse().map((genre) => (
        <PosterRow
          key={genre.id}
          title={genre.title}
          items={genre.posters}
          onSelectItem={onSelectItem}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      {homeData.countries && homeData.countries.length > 0 && (
        <CountryRow
          title="کشورها"
          items={homeData.countries}
          onSelectCountry={onSelectCountry}
        />
      )}
    </div>
  );
};