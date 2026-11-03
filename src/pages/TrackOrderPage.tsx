import React, { useState } from 'react';
import { Order } from '../types.ts';
import { STORE_PHONE, STORE_WA } from '../data/catalog.ts';

interface TrackOrderPageProps {
  orders: Order[];
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ orders }) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Order[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const cleanQuery = q.replace(/[^a-zA-Z0-9]/g, '');
    const found = orders.filter((o) => {
      const cleanOrderId = o.id.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const cleanPhone = o.phone.replace(/[^0-9]/g, '');
      return (
        cleanOrderId.includes(cleanQuery) ||
        (cleanQuery.length >= 4 && cleanPhone.includes(cleanQuery))
      );
    });

    setResults(found);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Track Order</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#002B49]/10 text-[#002B49] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-xs">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Track Your Order</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your Order ID (e.g. <strong>DWA-1001</strong>) or Customer Mobile Phone Number:
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID (e.g. DWA-1001) or Mobile Number..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-[#002B49] outline-none text-xs sm:text-sm"
          />
          <button
            type="submit"
            className="bg-[#002B49] hover:bg-[#0d3b66] text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Track Now</span>
          </button>
        </form>

        {/* Results Area */}
        {searched && (
          <div className="pt-2 space-y-4">
            {results.length === 0 ? (
              <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl text-center text-xs text-rose-700 space-y-2">
                <i className="fa-solid fa-circle-exclamation text-xl"></i>
                <p className="font-bold">No active dispatch found for "{query}"</p>
                <p className="text-[11px] text-rose-600">
                  Please verify your Order ID or contact our 24/7 helpline at{' '}
                  <strong className="underline">{STORE_PHONE}</strong> to verify shipment with Leopard Courier.
                </p>
              </div>
            ) : (
              results.map((o) => {
                const isDelivered = o.status === 'Delivered';
                const isShipped = o.status === 'Shipped' || isDelivered;
                const isConfirmed = o.status === 'Confirmed' || isShipped;

                return (
                  <div
                    key={o.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Order Reference
                        </span>
                        <h3 className="font-black text-[#002B49] text-base">{o.id}</h3>
                        <span className="text-[10px] text-slate-500">Booked: {o.date}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Timeline Steps */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-500">
                        <div className="space-y-1">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-[10px]">
                            <i className="fa-solid fa-check"></i>
                          </div>
                          <span className="text-emerald-700">Received</span>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                              isConfirmed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            <i className="fa-solid fa-box"></i>
                          </div>
                          <span className={isConfirmed ? 'text-emerald-700' : ''}>Confirmed</span>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                              isShipped ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            <i className="fa-solid fa-truck-fast"></i>
                          </div>
                          <span className={isShipped ? 'text-blue-700' : ''}>In Transit (Leopard)</span>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                              isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            <i className="fa-solid fa-house-chimney"></i>
                          </div>
                          <span className={isDelivered ? 'text-emerald-700' : ''}>Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 text-slate-600">
                      <p>
                        <strong>Customer Name:</strong> {o.name}
                      </p>
                      <p>
                        <strong>Contact Number:</strong> {o.phone}
                      </p>
                      <p>
                        <strong>Delivery Destination:</strong> {o.address}, {o.city}
                      </p>
                      <p>
                        <strong>Item Dispatched:</strong> {o.productTitle}
                      </p>
                      <div className="border-t border-slate-100 pt-1.5 flex justify-between font-bold text-slate-800">
                        <span>Total Payable (COD):</span>
                        <span className="text-[#002B49] font-black text-sm">
                          Rs {o.total.toLocaleString()} (Includes Rs {o.delivery} Leopard Courier)
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Action */}
                    <div className="flex justify-end pt-1">
                      <a
                        href={`https://wa.me/${STORE_WA}?text=${encodeURIComponent(
                          `Hello Dawashoppk! I would like an update on my order ID ${o.id}:`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                        <span>Ask Support About {o.id}</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Need Assistance Hotline Box */}
        <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500 space-y-1.5">
          <p className="font-bold text-slate-800">Need instant assistance with parcel dispatch or address change?</p>
          <p>
            Call or WhatsApp 24/7 at{' '}
            <a href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`} className="text-[#002B49] font-extrabold underline">
              {STORE_PHONE}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
