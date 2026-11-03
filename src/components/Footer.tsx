import React from 'react';
import { STORE_PHONE, STORE_WA, STORE_EMAIL, STORE_ADDRESS } from '../data/catalog.ts';
import { Logo } from './Logo.tsx';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001A2C] text-slate-300 pt-10 sm:pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="md" variant="light" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400 font-black text-sm">DawaShopPK.com</strong> is Pakistan's trusted online destination for 100% genuine health supplements, timing sprays, delay creams, vitality honey, and herbal wellness solutions. Discreet brown-box delivery nationwide.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center text-xs transition"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center text-xs transition"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href={`https://wa.me/${STORE_WA}?text=Hello%20DawaShop%20PK!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center text-xs transition"
                title={`WhatsApp ${STORE_PHONE}`}
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center text-xs transition"
                title="YouTube"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Col 2: INFORMATION */}
          <div>
            <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-wider mb-3.5 border-l-2 border-amber-500 pl-2">
              INFORMATION
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about-us" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact-us" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#privacy-policy" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms-conditions" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#how-to-order" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  How To Order
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: CUSTOMER SERVICE */}
          <div>
            <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-wider mb-3.5 border-l-2 border-amber-500 pl-2">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#track-order" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Track Order
                </a>
              </li>
              <li>
                <a href="#returns-exchanges" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Returns &amp; Exchanges
                </a>
              </li>
              <li>
                <a href="#payment-methods" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Payment Methods
                </a>
              </li>
              <li>
                <a href="#warranty" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Warranty &amp; Authenticity
                </a>
              </li>
              <li>
                <a href="#delivery-info" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <i className="fa-solid fa-chevron-right text-[9px] text-amber-500/70"></i>
                  Delivery Information
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: GET IN TOUCH */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-wider mb-3.5 border-l-2 border-amber-500 pl-2">
              GET IN TOUCH
            </h4>
            <div className="text-xs space-y-2.5 text-slate-300">
              <p className="flex items-start gap-2.5">
                <i className="fa-solid fa-location-dot text-amber-400 mt-0.5"></i>
                <span>{STORE_ADDRESS}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <i className="fa-solid fa-phone text-amber-400"></i>
                <a href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`} className="hover:text-white font-bold text-slate-200">
                  {STORE_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <i className="fa-solid fa-envelope text-amber-400"></i>
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-white">
                  {STORE_EMAIL}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <i className="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
                <a
                  href={`https://wa.me/${STORE_WA}?text=Hello%20dawashoppk.com!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-semibold"
                >
                  WhatsApp: {STORE_PHONE}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <div className="pt-6 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-400">Accepted Payment Methods:</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-1 rounded text-[11px] font-semibold">
              CASH ON DELIVERY (COD)
            </span>
            <span className="bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-1 rounded text-[11px] font-semibold">
              EASYPAISA
            </span>
            <span className="bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-1 rounded text-[11px] font-semibold">
              JAZZCASH
            </span>
            <span className="bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-1 rounded text-[11px] font-semibold">
              DIRECT BANK TRANSFER
            </span>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="border-t border-slate-800/80 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
          <p>&copy; 2026 <strong className="text-white font-bold">DawaShop PK</strong>. All Rights Reserved. Official Helpline: <strong className="text-amber-400 font-bold">{STORE_PHONE}</strong></p>
          <div className="flex items-center gap-4">
            <a href="#privacy-policy" className="hover:text-slate-300">
              Privacy Policy
            </a>
            <span>&bull;</span>
            <a href="#terms-conditions" className="hover:text-slate-300">
              Terms &amp; Conditions
            </a>
            <span>&bull;</span>
            <a href="#admin" className="hover:text-amber-400/80 text-[10px]">
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
