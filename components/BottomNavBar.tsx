import React from 'react';
import { HomeIcon, SearchIcon, MovieIcon, TVIcon, SparklesIcon, HeartIcon } from './icons';
import type { View } from '../types';

interface BottomNavBarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center space-y-1 w-full h-full
        transition-colors duration-200
        focus:outline-none focus:bg-gray-700/50 rounded-md
        ${isActive ? 'text-red-500' : 'text-gray-400 hover:text-white'}
      `}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export const BottomNavBar = ({ currentView, setCurrentView }: BottomNavBarProps) => {
  return (
    <nav className="fixed bottom-0 right-0 left-0 h-20 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 z-50 md:hidden">
      <div className="flex justify-around items-center h-full">
        <NavItem
          icon={<HomeIcon className="w-7 h-7" />}
          label="خانه"
          isActive={currentView === 'home'}
          onClick={() => setCurrentView('home')}
        />
        <NavItem
          icon={<SearchIcon className="w-7 h-7" />}
          label="جستجو"
          isActive={currentView === 'search'}
          onClick={() => setCurrentView('search')}
        />
        <NavItem
          icon={<MovieIcon className="w-7 h-7" />}
          label="فیلم‌ها"
          isActive={currentView === 'movies'}
          onClick={() => setCurrentView('movies')}
        />
        <NavItem
          icon={<TVIcon className="w-7 h-7" />}
          label="سریال‌ها"
          isActive={currentView === 'series'}
          onClick={() => setCurrentView('series')}
        />
         <NavItem
          icon={<HeartIcon className="w-7 h-7" />}
          label="علاقه‌مندی"
          isActive={currentView === 'favorites'}
          onClick={() => setCurrentView('favorites')}
        />
      </div>
    </nav>
  );
};