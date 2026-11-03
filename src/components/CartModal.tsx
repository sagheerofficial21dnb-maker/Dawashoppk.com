import React from 'react';
import { CartItem } from '../types.ts';
import { COD_SHIPPING } from '../data/catalog.ts';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + COD_SHIPPING : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs overflow-y-auto p-4 flex items-center justify-center">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl p-5 border border-slate-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs cursor-pointer transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-bag-shopping text-[#002B49]"></i>
          <span>Your Shopping Bag</span>
        </h3>

        {cart.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <i className="fa-solid fa-cart-arrow-down text-lg"></i>
            </div>
            <p className="text-xs text-slate-400">Your shopping bag is empty.</p>
            <a
              href="#shop"
              onClick={onClose}
              className="inline-block px-4 py-1.5 bg-[#002B49] text-white rounded-xl text-xs font-bold mt-2"
            >
              Browse Catalog
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scroll my-3 pr-1">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <h5 className="font-bold text-slate-800 truncate">{item.product.title}</h5>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                        <span>Qty: {item.quantity}</span>
                        <span>&bull;</span>
                        <span className="text-[#002B49] font-black">
                          Rs {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1.5 cursor-pointer ml-2 shrink-0"
                    title="Remove item"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-700">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-600">
                <span>Leopard Courier Delivery:</span>
                <span className="text-[#002B49]">Rs {COD_SHIPPING}</span>
              </div>
              <div className="border-t border-slate-100 pt-1.5 flex justify-between font-black text-sm text-slate-900">
                <span>Total Payable:</span>
                <span className="text-[#002B49]">Rs {total.toLocaleString()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-2.5 bg-[#002B49] hover:bg-[#0d3b66] text-white font-bold rounded-xl transition mt-2 cursor-pointer shadow-md"
              >
                Proceed to Cash on Delivery
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
