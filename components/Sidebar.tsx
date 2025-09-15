import React from 'react';
import { HomeIcon, SearchIcon, MovieIcon, TVIcon, SparklesIcon, HeartIcon } from './icons';
// FIX: Import the shared View type from types.ts to ensure consistency with the App component.
import type { View } from '../types';

// FIX: Removed the local definition of the 'View' type to use the shared type from types.ts.
// type View = 'home' | 'search' | 'movies' | 'series';

interface SidebarProps {
  // FIX: Updated props to use the shared View type, resolving type mismatch errors.
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => {
  return (
    <li
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`
        flex items-center space-x-4 space-x-reverse p-4 rounded-lg cursor-pointer transition-all duration-200
        text-gray-300 hover:bg-gray-700 hover:text-white
        focus:outline-none focus:ring-4 focus:ring-red-500 focus:bg-gray-700
        ${isActive ? 'bg-gray-700 text-white' : ''}
      `}
    >
      {icon}
      <span className="text-xl font-semibold">{label}</span>
    </li>
  );
};

export const Sidebar = ({ currentView, setCurrentView }: SidebarProps) => {
  return (
    <nav className="w-72 h-screen bg-black/50 p-6 flex-col space-y-10 hidden md:flex">
      <div className="flex items-center space-x-3 space-x-reverse">
        <h1 className="text-3xl font-bold text-red-600">پشمک‌مووی</h1>
      </div>
      <ul className="space-y-4">
        <NavItem
          icon={<HomeIcon className="w-8 h-8" />}
          label="خانه"
          isActive={currentView === 'home'}
          onClick={() => setCurrentView('home')}
        />
        <NavItem
          icon={<SearchIcon className="w-8 h-8" />}
          label="جستجو"
          isActive={currentView === 'search'}
          onClick={() => setCurrentView('search')}
        />
        <NavItem
          icon={<MovieIcon className="w-8 h-8" />}
          label="فیلم‌ها"
          isActive={currentView === 'movies'}
          onClick={() => setCurrentView('movies')}
        />
        <NavItem
          icon={<TVIcon className="w-8 h-8" />}
          label="سریال‌ها"
          isActive={currentView === 'series'}
          onClick={() => setCurrentView('series')}
        />
        <NavItem
          icon={<SparklesIcon className="w-8 h-8" />}
          label="انیمیشن / انیمه"
          isActive={currentView === 'anime'}
          onClick={() => setCurrentView('anime')}
        />
        <NavItem
          icon={<HeartIcon className="w-8 h-8" />}
          label="علاقه‌مندی‌ها"
          isActive={currentView === 'favorites'}
          onClick={() => setCurrentView('favorites')}
        />
      </ul>
    </nav>
  );
};