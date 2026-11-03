import React from 'react';
import { STORE_PHONE, STORE_WA, COD_SHIPPING, FREE_DELIVERY_THRESHOLD } from '../data/catalog.ts';

export const HowToOrderPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">How To Order</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">How To Order</h1>
          <p className="text-sm font-bold text-amber-500 mt-1">
            Placing an Order on Dawashoppk is Quick, Easy &amp; 100% Confidential!
          </p>
        </div>

        <p>
          We offer three effortless ways to place your order anywhere in Pakistan. Pick whichever method is most comfortable for you:
        </p>

        {/* 3 Step Visual Flow */}
        <div className="space-y-4">
          {/* Method 1 */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#002B49] text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-black text-[#002B49] text-sm sm:text-base">
                Method A: Direct Online Cash on Delivery Form
              </h3>
            </div>
            <p className="text-xs text-slate-600 pl-10">
              Browse our catalog, find your desired item, and click the <strong>"BUY NOW"</strong> button on any product card or detail page. A clean popup form will appear. Simply enter your Name, Mobile Number, City, and Delivery Address, then click <strong>"Confirm Order"</strong>. You will receive an immediate Order ID (e.g. DWA-1045) and our dispatch team will route your parcel to Leopard Courier.
            </p>
          </div>

          {/* Method 2 */}
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#25D366] text-white font-black text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-black text-emerald-950 text-sm sm:text-base">
                Method B: Instant WhatsApp Order ({STORE_PHONE})
              </h3>
            </div>
            <p className="text-xs text-emerald-900 pl-10">
              On every product page, click the green <strong>"ORDER ON WHATSAPP"</strong> button. This immediately opens a chat with our customer agent at <strong>{STORE_PHONE}</strong> with your selected item name, price, and link pre-filled. Simply send your address in the chat, and our representative will book your order immediately.
            </p>
            <div className="pl-10 pt-1">
              <a
                href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20I%20want%20to%20place%20an%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp ({STORE_PHONE})
              </a>
            </div>
          </div>

          {/* Method 3 */}
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-black text-blue-950 text-sm sm:text-base">
                Method C: Call Our 24/7 Telephone Hotline ({STORE_PHONE})
              </h3>
            </div>
            <p className="text-xs text-blue-900 pl-10">
              Prefer speaking with a real person? Dial <strong>{STORE_PHONE}</strong> directly. Our order booking officer will answer your call, note your delivery details, and answer any private questions you may have about product usage or timing.
            </p>
            <div className="pl-10 pt-1">
              <a
                href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <i className="fa-solid fa-phone"></i> Call {STORE_PHONE}
              </a>
            </div>
          </div>
        </div>

        {/* Courier & Delivery Summary */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-black text-[#002B49] text-sm">Delivery &amp; Payment Summary:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="block font-bold text-slate-800">Courier Dispatch</span>
              <span className="text-slate-500">Leopard Courier &amp; TCS</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="block font-bold text-slate-800">Courier Charges</span>
              <span className="text-[#002B49] font-black">Rs {COD_SHIPPING} Flat</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="block font-bold text-slate-800">Free Delivery</span>
              <span className="text-emerald-700 font-bold">Above Rs {FREE_DELIVERY_THRESHOLD.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Confidential packing note */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <strong className="block font-black text-amber-900">
            <i className="fa-solid fa-shield-halved mr-1"></i> 100% Confidential Parcel Packaging
          </strong>
          <p>
            You do not have to worry about family members or neighbors seeing your order. All parcels are packaged in plain, opaque brown cartons with no product names or adult wellness descriptions on the outer label.
          </p>
        </div>
      </div>
    </div>
  );
};
