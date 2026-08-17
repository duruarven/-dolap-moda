export type ViewMode = 
  | 'feed' 
  | 'product_detail' 
  | 'sell' 
  | 'chat' 
  | 'profile' 
  | 'orders' 
  | 'ai_assistant' 
  | 'favorites';

export type DeviceFrame = 'mobile_ios' | 'mobile_android' | 'desktop';

export type ProductCondition = 'Yeni & Etiketli' | 'Az Kullanılmış' | 'Makul Durumda';

export type ShippingType = 'Kargo Bedava' | 'Alıcı Öder' | '30 TL Sabit Kargo';

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  salesCount: number;
  isSuperSeller: boolean;
  isEDevletVerified?: boolean;
  eDevletVerifiedAt?: string;
  sellerVerificationDocNo?: string;
  tcKimlikMasked?: string;
  responseRate: string;
  city: string;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
  bio: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: 'Kadın' | 'Erkek' | 'Çocuk' | 'Lüks' | 'Ayakkabı' | 'Çanta' | 'Aksesuar' | 'Kozmetik' | 'Ev & Yaşam';
  subcategory: string;
  brand: string;
  size: string;
  condition: ProductCondition;
  images: string[];
  seller: Seller;
  createdAt: string;
  favoriteCount: number;
  likesCount: number;
  commentsCount: number;
  shippingType: ShippingType;
  status: 'active' | 'sold' | 'reserved';
  tags: string[];
  color: string;
}

export interface Offer {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterAmount?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined' | 'countered';
  createdAt: string;
  type: 'text' | 'offer' | 'system';
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  product: Product;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  totalPrice: number;
  itemPrice: number;
  serviceFee: number;
  shippingFee: number;
  status: 'ordered' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  cargoCompany: string;
  cargoCode: string;
  createdAt: string;
  deliveryAddress: string;
  trackingSteps: {
    title: string;
    description: string;
    date: string;
    completed: boolean;
  }[];
  review?: Review;
}

export interface Review {
  id: string;
  orderId?: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  sellerId?: string;
  sellerName?: string;
  buyerId?: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  tags?: string[];
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  username: string;
  avatar: string;
  bio: string;
  phone?: string;
  deliveryAddress?: string;
  rating: number;
  totalSales: number;
  activeListingsCount: number;
  followersCount: number;
  followingCount: number;
  walletBalance: number;
  pendingBalance: number;
  iban: string;
  isSuperSeller: boolean;
  isSeller: boolean;
  shopName?: string;
  city?: string;
  status?: 'pending_verification' | 'active' | 'suspended';
  isEmailVerified?: boolean;
  isVerified?: boolean;
  verificationCode?: string;
  verifiedAt?: string;
  isEDevletVerified?: boolean;
  eDevletVerifiedAt?: string;
  tcKimlikMasked?: string;
  sellerVerificationDocNo?: string;
  sellerBadge?: 'verified_seller' | 'edevlet_seller' | 'super_seller';
}
