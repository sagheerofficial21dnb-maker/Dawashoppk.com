import React from 'react';
import { STORE_PHONE, STORE_WA, STORE_EMAIL, STORE_ADDRESS } from '../data/catalog.ts';
import { Logo } from '../components/Logo.tsx';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">About Us</span>
      </nav>

      {/* Main Content Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-xs sm:text-sm">
        {/* Header Title */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">About Us</h1>
          <p className="text-sm font-bold text-amber-500 mt-1">
            Enrich Your Experience Of Online Health &amp; Timing Shopping In Pakistan With dawashoppk.com
          </p>
        </div>

        {/* Story */}
        <div className="space-y-4">
          <p>
            Experience a convenient, confidential, and completely hassle-free way of online wellness shopping in Pakistan. <strong>dawashoppk.com</strong> elevates your personal lifestyle and intimate well-being by bringing an extensive catalog of top-class, genuine wellness formulations, imported delay sprays, vitality honey, endurance tablets, and herbal health tonics right to your doorstep.
          </p>
          <p>
            Founded with a commitment to trust and discretion, Dawashoppk has served tens of thousands of satisfied customers across all major metropolitan cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta) as well as hundreds of rural towns and tehsils across Pakistan.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#002B49] font-black text-base">
              <i className="fa-solid fa-store text-amber-500"></i>
              <h3>Convenient One-Stop Wellness Store</h3>
            </div>
            <p className="text-xs text-slate-600">
              No need to endure awkward or uncomfortable visits to crowded public medical stores or street pharmacies. Dawashoppk brings the most reputable local and international wellness solutions into a clear, organized digital store. Each item is strictly categorized with ingredients, usage guides, and verifiable product badges.
            </p>
          </div>

          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-[#002B49] font-black text-base">
              <i className="fa-solid fa-clock text-blue-600"></i>
              <h3>Buy Online 24/7 with Rapid Cash on Delivery</h3>
            </div>
            <p className="text-xs text-slate-600">
              Order at any time of day or night. We dispatch parcels with our trusted logistics partner, <strong>Leopard Courier &amp; TCS</strong>, for a flat Rs 350 courier fee. Orders above Rs 10,000 enjoy 100% Free Shipping. Pay directly with cash to the courier rider upon delivery at your doorstep.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div>
          <h3 className="text-lg font-black text-[#002B49] mb-4">Our Core Pillars of Service</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pillar 1 with small logo */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <Logo isIconOnly={true} size="sm" className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">100% Authentic Stock</h4>
              <p className="text-[11px] text-slate-500">
                Every package features manufacturer holograms, valid expiration dates, and sealed packaging. We strictly reject counterfeit products.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#002B49] flex items-center justify-center text-base">
                <i className="fa-solid fa-box-archive"></i>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">100% Discreet Brown-Box Packing</h4>
              <p className="text-[11px] text-slate-500">
                Packed in plain brown parcels without any product names, pictures, or embarrassing descriptions on the exterior. Total confidentiality.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base">
                <i className="fa-solid fa-headset"></i>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">24/7 Helpline: {STORE_PHONE}</h4>
              <p className="text-[11px] text-slate-500">
                Reach our friendly order specialists anytime via direct call or WhatsApp at <strong className="text-slate-700">{STORE_PHONE}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Banner with Website Number */}
        <div className="bg-[#002B49] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-base text-amber-400">Have Questions Or Need Advice?</h4>
            <p className="text-xs text-slate-300 mt-1">
              Our wellness counselors are available 24/7 on phone call and WhatsApp.
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              Location: <strong>{STORE_ADDRESS}</strong> &bull; Email: <strong>{STORE_EMAIL}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
              className="px-4 py-2.5 bg-white text-[#002B49] font-bold rounded-xl text-xs hover:bg-slate-100 transition shadow flex items-center gap-1.5"
            >
              <i className="fa-solid fa-phone"></i>
              <span>{STORE_PHONE}</span>
            </a>
            <a
              href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition shadow flex items-center gap-1.5"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
