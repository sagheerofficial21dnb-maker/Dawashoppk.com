import React, { useState, useEffect, useRef } from 'react';
import { Product, Review } from '../types.ts';
import { COD_SHIPPING, STORE_WA } from '../data/catalog.ts';
import { RichTextRenderer } from '../components/RichTextRenderer.tsx';
import { getProductApprovedReviews } from '../utils/productReviews.ts';

interface ProductDetailPageProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
  onOrderNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onSubmitReview: (review: Omit<Review, 'id' | 'status'>) => void;
  onSelectTag?: (tag: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  reviews,
  relatedProducts,
  onOrderNow,
  onSelectProduct,
  onSubmitReview,
  onSelectTag,
}) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'tags' | 'reviews'>('desc');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  // Multiple product images list with fallback
  const fallbackDefaultImg = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.filter(Boolean)
      : product.image
      ? [product.image]
      : [fallbackDefaultImg];

  const currentMainImage = galleryImages[selectedImageIndex] || galleryImages[0] || fallbackDefaultImg;

  const productSlug = product.slug || product.id.toLowerCase();
  const canonicalUrl = `https://dawashoppk.com/#product-${productSlug}`;

  const waOrderText = encodeURIComponent(
    `Hello DawaShop PK!\nI would like to order this product:\n\n` +
      `*Product:* ${product.title}\n` +
      `*SKU:* ${product.sku || product.id}\n` +
      `*Price:* Rs ${product.price.toLocaleString()} + Rs ${COD_SHIPPING} Leopard Delivery\n` +
      `*Total Payable:* Rs ${(product.price + COD_SHIPPING).toLocaleString()}\n` +
      `*Product Link:* ${canonicalUrl}\n\nPlease confirm my Cash on Delivery order.`
  );

  // Lightbox touch swipe & keyboard navigation
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft' && galleryImages.length > 1) {
        setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      } else if (e.key === 'ArrowRight' && galleryImages.length > 1) {
        setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, galleryImages.length]);

  // Auto-published 4 to 5 relevant Roman Urdu reviews with gender-appropriate names & masked private details
  const productReviews = getProductApprovedReviews(product, reviews);

  const handleReviewFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    onSubmitReview({
      productId: product.id,
      productTitle: product.title,
      author: reviewAuthor.trim(),
      email: reviewEmail.trim(),
      city: 'Pakistan',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSubmittedSuccess(true);
    setReviewAuthor('');
    setReviewEmail('');
    setReviewRating(5);
    setHoverRating(null);
    setReviewComment('');
  };

  const handleTagClick = (tag: string) => {
    if (onSelectTag) {
      onSelectTag(tag);
    } else {
      window.location.hash = '#shop';
    }
  };

  const isOutOfStock = product.status === 'Out of Stock' || (product.stock !== undefined && product.stock <= 0);

  return (
    <div className="w-full min-h-screen pb-32 sm:pb-24 lg:pb-16 bg-slate-50/40">
      {/* Breadcrumb Navigation - Full Screen Fluid Strip */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <a href="#home" className="hover:text-[#002B49] font-semibold flex items-center gap-1">
              <i className="fa-solid fa-house text-xs"></i> Home
            </a>
            <span>/</span>
            <a href="#shop" className="hover:text-[#002B49] font-semibold">
              Shop
            </a>
            <span>/</span>
            <span className="text-slate-400 font-medium">{product.category}</span>
            <span>/</span>
            <span className="text-[#002B49] font-bold truncate max-w-[240px] sm:max-w-md">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Container - Full Width Fluid Screen */}
      <div className="w-full px-2 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Responsive Grid System: Main Product Image Left, Purchase Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start w-full">
          {/* LEFT COLUMN: Main Product Image & Thumbnail Gallery */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-3 w-full">
            <div className="bg-white p-2 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs relative flex items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[460px] md:min-h-[520px] w-full">
              <img
                src={currentMainImage}
                alt={product.title}
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-auto max-h-[500px] sm:max-h-[580px] md:max-h-[640px] object-contain mx-auto transition-transform duration-300 hover:scale-[1.01] cursor-zoom-in"
                title="Click to view full screen picture"
              />

              {discount && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-md z-10">
                  SALE -{discount}%
                </span>
              )}

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
                {product.badge && (
                  <span className="bg-[#002B49] text-amber-400 font-extrabold text-xs px-3 py-1 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Prominent Full Screen Trigger Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-slate-950/85 hover:bg-slate-950 text-white px-3.5 py-1.5 sm:py-2 rounded-xl shadow-md text-xs font-bold transition flex items-center gap-2 cursor-pointer backdrop-blur-xs z-10 border border-white/10 hover:scale-105 active:scale-95"
                title="Open full screen picture view"
              >
                <i className="fa-solid fa-expand text-amber-400"></i>
                <span>Full Screen</span>
              </button>
            </div>

            {/* Multiple Product Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar p-1 w-full">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-2 p-1 bg-white overflow-hidden transition cursor-pointer flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#002B49] ring-2 ring-[#002B49]/20 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} preview ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Purchase Details & Order Actions */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4 side-panel-sticky w-full">
            <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xs space-y-4 sm:space-y-5 w-full">
              {/* Category, SKU & Status Header */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>

                <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {product.sku || `SKU-${product.id}`}
                </span>

                {isOutOfStock ? (
                  <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs">
                    Out of Stock
                  </span>
                ) : (
                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                    Status: Active (In Stock)
                  </span>
                )}
              </div>

              {/* 100% Authentic Bar */}
              <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/70">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100% Authentic Guaranteed</h4>
                  <p className="text-[10px] text-emerald-700 font-medium">Genuine sealed products &bull; Discreet nationwide parcel</p>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug break-words">
                {product.title}
              </h1>

              {/* Rating & Verified Tag */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex text-amber-400">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="text-slate-600 font-bold">
                  ({productReviews.length || product.reviewsCount || 1} verified customer reviews)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">DawaShop PK Verified</span>
              </div>

              {/* Short Description Summary */}
              {product.shortDescription && (
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-slate-700 leading-relaxed font-medium break-words">
                  <span className="font-bold text-[#002B49] block text-[11px] uppercase tracking-wide mb-0.5">
                    Quick Summary:
                  </span>
                  {product.shortDescription}
                </div>
              )}

              {/* Pricing Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#002B49]">
                    Rs {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      Rs {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-semibold">
                  Cash on Delivery available +{' '}
                  <strong className="text-[#002B49]">Rs {COD_SHIPPING} Leopard Courier charges</strong>
                </p>
                <p className="text-[11px] text-emerald-700 font-bold">
                  Total Payable: Rs {(product.price + COD_SHIPPING).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons: Order Now & Order on WhatsApp */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onOrderNow(product)}
                  className={`w-full py-4 rounded-xl font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#002B49] hover:bg-[#001A2C] text-white active:scale-[0.99]'
                  }`}
                >
                  <i className="fa-solid fa-cart-shopping text-amber-400 text-base"></i>
                  <span>{isOutOfStock ? 'OUT OF STOCK' : 'ORDER NOW (Cash On Delivery)'}</span>
                </button>
                <a
                  href={`https://wa.me/${STORE_WA}?text=${waOrderText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-black text-sm sm:text-base shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                >
                  <i className="fa-brands fa-whatsapp text-2xl"></i>
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Highlights 3-Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Shipping</span>
                  Leopard/TCS
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Packaging</span>
                  Plain Brown Box
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Store</span>
                  DawaShop PK
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS TABS: DESCRIPTION, TAGS, REVIEWS */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xs p-4 sm:p-7 md:p-8 space-y-6 overflow-hidden break-words max-w-full">
          {/* 3 Tabs Navigation Bar */}
          <div className="flex border-b border-slate-200 gap-3 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`pb-3 px-1 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'desc'
                  ? 'border-[#002B49] text-[#002B49]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-file-lines text-xs text-blue-600"></i>
              <span>Description</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tags')}
              className={`pb-3 px-1 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'tags'
                  ? 'border-[#002B49] text-[#002B49]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-tags text-xs text-emerald-600"></i>
              <span>Tags ({product.tags?.length || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-1 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-[#002B49] text-[#002B49]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-comments text-xs text-amber-500"></i>
              <span>Reviews ({productReviews.length})</span>
            </button>
          </div>

          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'desc' && (
            <div className="space-y-4 w-full max-w-full">
              <div className="w-full max-w-full bg-slate-50/80 p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere] overflow-hidden">
                <RichTextRenderer
                  content={product.longDescription || product.shortDescription || '100% genuine formulation certified for safety and quality.'}
                />
              </div>
            </div>
          )}

          {/* TAB 2: TAGS */}
          {activeTab === 'tags' && (
            <div className="space-y-4 w-full max-w-full">
              <div className="w-full max-w-full bg-slate-50/80 p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 overflow-hidden break-words">
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {(product.tags && product.tags.length > 0 ? product.tags : ['wellness', 'dawashoppk']).map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="bg-white hover:bg-[#002B49] hover:text-white text-[#002B49] border border-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      title={`#${tag}`}
                    >
                      <i className="fa-solid fa-tag text-[10px] text-amber-500"></i>
                      <span>#{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5 w-full max-w-full">
              <div className="w-full max-w-full bg-slate-50/80 p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 break-words [overflow-wrap:anywhere] overflow-hidden space-y-6">
                {/* Submission Success Notice */}
                {reviewSubmittedSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                    <span>
                      <strong>Shukriya!</strong> Aapka review submit ho gaya hai.
                    </span>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Customer Reviews ({productReviews.length})
                  </h4>

                  {productReviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">{r.author}</span>
                          {r.city && <span className="text-[11px] text-slate-400">({r.city})</span>}
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            &#10003; Verified Buyer
                          </span>
                        </div>
                        <div className="text-amber-400 text-xs font-bold">
                          {Array.from({ length: r.rating || 5 }).map((_, i) => (
                            <span key={i}>&#9733;</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium break-words [overflow-wrap:anywhere]">{r.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Review Submit Form */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm mb-1">Write a Review</h5>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Share your experience with this product.
                  </p>
                  <form onSubmit={handleReviewFormSubmit} className="space-y-4 text-xs">
                    {/* Name & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49] bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={reviewEmail}
                          onChange={(e) => setReviewEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49] bg-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Interactive Star Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Rating (Select Stars) <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= (hoverRating ?? reviewRating);
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="text-2xl sm:text-3xl transition-transform hover:scale-115 active:scale-95 cursor-pointer p-0.5 focus:outline-none"
                                title={`${star} Star${star > 1 ? 's' : ''}`}
                              >
                                <i
                                  className={`fa-star ${
                                    isFilled
                                      ? 'fa-solid text-amber-400'
                                      : 'fa-regular text-slate-300 hover:text-amber-300'
                                  }`}
                                ></i>
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg ml-1">
                          {(hoverRating ?? reviewRating) === 5 && '5/5 Excellent Results'}
                          {(hoverRating ?? reviewRating) === 4 && '4/5 Very Good'}
                          {(hoverRating ?? reviewRating) === 3 && '3/5 Average'}
                          {(hoverRating ?? reviewRating) === 2 && '2/5 Below Average'}
                          {(hoverRating ?? reviewRating) === 1 && '1/5 Poor'}
                        </span>
                      </div>
                    </div>

                    {/* Review Comment Textarea */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Review <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write your honest review and experience about this product..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#002B49] bg-white text-xs leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="px-6 py-2.5 sm:py-3 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl font-bold transition cursor-pointer shadow-xs text-xs flex items-center gap-2 active:scale-95"
                    >
                      <i className="fa-solid fa-paper-plane text-amber-400 text-xs"></i>
                      <span>Submit Review</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section - Fluid Full Screen */}
        {relatedProducts.length > 0 && (
          <div className="w-full bg-white p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-xs space-y-4">
            <h4 className="font-black text-slate-800 text-sm">Related Recommendations</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {relatedProducts.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectProduct(r)}
                  className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center cursor-pointer hover:bg-slate-100 transition"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-20 mx-auto object-contain mb-1.5"
                  />
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{r.title}</h5>
                  <span className="text-xs font-black text-[#002B49]">
                    Rs {r.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULL-SCREEN PRODUCT PICTURES VIEWER (LIGHTBOX) - RESPONSIVE ACROSS ALL DEVICES */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none"
        >
          {/* Lightbox Header with Title & Close Button */}
          <div className="p-3 sm:p-4 md:px-8 flex items-center justify-between text-white border-b border-white/10 bg-slate-950/90 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
              <span className="font-extrabold text-xs sm:text-sm md:text-base truncate max-w-[200px] sm:max-w-md">
                {product.title}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-400 font-bold bg-white/10 px-2 py-0.5 rounded-full flex-shrink-0">
                {selectedImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition shadow-lg active:scale-95"
                title="Close Picture View (Esc)"
              >
                <i className="fa-solid fa-xmark text-base sm:text-lg"></i>
              </button>
            </div>
          </div>

          {/* Picture Display Area with Mobile Touch Swipe & Responsive Scaling */}
          <div
            className="flex-1 relative flex items-center justify-center p-2 sm:p-6 md:p-8 overflow-hidden touch-pan-y"
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartXRef.current === null) return;
              const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
              touchStartXRef.current = null;
              if (deltaX > 40 && galleryImages.length > 1) {
                // Swipe right -> previous image
                setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
              } else if (deltaX < -40 && galleryImages.length > 1) {
                // Swipe left -> next image
                setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
              }
            }}
          >
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
                }
                className="absolute left-2 sm:left-4 md:left-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer z-10 transition shadow-xl active:scale-95"
                title="Previous Image (Left Arrow)"
              >
                <i className="fa-solid fa-chevron-left text-sm sm:text-base"></i>
              </button>
            )}

            <div className="flex items-center justify-center max-w-full max-h-full">
              <img
                src={currentMainImage}
                alt={product.title}
                className="max-h-[68vh] sm:max-h-[76vh] md:max-h-[82vh] max-w-[95vw] sm:max-w-[90vw] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-200"
              />
            </div>

            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-2 sm:right-4 md:right-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer z-10 transition shadow-xl active:scale-95"
                title="Next Image (Right Arrow)"
              >
                <i className="fa-solid fa-chevron-right text-sm sm:text-base"></i>
              </button>
            )}
          </div>

          {/* Thumbnail Selector Strip if multiple pictures */}
          {galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 pb-2 px-3 sm:px-4 overflow-x-auto no-scrollbar flex-shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 p-0.5 overflow-hidden transition cursor-pointer bg-white/10 flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-amber-400 scale-105 ring-2 ring-amber-400/30'
                      : 'border-white/20 hover:border-white/60'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Clean Lightbox Footer */}
          <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
            <span className="text-[11px] sm:text-xs text-slate-300 hidden sm:inline">
              100% Genuine &bull; Nationwide Cash on Delivery
            </span>
            <a
              href={`https://wa.me/${STORE_WA}?text=${waOrderText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ml-auto active:scale-95"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
