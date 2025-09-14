
import React, { useRef, useEffect } from 'react';
import type { Poster } from '../types';
import { PosterCard } from './PosterCard';

interface PosterRowProps {
  title: string;
  items: Poster[];
  onSelectItem: (item: Poster) => void;
}

export const PosterRow = ({ title, items, onSelectItem }: PosterRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);

    // This effect ensures that keyboard navigation within the row works smoothly.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!rowRef.current || !rowRef.current.contains(document.activeElement)) {
                return;
            }

            const focusableElements = Array.from(
                rowRef.current.querySelectorAll<HTMLElement>('[tabindex="0"]')
            );
            
            const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

            if (e.key === 'ArrowRight') { // RTL: go to previous item
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
                focusableElements[prevIndex]?.focus();
            } else if (e.key === 'ArrowLeft') { // RTL: go to next item
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % focusableElements.length;
                focusableElements[nextIndex]?.focus();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (!items || items.length === 0) {
        return null;
    }

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-gray-200 mb-4 px-10">{title}</h2>
      <div ref={rowRef} className="flex space-x-6 space-x-reverse overflow-x-auto overflow-y-hidden py-4 px-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {items.map((item) => (
          <PosterCard key={item.id} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    </div>
  );
};