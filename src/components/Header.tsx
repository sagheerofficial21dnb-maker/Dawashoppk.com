import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { CATEGORIES, STORE_PHONE, STORE_WA, STORE_EMAIL } from '../data/catalog.ts';

interface HeaderProps {
  cartCount: number;
  currentHash: string;
  onOpenCart: () => void;
  onToggleMobileDrawer: () => void;
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  currentHash,
  onOpenCart,
  onToggleMobileDrawer,
  onSearch,
  onSelectCategory,
  selectedCategory,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const active = currentHash.toLowerCase();
  const isHome = active === '#home' || active === '' || active === '#';
  const isShop = active === '#shop' || active.startsWith('#product-');
  const isAbout = active === '#about-us' || active === '#about';
  const isContact = active === '#contact-us' || active === '#contact';

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#001A2C] text-slate-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-white/10 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
              DawaShop PK
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Free Delivery on orders above Rs 10,000 across Pakistan
            </span>
            <span className="text-slate-300 font-medium sm:hidden">Free Delivery &gt; 10K</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-slate-300">
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <i className="fa-solid fa-envelope text-amber-400"></i>
              <span>{STORE_EMAIL}</span>
            </a>
            <a
              href={`https://wa.me/${STORE_WA}?text=Hello%20DawaShop%20PK!%20I%20want%20to%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white font-bold hover:text-emerald-400 transition"
            >
              <i className="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
              <span>{STORE_PHONE}</span>
            </a>
            <a href="#track-order" className="flex items-center gap-1.5 hover:text-amber-400 transition">
              <i className="fa-solid fa-truck-fast text-cyan-400"></i>
              <span className="hidden sm:inline">Track Order</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="bg-white sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Hamburger and Brand Logo */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button
                onClick={onToggleMobileDrawer}
                aria-label="Open Navigation"
                className="lg:hidden p-2 text-slate-700 hover:text-[#002B49] text-xl focus:outline-none cursor-pointer"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
              <a href="#home">
                <Logo showSubtitle={true} />
              </a>
            </div>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-2">
              <div className="flex w-full rounded-xl border border-slate-300 focus-within:border-[#002B49] focus-within:ring-2 focus-within:ring-[#002B49]/10 bg-white overflow-hidden shadow-xs">
                <select
                  value={selectedCategory}
                  onChange={(e) => onSelectCategory(e.target.value)}
                  className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 border-r border-slate-300 outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    onSearch(e.target.value);
                  }}
                  placeholder="Search products, timing tablets, delay sprays on DawaShop PK..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-700 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#002B49] text-white px-3.5 hover:bg-[#0d3b66] transition cursor-pointer"
                >
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                </button>
              </div>
            </form>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`https://wa.me/${STORE_WA}?text=Hello%20DawaShop%20PK!%20I%20want%20to%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>WhatsApp</span>
              </a>
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#002B49] hover:bg-slate-50 transition cursor-pointer"
                title="View Shopping Bag"
              >
                <i className="fa-solid fa-bag-shopping text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-2.5 md:hidden">
            <div className="flex w-full rounded-xl border border-slate-300 bg-white overflow-hidden shadow-xs">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="Search products on dawashoppk.com..."
                className="w-full px-3 py-2 text-xs text-slate-700 outline-none"
              />
              <button
                type="submit"
                className="bg-[#002B49] text-white px-3.5 flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </button>
            </div>
          </form>
        </div>

        {/* PRIMARY NAVIGATION MENU: EXCLUSIVELY FEATURING 4 FUNCTIONAL LINKS: HOME, SHOP, ABOUT US, CONTACT US */}
        <nav className="bg-[#002B49] text-white border-t border-[#001A2C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 text-xs sm:text-sm font-semibold py-1">
            {/* 1. Home */}
            <a
              href="#home"
              className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isHome
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-[#0d3b66]'
              }`}
            >
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </a>

            {/* 2. Shop */}
            <a
              href="#shop"
              className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isShop
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-[#0d3b66]'
              }`}
            >
              <i className="fa-solid fa-store"></i>
              <span>Shop</span>
            </a>

            {/* 3. About Us */}
            <a
              href="#about-us"
              className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isAbout
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-[#0d3b66]'
              }`}
            >
              <i className="fa-solid fa-circle-info"></i>
              <span>About Us</span>
            </a>

            {/* 4. Contact Us */}
            <a
              href="#contact-us"
              className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isContact
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-[#0d3b66]'
              }`}
            >
              <i className="fa-solid fa-address-book"></i>
              <span>Contact Us</span>
            </a>
          </div>
        </nav>
      </header>
    </>
  );
};
