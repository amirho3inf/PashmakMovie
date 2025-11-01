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
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ icon, label, path, isActive }, ref) => {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn(
          "flex flex-col items-center justify-center gap-1 h-full",
          "min-w-0 flex-1 px-2 py-2",
          "rounded-lg",
          "transition-all duration-200",
          isActive
            ? "text-primary bg-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        <Link ref={ref} to={path} className="flex flex-col items-center gap-1">
          <span className="text-xl">{icon}</span>
          <span className="text-[10px] font-medium leading-tight">{label}</span>
        </Link>
      </Button>
    );
  }
);

NavItem.displayName = "NavItem";

export const BottomNavBar = () => {
  const location = useLocation();

  // Determine active route
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      icon: <HomeIcon className="w-5 h-5" />,
      label: "خانه",
      path: "/",
    },
    {
      icon: <SearchIcon className="w-5 h-5" />,
      label: "جستجو",
      path: "/search",
    },
    {
      icon: <MovieIcon className="w-5 h-5" />,
      label: "فیلم‌ها",
      path: "/movies",
    },
    {
      icon: <TVIcon className="w-5 h-5" />,
      label: "سریال‌ها",
      path: "/series",
    },
    {
      icon: <SparklesIcon className="w-5 h-5" />,
      label: "انیمه",
      path: "/anime",
    },
    {
      icon: <HeartIcon className="w-5 h-5" />,
      label: "علاقه‌مندی",
      path: "/favorites",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 right-0 left-0 z-50",
        "h-20 border-t border-border bg-background/95 backdrop-blur",
        "md:hidden" // Hide on desktop
      )}
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={isActive(item.path)}
          />
        ))}
      </div>
    </nav>
  );
};
