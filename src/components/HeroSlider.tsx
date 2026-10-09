import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../types';

interface HeroSliderProps {
  slides: Slide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Cycling colors
  const cycleColors = ['#EAB308', '#06B6D4', '#EF4444', '#F59E0B', '#10B981'];

  // Hero slider cycle change per 6 seconds as requested
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      setColorIndex((prev) => (prev + 1) % cycleColors.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides, cycleColors.length, currentSlideIndex]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setColorIndex((prev) => (prev + 1) % cycleColors.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setColorIndex((prev) => (prev - 1 + cycleColors.length) % cycleColors.length);
  };

  // Touch handlers for high sensitivity mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 40) {
      prevSlide();
    } else if (diff < -40) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[currentSlideIndex] || slides[0];
  const activeColor = activeSlide.color || cycleColors[colorIndex];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden select-none bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-200 border-b border-zinc-200 py-8 sm:py-10 md:py-12 lg:py-14 shadow-inner min-h-[220px] sm:min-h-[260px] md:min-h-[290px] lg:min-h-[320px] flex items-center justify-center"
    >
      {/* Background image if active slide has one - full background with readable overlay */}
      {activeSlide.imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={activeSlide.imageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          {/* Subtle translucent scrim so text remains crystal clear */}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/70" />
        </div>
      )}

      {/* Ambient color lighting glow */}
      <div
        className="absolute inset-0 opacity-15 transition-colors duration-1000 pointer-events-none z-1"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 70%)`,
        }}
      />

      {/* HIGH SENSITIVITY INVISIBLE LEFT CLICK REGION (Full left half) */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer bg-transparent border-0 opacity-0 focus:outline-none"
        title="Previous slide (click anywhere on left half)"
        aria-label="Previous slide"
      />

      {/* HIGH SENSITIVITY INVISIBLE RIGHT CLICK REGION (Full right half) */}
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer bg-transparent border-0 opacity-0 focus:outline-none"
        title="Next slide (click anywhere on right half)"
        aria-label="Next slide"
      />

      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center text-center pointer-events-none">
        {/* Dynamic Text Header: "[DYNAMIC_COLOR]TITLE[/DYNAMIC_COLOR] artifacts" */}
        <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none drop-shadow-sm transition-all duration-700">
          <span
            className="transition-colors duration-700 ease-in-out font-black"
            style={{ color: activeColor }}
          >
            {activeSlide.titleHighlight || 'TITLE'}
          </span>{' '}
          <span className="text-zinc-400 font-extrabold tracking-normal">
            {activeSlide.titleSuffix || 'artifacts'}
          </span>
        </h1>

        {/* Subtitle if available */}
        {activeSlide.subtitle && (
          <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-700 max-w-2xl font-medium drop-shadow-xs">
            {activeSlide.subtitle}
          </p>
        )}

        {/* Pagination Indicators (dots) centered below hero banner */}
        <div className="flex items-center justify-center gap-2 mt-8 md:mt-12 bg-zinc-200/80 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-300 shadow-xs z-40 pointer-events-auto">
          {slides.map((slide, idx) => (
            <button
              key={slide.id || idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-7 h-2.5 bg-zinc-900'
                  : 'w-2.5 h-2.5 bg-zinc-400 hover:bg-zinc-600'
              }`}
              title={`Go to slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
