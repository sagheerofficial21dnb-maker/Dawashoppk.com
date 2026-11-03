export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string; // Primary image for backwards compatibility & quick access
  images: string[]; // Multiple product gallery images
  stock?: number;
  status: 'Active' | 'Out of Stock' | 'Draft';
  shortDescription: string;
  longDescription: string;
  focusKeyword?: string;
  categories?: string[];
  metaTitle?: string;
  metaDescription?: string;
  rating?: number;
  reviewsCount?: number;
  features: string[];
  benefits: string[];
  howToUse: string;
  tags: string[];
  createdAt?: string; // ISO date timestamp for 7-day automated refresh & recency sorting
}

export interface Order {
  id: string;
  date: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  productTitle: string;
  price: number;
  delivery: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  author: string;
  email?: string;
  city: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
