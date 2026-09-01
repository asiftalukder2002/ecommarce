export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string;
  address?: string;
  role?: 'customer' | 'seller' | 'admin';
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'cash_on_delivery' | 'bkash' | 'nagad' | 'whatsapp';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  senderRole: 'user' | 'seller' | 'support';
  productId?: string;
  productName?: string;
  createdAt: string;
}

export interface Seller {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  password?: string;
  avatar?: string;
  bannerImage?: string;
  joinedDate: string;
  verified: boolean;
  rating?: number;
  description?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  category: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  images?: string[];
  description: string;
  badge?: 'NEW' | 'SALE' | 'HOT' | 'LIMITED';
  inStock: boolean;
  stockCount?: number;
  sellerId?: string;
  sellerName?: string;
  sellerPhone?: string;
  sellerWhatsApp?: string;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  colors?: { name: string; hex: string; available: boolean }[];
  storageOptions?: { label: string; subtext?: string; priceDelta: number }[];
  features?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Material symbol or lucide name
  count?: number;
  color?: string;
}

export interface CartItem {
  product: Product;
  selectedColor?: string;
  selectedStorage?: string;
  quantity: number;
  totalPrice: number;
}

export type ActiveTab = 'home' | 'categories' | 'search' | 'seller' | 'admin';
export type AdminSubView = 'dashboard' | 'add-product' | 'edit-product';
export type SellerSubView = 'dashboard' | 'add-product' | 'edit-product' | 'register' | 'login' | 'profile';

