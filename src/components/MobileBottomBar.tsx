import React from 'react';
import { STORE_PHONE, STORE_WA } from '../data/catalog.ts';

interface MobileBottomBarProps {
  onSearchFocus: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onSearchFocus }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl lg:hidden py-1.5 px-3">
      <div className="flex items-center justify-around relative">
        <a href="#home" className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#002B49]">
          <i className="fa-solid fa-house text-base"></i>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </a>
        <a href="#shop" className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#002B49]">
          <i className="fa-solid fa-store text-base"></i>
          <span className="text-[10px] font-bold uppercase">Shop</span>
        </a>

        {/* Floating Phone Call Button */}
        <div className="-mt-7">
          <a
            href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
            className="w-12 h-12 rounded-full bg-[#002B49] hover:bg-[#0d3b66] text-white flex items-center justify-center shadow-lg border-4 border-white transition transform active:scale-95"
            title={`Call Hotline ${STORE_PHONE}`}
          >
            <i className="fa-solid fa-phone text-base text-amber-400"></i>
          </a>
        </div>

        <a
          href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#25D366]"
        >
          <i className="fa-brands fa-whatsapp text-lg text-[#25D366]"></i>
          <span className="text-[10px] font-bold uppercase">Chat</span>
        </a>
        <button
          onClick={onSearchFocus}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#002B49] cursor-pointer"
        >
          <i className="fa-solid fa-magnifying-glass text-base"></i>
          <span className="text-[10px] font-bold uppercase">Search</span>
        </button>
      </div>
    </div>
  );
};
