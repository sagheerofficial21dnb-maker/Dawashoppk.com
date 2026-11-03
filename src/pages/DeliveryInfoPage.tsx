import React from 'react';
import { STORE_PHONE, STORE_WA, COD_SHIPPING, FREE_DELIVERY_THRESHOLD } from '../data/catalog.ts';

export const DeliveryInfoPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Delivery Information</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Delivery Information</h1>
          <p className="text-sm font-bold text-amber-500 mt-1">
            Fast, Reliable &amp; 100% Discreet Cash On Delivery Across All of Pakistan
          </p>
        </div>

        <p>
          At <strong>dawashoppk.com</strong>, we partner with Pakistan's premier courier networks—including <strong>Leopard Courier</strong>, <strong>TCS</strong>, and <strong>Trax Logistics</strong>—to ensure swift, safe, and confidential doorstep deliveries anywhere in the country.
        </p>

        {/* Delivery Timelines & Charges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002B49] flex items-center justify-center text-lg mb-2 shadow-xs">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="font-black text-[#002B49] text-sm">Delivery Timelines</h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
              <li><strong>Lahore &amp; Gujranwala:</strong> Same day or 24 Hours.</li>
              <li><strong>Karachi, Islamabad, Rawalpindi, Peshawar:</strong> 24 to 48 Hours.</li>
              <li><strong>Faisalabad, Multan, Sialkot, Hyderabad:</strong> 24 to 48 Hours.</li>
              <li><strong>Rural Towns, Tehsils &amp; Remote Districts:</strong> 2 to 3 Business Days.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-2 shadow-xs">
              <i className="fa-solid fa-tags"></i>
            </div>
            <h3 className="font-black text-[#002B49] text-sm">Courier Charges</h3>
            <div className="space-y-1 text-xs text-slate-600">
              <p>
                Flat COD Delivery Charge: <strong className="text-[#002B49] text-sm font-black">Rs {COD_SHIPPING}</strong> nationwide.
              </p>
              <p>
                Whether you live in Karachi, Gwadar, Gilgit, or Lahore, the delivery fee remains fixed at Rs {COD_SHIPPING}.
              </p>
              <p className="text-emerald-700 font-bold mt-2">
                &bull; Orders exceeding Rs {FREE_DELIVERY_THRESHOLD.toLocaleString()} receive 100% FREE SHIPPING!
              </p>
            </div>
          </div>
        </div>

        {/* 100% Discreet Packaging Section */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0">
              <i className="fa-solid fa-box"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-amber-400">100% Discreet &amp; Confidential Brown-Box Packaging</h3>
              <p className="text-xs text-slate-300">Your privacy is our utmost commitment.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="block text-white mb-1">Plain Brown Parcel</strong>
              <span>Packaged in heavy brown cardboard without any outside product pictures or text.</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="block text-white mb-1">Confidential Courier Slip</strong>
              <span>Outer airway bill mentions only "Personal Care Merchandise" or "Health Care".</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="block text-white mb-1">Direct Rider Handover</strong>
              <span>Courier rider will call you prior to arrival so you can receive the parcel privately.</span>
            </div>
          </div>
        </div>

        {/* Hotline Assistance */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#002B49] text-sm">Need Urgent Dispatch Or Special Delivery Instructions?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Call or WhatsApp our dispatch manager 24/7 at <strong className="text-slate-800">{STORE_PHONE}</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
              className="px-4 py-2 bg-[#002B49] hover:bg-[#0d3b66] text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-phone"></i>
              <span>{STORE_PHONE}</span>
            </a>
            <a
              href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20I%20have%20a%20delivery%20question.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
