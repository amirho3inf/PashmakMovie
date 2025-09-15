import React, { useEffect, useRef } from 'react';

interface Option {
  id: number | string;
  title: string;
}

interface FilterModalProps {
  title: string;
  options: Option[];
  selectedValue: number | string;
  onSelect: (value: number | string) => void;
  onClose: () => void;
}

export const FilterModal = ({ title, options, selectedValue, onSelect, onClose }: FilterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus the currently selected item or the first item in the list
    const selectedElement = modalRef.current?.querySelector<HTMLElement>(`[data-value="${selectedValue}"]`);
    if (selectedElement) {
        selectedElement.focus();
    } else {
        modalRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    }


    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, selectedValue]);

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 pb-24 md:pb-4" role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
      <div ref={modalRef} className="relative bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col p-6 md:p-8">
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-4 left-4 md:top-6 md:left-6 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 id="filter-modal-title" className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">{title}</h2>
        <ul className="overflow-y-auto space-y-2 pr-2 -mr-2 md:pr-4 md:-mr-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
          {options.map((option) => (
            <li key={option.id}>
              <button
                tabIndex={0}
                data-value={option.id}
                onClick={() => onSelect(option.id)}
                className={`
                  w-full text-right text-xl md:text-2xl font-semibold p-4 rounded-lg transition-colors duration-200
                  focus:outline-none focus:bg-red-600 focus:text-white
                  hover:bg-gray-700
                  ${selectedValue === option.id ? 'bg-red-700 text-white' : 'text-gray-300'}
                `}
              >
                {option.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};