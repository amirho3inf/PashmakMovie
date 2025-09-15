import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HomeView } from './components/HomeView';
import { DetailView } from './components/DetailView';
import { SearchView } from './components/SearchView';
import { Sidebar } from './components/Sidebar';
import { BrowseView } from './components/BrowseView';
import { Poster, Genre, View, Country } from './types';
import { initializeApiConfig } from './services/config';
import * as favoritesService from './services/favorites';
import { Loader } from './components/Loader';
import { useMediaQuery } from './hooks/useMediaQuery';
import { BottomNavBar } from './components/BottomNavBar';
import { ScrollContainerContext } from './contexts/ScrollContainerContext';
import { FavoritesView } from './components/FavoritesView';

export default function App() {
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedItem, setSelectedItem] = useState<Poster | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [favorites, setFavorites] = useState<Poster[]>([]);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const mainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeApiConfig();
        setFavorites(favoritesService.getFavorites());
      } catch (error) {
        console.error("Failed to initialize application:", error);
        setConfigError("خطا در بارگذاری تنظیمات برنامه. لطفاً بعداً دوباره امتحان کنید.");
      } finally {
        setIsConfigLoading(false);
      }
    };
    initApp();
  }, []);

  const handleSelectItem = useCallback((item: Poster) => {
    setSelectedItem(item);
  }, []);
  
  const handleSelectGenre = useCallback((genre: Genre) => {
    setSelectedGenre(genre);
    setSelectedItem(null);
    setSelectedCountry(null);
    setCurrentView('genre');
  }, []);

  const handleSelectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
    setSelectedItem(null);
    setSelectedGenre(null);
    setCurrentView('country');
  }, []);

  const handleToggleFavorite = useCallback((item: Poster) => {
    const isFav = favorites.some(fav => fav.id === item.id);
    if (isFav) {
      favoritesService.removeFavorite(item.id);
    } else {
      favoritesService.addFavorite(item);
    }
    setFavorites(favoritesService.getFavorites());
  }, [favorites]);

  const handleBack = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const renderContent = () => {
    if (selectedItem) {
      return (
        <DetailView
          item={selectedItem}
          onBack={handleBack}
          isFavorite={favorites.some(fav => fav.id === selectedItem.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView onSelectItem={handleSelectItem} onSelectGenre={handleSelectGenre} onSelectCountry={handleSelectCountry} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'search':
        return <SearchView onSelectItem={handleSelectItem} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'movies':
        return <BrowseView key="movies" type="movie" onSelectItem={handleSelectItem} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'series':
        return <BrowseView key="series" type="series" onSelectItem={handleSelectItem} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'anime':
        return <BrowseView key="anime" type="anime" onSelectItem={handleSelectItem} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'favorites':
        return <FavoritesView onSelectItem={handleSelectItem} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'genre':
        if (selectedGenre) {
            return <BrowseView key={`genre-${selectedGenre.id}`} type="all" onSelectItem={handleSelectItem} initialGenre={selectedGenre} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
        }
        setCurrentView('home'); // Fallback
        return null;
      case 'country':
        if (selectedCountry) {
            return <BrowseView key={`country-${selectedCountry.id}`} type="all" onSelectItem={handleSelectItem} initialCountry={selectedCountry} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
        }
        setCurrentView('home'); // Fallback
        return null;
      default:
        return <HomeView onSelectItem={handleSelectItem} onSelectGenre={handleSelectGenre} onSelectCountry={handleSelectCountry} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
    }
  };

  const handleSetCurrentView = (view: View) => {
      if (view !== 'genre') {
          setSelectedGenre(null);
      }
      if (view !== 'country') {
          setSelectedCountry(null);
      }
      setSelectedItem(null);
      setCurrentView(view);
  };

  if (isConfigLoading) {
    return <Loader />;
  }

  if (configError) {
    return (
      <div className="flex h-screen w-screen justify-center items-center bg-gray-900 text-red-500 text-2xl p-8 text-center">
        {configError}
      </div>
    );
  }

  return (
    <ScrollContainerContext.Provider value={mainScrollRef}>
      <div className="h-screen w-screen overflow-hidden bg-gray-900 md:flex">
        {isDesktop && <Sidebar currentView={currentView} setCurrentView={handleSetCurrentView} />}
        <main ref={mainScrollRef} className="flex-1 h-full overflow-y-auto pb-20 md:pb-0">
          {renderContent()}
        </main>
        {!isDesktop && <BottomNavBar currentView={currentView} setCurrentView={handleSetCurrentView} />}
      </div>
    </ScrollContainerContext.Provider>
  );
}