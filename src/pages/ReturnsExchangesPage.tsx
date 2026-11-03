import React from 'react';
import { STORE_PHONE, STORE_WA, STORE_EMAIL } from '../data/catalog.ts';
import { Logo } from '../components/Logo.tsx';

export const ReturnsExchangesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Returns &amp; Exchanges</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Logo size="sm" isIconOnly={true} />
            <span className="font-bold text-[#002B49] text-xs">Dawashoppk Customer Protection Guarantee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Returns &amp; Exchanges</h1>
          <p className="text-xs text-slate-500 mt-1">
            3-Day Hassle-Free Replacement or Full Cash Refund via JazzCash / EasyPaisa
          </p>
        </div>

        <p>
          At <strong>dawashoppk.com</strong>, your satisfaction and peace of mind are paramount. If you receive an item that arrives defective, broken during courier transit, or differs from what you ordered, we will promptly replace the item or provide a full cash refund within <strong>2 to 3 business days</strong>.
        </p>

        {/* 3 Step Return Procedure */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">Simple 3-Step Return Process:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#002B49] text-amber-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Photograph the Parcel</h4>
              <p className="text-[11px] text-slate-500">
                Snap a quick photo or video of the received parcel, the outer courier slip, and the product seal.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-xs">WhatsApp Helpline</h4>
              <p className="text-[11px] text-slate-500">
                Send the photos along with your Order ID (e.g. DWA-1020) to our hotline at <strong>{STORE_PHONE}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Replacement or Refund</h4>
              <p className="text-[11px] text-slate-500">
                We immediately dispatch a fresh replacement or transfer your full refund to your JazzCash or EasyPaisa account.
              </p>
            </div>
          </div>
        </div>

        {/* Eligibility Conditions */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
          <h4 className="font-bold text-[#002B49] text-sm">Policy Conditions:</h4>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
            <li>Claims must be initiated within <strong>3 calendar days</strong> of receiving your parcel.</li>
            <li>Due to medical and hygienic safety regulations, opened, consumed, or unsealed personal bottles cannot be accepted unless proven defective upon initial opening.</li>
            <li>All original outer cartons and accessories should be preserved.</li>
            <li>Refunds are transferred without deduction via JazzCash, EasyPaisa, or online bank transfer.</li>
          </ul>
        </div>

        {/* Contact Strip */}
        <div className="p-5 bg-[#001A2C] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-amber-400 text-sm">Need to initiate a return or replacement?</h4>
            <p className="text-xs text-slate-300">
              Our claims manager is available 24/7 on WhatsApp: <strong>{STORE_PHONE}</strong>
            </p>
          </div>
          <a
            href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20I%20want%20to%20claim%20a%20return/refund.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>WhatsApp Claim: {STORE_PHONE}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
