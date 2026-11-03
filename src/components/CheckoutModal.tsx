import React, { useState } from 'react';
import { Product, Order } from '../types.ts';
import { COD_SHIPPING, STORE_PHONE } from '../data/catalog.ts';

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen || !product) return null;

  const total = product.price + COD_SHIPPING;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) return;

    const orderId = `DWA-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newOrder: Order = {
      id: orderId,
      date: dateStr,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      productTitle: product.title,
      price: product.price,
      delivery: COD_SHIPPING,
      total: total,
      status: 'Pending',
    };

    onOrderPlaced(newOrder);
    onClose();
    setName('');
    setPhone('');
    setCity('');
    setAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs overflow-y-auto p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 relative my-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 text-xl font-black shadow-xs">
            <i className="fa-solid fa-truck-ramp-box"></i>
          </div>
          <h3 className="text-lg font-black text-slate-900">Cash on Delivery Order</h3>
          <p className="text-xs text-slate-500">Pay cash upon parcel arrival at your doorstep</p>
        </div>

        {/* Item & Price Summary */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between font-bold text-slate-800">
            <span className="truncate pr-2">{product.title}</span>
            <span className="whitespace-nowrap">Rs {product.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Leopard Courier Delivery Fee:</span>
            <span className="font-bold text-[#002B49]">Rs {COD_SHIPPING}</span>
          </div>
          <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
            <span>Total Payable:</span>
            <span className="text-[#002B49]">Rs {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Muhammad Ali"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0327-8007580"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
            />
            <span className="text-[10px] text-slate-400">Our rider will call on this number prior to arrival.</span>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">City *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lahore, Karachi, Islamabad, Rawalpindi"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Complete Delivery Address *</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House #, Street #, Mohallah / Sector, Landmark..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-check"></i>
            <span>Confirm Order (Cash on Delivery)</span>
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-500">
            Need phone assistance? Call or WhatsApp anytime at{' '}
            <a href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`} className="font-bold text-[#002B49] underline">
              {STORE_PHONE}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
