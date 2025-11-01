import React from "react";
import { Link, useLocation } from "react-router";
import {
  HomeIcon,
  SearchIcon,
  MovieIcon,
  TVIcon,
  SparklesIcon,
  HeartIcon,
} from "./icons";

const NavItem = ({
  icon,
  label,
  path,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}) => {
  return (
    <li>
      <Link
        to={path}
        tabIndex={0}
        className={`
          flex items-center space-x-4 space-x-reverse p-4 rounded-lg cursor-pointer transition-all duration-200
          text-gray-300 hover:bg-gray-700 hover:text-white
          focus:outline-none focus:ring-4 focus:ring-red-500 focus:bg-gray-700
          ${isActive ? "bg-gray-700 text-white" : ""}
        `}
      >
        {icon}
        <span className="text-xl font-semibold">{label}</span>
      </Link>
    </li>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  // Determine active route
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-72 h-screen bg-black/50 p-6 flex-col space-y-10 hidden md:flex">
      <div className="flex items-center space-x-3 space-x-reverse">
        <Link to="/">
          <h1 className="text-3xl font-bold text-red-600">پشمک‌مووی</h1>
        </Link>
      </div>
      <ul className="space-y-4">
        <NavItem
          icon={<HomeIcon className="w-8 h-8" />}
          label="خانه"
          path="/"
          isActive={isActive("/")}
        />
        <NavItem
          icon={<SearchIcon className="w-8 h-8" />}
          label="جستجو"
          path="/search"
          isActive={isActive("/search")}
        />
        <NavItem
          icon={<MovieIcon className="w-8 h-8" />}
          label="فیلم‌ها"
          path="/movies"
          isActive={isActive("/movies")}
        />
        <NavItem
          icon={<TVIcon className="w-8 h-8" />}
          label="سریال‌ها"
          path="/series"
          isActive={isActive("/series")}
        />
        <NavItem
          icon={<SparklesIcon className="w-8 h-8" />}
          label="انیمیشن / انیمه"
          path="/anime"
          isActive={isActive("/anime")}
        />
        <NavItem
          icon={<HeartIcon className="w-8 h-8" />}
          label="علاقه‌مندی‌ها"
          path="/favorites"
          isActive={isActive("/favorites")}
        />
      </ul>
    </nav>
  );
};
