import React, { useState } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const AUTHORIZED_OWNER_EMAILS = [
  'sagheerofficial21dnb@gmail.com',
  'muhammadsagheer21dnb@gmail.com',
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [email, setEmail] = useState('sagheerofficial21dnb@gmail.com');
  const [password, setPassword] = useState('MUHAMMADSAGHEER@786');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = AUTHORIZED_OWNER_EMAILS.includes(cleanEmail);

    if (isOwner && password === 'MUHAMMADSAGHEER@786') {
      onSuccess();
    } else {
      onError('Access Denied: Portal access is strictly restricted to the verified site owner.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs overflow-y-auto p-4 flex items-center justify-center animate-in fade-in">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
          title="Close Modal"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-[#002B49] text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-2xl font-black shadow-md border-2 border-amber-400/20">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
            Site Owner Access Strictly Restricted
          </span>
          <h3 className="text-lg font-black text-slate-900">DawaShop PK Owner Portal</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Verification required. Only the registered site owner is authorized to manage store inventory and orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Site Owner Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sagheerofficial21dnb@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49] font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Owner Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49] font-medium"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-500 flex items-center gap-2">
            <i className="fa-solid fa-lock text-emerald-600"></i>
            <span>Encrypted owner session security enforced.</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-shield-halved text-amber-400"></i>
            <span>Verify &amp; Sign In as Site Owner</span>
          </button>
        </form>
      </div>
    </div>
  );
};
