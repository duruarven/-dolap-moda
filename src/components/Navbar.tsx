import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Smartphone, 
  Monitor, 
  User, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  SlidersHorizontal,
  ChevronDown,
  Check,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    searchQuery, 
    setSearchQuery, 
    favorites, 
    conversations,
    deviceFrame, 
    setDeviceFrame,
    viewMode,
    setViewMode,
    orders
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Banner Bar for Device & User Simulation */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-medium text-[11px]">
            <ShieldCheck className="w-3 h-3 text-rose-400" /> %100 Alıcı & Satıcı Güvencesi
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300 font-medium">Dolap & Gardrops Tipi İkinci El Pazaryeri</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Device Frame Switcher */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              id="device-frame-ios"
              onClick={() => setDeviceFrame('mobile_ios')}
              title="iOS Görünümü"
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all text-[11px] font-medium ${
                deviceFrame === 'mobile_ios' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>iOS App</span>
            </button>
            <button
              id="device-frame-android"
              onClick={() => setDeviceFrame('mobile_android')}
              title="Android Görünümü"
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all text-[11px] font-medium ${
                deviceFrame === 'mobile_android' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Android</span>
            </button>
            <button
              id="device-frame-desktop"
              onClick={() => setDeviceFrame('desktop')}
              title="Masaüstü Görünümü"
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all text-[11px] font-medium ${
                deviceFrame === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden md:inline">Masaüstü</span>
            </button>
          </div>

          {/* User Persona Role Switcher */}
          <div className="relative">
            <button
              id="user-persona-dropdown-trigger"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors text-[11px] font-medium"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-4 h-4 rounded-full object-cover" />
              <span className="max-w-[100px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Test Rolünü Seçin
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    id={`switch-user-${u.id}`}
                    onClick={() => {
                      switchUser(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800 transition-colors text-left text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-slate-100 leading-tight">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.bio.substring(0, 24)}...</div>
                      </div>
                    </div>
                    {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo */}
        <div 
          id="nav-logo"
          onClick={() => setViewMode('feed')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent">
              Dolap<span className="text-slate-800 font-bold">Moda</span>
            </span>
            <span className="block text-[9px] font-semibold tracking-wider text-rose-500 uppercase leading-none">
              İkinci El Pazaryeri
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
              placeholder="Marka, ürün, dolap veya kategori ara (örn: Zara, Nike Dunk, Elbise)..."
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
            <span className="hidden sm:inline">Moda AI</span>
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

          {/* Profile / My Closet */}
          <button
            id="nav-profile"
            onClick={() => setViewMode('profile')}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all cursor-pointer"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[90px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
