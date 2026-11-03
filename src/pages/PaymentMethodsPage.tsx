import React from 'react';
import { STORE_PHONE, STORE_WA, COD_SHIPPING } from '../data/catalog.ts';

export const PaymentMethodsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Payment Methods</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Payment Methods</h1>
          <p className="text-sm font-bold text-amber-500 mt-1">
            Flexible, Safe &amp; Convenient Payment Channels Across Pakistan
          </p>
        </div>

        <p>
          At <strong>Dawashopk.com</strong>, we offer four secure and straightforward payment methods to make your shopping experience as seamless as possible:
        </p>

        {/* 4 Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Method 1: COD */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-2 shadow-xs">
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <h3 className="font-black text-[#002B49] text-sm">1. Cash On Delivery (COD)</h3>
            <p className="text-xs text-slate-600">
              Our most popular payment method. You do not pay anything in advance. When the Leopard Courier or TCS rider delivers your package at your doorstep, you hand the exact cash amount (product price + Rs {COD_SHIPPING} courier fee) to the rider.
            </p>
            <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Recommended for 1st Time Buyers
            </span>
          </div>

          {/* Method 2: EasyPaisa */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-lg mb-2 shadow-xs">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>
            <h3 className="font-black text-[#002B49] text-sm">2. EasyPaisa Mobile Transfer</h3>
            <p className="text-xs text-slate-600">
              Transfer funds directly from your EasyPaisa app or through any nearby authorized retail agent. Once transferred, share the transaction screenshot on our WhatsApp at <strong>{STORE_PHONE}</strong> for instant dispatch processing.
            </p>
            <span className="inline-block text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
              Instant Verification via WhatsApp
            </span>
          </div>

          {/* Method 3: JazzCash */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg mb-2 shadow-xs">
              <i className="fa-solid fa-wallet"></i>
            </div>
            <h3 className="font-black text-[#002B49] text-sm">3. JazzCash Mobile Account</h3>
            <p className="text-xs text-slate-600">
              Transfer funds smoothly through your JazzCash mobile wallet or Jazz retail outlet. Simply quote your Order ID in the transaction reference or send the TID number to <strong>{STORE_PHONE}</strong>.
            </p>
            <span className="inline-block text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
              Available 24/7
            </span>
          </div>

          {/* Method 4: Bank Transfer */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002B49] flex items-center justify-center text-lg mb-2 shadow-xs">
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <h3 className="font-black text-[#002B49] text-sm">4. Direct Online Bank Transfer</h3>
            <p className="text-xs text-slate-600">
              Transfer via your banking app (Meezan Bank, HBL, Bank Alfalah, Allied Bank, MCB, Faysal Bank). Request our IBAN directly via our official helpline <strong>{STORE_PHONE}</strong>.
            </p>
            <span className="inline-block text-[10px] bg-blue-100 text-[#002B49] font-bold px-2 py-0.5 rounded">
              Corporate &amp; High-Volume Orders
            </span>
          </div>
        </div>

        {/* Verification Hotline Banner */}
        <div className="bg-[#002B49] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-base text-amber-400">Need Account Details For Advance Payment?</h4>
            <p className="text-xs text-slate-300 mt-1">
              Contact our accounts team on WhatsApp at <strong className="text-white">{STORE_PHONE}</strong> to obtain verified corporate account numbers.
            </p>
          </div>
          <a
            href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20Please%20send%20EasyPaisa/JazzCash%20account%20details.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>WhatsApp Accounts</span>
          </a>
        </div>
      </div>
    </div>
  );
};
