import React, { useMemo } from 'react';
import { Product } from '../types.ts';
import { CATEGORIES, TESTIMONIALS } from '../data/catalog.ts';
import { TrustBadges } from '../components/TrustBadges.tsx';
import { CategorySlider } from '../components/CategorySlider.tsx';
import { HeroSlider } from '../components/HeroSlider.tsx';
import { getNewArrivalsProducts } from '../utils/newArrivals.ts';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onFilterCategory,
}) => {
  // Auto-calculated 7-day refresh and minimum 8-product guarantee for New Arrivals
  const newArrivalsProducts = useMemo(() => {
    return getNewArrivalsProducts(products, 8);
  }, [products]);

  return (
    <div className="space-y-6 pt-2">
      {/* Hero Section with Panoramic Banners */}
      <HeroSlider onFilterCategory={onFilterCategory} />

      {/* Trust Badges Strip (Includes small logo next to 100% Authentic) */}
      <TrustBadges />

      {/* Dynamic Category Sliders */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-7">
        {CATEGORIES.map((cat) => {
          const isNewArrivals = cat.toLowerCase() === 'new arrivals';
          const catProducts = isNewArrivals
            ? newArrivalsProducts
            : products.filter(
                (p) =>
                  p.category.toLowerCase() === cat.toLowerCase() ||
                  (p.categories && p.categories.some((c) => c.toLowerCase() === cat.toLowerCase()))
              );

          return (
            <CategorySlider
              key={cat}
              category={cat}
              products={catProducts}
              onSelectProduct={onSelectProduct}
              onViewCategory={onFilterCategory}
            />
          );
        })}
      </div>

      {/* Customer Testimonials Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-l-4 border-[#002B49] pl-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#002B49]">What Our Customers Say</h3>
              <p className="text-[11px] text-slate-500">Real verified feedback from clients across Pakistan</p>
            </div>
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto py-2">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-64 sm:w-80 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-amber-400 text-xs font-bold">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <span className="text-[9px] bg-blue-100 text-[#002B49] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {t.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-3 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-[#002B49] text-amber-400 font-bold flex items-center justify-center text-xs">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{t.author}</h5>
                    <span className="text-[10px] text-slate-400">
                      {t.city} &bull; <strong className="text-emerald-600 font-bold">Verified Buyer</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
