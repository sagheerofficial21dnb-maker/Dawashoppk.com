import React from 'react';
import { STORE_PHONE } from '../data/catalog.ts';

export const TrustBadges: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Free Delivery */}
        <div className="flex items-center gap-3 p-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B49] flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Free Delivery</h4>
            <p className="text-[10px] text-slate-500">Orders above Rs 10,000</p>
          </div>
        </div>

        {/* 100% Authentic */}
        <div className="flex items-center gap-3 p-1 bg-emerald-50/40 rounded-xl border border-emerald-100/60 sm:border-0 sm:bg-transparent">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-xs flex-shrink-0">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Authentic</h4>
            <p className="text-[10px] text-emerald-700 font-medium">Genuine sealed products only</p>
          </div>
        </div>

        {/* Easy Returns */}
        <div className="flex items-center gap-3 p-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i className="fa-solid fa-arrow-rotate-left"></i>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Easy Returns</h4>
            <p className="text-[10px] text-slate-500">3-Day hassle-free refund</p>
          </div>
        </div>

        {/* 24/7 Support with Website Number */}
        <div className="flex items-center gap-3 p-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">24/7 Support</h4>
            <a
              href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
              className="text-[10px] font-bold text-[#002B49] hover:underline"
            >
              {STORE_PHONE} Hotline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
