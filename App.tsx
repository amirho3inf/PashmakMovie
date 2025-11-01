import React, { useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { BottomNavBar } from "./components/BottomNavBar";
import { ScrollContainerContext } from "./contexts/ScrollContainerContext";
import { useSpatialNavigation } from "./hooks/useSpatialNavigation";

export default function App() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mainScrollRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Activate spatial navigation for the main content area
  useSpatialNavigation(mainScrollRef);

  useEffect(() => {
    // When the route changes, focus the first focusable element inside it.
    const timer = setTimeout(() => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo(0, 0);
        const firstFocusable = mainScrollRef.current.querySelector<HTMLElement>(
          '[tabindex="0"], a, button'
        );
        firstFocusable?.focus({ preventScroll: true });
      }
    }, 150); // Delay to allow the DOM to update fully

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <ScrollContainerContext.Provider value={mainScrollRef}>
      <div className="h-screen w-screen overflow-hidden bg-gray-900 md:flex">
        {isDesktop && <Sidebar />}
        <main
          ref={mainScrollRef}
          className="flex-1 h-full overflow-y-auto pb-20 md:pb-0 focus:outline-none"
          tabIndex={-1}
        >
          <Outlet />
        </main>
        {!isDesktop && <BottomNavBar />}
      </div>
    </ScrollContainerContext.Provider>
  );
}
