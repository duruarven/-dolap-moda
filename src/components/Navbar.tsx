import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  PackageCheck, 
  Wallet, 
  Tag,
  Store,
  PlusCircle,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  Grid
} from 'lucide-react';

const CATEGORIES_NAV = [
  { id: 'Tümü', label: 'Tümü', icon: '✨' },
  { id: 'Kadın', label: 'Kadın', icon: '👗' },
  { id: 'Erkek', label: 'Erkek', icon: '👔' },
  { id: 'Çocuk', label: 'Çocuk', icon: '🧸' },
  { id: 'Aksesuar', label: 'Aksesuar', icon: '👓' },
  { id: 'Ayakkabı', label: 'Ayakkabı', icon: '👟' },
  { id: 'Çanta', label: 'Çanta', icon: '👜' },
  { id: 'Kozmetik', label: 'Kozmetik', icon: '💄' },
  { id: 'Ev & Yaşam', label: 'Ev & Yaşam', icon: '🏠' },
];

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isLoggedIn,
    openAuthModal,
    logout,
    searchQuery, 
    setSearchQuery, 
    favorites, 
    conversations,
    viewMode,
    setViewMode,
    orders,
    openBecomeSellerModal,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (viewMode !== 'feed') {
      setViewMode('feed');
    }
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 sm:hidden cursor-pointer"
            title="Kategori Menüsü"
          >
            {showMobileMenu ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            id="nav-logo"
            onClick={() => {
              setSelectedCategory('Tümü');
              setViewMode('feed');
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-all relative">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full ring-2 ring-white shadow-xs">
                <Tag className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors block leading-none">
                Cepte<span className="text-rose-600">Moda</span>
              </span>
              <span className="hidden sm:block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                Giy • Sat • Yenile | Sıfır & 2. El
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="flex-1 max-w-xl relative mx-1 sm:mx-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Marka, ürün veya kategori ara (örn: Zara, Elbise)..."
              className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 text-xs rounded-full border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                id="clear-search-button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Satıcı Ol / Ürün Yükle Prominent Button */}
          {!currentUser.isSeller ? (
            <button
              id="nav-become-seller"
              onClick={openBecomeSellerModal}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white rounded-full text-xs font-black shadow-md shadow-rose-200 transition-all hover:scale-105 active:scale-95 shrink-0"
              title="Kendi mağazanı aç ve ürün sat"
            >
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Satıcı Ol</span>
              <span className="sm:hidden">Sat</span>
            </button>
          ) : (
            <button
              id="nav-sell-item-btn"
              onClick={() => setViewMode('sell')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full text-xs font-black shadow-md shadow-emerald-200 transition-all hover:scale-105 shrink-0"
              title="Yeni ürün ekle ve yayınla"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Ürün Yükle</span>
              <span className="sm:hidden">Yükle</span>
            </button>
          )}

          {/* AI Assistant Button */}
          <button
            id="nav-ai-assistant"
            onClick={() => setViewMode('ai_assistant')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs ${
              viewMode === 'ai_assistant'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="hidden lg:inline">Moda AI</span>
          </button>

          {/* Favorites - Desktop only, since mobile has bottom nav */}
          <button
            id="nav-favorites"
            onClick={() => setViewMode('favorites')}
            className="hidden sm:block relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Favorilerim"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Messages - Desktop only */}
          <button
            id="nav-messages"
            onClick={() => setViewMode('chat')}
            className="hidden sm:block relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Mesajlar"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Orders - Desktop only */}
          <button
            id="nav-orders"
            onClick={() => setViewMode('orders')}
            className="hidden sm:block relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Siparişlerim / Satışlarım"
          >
            <PackageCheck className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* AUTH BUTTONS OR PROFILE */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-1">
              <button
                id="nav-login-btn"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-extrabold text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Giriş Yap</span>
              </button>

              <button
                id="nav-register-btn"
                onClick={() => openAuthModal('register')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Üye Ol</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                id="nav-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all cursor-pointer"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 sm:w-6 sm:h-6 rounded-full object-cover" />
                <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{currentUser.username}</p>
                  </div>

                  <button
                    onClick={() => {
                      setViewMode('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dolabım / Profilim</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation Bar - App Wide */}
      <nav id="category-navigation-menu" className="border-t border-slate-100 bg-slate-50/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1.5 text-xs">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-max px-1">
              {CATEGORIES_NAV.map((cat) => {
                const isActive = selectedCategory === cat.id && viewMode === 'feed';
                return (
                  <button
                    key={cat.id}
                    id={`nav-category-${cat.id}`}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs shadow-rose-200'
                        : 'text-slate-700 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Category Drawer Menu Modal */}
      {showMobileMenu && (
        <div className="sm:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-start animate-in fade-in duration-200">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-rose-600" />
                <span className="font-black text-slate-900 text-sm">Kategoriler</span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-1 flex-1">
              {CATEGORIES_NAV.map((cat) => {
                const isActive = selectedCategory === cat.id && viewMode === 'feed';
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setViewMode('ai_assistant');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Moda AI Danışmanı</span>
              </button>

              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl text-xs font-black bg-slate-900 text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Giriş Yap / Üye Ol</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

