import React, { useState, useEffect } from 'react';
import { Product, Order, Review, CartItem } from './types.ts';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  STORE_PHONE,
} from './data/catalog.ts';

import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileDrawer } from './components/MobileDrawer.tsx';
import { MobileBottomBar } from './components/MobileBottomBar.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { CartModal } from './components/CartModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { HowToOrderPage } from './pages/HowToOrderPage.tsx';
import { TrackOrderPage } from './pages/TrackOrderPage.tsx';
import { ReturnsExchangesPage } from './pages/ReturnsExchangesPage.tsx';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage.tsx';
import { WarrantyPage } from './pages/WarrantyPage.tsx';
import { DeliveryInfoPage } from './pages/DeliveryInfoPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

interface Toast {
  id: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  // Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dawashoppk_prods_v4');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => {
            if (!p.createdAt) {
              const daysAgo = idx < 5 ? (idx + 1) : (7 + (idx - 4) * 2);
              return {
                ...p,
                createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
              };
            }
            return p;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dawashoppk_ords_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('dawashoppk_revs_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dawashoppk_cart_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Navigation & Routing
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & UI
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dawashoppk_prods_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dawashoppk_ords_v4', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dawashoppk_revs_v4', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('dawashoppk_cart_v4', JSON.stringify(cart));
  }, [cart]);

  // URL Hash Listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentHash(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update document title for SEO & clarity
      if (hash === '#about-us' || hash === '#about') {
        document.title = 'About Us - dawashoppk.com | Authentic Health & Wellness Store';
      } else if (hash === '#contact-us' || hash === '#contact') {
        document.title = `Contact Us (${STORE_PHONE}) - dawashoppk.com`;
      } else if (hash === '#privacy-policy' || hash === '#privacy') {
        document.title = 'Privacy Policy & Confidential Packaging - dawashoppk.com';
      } else if (hash === '#terms-conditions' || hash === '#terms') {
        document.title = 'Terms & Conditions - dawashoppk.com';
      } else if (hash === '#how-to-order') {
        document.title = 'How To Order - dawashoppk.com';
      } else if (hash === '#track-order') {
        document.title = 'Track Order - dawashoppk.com';
      } else if (hash === '#returns-exchanges' || hash === '#returns') {
        document.title = 'Returns & Exchanges - dawashoppk.com';
      } else if (hash === '#payment-methods' || hash === '#payment') {
        document.title = 'Payment Methods (COD / EasyPaisa) - dawashoppk.com';
      } else if (hash === '#warranty') {
        document.title = 'Warranty & 100% Authentic Quality - dawashoppk.com';
      } else if (hash === '#delivery-info' || hash === '#delivery') {
        document.title = 'Delivery Information (Leopard Courier) - dawashoppk.com';
      } else if (hash === '#shop') {
        document.title = 'Shop All Products - dawashoppk.com';
      } else if (hash.startsWith('#product-')) {
        const prodKey = hash.replace('#product-', '').toLowerCase();
        const cleanKey = prodKey.replace(/-price-in-pakistan$/, '').replace(/-in-pakistan$/, '');
        const p = products.find(
          (item) =>
            item.id.toLowerCase() === prodKey ||
            (item.slug && item.slug.toLowerCase() === prodKey) ||
            (item.slug && item.slug.toLowerCase().replace(/-price-in-pakistan$/, '').replace(/-in-pakistan$/, '') === cleanKey)
        );
        document.title = p ? `${p.metaTitle || p.title} - dawashoppk.com` : 'Product Details - dawashoppk.com';
      } else if (hash === '#admin') {
        document.title = 'Admin Portal - dawashoppk.com';
      } else {
        document.title = 'dawashoppk.com - Authentic Health, Wellness & Timing Store in Pakistan';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  // Toast Helper
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Navigations
  const handleSelectProduct = (product: Product) => {
    window.location.hash = `#product-${product.slug || product.id}`;
  };

  const handleSelectTag = (tag: string) => {
    setSelectedCategory('all');
    setSearchQuery(tag);
    window.location.hash = '#shop';
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    window.location.hash = '#shop';
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    window.location.hash = '#shop';
  };

  // Order Handlers
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order Placed Successfully! Your Order ID is ${newOrder.id}`, 'success');
    window.location.hash = '#track-order';
  };

  const handleReviewSubmitted = (newReviewData: Omit<Review, 'id' | 'status'>) => {
    const newRev: Review = {
      ...newReviewData,
      id: `REV-${Date.now()}`,
      status: 'pending',
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Review submitted! It will appear once verified by the store admin.', 'success');
  };

  // Cart Handlers
  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from shopping bag.', 'info');
  };

  const handleCheckoutFromCart = () => {
    if (cart.length === 0) return;
    setCartModalOpen(false);
    setCheckoutProduct(cart[0].product);
  };

  // Admin Actions
  const handleSaveProduct = (prod: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === prod.id);
      if (exists) {
        return prev.map((p) => (p.id === prod.id ? prod : p));
      }
      return [prod, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleBulkDeleteProducts = (ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    showToast(`${ids.length} product(s) deleted successfully.`, 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order ${orderId} updated to ${status}`, 'success');
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order ${orderId} deleted permanently.`, 'info');
  };

  const handleBulkDeleteOrders = (ids: string[]) => {
    setOrders((prev) => prev.filter((o) => !ids.includes(o.id)));
    showToast(`${ids.length} order(s) deleted permanently.`, 'info');
  };

  const handleBulkUpdateOrderStatus = (ids: string[], status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (ids.includes(o.id) ? { ...o, status } : o))
    );
    showToast(`${ids.length} order(s) updated to ${status}.`, 'success');
  };

  const handleUpdateReviewStatus = (reviewId: string, status: Review['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    showToast(`Review status updated to ${status}`, 'success');
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast(`Review deleted permanently.`, 'info');
  };

  const handleBulkApproveReviews = (ids: string[]) => {
    setReviews((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, status: 'approved' } : r))
    );
    showToast(`${ids.length} review(s) approved and published!`, 'success');
  };

  const handleBulkDeleteReviews = (ids: string[]) => {
    setReviews((prev) => prev.filter((r) => !ids.includes(r.id)));
    showToast(`${ids.length} review(s) deleted permanently.`, 'info');
  };

  // Determine active view from URL hash
  const normalizedHash = currentHash.toLowerCase();

  const renderActiveView = () => {
    if (normalizedHash === '#admin') {
      if (!isAdminLoggedIn) {
        return (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-[#002B49] text-amber-400 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-md border-2 border-amber-400/20">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Restricted Area &bull; Site Owner Only
            </span>
            <h2 className="text-xl font-black text-slate-900">Site Owner Authentication Required</h2>
            <p className="text-xs text-slate-500">
              This administrative portal is strictly restricted to the verified site owner of DawaShop PK. Please authenticate with your owner credentials.
            </p>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="px-6 py-2.5 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#0d3b66] transition cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-key text-amber-400"></i>
              <span>Authenticate as Site Owner</span>
            </button>
          </div>
        );
      }
      return (
        <AdminPage
          products={products}
          orders={orders}
          reviews={reviews}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onBulkDeleteProducts={handleBulkDeleteProducts}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onBulkDeleteOrders={handleBulkDeleteOrders}
          onBulkUpdateOrderStatus={handleBulkUpdateOrderStatus}
          onUpdateReviewStatus={handleUpdateReviewStatus}
          onDeleteReview={handleDeleteReview}
          onBulkApproveReviews={handleBulkApproveReviews}
          onBulkDeleteReviews={handleBulkDeleteReviews}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            window.location.hash = '#home';
            showToast('Logged out of admin panel.', 'info');
          }}
          onShowToast={showToast}
        />
      );
    }

    if (normalizedHash.startsWith('#product-')) {
      const prodKey = normalizedHash.replace('#product-', '').toLowerCase();
      const cleanKey = prodKey.replace(/-price-in-pakistan$/, '').replace(/-in-pakistan$/, '');
      const product = products.find(
        (p) =>
          p.id.toLowerCase() === prodKey ||
          (p.slug && p.slug.toLowerCase() === prodKey) ||
          (p.slug && p.slug.toLowerCase().replace(/-price-in-pakistan$/, '').replace(/-in-pakistan$/, '') === cleanKey)
      );
      if (product) {
        const related = products
          .filter((p) => p.id !== product.id && p.category === product.category)
          .slice(0, 4);
        return (
          <ProductDetailPage
            product={product}
            reviews={reviews}
            relatedProducts={related.length ? related : products.slice(0, 4)}
            onOrderNow={(prod) => setCheckoutProduct(prod)}
            onSelectProduct={handleSelectProduct}
            onSubmitReview={handleReviewSubmitted}
            onSelectTag={handleSelectTag}
          />
        );
      }
    }

    switch (normalizedHash) {
      case '#shop':
        return (
          <ShopPage
            products={products}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onClearSearch={() => setSearchQuery('')}
          />
        );
      case '#about-us':
      case '#about':
        return <AboutPage />;
      case '#contact-us':
      case '#contact':
        return <ContactPage onShowToast={showToast} />;
      case '#privacy-policy':
      case '#privacy':
        return <PrivacyPolicyPage />;
      case '#terms-conditions':
      case '#terms':
        return <TermsPage />;
      case '#how-to-order':
        return <HowToOrderPage />;
      case '#track-order':
        return <TrackOrderPage orders={orders} />;
      case '#returns-exchanges':
      case '#returns':
        return <ReturnsExchangesPage />;
      case '#payment-methods':
      case '#payment':
        return <PaymentMethodsPage />;
      case '#warranty':
        return <WarrantyPage />;
      case '#delivery-info':
      case '#delivery':
        return <DeliveryInfoPage />;
      case '#home':
      default:
        return (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onFilterCategory={handleSelectCategory}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans pb-16 lg:pb-0">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-[999999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900'
            }`}
          >
            <i
              className={`fa-solid ${
                toast.type === 'success'
                  ? 'fa-circle-check text-emerald-200'
                  : toast.type === 'error'
                  ? 'fa-circle-xmark text-rose-200'
                  : 'fa-circle-info text-amber-300'
              }`}
            ></i>
            <span>{toast.msg}</span>
          </div>
        ))}
      </div>

      {/* Main Header */}
      <Header
        cartCount={cart.length}
        currentHash={currentHash}
        onOpenCart={() => setCartModalOpen(true)}
        onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
        onSearch={handleSearch}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        currentHash={currentHash}
      />

      {/* Main Content Router */}
      <main className="flex-1">{renderActiveView()}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Sticky Bar */}
      <MobileBottomBar
        onSearchFocus={() => {
          window.location.hash = '#shop';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Checkout COD Modal */}
      <CheckoutModal
        product={checkoutProduct}
        isOpen={checkoutProduct !== null}
        onClose={() => setCheckoutProduct(null)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Shopping Bag Modal */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutFromCart}
      />

      {/* Admin Sign-in Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => {
          setAdminModalOpen(false);
          if (normalizedHash === '#admin' && !isAdminLoggedIn) {
            window.location.hash = '#home';
          }
        }}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          setAdminModalOpen(false);
          showToast('Admin logged in successfully!', 'success');
          window.location.hash = '#admin';
        }}
        onError={(msg) => showToast(msg, 'error')}
      />
    </div>
  );
}
