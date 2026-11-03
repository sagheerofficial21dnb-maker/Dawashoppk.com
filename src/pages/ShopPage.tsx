import React, { useState, useMemo } from 'react';
import { Product } from '../types.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { getNewArrivalsProducts } from '../utils/newArrivals.ts';

interface ShopPageProps {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
  onClearSearch?: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  selectedCategory,
  searchQuery,
  onSelectProduct,
  onSelectCategory,
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory.toLowerCase() === 'new arrivals') {
        list = getNewArrivalsProducts(products, 8);
      } else {
        list = list.filter(
          (p) =>
            p.category.toLowerCase() === selectedCategory.toLowerCase() ||
            (p.categories && p.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase()))
        );
      }
    }

    // Filter by Search Query or Tag
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.slug && p.slug.toLowerCase().includes(q)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.longDescription && p.longDescription.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const viewTitle = searchQuery
    ? `Filtered for "${searchQuery}"`
    : selectedCategory && selectedCategory !== 'all'
    ? `${selectedCategory} Collection`
    : 'All Products Catalog';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#002B49]">{viewTitle}</h2>
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> verified wellness items on dawashoppk.com
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="text-xs text-amber-600 hover:text-amber-800 font-bold bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i> Clear Filter "{searchQuery}"
            </button>
          )}

          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i> Clear Category
            </button>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Matching Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or reset filters to browse the entire dawashoppk.com inventory.
          </p>
          <button
            type="button"
            onClick={() => {
              if (onClearSearch) onClearSearch();
              onSelectCategory('all');
            }}
            className="px-5 py-2 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#0d3b66] transition cursor-pointer"
          >
            Show All Products on dawashoppk.com
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
};
