import React, { useState, useCallback, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { DetailView } from './components/DetailView';
import { SearchView } from './components/SearchView';
import { Sidebar } from './components/Sidebar';
import { BrowseView } from './components/BrowseView';
// FIX: Import the shared View type from types.ts to ensure type consistency across components.
import { Poster, Genre, View, Country } from './types';
import { initializeApiConfig } from './services/config';
import { Loader } from './components/Loader';

// FIX: Removed the local definition of the 'View' type. It is now defined in types.ts to be used globally.
// type View = 'home' | 'search' | 'movies' | 'series' | 'genre';

export default function App() {
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedItem, setSelectedItem] = useState<Poster | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeApiConfig();
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

  const handleBack = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const renderContent = () => {
    if (selectedItem) {
      return <DetailView item={selectedItem} onBack={handleBack} />;
    }

    switch (currentView) {
      case 'home':
        return <HomeView onSelectItem={handleSelectItem} onSelectGenre={handleSelectGenre} onSelectCountry={handleSelectCountry} />;
      case 'search':
        return <SearchView onSelectItem={handleSelectItem} />;
      case 'movies':
        return <BrowseView key="movies" type="movie" onSelectItem={handleSelectItem} />;
      case 'series':
        return <BrowseView key="series" type="series" onSelectItem={handleSelectItem} />;
      case 'anime':
        return <BrowseView key="anime" type="anime" onSelectItem={handleSelectItem} />;
      case 'genre':
        if (selectedGenre) {
            return <BrowseView key={`genre-${selectedGenre.id}`} type="all" onSelectItem={handleSelectItem} initialGenre={selectedGenre} />;
        }
        setCurrentView('home'); // Fallback
        return null;
      case 'country':
        if (selectedCountry) {
            return <BrowseView key={`country-${selectedCountry.id}`} type="all" onSelectItem={handleSelectItem} initialCountry={selectedCountry} />;
        }
        setCurrentView('home'); // Fallback
        return null;
      default:
        return <HomeView onSelectItem={handleSelectItem} onSelectGenre={handleSelectGenre} onSelectCountry={handleSelectCountry} />;
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
    return (
      <div className="flex h-screen w-screen justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex h-screen w-screen justify-center items-center bg-gray-900 text-red-500 text-2xl p-8 text-center">
        {configError}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
      <Sidebar currentView={currentView} setCurrentView={handleSetCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}