import React, { useState, useEffect, useRef } from 'react';
import { STORE_PHONE, STORE_WA } from '../data/catalog.ts';

export interface HeroSlide {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  waMessage: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'male-wellness-creams',
    title: 'Male Wellness Creams',
    category: 'Delay Cream',
    image: '/assets/aistudio/ca246b2c-8819-4013-8fb5-4a3c268e4f97_a7b45d5e.jpg',
    alt: 'Male Wellness Creams - Procomil, Von Von, Horse Power, Knight Rider',
    waMessage: 'Hello DawaShop PK! I want to order Male Wellness Creams.',
  },
  {
    id: 'super-viga-delay-spray',
    title: 'Super Viga Delay Spray',
    category: 'Delay Spray',
    image: '/assets/aistudio/2e5a4770-2682-43c1-9150-d2b8f8e2b542_af6c9b07.jpg',
    alt: 'Super Viga Delay Spray - Maximum Long-Time Formula with Vitamin E',
    waMessage: 'Hello DawaShop PK! I want to order Super Viga Delay Spray.',
  },
  {
    id: 'bio-beauty-breast-cream',
    title: 'Bio Beauty Breast Cream',
    category: 'For Female',
    image: '/assets/aistudio/1a226e7a-e8b3-4c6f-8fcd-d84823920f36_57b3be26.jpg',
    alt: 'Bio Beauty Breast Cream - Firming & Enlargement 100% Natural Formula',
    waMessage: 'Hello DawaShop PK! I want to order Bio Beauty Breast Cream.',
  },
];

interface HeroSliderProps {
  onFilterCategory: (category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onFilterCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Smooth Autoplay with Pause on Hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const handleSlideClick = (slide: HeroSlide) => {
    onFilterCategory(slide.category);
    window.location.hash = '#shop';
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 select-none">
      <div
        className="relative w-full aspect-[21/9] bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-800 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Panoramic Banners Track */}
        <div
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 relative cursor-pointer bg-slate-950 flex items-center justify-center overflow-hidden"
              onClick={() => handleSlideClick(slide)}
              title={`Click to view ${slide.title} on DawaShop PK`}
            >
              {/* Ultra-wide 21:9 image with responsive scaling - no cropping, distortion, or text overlays */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-contain sm:object-cover pointer-events-none"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/85 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 opacity-80 sm:opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-lg hover:scale-105"
        >
          <i className="fa-solid fa-chevron-left text-xs sm:text-sm"></i>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/85 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 opacity-80 sm:opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-lg hover:scale-105"
        >
          <i className="fa-solid fa-chevron-right text-xs sm:text-sm"></i>
        </button>

        {/* Clean Slide Indicators (Dots & Pills) */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 bg-slate-950/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-amber-400 shadow-sm'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
