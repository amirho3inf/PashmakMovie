
import React, { useState, useEffect } from 'react';
import type { Slide } from '../types';

interface HeroProps {
  slides: Slide[];
}

export const Hero = ({ slides }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return <div className="h-[60vh] bg-gray-800" />;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-[60vh] w-full mb-10">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
      ))}
      
      <div className="relative z-10 flex flex-col justify-end h-full p-10 text-white">
        <h2 className="text-6xl font-extrabold mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {currentSlide.title}
        </h2>
        <div className="flex space-x-4 space-x-reverse">
          <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg text-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-all duration-200">
            Play
          </button>
          <button className="px-8 py-3 bg-gray-700/80 text-white font-bold rounded-lg text-xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200">
            More Info
          </button>
        </div>
      </div>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
    </div>
  );
};