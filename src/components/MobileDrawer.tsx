import React from 'react';
import { STORE_PHONE, STORE_WA } from '../data/catalog.ts';
import { Logo } from './Logo.tsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentHash?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentHash = '#home',
}) => {
  if (!isOpen) return null;

  const active = currentHash.toLowerCase();
  const isHome = active === '#home' || active === '' || active === '#';
  const isShop = active === '#shop';
  const isAbout = active === '#about-us' || active === '#about';
  const isContact = active === '#contact-us' || active === '#contact';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed top-0 bottom-0 left-0 w-72 max-w-[82vw] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out">
        <div className="p-4 bg-[#002B49] text-white flex items-center justify-between border-b border-[#001A2C]">
          <div className="flex items-center gap-2">
            <Logo size="sm" variant="light" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close Navigation"
            className="text-slate-300 hover:text-white text-lg p-1 cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* PRIMARY NAVIGATION MENU: EXCLUSIVELY THE 4 FUNCTIONAL LINKS */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 text-sm font-bold text-slate-700">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-1">
            Navigation Menu
          </div>

          {/* 1. Home */}
          <a
            href="#home"
            onClick={onClose}
            className={`w-full py-3 px-3.5 rounded-xl flex items-center gap-3 transition ${
              isHome
                ? 'bg-[#002B49] text-amber-400 shadow-sm'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <i className="fa-solid fa-house w-5 text-center"></i>
            <span>Home</span>
          </a>

          {/* 2. Shop */}
          <a
            href="#shop"
            onClick={onClose}
            className={`w-full py-3 px-3.5 rounded-xl flex items-center gap-3 transition ${
              isShop
                ? 'bg-[#002B49] text-amber-400 shadow-sm'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <i className="fa-solid fa-store w-5 text-center"></i>
            <span>Shop</span>
          </a>

          {/* 3. About Us */}
          <a
            href="#about-us"
            onClick={onClose}
            className={`w-full py-3 px-3.5 rounded-xl flex items-center gap-3 transition ${
              isAbout
                ? 'bg-[#002B49] text-amber-400 shadow-sm'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <i className="fa-solid fa-circle-info w-5 text-center"></i>
            <span>About Us</span>
          </a>

          {/* 4. Contact Us */}
          <a
            href="#contact-us"
            onClick={onClose}
            className={`w-full py-3 px-3.5 rounded-xl flex items-center gap-3 transition ${
              isContact
                ? 'bg-[#002B49] text-amber-400 shadow-sm'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <i className="fa-solid fa-address-book w-5 text-center"></i>
            <span>Contact Us</span>
          </a>

          {/* Quick Track link in footer of drawer */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <a
              href="#track-order"
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2.5 text-xs text-slate-500 font-medium"
            >
              <i className="fa-solid fa-truck-fast text-[#002B49]"></i>
              <span>Track Existing Order</span>
            </a>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
          <a
            href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
            className="py-2.5 px-2 bg-slate-900 hover:bg-black text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <i className="fa-solid fa-phone text-amber-400"></i> Call Now
          </a>
          <a
            href={`https://wa.me/${STORE_WA}?text=Hello%20dawashoppk.com!`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-2 bg-[#25D366] hover:bg-emerald-600 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i> WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};
