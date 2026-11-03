import React, { useRef, useEffect } from 'react';
import { Product } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';

interface CategorySliderProps {
  category: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewCategory: (category: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  category,
  products,
  onSelectProduct,
  onViewCategory,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isPausedRef = useRef(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerPause = () => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    // 5-second inspection pause as required
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 5000);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      if (!isPausedRef.current && slider) {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          slider.scrollBy({ left: 220, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => {
      clearInterval(interval);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const handleScroll = (direction: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
      triggerPause();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isMouseDownRef.current = true;
    isPausedRef.current = true;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      triggerPause();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.6;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    isPausedRef.current = true;
    startXRef.current = e.touches[0].pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchEnd = () => {
    triggerPause();
  };

  if (products.length === 0) return null;

  const isNewArrivals = category.toLowerCase() === 'new arrivals';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
      <div className="flex items-center justify-between border-l-4 border-[#002B49] pl-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-[#002B49] tracking-tight">{category}</h3>
            {isNewArrivals && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <i className="fa-solid fa-arrows-rotate text-[9px] text-emerald-600"></i>
                Auto-refreshed every 7 days
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {isNewArrivals
              ? 'Showing latest arrivals updated every 7 days • Fully stocked with recent additions'
              : '100% Genuine with Leopard Courier Cash On Delivery'}
          </p>
        </div>
        <button
          onClick={() => onViewCategory(category)}
          className="text-xs font-bold text-blue-600 hover:text-amber-500 transition flex items-center gap-1 cursor-pointer"
        >
          VIEW ALL <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>

      {/* Relative container with left and right side buttons */}
      <div className="relative group/slider">
        {/* Left Side Arrow */}
        <button
          onClick={() => handleScroll(-1)}
          aria-label="Previous Products"
          className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#002B49] border border-slate-300 shadow-md flex items-center justify-center hover:bg-[#002B49] hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs sm:text-sm"></i>
        </button>

        {/* Scrollable Container */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="no-scrollbar slider-grab flex gap-3 sm:gap-4 overflow-x-auto py-2 scroll-smooth px-1 select-none"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>

        {/* Right Side Arrow */}
        <button
          onClick={() => handleScroll(1)}
          aria-label="Next Products"
          className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#002B49] border border-slate-300 shadow-md flex items-center justify-center hover:bg-[#002B49] hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-chevron-right text-xs sm:text-sm"></i>
        </button>
      </div>
    </div>
  );
};
