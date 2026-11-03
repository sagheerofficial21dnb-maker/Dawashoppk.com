import React, { useState } from 'react';
import { STORE_PHONE, STORE_WA, STORE_EMAIL, STORE_ADDRESS } from '../data/catalog.ts';

interface ContactPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      onShowToast('Please fill in all required fields.', 'error');
      return;
    }
    onShowToast(`Thank you, ${fullName}! Your message has been received. Our team will contact you at ${phone} promptly.`, 'success');
    setFullName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Contact Us</span>
      </nav>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Contact Us</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We are here to assist with any questions about products, discreet deliveries, or order tracking across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Message Form */}
          <div className="space-y-4">
            <h3 className="font-black text-[#002B49] text-base">Send Us a Direct Message</h3>
            <p className="text-xs text-slate-500">
              Fill out this form and our customer support supervisor will call or WhatsApp you within minutes.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">PHONE NUMBER (CALL &amp; WHATSAPP) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0327-8007580"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">EMAIL ADDRESS (OPTIONAL)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@dawashoppk.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">SUBJECT</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Product inquiry / Order inquiry / Advice"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">MESSAGE *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your question, item name, or delivery inquiry..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <i className="fa-solid fa-paper-plane"></i>
                <span>SEND MESSAGE</span>
              </button>
            </form>
          </div>

          {/* Direct Info Cards */}
          <div className="space-y-3.5 text-xs">
            <h3 className="font-black text-[#002B49] text-base mb-2">Direct Contact Channels</h3>

            {/* Phone Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Direct Telephone Hotline</h4>
                <a
                  href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
                  className="text-slate-900 font-extrabold text-base block mt-0.5 hover:text-blue-700"
                >
                  {STORE_PHONE}
                </a>
                <span className="text-[10px] text-slate-400">Available 24 Hours / 7 Days a week for orders</span>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center text-xl shrink-0">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950">WhatsApp Order Support</h4>
                  <p className="text-xs font-black text-emerald-800">{STORE_PHONE}</p>
                  <span className="text-[10px] text-emerald-600">Fastest response for confidential inquiries</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition whitespace-nowrap shadow-xs"
              >
                Chat Now
              </a>
            </div>

            {/* Email Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002B49] flex items-center justify-center text-base shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Email Customer Support</h4>
                <a href={`mailto:${STORE_EMAIL}`} className="text-slate-700 font-semibold text-xs block mt-0.5 hover:underline">
                  {STORE_EMAIL}
                </a>
                <span className="text-[10px] text-slate-400">Official response within 12 hours</span>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Head Office &amp; Central Distribution</h4>
                <p className="text-slate-600 font-medium mt-0.5">{STORE_ADDRESS}</p>
                <span className="text-[10px] text-slate-400">Dispatches via Leopard Courier &amp; TCS Daily</span>
              </div>
            </div>

            {/* Fast Service Promise */}
            <div className="p-4 bg-[#001A2C] text-slate-200 rounded-2xl space-y-1">
              <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider block">
                Discreet Confidentiality Guaranteed
              </span>
              <p className="text-[11px] text-slate-300">
                All communications and order details are handled with strict privacy. Your phone number is never shared or added to marketing spam lists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
