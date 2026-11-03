import React from 'react';
import { STORE_PHONE, STORE_EMAIL, STORE_ADDRESS } from '../data/catalog.ts';
import { Logo } from '../components/Logo.tsx';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Privacy Policy</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Logo size="sm" isIconOnly={true} />
            <span className="font-bold text-[#002B49] text-xs">Dawashoppk Customer Protection &amp; Confidentiality</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">
            Last Updated: November 2026 &bull; Strict Discretion Guaranteed Across Pakistan
          </p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
          <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
            <i className="fa-solid fa-user-shield text-emerald-700"></i>
            100% Confidentiality &amp; Packaging Discretion Pledge
          </h3>
          <p className="text-xs text-emerald-800">
            At <strong>Dawashoppk</strong>, we understand that wellness, endurance, and personal vitality are deeply personal matters. We guarantee that your parcel will arrive in a <strong>plain brown corrugated box</strong> with no external logos, no product names, and no sensitive descriptions printed on the airway bill. The courier rider only sees your recipient name, phone, and delivery address.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">1. What Information Do We Collect?</h3>
          <p>
            When you place an order on Dawashoppk or request delivery assistance via our hotline <strong>{STORE_PHONE}</strong>, we collect only the strictly essential contact credentials required to fulfill your order:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li><strong>Recipient Full Name:</strong> For identification by the courier delivery agent.</li>
            <li><strong>Active Mobile Phone Number:</strong> To contact you before arrival and confirm Cash on Delivery.</li>
            <li><strong>Delivery Street Address &amp; City:</strong> For accurate routing by Leopard Courier or TCS.</li>
            <li><strong>Email Address (Optional):</strong> For electronic dispatch notifications and invoice tracking.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">2. How We Use Your Information</h3>
          <p>The details you provide are utilized strictly for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>Booking and dispatching your shipment through Leopard Courier or TCS logistics.</li>
            <li>Sending SMS or WhatsApp order confirmations with your tracking number.</li>
            <li>Responding to customer service inquiries or refund requests.</li>
            <li>Internal verification to prevent fraudulent orders.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">3. Zero Selling or Sharing of Personal Data</h3>
          <p>
            We adhere to a strict zero-tolerance policy regarding customer data. <strong>We do not sell, rent, lease, trade, or transfer your personal data, phone numbers, or order history to any third-party advertisers, telemarketers, or external databases.</strong> The only entities that receive your shipping coordinates are licensed logistics couriers under strict non-disclosure obligations.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">4. Payment Security &amp; No Card Storage</h3>
          <p>
            Dawashoppk operates primarily on <strong>Cash on Delivery (COD)</strong>, which means you never need to enter credit card numbers or banking passwords on our website. For digital bank or JazzCash/EasyPaisa payments, transactions are executed within your own secure banking apps, ensuring our servers never touch or store sensitive financial credentials.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">5. Your Right to Record Deletion</h3>
          <p>
            You have the full right at any time to request that your phone number and order record be permanently purged from our customer dispatch ledger. To exercise this right, simply contact us via WhatsApp or telephone at <strong>{STORE_PHONE}</strong> or email <strong>{STORE_EMAIL}</strong> with your phone number, and our team will erase your history within 24 hours.
          </p>
        </div>

        {/* Contact Strip */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-slate-900 block font-bold">Questions about your privacy?</strong>
            <span className="text-slate-500">Contact our Data Protection Officer at {STORE_ADDRESS}</span>
          </div>
          <a
            href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
            className="px-4 py-2 bg-[#002B49] text-white font-bold rounded-xl hover:bg-[#0d3b66] transition"
          >
            Call {STORE_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
};
