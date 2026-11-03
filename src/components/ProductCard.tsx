import React from 'react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="flex-shrink-0 w-44 sm:w-56 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      {/* Product Image Area */}
      <div
        className="relative bg-slate-50 p-3 h-44 sm:h-52 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          loading="lazy"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-rose-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
            -{discount}%
          </span>
        )}
        {product.badge && (
          <span className="absolute top-2 right-2 bg-[#002B49] text-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Details Area */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block truncate">
            {product.category}
          </span>
          <h4
            onClick={() => onSelect(product)}
            className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 hover:text-[#002B49] cursor-pointer transition"
            title={product.title}
          >
            {product.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-amber-400">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <span className="text-slate-400 text-[10px]">({product.reviewsCount || 1})</span>
        </div>

        <div className="border-t border-slate-100 pt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-[#002B49]">
              Rs {product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                Rs {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">+Rs 350 Leopard Courier</span>
        </div>

        <button
          onClick={() => onSelect(product)}
          className="w-full py-2 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
        >
          <i className="fa-solid fa-bag-shopping text-amber-400 text-[11px]"></i>
          <span>BUY NOW</span>
        </button>
      </div>
    </div>
  );
};
