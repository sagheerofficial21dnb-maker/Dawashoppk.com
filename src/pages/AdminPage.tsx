import React, { useState, useMemo, useEffect } from 'react';
import { Product, Order, Review } from '../types.ts';
import { CATEGORIES as INITIAL_CATEGORIES, generateSlug, generateSku } from '../data/catalog.ts';
import { WysiwygEditor } from '../components/WysiwygEditor.tsx';
import { Logo } from '../components/Logo.tsx';
import { generateProductListing, generateProductSlugWithPriceInPakistan } from '../utils/productListingGenerator.ts';

interface AdminPageProps {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBulkDeleteProducts?: (ids: string[]) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onBulkDeleteOrders?: (ids: string[]) => void;
  onBulkUpdateOrderStatus?: (ids: string[], status: Order['status']) => void;
  onUpdateReviewStatus: (reviewId: string, status: Review['status']) => void;
  onDeleteReview: (reviewId: string) => void;
  onBulkApproveReviews?: (ids: string[]) => void;
  onBulkDeleteReviews?: (ids: string[]) => void;
  onLogout: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type AdminTab =
  | 'overview'
  | 'products'
  | 'product-form'
  | 'categories'
  | 'orders'
  | 'reviews'
  | 'settings';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: string;
  onConfirm: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  orders,
  reviews,
  onSaveProduct,
  onDeleteProduct,
  onBulkDeleteProducts,
  onUpdateOrderStatus,
  onDeleteOrder,
  onBulkDeleteOrders,
  onBulkUpdateOrderStatus,
  onUpdateReviewStatus,
  onDeleteReview,
  onBulkApproveReviews,
  onBulkDeleteReviews,
  onLogout,
  onShowToast,
}) => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Product Form State (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSnippetSectionOpen, setIsSnippetSectionOpen] = useState(true);
  const [newTagInput, setNewTagInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Bulk Selection States (Products, Orders & Reviews)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [bulkOrderStatusTarget, setBulkOrderStatusTarget] = useState<Order['status']>('Confirmed');

  // Full Screen Image Preview Modal State
  const [fullscreenPreviewImage, setFullscreenPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Close full screen modal on Escape key
  useEffect(() => {
    if (!fullscreenPreviewImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenPreviewImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenPreviewImage]);

  // Confirmation Modal State (Non-blocking Custom Modal)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  // Category State with Persistence
  const [categoriesList, setCategoriesList] = useState<string[]>(() => {
    const saved = localStorage.getItem('dawashoppk_categories_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  // Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>('all');

  // Metric Computations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Pending').length;
  }, [orders]);

  const pendingReviewsCount = useMemo(() => {
    return reviews.filter((r) => r.status === 'pending').length;
  }, [reviews]);

  // Sitemap Generation for SEO Settings
  const sitemapXml = useMemo(() => {
    const baseUrl = 'https://dawashoppk.com';
    const now = new Date().toISOString().split('T')[0];
    const staticRoutes = [
      '#home',
      '#shop',
      '#about-us',
      '#contact-us',
      '#track-order',
      '#how-to-order',
      '#returns-exchanges',
      '#payment-methods',
      '#warranty',
      '#delivery-info',
      '#privacy-policy',
      '#terms-conditions',
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    staticRoutes.forEach((route) => {
      xml += `  <url>\n    <loc>${baseUrl}/${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${
        route === '#home' ? '1.0' : route === '#shop' ? '0.8' : '0.6'
      }</priority>\n  </url>\n`;
    });
    products.forEach((p) => {
      const slug = p.slug || generateSlug(p.title);
      xml += `  <url>\n    <loc>${baseUrl}/#product-${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  }, [products]);

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(sitemapXml);
    onShowToast('Dynamic XML Sitemap for dawashoppk.com copied to clipboard!', 'success');
  };

  // Open "Add New Product" in Persistent Layout
  const handleOpenAddProduct = (defaultCategory?: string) => {
    const initialId = `DWA-${Math.floor(200 + Math.random() * 800)}`;
    const initialCategory = defaultCategory || '';
    const initialSku = initialCategory ? generateSku(initialCategory, initialId) : `DW-GEN-${initialId}`;

    setEditingProduct({
      id: initialId,
      title: '',
      slug: '',
      sku: initialSku,
      category: initialCategory,
      categories: initialCategory ? [initialCategory] : [],
      price: 1850,
      oldPrice: 2850,
      badge: 'NEW',
      image: '',
      images: [],
      stock: 50,
      status: 'Active',
      shortDescription: '',
      longDescription: '',
      focusKeyword: '',
      metaTitle: '',
      metaDescription: '',
      features: [
        '100% Asli Sealed Packaging Hologram Ke Sath',
        'Jald Asar Qudrati Formula Baghair Side-Effects',
        'Discreet Opaque Box Mein Khufia Delivery',
        'Pure Pakistan Mein Cash On Delivery Sahoolat',
      ],
      benefits: [
        'Timing aur stamina mein qabil-e-deed izafa',
        'Khoon ki rawani aur natural blood flow ko taiz kare',
        'Rozmarrah ki thakan aur pareshani ko door kare',
        '100% mehfooz aur certified herbal ajza',
      ],
      howToUse:
        'Khas waqt se 30 se 45 minute pehle taza pani ke sath istemal ya apply karein. Packet par di gayi hidayat ke mutabiq istemal karein.',
      tags: ['timing', 'stamina', 'roman-urdu', 'dawashoppk'],
    });
    setIsNewProduct(true);
    setNewImageUrl('');
    setNewTagInput('');
    setActiveTab('product-form');
    setMobileSidebarOpen(false);
  };

  // Open "Edit Product" in Persistent Layout
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct({
      ...p,
      images: p.images && p.images.length > 0 ? [...p.images] : p.image ? [p.image] : [],
      categories: p.categories && p.categories.length > 0 ? [...p.categories] : [p.category],
      slug: p.slug || generateProductSlugWithPriceInPakistan(p.title),
      sku: p.sku || generateSku(p.category, p.id),
      status: p.status || 'Active',
      shortDescription: p.shortDescription || '',
      longDescription: p.longDescription || '',
      focusKeyword: p.focusKeyword || '',
      metaTitle: p.metaTitle || `${p.title} Price in Pakistan | DawaShop PK`,
      metaDescription: p.metaDescription || `Order ${p.title} with Cash on Delivery at dawashoppk.com.`,
      tags: p.tags ? [...p.tags] : ['wellness'],
    });
    setIsNewProduct(false);
    setNewImageUrl('');
    setNewTagInput('');
    setActiveTab('product-form');
    setMobileSidebarOpen(false);
  };

  // Discard Changes & Clean Return to Products List
  const handleDiscardProductChanges = () => {
    setEditingProduct(null);
    setIsNewProduct(false);
    setActiveTab('products');
    onShowToast('Changes discarded.', 'info');
  };

  // Live Title Handler with Auto-Generated All Values upon Title Input
  const handleTitleChange = (newTitle: string) => {
    if (!editingProduct) return;
    const autoSlug = newTitle.trim() ? generateProductSlugWithPriceInPakistan(newTitle) : '';

    if (newTitle.trim().length >= 2) {
      const generated = generateProductListing(newTitle, products);
      setEditingProduct({
        ...editingProduct,
        title: newTitle,
        slug: generated.slug,
        shortDescription: generated.shortDescription,
        longDescription: generated.longDescription,
        focusKeyword: generated.focusKeyword,
        metaTitle: generated.metaTitle,
        metaDescription: generated.metaDescription,
        tags: generated.tags,
        features: generated.features,
        benefits: generated.benefits,
        howToUse: generated.howToUse,
      });
    } else {
      setEditingProduct({
        ...editingProduct,
        title: newTitle,
        slug: autoSlug,
      });
    }
  };

  // Auto-generate Snippet
  const handleAutoGenerateSnippet = () => {
    if (!editingProduct) return;
    const title = editingProduct.title || 'Product';
    let generatedTitle = `Buy ${title} Online | DawaShop PK`;
    if (generatedTitle.length > 58) {
      generatedTitle = `Buy ${title.slice(0, 36).trim()}... | DawaShop PK`;
    }

    let generatedDesc = `Order authentic ${title} with 100% certified quality guarantee. Fast Cash on Delivery across Pakistan in discreet plain parcel. Buy online today at DawaShop PK!`;
    if (generatedDesc.length > 160) {
      generatedDesc = generatedDesc.slice(0, 157).trim() + '...';
    } else if (generatedDesc.length < 150) {
      generatedDesc = `Order 100% genuine ${title} with verified manufacturer seal. Express Cash on Delivery across Pakistan in discreet plain packaging. Buy now at DawaShop PK!`;
      if (generatedDesc.length > 160) {
        generatedDesc = generatedDesc.slice(0, 157).trim() + '...';
      } else if (generatedDesc.length < 150) {
        generatedDesc = generatedDesc.padEnd(152, '.');
      }
    }

    const cleanKeyword = (editingProduct.focusKeyword || title)
      .replace(/\b(in pakistan|pakistan|lahore|karachi|islamabad|rawalpindi)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    setEditingProduct({
      ...editingProduct,
      focusKeyword: cleanKeyword,
      metaTitle: generatedTitle,
      metaDescription: generatedDesc,
    });
    onShowToast('SEO Snippet auto-generated (under 60 chars title, 150-160 chars description).', 'success');
  };

  // Full Automated Product Listing Generator (All requirements: slug, short/long desc, smart internal & external links, focus keyword, meta SEO, city tags)
  const handleAutoGenerateFullListing = (overrideTitle?: string, silentIfEmpty: boolean = false) => {
    if (!editingProduct) return;
    const currentTitle = (overrideTitle ?? editingProduct.title)?.trim();
    if (!currentTitle) {
      if (!silentIfEmpty) {
        onShowToast('Please enter a Product Title first to auto-generate the listing.', 'error');
      }
      return;
    }
    const generated = generateProductListing(currentTitle, products);
    setEditingProduct({
      ...editingProduct,
      title: generated.title,
      slug: generated.slug,
      shortDescription: generated.shortDescription,
      longDescription: generated.longDescription,
      focusKeyword: generated.focusKeyword,
      metaTitle: generated.metaTitle,
      metaDescription: generated.metaDescription,
      tags: generated.tags,
      features: generated.features,
      benefits: generated.benefits,
      howToUse: generated.howToUse,
    });
    onShowToast(`Complete product listing auto-generated for "${generated.title}" with internal & external links!`, 'success');
  };

  // Image Upload Handlers
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    const newImgs: string[] = [];
    const fileList = Array.from(files);

    let processedCount = 0;
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          newImgs.push(base64);
        }
        processedCount++;
        if (processedCount === fileList.length) {
          const currentList = editingProduct.images || [];
          const combined = [...currentList, ...newImgs];
          setEditingProduct({
            ...editingProduct,
            images: combined,
            image: editingProduct.image || combined[0],
          });
          onShowToast(`${newImgs.length} image(s) uploaded successfully!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim() || !editingProduct) return;
    const currentList = editingProduct.images || [];
    const updated = [...currentList, newImageUrl.trim()];
    setEditingProduct({
      ...editingProduct,
      images: updated,
      image: editingProduct.image || updated[0],
    });
    setNewImageUrl('');
    onShowToast('Image URL added to gallery.', 'info');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!editingProduct) return;
    const currentList = editingProduct.images || [];
    const updated = currentList.filter((_, idx) => idx !== indexToRemove);
    setEditingProduct({
      ...editingProduct,
      images: updated,
      image: updated[0] || '',
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!editingProduct) return;
    const currentList = [...(editingProduct.images || [])];
    const selected = currentList[index];
    if (!selected) return;
    currentList.splice(index, 1);
    currentList.unshift(selected);
    setEditingProduct({
      ...editingProduct,
      images: currentList,
      image: selected,
    });
    onShowToast('Primary cover image updated.', 'success');
  };

  // Category Checkbox Handlers
  const handleToggleCategory = (cat: string) => {
    if (!editingProduct) return;
    const currentCategories = editingProduct.categories || (editingProduct.category ? [editingProduct.category] : []);
    let updated: string[];
    if (currentCategories.includes(cat)) {
      updated = currentCategories.filter((c) => c !== cat);
    } else {
      updated = [...currentCategories, cat];
    }
    setEditingProduct({
      ...editingProduct,
      categories: updated,
      category: updated[0] || '',
    });
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryInput.trim();
    if (!clean) return;
    if (categoriesList.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      onShowToast(`Category "${clean}" already exists.`, 'error');
      return;
    }
    const updated = [...categoriesList, clean];
    setCategoriesList(updated);
    localStorage.setItem('dawashoppk_categories_v2', JSON.stringify(updated));
    setNewCategoryInput('');
    if (editingProduct) {
      const current = editingProduct.categories || [];
      setEditingProduct({
        ...editingProduct,
        categories: [...current, clean],
        category: clean,
      });
    }
    onShowToast(`Category "${clean}" created and selected!`, 'success');
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (!newTagInput.trim() || !editingProduct) return;
    const cleanTag = newTagInput.trim().toLowerCase();
    const existing = editingProduct.tags || [];
    if (!existing.includes(cleanTag)) {
      setEditingProduct({
        ...editingProduct,
        tags: [...existing, cleanTag],
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      tags: (editingProduct.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  // Save Product (CRUD)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.title || !editingProduct.title.trim()) {
      onShowToast('Please provide a product title.', 'error');
      return;
    }

    if (!editingProduct.categories || editingProduct.categories.length === 0) {
      onShowToast('Please select at least one category for this product.', 'error');
      return;
    }

    const title = editingProduct.title.trim();
    const finalSlug = editingProduct.slug?.trim() || generateSlug(title);
    const primaryCategory =
      (editingProduct.categories && editingProduct.categories[0]) ||
      editingProduct.category ||
      'General';

    const finalImages =
      editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : [editingProduct.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'];

    const finalProduct: Product = {
      id: editingProduct.id || `DWA-${Date.now()}`,
      title,
      slug: finalSlug,
      sku: editingProduct.sku?.trim() || generateSku(primaryCategory, editingProduct.id || '101'),
      category: primaryCategory,
      categories: editingProduct.categories && editingProduct.categories.length > 0 ? editingProduct.categories : [primaryCategory],
      price: Number(editingProduct.price) || 1850,
      oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : undefined,
      badge: editingProduct.badge?.trim() || undefined,
      image: finalImages[0],
      images: finalImages,
      stock: editingProduct.stock !== undefined ? Number(editingProduct.stock) : 50,
      status: editingProduct.status || 'Active',
      shortDescription: editingProduct.shortDescription?.trim() || `${title} is an authentic formulation on dawashoppk.com.`,
      longDescription: editingProduct.longDescription?.trim() || `${title} provides maximum endurance and verified quality on dawashoppk.com.`,
      focusKeyword: editingProduct.focusKeyword?.trim() || '',
      metaTitle: editingProduct.metaTitle?.trim() || `Buy ${title} | dawashoppk.com`,
      metaDescription: editingProduct.metaDescription?.trim() || `Order ${title} with Cash on Delivery at dawashoppk.com.`,
      features: editingProduct.features && editingProduct.features.length > 0 ? editingProduct.features : ['100% Original Sealed Packaging', 'Fast Acting Formulation', 'Discreet Parcel Delivery'],
      benefits: editingProduct.benefits && editingProduct.benefits.length > 0 ? editingProduct.benefits : ['Maximum stamina', 'Enhanced control and confidence'],
      howToUse: editingProduct.howToUse?.trim() || 'Follow package directions carefully with fresh water.',
      tags: editingProduct.tags && editingProduct.tags.length > 0 ? editingProduct.tags : ['wellness', 'dawashoppk.com'],
      rating: editingProduct.rating || 5,
      reviewsCount: editingProduct.reviewsCount || 1,
      createdAt: editingProduct.createdAt || new Date().toISOString(),
    };

    onSaveProduct(finalProduct);
    setEditingProduct(null);
    setIsNewProduct(false);
    setActiveTab('products');
    onShowToast(`Product "${finalProduct.title}" saved successfully!`, 'success');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat =
        productCategoryFilter === 'all' ||
        p.category.toLowerCase() === productCategoryFilter.toLowerCase() ||
        (p.categories && p.categories.some((c) => c.toLowerCase() === productCategoryFilter.toLowerCase()));
      return matchSearch && matchCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Bulk Product Handlers
  const handleToggleSelectAllProducts = () => {
    if (filteredProducts.length === 0) return;
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDeleteProducts = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Selected Products',
      message: `Are you sure you want to permanently delete ${count} selected product(s) from DawaShop PK? This action cannot be undone.`,
      confirmLabel: `Delete ${count} Product(s)`,
      confirmColor: 'bg-rose-600',
      onConfirm: () => {
        if (onBulkDeleteProducts) {
          onBulkDeleteProducts(selectedProductIds);
        } else {
          selectedProductIds.forEach((id) => onDeleteProduct(id));
          onShowToast(`${count} products deleted.`, 'info');
        }
        setSelectedProductIds([]);
      },
    });
  };

  const handleConfirmDeleteAllProducts = () => {
    if (products.length === 0) return;
    const allIds = products.map((p) => p.id);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete ALL Products',
      message: `WARNING: Are you sure you want to delete ALL ${products.length} products in the entire catalog? This action will permanently remove all store products!`,
      confirmLabel: `Yes, Delete All (${products.length}) Products`,
      confirmColor: 'bg-rose-700',
      onConfirm: () => {
        if (onBulkDeleteProducts) {
          onBulkDeleteProducts(allIds);
        } else {
          allIds.forEach((id) => onDeleteProduct(id));
          onShowToast(`All ${allIds.length} products deleted.`, 'info');
        }
        setSelectedProductIds([]);
      },
    });
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.includes(orderSearch) ||
        o.productTitle.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Bulk Order Handlers
  const handleToggleSelectAllOrders = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((oId) => oId !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDeleteOrders = () => {
    if (selectedOrderIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Bulk Delete Orders',
      message: `Are you sure you want to permanently delete ${selectedOrderIds.length} selected order(s)?`,
      confirmLabel: 'Delete Orders',
      confirmColor: 'bg-rose-600',
      onConfirm: () => {
        if (onBulkDeleteOrders) {
          onBulkDeleteOrders(selectedOrderIds);
        } else {
          selectedOrderIds.forEach((id) => onDeleteOrder(id));
          onShowToast(`${selectedOrderIds.length} orders removed.`, 'info');
        }
        setSelectedOrderIds([]);
      },
    });
  };

  const handleApplyBulkOrderStatus = () => {
    if (selectedOrderIds.length === 0) return;
    if (onBulkUpdateOrderStatus) {
      onBulkUpdateOrderStatus(selectedOrderIds, bulkOrderStatusTarget);
    } else {
      selectedOrderIds.forEach((id) => onUpdateOrderStatus(id, bulkOrderStatusTarget));
      onShowToast(`${selectedOrderIds.length} orders updated to ${bulkOrderStatusTarget}.`, 'success');
    }
    setSelectedOrderIds([]);
  };

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        r.author.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.productTitle.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment.toLowerCase().includes(reviewSearch.toLowerCase());
      const matchStatus = reviewStatusFilter === 'all' || r.status === reviewStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [reviews, reviewSearch, reviewStatusFilter]);

  // Bulk Review Handlers
  const handleToggleSelectAllReviews = () => {
    if (selectedReviewIds.length === filteredReviews.length) {
      setSelectedReviewIds([]);
    } else {
      setSelectedReviewIds(filteredReviews.map((r) => r.id));
    }
  };

  const handleToggleSelectReview = (id: string) => {
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkApproveReviews = () => {
    if (selectedReviewIds.length === 0) return;
    if (onBulkApproveReviews) {
      onBulkApproveReviews(selectedReviewIds);
    } else {
      selectedReviewIds.forEach((id) => onUpdateReviewStatus(id, 'approved'));
      onShowToast(`${selectedReviewIds.length} reviews approved!`, 'success');
    }
    setSelectedReviewIds([]);
  };

  const handleConfirmBulkDeleteReviews = () => {
    if (selectedReviewIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Bulk Delete Reviews',
      message: `Permanently delete ${selectedReviewIds.length} selected review(s) from database?`,
      confirmLabel: 'Delete Reviews',
      confirmColor: 'bg-rose-600',
      onConfirm: () => {
        if (onBulkDeleteReviews) {
          onBulkDeleteReviews(selectedReviewIds);
        } else {
          selectedReviewIds.forEach((id) => onDeleteReview(id));
          onShowToast(`${selectedReviewIds.length} reviews deleted.`, 'info');
        }
        setSelectedReviewIds([]);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row antialiased">
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden bg-[#001A2C] text-white p-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <Logo size="sm" variant="light" />
          <span className="text-xs font-bold text-amber-400">Site Owner Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAddProduct()}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1 shadow-xs"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>Add</span>
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white text-lg"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* PERSISTENT ADMIN SIDEBAR (VISIBLE ON ALL PAGES) */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[68px] left-0 h-screen lg:h-[calc(100vh-68px)] w-72 bg-[#002B49] text-white z-30 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <Logo size="sm" variant="light" showSubtitle={false} />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="bg-[#001A2C] p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-200">DawaShop PK</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black uppercase">
              Site Owner
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Action: Add Product */}
          <button
            onClick={() => handleOpenAddProduct()}
            className={`w-full mb-3 px-4 py-3 rounded-xl text-xs font-black flex items-center justify-between shadow-md transition cursor-pointer ${
              activeTab === 'product-form' && isNewProduct
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white/20'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-circle-plus text-base"></i>
              <span className="tracking-wide uppercase">Add Product</span>
            </div>
            <span className="bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px] font-bold">New</span>
          </button>

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
            Store Navigation
          </div>

          {/* 1. Dashboard / Overview */}
          <button
            onClick={() => {
              setActiveTab('overview');
              setMobileSidebarOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-chart-pie w-4 text-center"></i>
              <span>Dashboard</span>
            </div>
          </button>

          {/* 2. All Products */}
          <button
            onClick={() => {
              setActiveTab('products');
              setMobileSidebarOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-boxes-stacked w-4 text-center"></i>
              <span>All Products</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'products' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* 3. Product Categories */}
          <button
            onClick={() => {
              setActiveTab('categories');
              setMobileSidebarOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-tags w-4 text-center"></i>
              <span>Product Categories</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'categories' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
              }`}
            >
              {categoriesList.length}
            </span>
          </button>

          {/* 4. Orders List */}
          <button
            onClick={() => {
              setActiveTab('orders');
              setMobileSidebarOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-truck-fast w-4 text-center"></i>
              <span>Orders List</span>
            </div>
            {pendingOrdersCount > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-rose-600 text-white animate-pulse">
                {pendingOrdersCount} New
              </span>
            ) : (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'orders' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          {/* 5. Reviews Moderation */}
          <button
            onClick={() => {
              setActiveTab('reviews');
              setMobileSidebarOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-shield-halved w-4 text-center"></i>
              <span>Reviews Moderation</span>
            </div>
            {pendingReviewsCount > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-amber-400 text-slate-950">
                {pendingReviewsCount} Pending
              </span>
            ) : (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'reviews' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}
              >
                {reviews.length}
              </span>
            )}
          </button>

          {/* 6. Settings & Sitemap */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setMobileSidebarOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-gear w-4 text-center"></i>
              <span>Settings &amp; SEO</span>
            </div>
          </button>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#001A2C]">
          <a
            href="#home"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
            <span>Live Storefront</span>
          </a>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-[11px]"></i>
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* SUB-VIEW 1: ALL PRODUCTS LIST */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header & Primary Actions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#002B49]">Product Catalog</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage inventory, pricing, multiple images, and SEO snippets on dawashoppk.com
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddProduct()}
                  className="bg-[#002B49] hover:bg-[#0d3b66] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-amber-400"></i>
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title, SKU, or slug..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-[#002B49]"
                />
              </div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Categories ({products.length})</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Product Operations Bar (Visible when 1 or more products selected) */}
            {selectedProductIds.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <i className="fa-solid fa-circle-check text-amber-600 text-sm"></i>
                  <span>{selectedProductIds.length} product(s) selected</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleConfirmBulkDeleteProducts}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    <span>Delete Selected ({selectedProductIds.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleSelectAllProducts}
                    className="px-2.5 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-semibold border border-amber-200 hover:bg-slate-50 cursor-pointer"
                  >
                    {selectedProductIds.length === filteredProducts.length
                      ? 'Deselect All'
                      : `Select All (${filteredProducts.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="px-2.5 py-1.5 bg-white text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto custom-scroll">
                <table className="w-full min-w-[720px] text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredProducts.length > 0 &&
                            selectedProductIds.length === filteredProducts.length
                          }
                          onChange={handleToggleSelectAllProducts}
                          title="Select / Deselect all products"
                          className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-0 cursor-pointer align-middle"
                        />
                      </th>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Categories</th>
                      <th className="py-3 px-4">Sale Price</th>
                      <th className="py-3 px-4">Stock &amp; Status</th>
                      <th className="py-3 px-4">Gallery</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <i className="fa-solid fa-box-open text-3xl mb-2 block"></i>
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isSelected = selectedProductIds.includes(p.id);
                        const discount =
                          p.oldPrice && p.oldPrice > p.price
                            ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                            : null;
                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-slate-50/70 transition ${
                              isSelected ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectProduct(p.id)}
                                title={`Select ${p.title}`}
                                className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-0 cursor-pointer align-middle"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative group/thumb cursor-pointer flex-shrink-0"
                                  onClick={() => setFullscreenPreviewImage({ url: p.image, title: p.title })}
                                  title="Click to view full screen"
                                >
                                  <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 group-hover/thumb:border-blue-500 transition shadow-xs"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition text-[10px]">
                                    <i className="fa-solid fa-expand"></i>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</h4>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                    <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-600 font-bold">
                                      {p.sku || p.id}
                                    </span>
                                    <span>&bull;</span>
                                    <span className="text-blue-600 truncate max-w-[140px]">
                                      #{p.slug || generateSlug(p.title)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {(p.categories || [p.category]).map((c, i) => (
                                  <span
                                    key={i}
                                    className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-black text-slate-900">Rs {p.price.toLocaleString()}</div>
                              {p.oldPrice && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  Rs {p.oldPrice.toLocaleString()} {discount && `(-${discount}%)`}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : p.status === 'Out of Stock'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {p.status || 'Active'}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">{p.stock ?? 50} units</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[11px] font-semibold text-slate-600">
                                <i className="fa-solid fa-images text-amber-500 mr-1"></i>
                                {p.images?.length || 1}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer"
                                  title="Edit Product"
                                >
                                  <i className="fa-solid fa-pen-to-square mr-1"></i>
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: 'Delete Product',
                                      message: `Are you sure you want to delete "${p.title}" permanently from DawaShop PK?`,
                                      confirmLabel: 'Delete Product',
                                      confirmColor: 'bg-rose-600',
                                      onConfirm: () => {
                                        onDeleteProduct(p.id);
                                        onShowToast('Product deleted.', 'info');
                                        setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                                      },
                                    });
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition cursor-pointer"
                                  title="Delete Product"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: PRODUCT FORM (ADD / EDIT) - PERSISTENT SIDEBAR INCLUDED */}
        {activeTab === 'product-form' && editingProduct && (
          <div className="space-y-6">
            {/* Top Working Breadcrumb & Back Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDiscardProductChanges}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to Products</span>
                </button>
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500">Admin</span> &rsaquo;{' '}
                  <span className="text-slate-500">Products</span> &rsaquo;{' '}
                  <span className="font-bold text-[#002B49]">
                    {isNewProduct ? 'Add New Product' : `Edit: ${editingProduct.title || 'Product'}`}
                  </span>
                </div>
              </div>

              {/* Status & Sticky Action Buttons */}
              <div className="flex items-center gap-2">
                <select
                  value={editingProduct.status || 'Active'}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      status: e.target.value as Product['status'],
                    })
                  }
                  className="px-3 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 outline-none cursor-pointer"
                >
                  <option value="Active">Status: Active</option>
                  <option value="Out of Stock">Status: Out of Stock</option>
                  <option value="Draft">Status: Draft</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleAutoGenerateFullListing()}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Auto-generate complete listing: title, slug, short & long description with internal links, focus keyword, meta SEO, and city tags"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-600"></i>
                  <span className="hidden sm:inline">⚡ Auto-Generate All</span>
                </button>

                <button
                  type="button"
                  onClick={handleDiscardProductChanges}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Discard Changes
                </button>

                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>Save &amp; Publish</span>
                </button>
              </div>
            </div>

            {/* Product Form Grid */}
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT & CENTER COLUMN (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Title & URL Slug */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-heading text-blue-600"></i>
                        <span>Product Title *</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoGenerateFullListing()}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                        title="1-Click Auto-Generate All: Slug, Short & Long Description with smart links, SEO metadata, and 15-20 tags"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                        <span>⚡ Auto-Generate All</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={editingProduct.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val.length >= 3 && (!editingProduct.shortDescription || editingProduct.shortDescription.length < 15 || !editingProduct.longDescription)) {
                            handleAutoGenerateFullListing(val, true);
                          }
                        }}
                        placeholder="e.g. Super Viga 150000 Delay Spray with Vitamin E"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm sm:text-base font-bold text-slate-900 outline-none focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Type product title and click <strong>⚡ Auto-Generate All</strong> (or press Tab) to automatically generate descriptions, smart internal catalog links, authoritative external links, SEO metadata, and city tags.
                    </p>
                  </div>

                  {/* Auto-Generating URL Slug Box */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <i className="fa-solid fa-link text-amber-500"></i>
                        <span>Auto-Generated Canonical URL Slug</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const freshSlug = generateProductSlugWithPriceInPakistan(editingProduct.title || '');
                          setEditingProduct({ ...editingProduct, slug: freshSlug });
                          onShowToast('Slug re-synchronized with Title (price in Pakistan)', 'info');
                        }}
                        className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                      >
                        Re-sync from Title
                      </button>
                    </div>
                    <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden text-xs">
                      <span className="bg-slate-100 text-slate-500 px-3 py-2 border-r border-slate-200 font-mono text-[11px] select-none">
                        dawashoppk.com/#product-
                      </span>
                      <input
                        type="text"
                        value={editingProduct.slug || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                        placeholder="super-viga-150000-delay-spray-price-in-pakistan"
                        className="w-full px-3 py-2 text-xs font-mono text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Short Description */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      Short Description (Above-the-fold Summary)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(editingProduct.shortDescription || '').length} characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                    }
                    placeholder="Short product punchline, clinical timing benefit, and immediate value proposition..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#002B49]"
                  />
                </div>

                {/* 3. Full WordPress / TinyMCE Style WYSIWYG Rich Text Editor */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Long Description / Clinical Specifications
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Full formatting toolbar supporting headings, alignment, lists, links, and direct media insertion
                    </p>
                  </div>

                  <WysiwygEditor
                    value={editingProduct.longDescription || ''}
                    onChange={(val) => setEditingProduct({ ...editingProduct, longDescription: val })}
                    onShowToast={onShowToast}
                  />
                </div>

                {/* 4. SEO & Edit Snippet Section */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-magnifying-glass text-cyan-600"></i>
                        <span>SEO &amp; Google Search Snippet</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Preview and directly edit SEO metadata rendered in Google search results
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSnippetSectionOpen(!isSnippetSectionOpen)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition"
                    >
                      {isSnippetSectionOpen ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {isSnippetSectionOpen && (
                    <div className="space-y-4">
                      {/* Google SERP Snippet Preview */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1 font-sans">
                        <div className="text-[11px] text-slate-600 flex items-center gap-1">
                          <span className="font-semibold text-slate-800">dawashoppk.com</span>
                          <span className="text-slate-400">
                            &rsaquo; product &rsaquo; {editingProduct.slug || 'slug'}
                          </span>
                        </div>
                        <h4 className="text-base font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1">
                          {editingProduct.metaTitle || `${editingProduct.title || 'Product Title'} | dawashoppk.com`}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {editingProduct.metaDescription ||
                            editingProduct.shortDescription ||
                            'Order original health and wellness formulations in Pakistan with discreet packing and cash on delivery at dawashoppk.com.'}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAutoGenerateSnippet}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                          <span>Auto-Generate SEO Snippet</span>
                        </button>
                      </div>

                      {/* Focus Keyword Input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Focus Keyword
                        </label>
                        <input
                          type="text"
                          value={editingProduct.focusKeyword || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, focusKeyword: e.target.value })}
                          placeholder="e.g. super viga 150000 delay spray"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#002B49]"
                        />
                      </div>

                      {/* Meta Title Field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-bold text-slate-800">SEO Meta Title</label>
                          <span className="text-[10px] text-slate-400">
                            {(editingProduct.metaTitle || '').length} / 60 chars
                          </span>
                        </div>
                        <input
                          type="text"
                          value={editingProduct.metaTitle || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, metaTitle: e.target.value })}
                          placeholder="Buy [Title] at Best Price in Pakistan | dawashoppk.com"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#002B49]"
                        />
                      </div>

                      {/* Meta Description Field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-bold text-slate-800">SEO Meta Description</label>
                          <span className="text-[10px] text-slate-400">
                            {(editingProduct.metaDescription || '').length} / 160 chars
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={editingProduct.metaDescription || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, metaDescription: e.target.value })}
                          placeholder="Compelling search snippet describing genuine quality, fast nationwide delivery, and cash on delivery..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#002B49]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Pricing & Inventory */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Pricing &amp; Inventory Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Sale Price (PKR) *
                      </label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price ?? ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        placeholder="1850"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-slate-900 outline-none focus:border-[#002B49]"
                      />
                      <span className="text-[10px] text-slate-400">Customer checkout price</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Regular Price (PKR)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.oldPrice ?? ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            oldPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        placeholder="2850"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 outline-none focus:border-[#002B49]"
                      />
                      <span className="text-[10px] text-slate-400">Strikethrough reference price</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">SKU</label>
                      <input
                        type="text"
                        value={editingProduct.sku || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        placeholder="DW-SPRAY-01"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={editingProduct.stock ?? 50}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="HOT, NEW, SALE"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Clickable Tags */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                    Clickable Product Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag and press Enter..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#002B49]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#0d3b66] transition cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(editingProduct.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-600 transition cursor-pointer"
                        >
                          <i className="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: MULTIPLE IMAGES & CATEGORIES (1/3 width) */}
              <div className="space-y-6">
                {/* 7. Product Gallery & Images */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Product Gallery Images
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {(editingProduct.images || []).length} image(s) configured
                    </p>
                  </div>

                  {/* Device File Upload */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#002B49] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-amber-500 mb-1.5"></i>
                    <span className="text-xs font-bold text-slate-800">Upload from Device</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Direct upload (multiple files allowed)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleLocalImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Add by Direct URL */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Or Add by Image URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#002B49]"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#0d3b66] transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail List */}
                  <div className="space-y-2 pt-2">
                    {(editingProduct.images || []).length === 0 && (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-slate-50/70 my-1">
                        <i className="fa-solid fa-image text-slate-400 text-2xl mb-1.5 block"></i>
                        <span className="font-bold text-slate-700 block">Primary Cover Image Field is Empty</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          New products have no default image. Upload from device or enter an image URL above to set cover.
                        </span>
                      </div>
                    )}
                    {(editingProduct.images || []).map((img, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition"
                      >
                        <div
                          className="relative group/thumb cursor-pointer flex-shrink-0"
                          onClick={() =>
                            setFullscreenPreviewImage({
                              url: img,
                              title: `${editingProduct.title || 'Product'} Image ${idx + 1}`,
                            })
                          }
                          title="Click to view full screen"
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-0.5 group-hover/thumb:border-blue-500 transition"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition text-[10px]">
                            <i className="fa-solid fa-expand"></i>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          {idx === 0 ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">
                              ★ Primary Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-blue-600 hover:underline font-bold text-[11px] cursor-pointer"
                            >
                              Set as Primary
                            </button>
                          )}
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{img}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Remove image"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. Category Checkboxes */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Product Categories
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {(editingProduct.categories || []).length === 0 ? (
                        <span className="text-amber-600 font-semibold">
                          No category selected &bull; Choose one or more below
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          {(editingProduct.categories || []).length} category(ies) selected
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {categoriesList.map((cat) => {
                      const isChecked = (editingProduct.categories || []).includes(cat);
                      return (
                        <label
                          key={cat}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition ${
                            isChecked
                              ? 'bg-blue-50/70 border-blue-300 text-slate-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCategory(cat)}
                            className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-[#002B49]"
                          />
                          <span className="text-xs">{cat}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Add Custom Category Inline */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 block">+ Add Custom Category:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="e.g. Herbal Balms"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-3 py-1.5 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#0d3b66] transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="bg-[#002B49] p-5 rounded-2xl text-white shadow-md space-y-3">
                  <h4 className="text-xs font-black uppercase text-amber-400">Save &amp; Update</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Changes reflect immediately in the public catalog, search index, and direct checkout.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Save &amp; Publish Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscardProductChanges}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* SUB-VIEW 3: PRODUCT CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#002B49]">Product Categories</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Taxonomy categories for catalog organization and customer browsing
                </p>
              </div>
              <button
                onClick={() => handleOpenAddProduct()}
                className="bg-[#002B49] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0d3b66] transition flex items-center gap-1.5 shadow-xs"
              >
                <i className="fa-solid fa-plus text-amber-400"></i>
                <span>Add Product</span>
              </button>
            </div>

            {/* Create Category Form */}
            <form onSubmit={handleAddNewCategory} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Create New Category
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="e.g. Stamina Boosters, Herbal Oils, Delay Sprays..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#002B49]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesList.map((cat) => {
                const count = products.filter(
                  (p) =>
                    p.category.toLowerCase() === cat.toLowerCase() ||
                    (p.categories && p.categories.some((c) => c.toLowerCase() === cat.toLowerCase()))
                ).length;
                return (
                  <div
                    key={cat}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#002B49] transition flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B49] flex items-center justify-center text-lg">
                        <i className="fa-solid fa-folder-open text-amber-500"></i>
                      </div>
                      <span className="text-xs font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        {count} Products
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{cat}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">dawashoppk.com taxonomy collection</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setProductCategoryFilter(cat);
                          setActiveTab('products');
                        }}
                        className="text-[#002B49] font-bold hover:text-amber-600 transition cursor-pointer"
                      >
                        View Products &rarr;
                      </button>
                      <button
                        onClick={() => handleOpenAddProduct(cat)}
                        className="text-amber-600 font-bold hover:text-amber-700 transition cursor-pointer"
                      >
                        + Add to Category
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-VIEW 4: ORDERS LIST WITH BULK ACTIONS & INDIVIDUAL DELETE */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#002B49]">Customer Orders List</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update statuses, contact buyers on WhatsApp, and manage individual or bulk order records
                </p>
              </div>
              <div className="text-xs font-bold text-slate-600">Total Orders: {orders.length}</div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ID, customer name, phone number, or product..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-[#002B49]"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-[#002B49] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Order Operations Bar */}
            {selectedOrderIds.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <i className="fa-solid fa-circle-check text-amber-600"></i>
                  <span>{selectedOrderIds.length} order(s) selected</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-700">Set Status:</span>
                    <select
                      value={bulkOrderStatusTarget}
                      onChange={(e) => setBulkOrderStatusTarget(e.target.value as Order['status'])}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={handleApplyBulkOrderStatus}
                      className="px-3 py-1 bg-[#002B49] text-white rounded-lg text-xs font-bold hover:bg-[#0d3b66] transition cursor-pointer"
                    >
                      Apply Status
                    </button>
                  </div>
                  <button
                    onClick={handleConfirmBulkDeleteOrders}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrderIds([])}
                    className="px-2.5 py-1 bg-white text-slate-700 rounded-lg text-xs font-semibold border border-amber-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <i className="fa-solid fa-inbox text-3xl mb-2 block"></i>
                  No orders match the selected filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={
                              filteredOrders.length > 0 &&
                              selectedOrderIds.length === filteredOrders.length
                            }
                            onChange={handleToggleSelectAllOrders}
                            className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-0 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4">Order ID &amp; Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Product &amp; Total</th>
                        <th className="py-3 px-4">Delivery Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((o) => {
                        const isSelected = selectedOrderIds.includes(o.id);
                        return (
                          <tr
                            key={o.id}
                            className={`hover:bg-slate-50/70 transition ${
                              isSelected ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectOrder(o.id)}
                                className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                {o.id}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">{o.date}</div>
                            </td>
                            <td className="py-3.5 px-4 space-y-0.5">
                              <div className="font-bold text-slate-900">{o.name}</div>
                              <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                <i className="fa-solid fa-phone text-amber-500 text-[10px]"></i>
                                <span>{o.phone}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {o.address}, {o.city}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-800 line-clamp-1">{o.productTitle}</div>
                              <div className="font-black text-[#002B49] text-xs mt-0.5">
                                Rs {o.total.toLocaleString()}{' '}
                                <span className="text-[10px] text-slate-400 font-normal">(COD)</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={o.status}
                                onChange={(e) =>
                                  onUpdateOrderStatus(o.id, e.target.value as Order['status'])
                                }
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold outline-none cursor-pointer border ${
                                  o.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : o.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : o.status === 'Confirmed'
                                    ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                    : o.status === 'Cancelled'
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hello ${o.name}! Regarding your dawashoppk.com order ${o.id} for "${o.productTitle}":`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold transition"
                                  title="Contact via WhatsApp"
                                >
                                  <i className="fa-brands fa-whatsapp text-sm"></i>
                                </a>
                                <button
                                  onClick={() => {
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: 'Delete Customer Order',
                                      message: `Permanently delete order "${o.id}" for customer ${o.name}? This action cannot be reversed.`,
                                      confirmLabel: 'Delete Order',
                                      confirmColor: 'bg-rose-600',
                                      onConfirm: () => {
                                        onDeleteOrder(o.id);
                                      },
                                    });
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold transition cursor-pointer"
                                  title="Delete Order"
                                >
                                  <i className="fa-solid fa-trash text-xs"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-VIEW 5: REVIEWS MODERATION (APPROVE, REJECT, DELETE, BULK ACTIONS) */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#002B49]">Review Moderation</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approve genuine feedback, reject spam, or permanently delete customer reviews
                </p>
              </div>
              <div className="text-xs font-bold text-slate-600">Total Reviews: {reviews.length}</div>
            </div>

            {/* Quick Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Search reviews by buyer, city, product, or comment..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-[#002B49]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Reviews' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'rejected', label: 'Rejected' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setReviewStatusFilter(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      reviewStatusFilter === item.id
                        ? 'bg-[#002B49] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Reviews Action Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      filteredReviews.length > 0 &&
                      selectedReviewIds.length === filteredReviews.length
                    }
                    onChange={handleToggleSelectAllReviews}
                    className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span>Select All ({selectedReviewIds.length} selected)</span>
                </label>
              </div>

              {selectedReviewIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmBulkApproveReviews}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>Bulk Approve</span>
                  </button>
                  <button
                    onClick={handleConfirmBulkDeleteReviews}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    <span>Bulk Delete</span>
                  </button>
                  <button
                    onClick={() => setSelectedReviewIds([])}
                    className="px-2.5 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>

            {/* Reviews Cards List */}
            <div className="space-y-3">
              {filteredReviews.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  <i className="fa-solid fa-comment-slash text-3xl mb-2 block"></i>
                  No reviews match your selected filter.
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const isSelected = selectedReviewIds.includes(rev.id);
                  return (
                    <div
                      key={rev.id}
                      className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start justify-between gap-4 transition ${
                        isSelected ? 'ring-2 ring-[#002B49]/30 bg-blue-50/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectReview(rev.id)}
                          className="w-4 h-4 text-[#002B49] rounded border-slate-300 focus:ring-0 mt-1 cursor-pointer"
                        />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{rev.author}</span>
                            <span className="text-xs text-slate-400">&bull; {rev.city}</span>
                            <div className="text-amber-400 text-xs">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <i key={i} className="fa-solid fa-star"></i>
                              ))}
                            </div>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                rev.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : rev.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {rev.status}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-[#002B49]">
                            Product: {rev.productTitle}
                          </div>

                          <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                            "{rev.comment}"
                          </p>
                        </div>
                      </div>

                      {/* Moderation Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => {
                              onUpdateReviewStatus(rev.id, 'approved');
                              onShowToast('Review approved and live on storefront.', 'success');
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <i className="fa-solid fa-check"></i>
                            <span>Approve</span>
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              onUpdateReviewStatus(rev.id, 'rejected');
                              onShowToast('Review rejected and hidden.', 'info');
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <i className="fa-solid fa-ban"></i>
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Review',
                              message: `Permanently delete review by "${rev.author}"?`,
                              confirmLabel: 'Delete Review',
                              confirmColor: 'bg-rose-600',
                              onConfirm: () => {
                                onDeleteReview(rev.id);
                              },
                            });
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          title="Delete Review"
                        >
                          <i className="fa-solid fa-trash"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* SUB-VIEW 6: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-black text-[#002B49]">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of store performance, order volume, and pending tasks
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Gross COD Volume</span>
                <h3 className="text-2xl font-black text-[#002B49]">Rs {totalRevenue.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-600 font-bold">From customer orders</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Catalog Items</span>
                <h3 className="text-2xl font-black text-[#002B49]">{products.length} Products</h3>
                <span className="text-[10px] text-blue-600 font-bold">Across {categoriesList.length} categories</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Tasks</span>
                <h3 className="text-2xl font-black text-amber-500">
                  {pendingOrdersCount} Orders &bull; {pendingReviewsCount} Reviews
                </h3>
                <span className="text-[10px] text-slate-500">Awaiting processing</span>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleOpenAddProduct()}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#002B49] transition shadow-xs text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                  <i className="fa-solid fa-plus"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Add New Product</h4>
                <p className="text-[11px] text-slate-500 mt-1">Create product with WYSIWYG editor</p>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#002B49] transition shadow-xs text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002B49] flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Manage Orders</h4>
                <p className="text-[11px] text-slate-500 mt-1">{orders.length} total customer records</p>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#002B49] transition shadow-xs text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Moderate Reviews</h4>
                <p className="text-[11px] text-slate-500 mt-1">{pendingReviewsCount} pending approvals</p>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#002B49] transition shadow-xs text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">XML Sitemap</h4>
                <p className="text-[11px] text-slate-500 mt-1">Export Google Search Console map</p>
              </button>
            </div>
          </div>
        )}

        {/* SUB-VIEW 7: SETTINGS & SITEMAP */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-black text-[#002B49]">Settings &amp; SEO Tools</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage search engine configuration, sitemaps, and store branding
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Dynamic XML Sitemap</h3>
                  <p className="text-xs text-slate-500">
                    Auto-indexes all product canonical slugs and core storefront pages
                  </p>
                </div>
                <button
                  onClick={handleCopySitemap}
                  className="px-4 py-2 bg-[#002B49] hover:bg-[#0d3b66] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-copy text-amber-400"></i>
                  <span>Copy XML Sitemap</span>
                </button>
              </div>
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] max-h-60 overflow-y-auto no-scrollbar">
                <pre>{sitemapXml}</pre>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-slate-900">Store Credentials &amp; Verification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Domain</span>
                  <span className="font-bold text-[#002B49]">dawashoppk.com</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Support Hotline</span>
                  <span className="font-bold text-[#002B49]">0327-8007580</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* NON-BLOCKING CUSTOM CONFIRMATION MODAL */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 className="font-black text-base text-slate-900">{confirmDialog.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition cursor-pointer ${
                  confirmDialog.confirmColor || 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FULL-SCREEN PRODUCT IMAGE PREVIEW MODAL - RESPONSIVE ACROSS ALL DEVICES */}
      {fullscreenPreviewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setFullscreenPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[96vh] sm:max-h-[92vh] w-full bg-slate-900/95 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10 text-white mb-2 sm:mb-3 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <i className="fa-solid fa-images text-amber-400 flex-shrink-0"></i>
                <h4 className="font-bold text-xs sm:text-sm truncate max-w-[180px] sm:max-w-md">
                  {fullscreenPreviewImage.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={fullscreenPreviewImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  <span className="hidden sm:inline">Open Original</span>
                </a>
                <button
                  type="button"
                  onClick={() => setFullscreenPreviewImage(null)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center text-sm transition cursor-pointer active:scale-95"
                  title="Close (Esc)"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Modal Responsive Image Area Preserving Exact Aspect Ratio */}
            <div className="flex items-center justify-center w-full flex-1 min-h-0 overflow-hidden rounded-xl bg-black/60 p-2 sm:p-4">
              <img
                src={fullscreenPreviewImage.url}
                alt={fullscreenPreviewImage.title}
                className="max-h-[72vh] sm:max-h-[78vh] md:max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
