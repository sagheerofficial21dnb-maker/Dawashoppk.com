import React from 'react';
import { STORE_PHONE, STORE_WA } from '../data/catalog.ts';
import { Logo } from '../components/Logo.tsx';

export const WarrantyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Warranty &amp; Authenticity</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Logo size="sm" isIconOnly={true} />
            <span className="font-bold text-[#002B49] text-xs">Dawashoppk Quality Assurance Division</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Warranty &amp; Authenticity Assurance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Zero Counterfeits &bull; Verifiable Holograms &bull; 100% Original Sealed Formulations
          </p>
        </div>

        {/* 100% Authentic Banner with Small Logo next to it */}
        <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-emerald-950">100% Authentic Quality Guarantee</h3>
                {/* Small Logo next to 100% Authentic */}
                <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                  <Logo isIconOnly={true} size="sm" className="w-5 h-5 text-[10px]" />
                  <span className="font-black text-[11px] text-[#002B49]">
                    Dawa<span className="text-amber-500">shop</span>pk
                  </span>
                </div>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Every item distributed by Dawashoppk is strictly certified for manufacturer authenticity.
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed pt-1">
            Counterfeit or substandard timing products can pose severe health hazards. At Dawashoppk, we operate a strict zero-tolerance policy against copied or expired products. Every batch undergoes physical inspection to verify intact tamper seals, expiration dates, holographic markers, and manufacturer lot codes.
          </p>
        </div>

        {/* 4 Pillars of Authenticity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-[#002B49] font-bold text-sm">
              <i className="fa-solid fa-lock text-emerald-600"></i>
              <h4>1. Tamper-Proof Factory Seals</h4>
            </div>
            <p className="text-xs text-slate-600">
              Every bottle, capsule blister, and spray container is factory sealed. Never accept a package if the tamper seal is sliced or missing upon courier delivery.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-[#002B49] font-bold text-sm">
              <i className="fa-solid fa-calendar-check text-blue-600"></i>
              <h4>2. Fresh Expiration Guarantee</h4>
            </div>
            <p className="text-xs text-slate-600">
              All inventory in our climate-controlled Lahore warehouse is fresh with a minimum validity of 2 to 3 years. We never dispatch near-expiry products.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-[#002B49] font-bold text-sm">
              <i className="fa-solid fa-temperature-arrow-down text-purple-600"></i>
              <h4>3. Climate Controlled Storage</h4>
            </div>
            <p className="text-xs text-slate-600">
              Medicinal sprays, oral jellies, and royal honey are preserved under optimal humidity and temperature (below 25&deg;C) to maintain active ingredient potency.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-[#002B49] font-bold text-sm">
              <i className="fa-solid fa-arrow-rotate-left text-amber-600"></i>
              <h4>4. 3-Day Exchange Guarantee</h4>
            </div>
            <p className="text-xs text-slate-600">
              If an item is damaged during courier shipment, our 3-day guarantee covers immediate replacement or full money refund via JazzCash/EasyPaisa.
            </p>
          </div>
        </div>

        {/* Verification Hotline Card */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#002B49] text-sm">Need Help Verifying a Hologram or Batch Number?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact our quality assurance desk on phone or WhatsApp at <strong className="text-slate-800">{STORE_PHONE}</strong>.
            </p>
          </div>
          <a
            href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20I%20want%20to%20verify%20a%20product%20authenticity.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>WhatsApp: {STORE_PHONE}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
