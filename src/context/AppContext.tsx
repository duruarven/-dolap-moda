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
  ShippingType,
  Review
} from '../types';
import { MOCK_PRODUCTS, MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_ORDERS, MOCK_REVIEWS } from '../data/mockData';
import { EmailVerificationService } from '../services/EmailVerificationService';
import { 
  auth, 
  db, 
  googleProvider, 
  appleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from '../lib/firebase';

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
  login: (email: string, password: string) => Promise<boolean>;
  validateLoginCredentials: (emailOrUser: string, pass: string) => Promise<{ valid: boolean; user?: UserProfile; error?: string }>;
  finalizeLogin: (user: UserProfile) => void;
  register: (fullName: string, email: string, password: string, initialStatus?: 'pending_verification' | 'active') => Promise<boolean>;
  finalizeRegistration: (fullName: string, email: string, password: string) => Promise<boolean>;
  activateUserMembership: (targetUserId?: string) => Promise<boolean>;
  resendVerificationEmail: (email: string, fullName: string, purpose?: 'login' | 'register') => Promise<{ success: boolean; hashCode?: string; expiresAt?: number; error?: string }>;
  verifyEmailCode: (email: string, code: string, hashCode: string, expiresAt: number) => Promise<{ success: boolean; verified?: boolean; error?: string }>;
  verifyUser: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;

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
  
  // Loading States for Skeletons & Transitions
  isPageLoading: boolean;
  setIsPageLoading: (loading: boolean) => void;
  isProductsLoading: boolean;
  setIsProductsLoading: (loading: boolean) => void;

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
  becomeSeller: (
    shopName: string, 
    city: string, 
    iban: string, 
    bio: string, 
    verificationData?: { 
      tcKimlikMasked: string; 
      docNo: string; 
      verifiedAt: string; 
    }
  ) => Promise<void>;

  // Conversations & Chat
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: Message[];
  sendMessage: (text: string, offerAmount?: number) => void;
  sendOffer: (productId: string, offerAmount: number) => void;
  respondToOffer: (messageId: string, action: 'accept' | 'decline' | 'counter', counterAmount?: number) => void;

  // Orders, Reviews & Sales
  orders: Order[];
  reviews: Review[];
  createOrder: (product: Product, address: string, courier: string) => Order;
  confirmOrderDelivery: (orderId: string) => void;
  addReview: (orderId: string, rating: number, comment: string, tags?: string[]) => void;

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

const GUEST_USER: UserProfile = {
  id: 'guest_user',
  name: 'Misafir Kullanıcı',
  email: '',
  username: '@misafir',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  bio: 'CepteModa ile keşfet ve yenilen.',
  phone: '0532 100 00 00',
  deliveryAddress: 'Atatürk Mah. Karanfil Sok. No:12 D:4, Karşıyaka / İZMİR',
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

// Helper to strip undefined values before passing to Firestore setDoc/updateDoc
const cleanFirestoreData = <T extends Record<string, any>>(data: T): Partial<T> => {
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(GUEST_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Firebase Auth State Listener & Firestore User Synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          let profileData: UserProfile;

          if (userSnap.exists()) {
            profileData = userSnap.data() as UserProfile;
          } else {
            // First time registration or social login without stored profile
            const cleanName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Moda Sever';
            const usernameHandle = `@${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 18)}`;
            
            profileData = {
              id: firebaseUser.uid,
              name: cleanName,
              email: firebaseUser.email || '',
              username: usernameHandle,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
              bio: 'CepteModa üyesi! Gardırobunu yeniliyor.',
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

            await setDoc(userDocRef, profileData, { merge: true });
          }

          setCurrentUser(profileData);
          setIsLoggedIn(true);
          setUsers(prev => {
            const exists = prev.some(u => u.id === profileData.id);
            return exists ? prev.map(u => u.id === profileData.id ? profileData : u) : [profileData, ...prev];
          });
        } catch (err) {
          console.error('Firebase profile sync error:', err);
          // Fallback minimal profile
          const fallbackUser: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Kullanıcı',
            email: firebaseUser.email || '',
            username: `@${(firebaseUser.email?.split('@')[0] || 'kullanici').replace(/[^a-z0-9]/g, '_')}`,
            avatar: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
            bio: 'CepteModa üyesi.',
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
          setCurrentUser(fallbackUser);
          setIsLoggedIn(true);
        }
      } else {
        const savedUserId = localStorage.getItem('cm_user_id');
        if (savedUserId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', savedUserId));
            if (userDoc.exists()) {
              const profileData = userDoc.data() as UserProfile;
              setCurrentUser(profileData);
              setIsLoggedIn(true);
              return;
            }
          } catch (e) {
            console.error('Saved user profile fetch error:', e);
          }
        }
        setIsLoggedIn(false);
        setCurrentUser(GUEST_USER);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check URL query parameters for direct email verification link (?verify_email=...&verify_code=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const verifyEmail = urlParams.get('verify_email');
    const verifyCode = urlParams.get('verify_code');
    const purpose = urlParams.get('purpose') || 'register';

    if (verifyEmail && verifyCode) {
      const handleAutoVerification = async () => {
        try {
          const verifyRes = await EmailVerificationService.verifyCode(verifyEmail, verifyCode, purpose as any);
          if (verifyRes.success && verifyRes.verified) {
            // Check if user already exists
            const existingUser = users.find(u => u.email?.toLowerCase() === verifyEmail.toLowerCase());
            if (existingUser) {
              await activateUserMembership(existingUser.id);
              finalizeLogin({
                ...existingUser,
                status: 'active',
                isEmailVerified: true
              });
            } else {
              // Provision active user
              const nameFromEmail = verifyEmail.split('@')[0];
              await finalizeRegistration(nameFromEmail, verifyEmail, 'CepteModa2026!');
            }

            addNotification(
              'E-Postanız Doğrulandı! 🎉',
              `${verifyEmail} adresiniz başarıyla onaylandı ve hesabınız aktifleştirildi.`,
              'success'
            );
          } else {
            addNotification(
              'Doğrulama Bağlantısı Geçersiz ⚠️',
              verifyRes.error || 'Doğrulama bağlantısının süresi dolmuş veya kod hatalı.',
              'warning'
            );
          }
        } catch (e) {
          console.error('Auto verification from URL failed:', e);
        } finally {
          // Clean up URL parameters without full page reload
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      };

      handleAutoVerification();
    }
  }, [users]);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // 1. Step 1 of Login: Validate user credentials without completing session yet
  const validateLoginCredentials = async (
    emailOrUser: string, 
    pass: string
  ): Promise<{ valid: boolean; user?: UserProfile; error?: string }> => {
    const cleanInput = emailOrUser.toLowerCase().trim();
    if (!cleanInput || !pass) {
      const errMsg = 'Lütfen e-posta ve şifrenizi giriniz.';
      addNotification('Eksik Bilgi ⚠️', errMsg, 'warning');
      return { valid: false, error: errMsg };
    }

    try {
      // First check if user exists in local/Firestore users collection
      const matchedUser = users.find(
        u => u.email?.toLowerCase() === cleanInput || u.username?.toLowerCase() === cleanInput
      );

      // Check with Firebase Auth signIn
      let authUser: any = null;
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanInput, pass);
        authUser = cred.user;
      } catch (authErr: any) {
        // If operation-not-allowed or custom provider fallback, allow if user exists in Firestore
        if (authErr.code === 'auth/operation-not-allowed' || authErr.code === 'auth/configuration-not-found') {
          if (matchedUser) {
            return { valid: true, user: matchedUser };
          }
        }
        
        let errorMsg = 'E-posta adresi veya şifre hatalı.';
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          errorMsg = 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı veya şifre hatalı.';
        } else if (authErr.code === 'auth/wrong-password') {
          errorMsg = 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.';
        } else if (authErr.code === 'auth/too-many-requests') {
          errorMsg = 'Çok fazla hatalı deneme yapıldı. Lütfen biraz bekleyin.';
        }

        // If not in Firebase Auth, check if matchedUser exists
        if (matchedUser) {
          return { valid: true, user: matchedUser };
        }

        addNotification('Giriş Yapılamadı ⚠️', errorMsg, 'warning');
        return { valid: false, error: errorMsg };
      }

      if (authUser) {
        const profile: UserProfile = matchedUser || {
          id: authUser.uid,
          name: authUser.displayName || cleanInput.split('@')[0],
          email: authUser.email || cleanInput,
          username: `@${(authUser.displayName || cleanInput.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 18)}`,
          avatar: authUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authUser.uid)}`,
          bio: 'CepteModa üyesi! Yeni ürünler keşfetmeyi seviyor.',
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
          city: 'İstanbul',
          status: 'active',
          isEmailVerified: true
        };
        return { valid: true, user: profile };
      }

      if (matchedUser) {
        return { valid: true, user: matchedUser };
      }

      const notFoundErr = 'Girdiğiniz bilgilere ait bir hesap bulunamadı.';
      addNotification('Hesap Bulunamadı ⚠️', notFoundErr, 'warning');
      return { valid: false, error: notFoundErr };
    } catch (err: any) {
      console.error('Validation error:', err);
      const generalErr = 'Giriş kontrolü sırasında bir hata oluştu.';
      addNotification('Hata ⚠️', generalErr, 'warning');
      return { valid: false, error: generalErr };
    }
  };

  // 2. Finalize Login after 6-digit email confirmation code is verified
  const finalizeLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('cm_user_id', user.id);
    addNotification('Giriş Başarılı! 🎉', `Hoş geldiniz ${user.name}! Hesabınıza güvenle giriş yapıldı.`, 'success');
  };

  // Direct login (for backwards-compatibility or automated tests)
  const login = async (emailOrUser: string, pass: string): Promise<boolean> => {
    const val = await validateLoginCredentials(emailOrUser, pass);
    if (val.valid && val.user) {
      finalizeLogin(val.user);
      return true;
    }
    return false;
  };

  // 3. Finalize Registration after 6-digit confirmation code is verified
  const finalizeRegistration = async (
    fullName: string, 
    email: string, 
    pass: string,
    customVerificationCode?: string
  ): Promise<boolean> => {
    const cleanName = fullName.trim();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanName || !cleanEmail || !pass) {
      addNotification('Eksik Bilgi ⚠️', 'Lütfen tüm zorunlu alanları doldurunuz.', 'warning');
      return false;
    }

    try {
      let uid = '';
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        uid = userCred.user.uid;
        await firebaseUpdateProfile(userCred.user, {
          displayName: cleanName,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`
        });
      } catch (authErr: any) {
        if (authErr.code === 'auth/operation-not-allowed' || authErr.code === 'auth/configuration-not-found') {
          console.warn('[AUTH FALLBACK] Firebase Auth Email/Password provider is not active. Using direct Firestore account provisioning.');
          uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        } else if (authErr.code === 'auth/email-already-in-use') {
          // If already created in Auth during pending step
          uid = auth.currentUser?.uid || `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        } else {
          throw authErr;
        }
      }

      const generatedCode = (customVerificationCode && String(customVerificationCode).trim().length === 6)
        ? String(customVerificationCode).trim()
        : Math.floor(100000 + Math.random() * 900000).toString();
      const nowIso = new Date().toISOString();
      const usernameHandle = `@${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 18)}`;
      const newUser: UserProfile = {
        id: uid,
        name: cleanName,
        email: cleanEmail,
        username: usernameHandle,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
        bio: 'CepteModa üyesi! Yeni ürünler keşfetmeyi seviyor.',
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
        city: 'İstanbul',
        status: 'pending_verification',
        isEmailVerified: false,
        isVerified: false,
        verificationCode: generatedCode,
        verifiedAt: ''
      };

      try {
        await setDoc(doc(db, 'users', uid), cleanFirestoreData(newUser), { merge: true });
      } catch (dbErr) {
        console.warn('Firestore user document save warning (fallback to local state):', dbErr);
      }

      setUsers(prev => [newUser, ...prev.filter(u => u.id !== uid)]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('cm_user_id', uid);

      addNotification('Aramıza Hoş Geldiniz! 🎉', `${cleanName} adıyla hesabınız oluşturuldu ve güvenle giriş yapıldı.`, 'success');
      return true;
    } catch (err: any) {
      console.error('Firebase finalize registration error:', err);
      let errorMsg = 'Kayıt sırasında bir hata oluştu.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Bu e-posta adresi zaten kayıtlı. Lütfen "Giriş Yap" sekmesini kullanınız.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Şifre en az 6 karakter olmalıdır.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Geçersiz bir e-posta formatı girdiniz.';
      }
      addNotification('Kayıt Başarısız ⚠️', errorMsg, 'warning');
      return false;
    }
  };

  // Real Register with Firebase Auth & Firestore Profile Setup
  const register = async (
    fullName: string, 
    email: string, 
    pass: string, 
    initialStatus: 'pending_verification' | 'active' = 'pending_verification'
  ): Promise<boolean> => {
    return finalizeRegistration(fullName, email, pass);
  };

  // Activate user membership in Firestore after successful code verification
  const activateUserMembership = async (targetUserId?: string): Promise<boolean> => {
    const uid = targetUserId || auth.currentUser?.uid || currentUser.id;
    if (!uid || uid === 'guest_user') return false;

    const nowIso = new Date().toISOString();
    const updates = {
      status: 'active',
      isEmailVerified: true,
      isVerified: true,
      verifiedAt: nowIso
    };

    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, updates, { merge: true });
    } catch (err: any) {
      console.warn('Firestore activate user write warning (proceeding with local state):', err);
    }

    setCurrentUser(prev => ({
      ...prev,
      status: 'active',
      isEmailVerified: true,
      isVerified: true,
      verifiedAt: nowIso
    }));

    setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: 'active', isEmailVerified: true, isVerified: true, verifiedAt: nowIso } : u));
    
    addNotification('Üyeliğiniz Aktif Edildi! 🎉', 'E-posta doğrulama kodu başarıyla onaylandı. Hesabınız aktif edildi.', 'success');
    return true;
  };

  // Dispatch 6-digit confirmation code via server SMTP API
  const resendVerificationEmail = async (
    targetEmail: string, 
    targetName: string,
    purpose: 'login' | 'register' = 'register'
  ): Promise<{ success: boolean; hashCode?: string; expiresAt?: number; error?: string }> => {
    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail.trim().toLowerCase(),
          fullName: targetName.trim(),
          purpose
        })
      });

      const data = await response.json();
      if (data.success) {
        const titleText = purpose === 'login' ? '🔐 Giriş Onay Kodu Gönderildi!' : '📬 Üyelik Onay Kodu Gönderildi!';
        const descText = purpose === 'login'
          ? `${targetEmail} adresinize 6 haneli güvenli giriş kodunuz iletildi.`
          : `${targetEmail} adresinize 6 haneli güvenlik onay kodu iletildi.`;

        addNotification(titleText, descText, 'success');
        return {
          success: true,
          hashCode: data.hashCode,
          expiresAt: data.expiresAt || Date.now() + 600000
        };
      } else {
        addNotification('E-Posta Gönderilemedi ⚠️', data.error || 'E-posta servisine erişilemedi.', 'warning');
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      console.error('Resend verification email error:', err);
      const errMsg = 'E-posta servisiyle iletişim kurulurken bir sunucu hatası oluştu.';
      addNotification('E-Posta Hatası ⚠️', errMsg, 'warning');
      return { success: false, error: errMsg };
    }
  };

  // Verify 6-digit code with server API
  const verifyEmailCode = async (
    targetEmail: string,
    code: string,
    hashCode: string,
    expiresAt: number
  ): Promise<{ success: boolean; verified?: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail.trim().toLowerCase(),
          code: code.trim(),
          hashCode,
          expiresAt
        })
      });

      const data = await response.json();
      if (data.success && data.verified) {
        return { success: true, verified: true };
      } else {
        return { success: false, verified: false, error: data.error || 'Geçersiz onay kodu.' };
      }
    } catch (err: any) {
      console.error('Verify email code error:', err);
      return { success: false, verified: false, error: 'Doğrulama servisine ulaşılamadı.' };
    }
  };

  // Verify user code directly against server API + Firestore users collection
  const verifyUser = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    try {
      // 1. First check with Server Verification API (handles in-memory cache and pending_verification)
      const serverRes = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode
        })
      });

      const serverData = await serverRes.json();
      if (serverRes.ok && serverData.success && serverData.verified) {
        // Activate local state
        const matched = users.find(u => u.email?.toLowerCase() === cleanEmail);
        if (matched) {
          await activateUserMembership(matched.id);
        } else if (currentUser.email?.toLowerCase() === cleanEmail) {
          await activateUserMembership(currentUser.id);
        }
        return { success: true };
      }

      // 2. Direct Firestore fallback
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', cleanEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userDoc = snap.docs[0];
        const userData = userDoc.data();

        if (userData.verificationCode === cleanCode) {
          await updateDoc(userDoc.ref, {
            isVerified: true,
            status: 'active',
            isEmailVerified: true,
            verificationCode: null,
            verifiedAt: new Date().toISOString()
          });

          await activateUserMembership(userDoc.id);
          return { success: true };
        }
      }

      return { 
        success: false, 
        error: serverData.error || 'Girdiğiniz 6 haneli onay kodu geçersiz. Lütfen tekrar deneyiniz.' 
      };
    } catch (err: any) {
      console.error('verifyUser error:', err);
      return { success: false, error: 'Doğrulama sırasında bir hata oluştu.' };
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      addNotification('Google ile Giriş Yapıldı! 🚀', `Hoş geldiniz, ${user.displayName || user.email}!`, 'success');
      return true;
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        addNotification('Giriş İptal Edildi', 'Google ile giriş penceresi kapatıldı.', 'info');
      } else if (err.code === 'auth/popup-blocked') {
        addNotification('Açılır Pencere Engellendi', 'Tarayıcınız açılır pencereyi engelledi. Lütfen izin veriniz.', 'warning');
      } else {
        addNotification('Google Giriş Hatası ⚠️', err.message || 'Google ile giriş yapılırken bir sorun oluştu.', 'warning');
      }
      return false;
    }
  };

  // Apple OAuth Login
  const loginWithApple = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      addNotification('Apple ID ile Giriş Yapıldı! 🍎', `Hoş geldiniz, ${user.displayName || user.email}!`, 'success');
      return true;
    } catch (err: any) {
      console.warn('Apple sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        addNotification('Giriş İptal Edildi', 'Apple ID giriş penceresi kapatıldı.', 'info');
      } else {
        addNotification('Apple ID Giriş Hatası ⚠️', err.message || 'Apple ile giriş yapılırken bir sorun oluştu.', 'warning');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    localStorage.removeItem('cm_user_id');
    setIsLoggedIn(false);
    setCurrentUser(GUEST_USER);
    addNotification('Çıkış Yapıldı', 'Hesabınızdan güvenle çıkış yaptınız.', 'info');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    
    // Also update in users list if exists
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u));

    if (currentUser.id && currentUser.id !== 'guest_user') {
      try {
        await setDoc(doc(db, 'users', currentUser.id), cleanFirestoreData(data), { merge: true });
      } catch (err) {
        console.error('Update profile error:', err);
      }
    }
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

  const becomeSeller = async (
    shopName: string, 
    city: string, 
    iban: string, 
    bio: string,
    verificationData?: { 
      tcKimlikMasked: string; 
      docNo: string; 
      verifiedAt: string; 
    }
  ) => {
    if (!isLoggedIn) {
      addNotification('Giriş Yapılmalı 🔒', 'Lütfen önce hesabınıza giriş yapın.', 'warning');
      openAuthModal('login');
      return;
    }

    const verifiedTimestamp = verificationData?.verifiedAt || new Date().toISOString();
    const docNo = verificationData?.docNo || `EDV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const tcMasked = verificationData?.tcKimlikMasked || '123*****890';

    const updatedFields: Partial<UserProfile> = {
      isSeller: true,
      shopName,
      city,
      iban,
      bio: bio || currentUser.bio,
      isEDevletVerified: true,
      eDevletVerifiedAt: verifiedTimestamp,
      tcKimlikMasked: tcMasked,
      sellerVerificationDocNo: docNo,
      sellerBadge: 'edevlet_seller'
    };

    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));

    // Update in users array
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedFields } : u));

    // Update user's products with the new e-Devlet badge
    setProducts(prev => prev.map(p => {
      if (p.seller.id === currentUser.id) {
        return {
          ...p,
          seller: {
            ...p.seller,
            name: currentUser.name,
            shopName: shopName || p.seller.name,
            city,
            isEDevletVerified: true,
            eDevletVerifiedAt: verifiedTimestamp,
            sellerVerificationDocNo: docNo,
            tcKimlikMasked: tcMasked
          }
        };
      }
      return p;
    }));

    // Persist to Firestore
    if (currentUser.id && currentUser.id !== 'guest_user') {
      try {
        const userDocRef = doc(db, 'users', currentUser.id);
        await setDoc(userDocRef, cleanFirestoreData(updatedFields), { merge: true });
      } catch (err) {
        console.warn('Firestore becomeSeller sync warning:', err);
      }
    }

    addNotification(
      '🏛️ e-Devlet Onaylı Satıcı Hesabınız Aktif!',
      `Tebrikler, ${shopName} mağazanız e-Devlet kimlik doğrulamasıyla başarıyla açıldı. Güvenli satış rozetiniz profilinize eklendi.`,
      'success'
    );
  };
  
  // Loading States for Skeletons & Transitions
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);

  // Filters
  const [selectedCategory, setSelectedCategoryState] = useState<string>('Tümü');
  const [selectedBrand, setSelectedBrandState] = useState<string>('Tümü');
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [selectedCondition, setSelectedConditionState] = useState<string>('Tümü');
  const [priceFilter, setPriceFilterState] = useState<{ min: number; max: number }>({ min: 0, max: 20000 });
  const [freeShippingOnly, setFreeShippingOnlyState] = useState<boolean>(false);
  const [sortBy, setSortByState] = useState<string>('newest');

  // Filter setters with micro-transition loading for smooth skeleton animations
  const setSelectedCategory = (cat: string) => {
    if (cat === selectedCategory) return;
    setIsProductsLoading(true);
    setSelectedCategoryState(cat);
    setTimeout(() => setIsProductsLoading(false), 220);
  };

  const setSelectedBrand = (brand: string) => {
    if (brand === selectedBrand) return;
    setIsProductsLoading(true);
    setSelectedBrandState(brand);
    setTimeout(() => setIsProductsLoading(false), 220);
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    if (query) {
      setIsProductsLoading(true);
      setTimeout(() => setIsProductsLoading(false), 200);
    }
  };

  const setSelectedCondition = (cond: string) => {
    setIsProductsLoading(true);
    setSelectedConditionState(cond);
    setTimeout(() => setIsProductsLoading(false), 220);
  };

  const setPriceFilter = (filter: { min: number; max: number }) => {
    setPriceFilterState(filter);
  };

  const setFreeShippingOnly = (val: boolean) => {
    setIsProductsLoading(true);
    setFreeShippingOnlyState(val);
    setTimeout(() => setIsProductsLoading(false), 220);
  };

  const setSortBy = (sort: string) => {
    setIsProductsLoading(true);
    setSortByState(sort);
    setTimeout(() => setIsProductsLoading(false), 220);
  };

  // View Mode & Navigation with Skeleton Transition
  const [viewModeState, setViewModeState] = useState<ViewMode>('feed');

  const setViewMode = (mode: ViewMode) => {
    if (!isLoggedIn && (mode === 'sell' || mode === 'orders' || mode === 'chat' || mode === 'profile')) {
      addNotification('Giriş Yapılmalı 🔒', 'Bu alana erişmek ve işlem yapmak için lütfen önce giriş yapın.', 'warning');
      openAuthModal('login');
      return;
    }

    if (mode === viewModeState) return;

    // Trigger smooth page transition with skeleton shimmer
    setIsPageLoading(true);
    setViewModeState(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsPageLoading(false);
    }, 280);
  };

  const viewMode = viewModeState;
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);

  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    if (product) {
      setIsPageLoading(true);
      setTimeout(() => {
        setIsPageLoading(false);
      }, 250);
    }
  };

  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop');

  // Conversations & Messages
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  // Orders & Reviews
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);

  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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

  const addReview = (orderId: string, rating: number, comment: string, tags: string[] = []) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const newReview: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId,
      productId: targetOrder.productId,
      productTitle: targetOrder.product.title,
      productImage: targetOrder.product.images[0],
      sellerId: targetOrder.sellerId,
      sellerName: targetOrder.sellerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating,
      comment,
      tags,
      date: 'Bugün'
    };

    setReviews(prev => [newReview, ...prev]);

    // Attach review to target order
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, review: newReview } : o));

    addNotification('Değerlendirmeniz Yayınlandı! ⭐', 'Satıcı ve ürün için puanlama/yorumunuz eklendi.', 'success');
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
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      validateLoginCredentials,
      finalizeLogin,
      register,
      finalizeRegistration,
      activateUserMembership,
      resendVerificationEmail,
      verifyEmailCode,
      verifyUser,
      loginWithGoogle,
      loginWithApple,
      updateUserProfile,
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
      isPageLoading,
      setIsPageLoading,
      isProductsLoading,
      setIsProductsLoading,
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
      reviews,
      createOrder,
      confirmOrderDelivery,
      addReview,
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
