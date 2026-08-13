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
  User
} from 'lucide-react';

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
    openBecomeSellerModal
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo */}
        <div 
          id="nav-logo"
          onClick={() => setViewMode('feed')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-all relative">
            <Wallet className="w-5 h-5 relative z-10" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full ring-2 ring-white shadow-xs">
              <Tag className="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors block leading-none">
              Cepte<span className="text-rose-600">Moda</span>
            </span>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
              Giy • Sat • Yenile | Sıfır & 2. El
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Marka, ürün veya kategori ara (örn: Zara, Nike Dunk, Elbise)..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 text-xs rounded-full border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                id="clear-search-button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Satıcı Ol / Ürün Yükle Prominent Button */}
          {!currentUser.isSeller ? (
            <button
              id="nav-become-seller"
              onClick={openBecomeSellerModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white rounded-full text-xs font-black shadow-md shadow-rose-200 transition-all hover:scale-105 active:scale-95 shrink-0"
              title="Kendi mağazanı aç ve ürün sat"
            >
              <Store className="w-4 h-4" />
              <span>Satıcı Ol</span>
            </button>
          ) : (
            <button
              id="nav-sell-item-btn"
              onClick={() => setViewMode('sell')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full text-xs font-black shadow-md shadow-emerald-200 transition-all hover:scale-105 shrink-0"
              title="Yeni ürün ekle ve yayınla"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ürün Yükle</span>
            </button>
          )}

          {/* AI Assistant Button */}
          <button
            id="nav-ai-assistant"
            onClick={() => setViewMode('ai_assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs ${
              viewMode === 'ai_assistant'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="hidden lg:inline">Moda AI</span>
          </button>

          {/* Favorites */}
          <button
            id="nav-favorites"
            onClick={() => setViewMode('favorites')}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Favorilerim"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            id="nav-messages"
            onClick={() => setViewMode('chat')}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Mesajlar"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Orders */}
          <button
            id="nav-orders"
            onClick={() => setViewMode('orders')}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
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
            <div className="flex items-center gap-1.5 ml-1">
              <button
                id="nav-login-btn"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-600" />
                <span>Giriş Yap</span>
              </button>

              <button
                id="nav-register-btn"
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Üye Ol</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                id="nav-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all cursor-pointer"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
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
    </header>
  );
};
