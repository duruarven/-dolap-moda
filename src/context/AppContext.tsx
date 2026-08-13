import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  UserProfile, 
  Conversation, 
  Message, 
  Order, 
  ViewMode, 
  DeviceFrame,
  ProductCondition,
  ShippingType
} from '../types';
import { MOCK_PRODUCTS, MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_ORDERS } from '../data/mockData';

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  switchUser: (userId: string) => void;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authInitialMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => void;
  register: (fullName: string, email: string, password: string) => void;
  logout: () => void;

  // Legal Modal
  isLegalModalOpen: boolean;
  legalActiveTab: 'terms' | 'privacy' | 'kvkk';
  openLegalModal: (tab?: 'terms' | 'privacy' | 'kvkk') => void;
  closeLegalModal: () => void;

  products: Product[];
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  priceFilter: { min: number; max: number };
  setPriceFilter: (filter: { min: number; max: number }) => void;
  freeShippingOnly: boolean;
  setFreeShippingOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  
  // Navigation & View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  deviceFrame: DeviceFrame;
  setDeviceFrame: (frame: DeviceFrame) => void;

  // Seller Management
  isBecomeSellerModalOpen: boolean;
  openBecomeSellerModal: () => void;
  closeBecomeSellerModal: () => void;
  becomeSeller: (shopName: string, city: string, iban: string, bio: string) => void;

  // Conversations & Chat
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: Message[];
  sendMessage: (text: string, offerAmount?: number) => void;
  sendOffer: (productId: string, offerAmount: number) => void;
  respondToOffer: (messageId: string, action: 'accept' | 'decline' | 'counter', counterAmount?: number) => void;

  // Orders & Sales
  orders: Order[];
  createOrder: (product: Product, address: string, courier: string) => Order;
  confirmOrderDelivery: (orderId: string) => void;

  // Product Actions
  addProduct: (productData: Omit<Product, 'id' | 'seller' | 'createdAt' | 'favoriteCount' | 'likesCount' | 'commentsCount' | 'status'>) => void;
  withdrawWalletBalance: (amount: number) => void;

  // AI & Toasts
  notifications: NotificationToast[];
  addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
  resetFilters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<UserProfile[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Requires login before publishing or seller actions
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (email: string, pass: string) => {
    const matchedUser = users.find(u => u.username.toLowerCase().includes(email.split('@')[0].toLowerCase())) || MOCK_USERS[0];
    setCurrentUser(matchedUser);
    setIsLoggedIn(true);
    addNotification('Hoş Geldiniz! 👋', `${matchedUser.name} hesabınıza başarıyla giriş yapıldı.`, 'success');
  };

  const register = (fullName: string, email: string, pass: string) => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: fullName,
      username: `@${fullName.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      bio: 'CepteModa yeni üyesi!',
      rating: 5.0,
      totalSales: 0,
      activeListingsCount: 0,
      followersCount: 0,
      followingCount: 0,
      walletBalance: 0,
      pendingBalance: 0,
      iban: '',
      isSuperSeller: false,
      isSeller: false,
      shopName: '',
      city: 'İstanbul'
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    addNotification('Aramıza Hoş Geldiniz! 🎉', 'Hesabınız başarıyla oluşturuldu.', 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    addNotification('Çıkış Yapıldı', 'Hesabınızdan güvenle çıkış yaptınız.', 'info');
  };

  // Legal Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalActiveTab, setLegalActiveTab] = useState<'terms' | 'privacy' | 'kvkk'>('terms');

  const openLegalModal = (tab: 'terms' | 'privacy' | 'kvkk' = 'terms') => {
    setLegalActiveTab(tab);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => setIsLegalModalOpen(false);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Seller Modal State
  const [isBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState<boolean>(false);

  const openBecomeSellerModal = () => {
    if (!isLoggedIn) {
      addNotification('Giriş Yapılmalı 🔒', 'Satıcı olmak ve mağaza açmak için lütfen önce giriş yapın.', 'warning');
      openAuthModal('login');
      return;
    }
    setIsBecomeSellerModalOpen(true);
  };
  const closeBecomeSellerModal = () => setIsBecomeSellerModalOpen(false);

  const becomeSeller = (shopName: string, city: string, iban: string, bio: string) => {
    if (!isLoggedIn) {
      addNotification('Giriş Yapılmalı 🔒', 'Lütfen önce hesabınıza giriş yapın.', 'warning');
      openAuthModal('login');
      return;
    }
    setCurrentUser(prev => ({
      ...prev,
      isSeller: true,
      shopName,
      city,
      iban,
      bio: bio || prev.bio
    }));
    addNotification('Satıcı Hesabı Aktifleştirildi! 🎉', `${shopName} mağazanız oluşturuldu. Artık ilan verip satış yapabilirsiniz.`, 'success');
  };
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedBrand, setSelectedBrand] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('Tümü');
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 20000 });
  const [freeShippingOnly, setFreeShippingOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  // View Mode & Navigation
  const [viewModeState, setViewModeState] = useState<ViewMode>('feed');

  const setViewMode = (mode: ViewMode) => {
    if (!isLoggedIn && (mode === 'sell' || mode === 'orders' || mode === 'chat' || mode === 'profile')) {
      addNotification('Giriş Yapılmalı 🔒', 'Bu alana erişmek ve işlem yapmak için lütfen önce giriş yapın.', 'warning');
      openAuthModal('login');
      return;
    }
    setViewModeState(mode);
  };

  const viewMode = viewModeState;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop');

  // Conversations & Messages
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  // Orders
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);

  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addNotification('Kullanıcı Değiştirildi', `Şu anki mod: ${target.name}`, 'info');
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      
      // Update favorite count on product
      setProducts(prods => prods.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            favoriteCount: exists ? p.favoriteCount - 1 : p.favoriteCount + 1
          };
        }
        return p;
      }));

      addNotification(
        exists ? 'Favorilerden Çıkarıldı' : 'Favorilere Eklendi 💖',
        exists ? 'Ürün favori halkanızdan çıkarıldı.' : 'Ürün favori listenize kaydedildi.',
        'success'
      );
      return updated;
    });
  };

  const resetFilters = () => {
    setSelectedCategory('Tümü');
    setSelectedBrand('Tümü');
    setSearchQuery('');
    setSelectedCondition('Tümü');
    setPriceFilter({ min: 0, max: 20000 });
    setFreeShippingOnly(false);
    setSortBy('newest');
  };

  // Chat & Offer Functions
  const sendMessage = (text: string, offerAmount?: number) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      offerAmount,
      offerStatus: offerAmount ? 'pending' : undefined,
      createdAt: 'Şimdi',
      type: offerAmount ? 'offer' : 'text'
    };

    setMessages(prev => [...prev, newMessage]);

    // Update last message in conversation
    setConversations(convs => convs.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: offerAmount ? `₺${offerAmount} teklifi gönderildi.` : text,
          lastMessageTime: 'Şimdi'
        };
      }
      return c;
    }));

    // Auto simulated response after 2 seconds if chatting with seller
    if (activeConversation.sellerId !== currentUser.id) {
      setTimeout(() => {
        const autoReply: Message = {
          id: `msg_${Date.now() + 1}`,
          conversationId: activeConversation.id,
          senderId: activeConversation.sellerId,
          senderName: activeConversation.sellerName,
          text: offerAmount 
            ? `Teklifinizi gördüm, düşüneceğim! Kargo durumuna göre yardımcı olmaya çalışırım 💕`
            : `Mesajınız için teşekkürler! Ürün hâlâ satıştadır, kargoya yarın verebilirim.`,
          createdAt: 'Şimdi',
          type: 'text'
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1500);
    }
  };

  const sendOffer = (productId: string, offerAmount: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    // Find or create conversation
    let conv = conversations.find(c => c.productId === productId && c.buyerId === currentUser.id);
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        productId: prod.id,
        productTitle: prod.title,
        productImage: prod.images[0],
        productPrice: prod.price,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerAvatar: currentUser.avatar,
        sellerId: prod.seller.id,
        sellerName: prod.seller.name,
        sellerAvatar: prod.seller.avatar,
        lastMessage: `₺${offerAmount} teklifi gönderildi.`,
        lastMessageTime: 'Şimdi',
        unreadCount: 0
      };
      setConversations(prev => [conv!, ...prev]);
    }

    setActiveConversation(conv);
    setViewMode('chat');
    sendMessage(`Ürün için ₺${offerAmount} teklif yaptım.`, offerAmount);
    addNotification('Teklif Gönderildi 📩', `Satıcıya ₺${offerAmount} tutarında teklifiniz iletildi.`, 'success');
  };

  const respondToOffer = (messageId: string, action: 'accept' | 'decline' | 'counter', counterAmount?: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          offerStatus: action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'countered'
        };
      }
      return m;
    }));

    if (action === 'accept') {
      addNotification('Teklif Kabul Edildi! 🎉', 'Teklif onaylandı, hemen al butonundan satın alabilirsiniz.', 'success');
    } else if (action === 'decline') {
      addNotification('Teklif Reddedildi', 'Teklif uygun görülmedi.', 'info');
    }
  };

  // Create Order from Checkout
  const createOrder = (product: Product, address: string, courier: string): Order => {
    const serviceFee = 9;
    const shippingFee = product.shippingType === 'Kargo Bedava' ? 0 : 30;
    const totalPrice = product.price + serviceFee + shippingFee;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `DLP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      productId: product.id,
      product,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
      totalPrice,
      itemPrice: product.price,
      serviceFee,
      shippingFee,
      status: 'ordered',
      cargoCompany: courier,
      cargoCode: `${courier.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      deliveryAddress: address,
      trackingSteps: [
        { title: 'Sipariş Alındı', description: 'Ödeme DolapModa güvenli havuz hesabında tutuluyor.', date: 'Bugün', completed: true },
        { title: 'Hazırlanıyor', description: 'Satıcının kargolaması bekleniyor.', date: 'Bekleniyor', completed: false },
        { title: 'Kargoya Verildi', description: 'Kargo kuryesi teslim alacak.', date: '-', completed: false },
        { title: 'Teslim Alındı ve Onay', description: 'Ürün kontrolü sonrası onay.', date: '-', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Mark product as reserved / sold
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'reserved' } : p));

    addNotification('Sipariş Alındı! 🛍️', `${product.title} için siparişiniz başarıyla oluşturuldu.`, 'success');
    return newOrder;
  };

  const confirmOrderDelivery = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'completed',
          trackingSteps: o.trackingSteps.map(step => ({ ...step, completed: true }))
        };
      }
      return o;
    }));

    // Add money to seller balance
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      setCurrentUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + targetOrder.itemPrice * 0.9 // 10% platform fee
      }));
    }

    addNotification('Sipariş Onaylandı ✅', 'Ödeme satıcının cüzdanına aktarıldı. Teşekkür ederiz!', 'success');
  };

  const addProduct = (productData: Omit<Product, 'id' | 'seller' | 'createdAt' | 'favoriteCount' | 'likesCount' | 'commentsCount' | 'status'>) => {
    if (!isLoggedIn) {
      addNotification('Giriş Yapılmalı 🔒', 'Ürün yayınlamak için lütfen önce hesabınıza giriş yapın.', 'warning');
      openAuthModal('login');
      return;
    }

    if (!currentUser.isSeller) {
      addNotification('Satıcı Profil Gereklidir 🏪', 'Ürün yayınlamak için ücretsiz satıcı profilinizi aktifleştirin.', 'info');
      openBecomeSellerModal();
      return;
    }

    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        rating: currentUser.rating,
        salesCount: currentUser.totalSales,
        isSuperSeller: currentUser.isSuperSeller,
        responseRate: '%99 (15 dk)',
        city: 'İstanbul / Kadıköy',
        followersCount: currentUser.followersCount,
        followingCount: currentUser.followingCount,
        joinedDate: '2023',
        bio: currentUser.bio
      },
      createdAt: 'Az önce',
      favoriteCount: 0,
      likesCount: 0,
      commentsCount: 0,
      status: 'active'
    };

    setProducts(prev => [newProduct, ...prev]);
    // Increment active listings count
    setCurrentUser(prev => ({ ...prev, activeListingsCount: prev.activeListingsCount + 1 }));

    addNotification('Ürün Yayınlandı! 👗', 'Ürününüz DolapModa pazarında başarıyla sergileniyor.', 'success');
    setSelectedProduct(newProduct);
    setViewMode('product_detail');
  };

  const withdrawWalletBalance = (amount: number) => {
    if (amount > currentUser.walletBalance) {
      addNotification('Bakiye Yersiz', 'Çekmek istediğiniz tutar mevcut bakiyenizden fazla.', 'warning');
      return;
    }

    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount
    }));

    addNotification('Bakiye Aktarıldı 🏦', `₺${amount} tutarındaki bakiyeniz tanımlı IBAN hesabınıza transfer edildi.`, 'success');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      switchUser,
      isLoggedIn,
      isAuthModalOpen,
      authInitialMode,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      isLegalModalOpen,
      legalActiveTab,
      openLegalModal,
      closeLegalModal,
      products,
      favorites,
      toggleFavorite,
      selectedCategory,
      setSelectedCategory,
      selectedBrand,
      setSelectedBrand,
      searchQuery,
      setSearchQuery,
      selectedCondition,
      setSelectedCondition,
      priceFilter,
      setPriceFilter,
      freeShippingOnly,
      setFreeShippingOnly,
      sortBy,
      setSortBy,
      viewMode,
      setViewMode,
      selectedProduct,
      setSelectedProduct,
      deviceFrame,
      setDeviceFrame,
      isBecomeSellerModalOpen,
      openBecomeSellerModal,
      closeBecomeSellerModal,
      becomeSeller,
      conversations,
      activeConversation,
      setActiveConversation,
      messages,
      sendMessage,
      sendOffer,
      respondToOffer,
      orders,
      createOrder,
      confirmOrderDelivery,
      addProduct,
      withdrawWalletBalance,
      notifications,
      addNotification,
      removeNotification,
      resetFilters
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
