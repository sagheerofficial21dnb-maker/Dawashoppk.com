import React from 'react';
import { STORE_PHONE, STORE_WA, STORE_EMAIL, COD_SHIPPING, FREE_DELIVERY_THRESHOLD } from '../data/catalog.ts';
import { Logo } from '../components/Logo.tsx';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <a href="#home" className="font-bold text-[#002B49] hover:underline flex items-center gap-1">
          <i className="fa-solid fa-house text-xs"></i> Home
        </a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Terms &amp; Conditions</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Logo size="sm" isIconOnly={true} />
            <span className="font-bold text-[#002B49] text-xs">Dawashoppk Customer Service Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49]">Terms &amp; Conditions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Please read these terms and conditions carefully before placing your order on Dawashopk.com.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">1. Age Requirement &amp; Eligibility</h3>
          <p>
            You must be at least <strong>18 years of age</strong> to browse, purchase, or order any adult health, timing spray, endurance tablet, or sexual wellness formulation from Dawashoppk. By placing an order, you warrant and represent that you meet this age requirement.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">2. Order Placement &amp; Verification</h3>
          <p>
            You can place an order by completing the digital Cash on Delivery checkout form on our website or by contacting our dedicated telephone and WhatsApp hotline at <strong>{STORE_PHONE}</strong>. Our dispatch team may place a brief verification call or send a WhatsApp confirmation message to ensure address accuracy before handing the parcel to Leopard Courier.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">3. Shipping Timelines &amp; Delivery Charges</h3>
          <p>
            We strive to dispatch every accepted order within 12 to 24 hours. Estimated delivery timelines across Pakistan:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li><strong>Major Metros (Lahore, Karachi, Islamabad, Rawalpindi):</strong> 24 to 48 hours.</li>
            <li><strong>Other Cities &amp; District Hubs:</strong> 2 to 3 business days.</li>
            <li><strong>Courier Fee:</strong> A flat dispatch charge of <strong>Rs {COD_SHIPPING}</strong> applies to Cash on Delivery parcels nationwide.</li>
            <li><strong>Free Delivery:</strong> Orders exceeding <strong>Rs {FREE_DELIVERY_THRESHOLD.toLocaleString()}</strong> qualify for 100% Free Shipping.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">4. 3-Day Warranty, Exchanges &amp; Refunds</h3>
          <p>
            Under our consumer satisfaction warranty, if your received item arrives damaged during transit, has a broken seal, or exhibits a verified manufacturing defect, we will exchange the product or process a full cash refund via <strong>JazzCash, EasyPaisa, or Bank Transfer</strong> within 2 to 3 working days.
          </p>
          <p className="text-xs text-slate-500 italic">
            Condition: Claims must be reported to our helpline {STORE_PHONE} within 3 days of delivery with parcel photos.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">5. Cash on Delivery Obligation</h3>
          <p>
            When choosing Cash on Delivery, the customer agrees to be available at the designated delivery address to receive the parcel and remit the exact payable amount to the courier rider. Unwarranted rejections harm logistics operations and may result in the customer address being blacklisted for future COD orders.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">6. Product Information &amp; Disclaimer</h3>
          <p>
            Products offered on Dawashoppk are wellness, herbal, and cosmetic formulations. While sourced from genuine manufacturers with authentic seals, individual physiological responses may vary based on health, metabolism, and adherence to usage instructions. Always read packaging labels before application or consumption.
          </p>
        </div>

        {/* Action Callout */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-slate-800">Need clarification on any policy?</h4>
            <p className="text-slate-500">Our customer service representatives are available 24/7.</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${STORE_PHONE.replace(/[^0-9]/g, '')}`}
              className="px-4 py-2 bg-[#002B49] text-white rounded-xl font-bold hover:bg-[#0d3b66] transition"
            >
              <i className="fa-solid fa-phone mr-1"></i> {STORE_PHONE}
            </a>
            <a
              href={`https://wa.me/${STORE_WA}?text=Hello%20Dawashoppk!%20Question%20about%20terms.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366] text-white rounded-xl font-bold hover:bg-emerald-600 transition"
            >
              <i className="fa-brands fa-whatsapp mr-1"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
