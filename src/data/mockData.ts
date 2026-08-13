import { Product, UserProfile, Conversation, Message, Order, Review } from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_main',
    name: 'Kullanıcı',
    username: '@kullanici_moda',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bio: 'İkinci el giyim ve aksesuar hesabı.',
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
  }
];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_CONVERSATIONS: Conversation[] = [];

export const MOCK_MESSAGES: Message[] = [];

export const MOCK_ORDERS: Order[] = [];

export const MOCK_REVIEWS: Review[] = [];
