import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Heart, 
  PlusCircle, 
  MessageSquare, 
  User,
  PackageCheck
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { viewMode, setViewMode, favorites, conversations, orders } = useApp();

  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div id="bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-4 shadow-lg sm:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Keşfet */}
        <button
          id="bottom-tab-feed"
          onClick={() => setViewMode('feed')}
          className={`flex flex-col items-center gap-0.5 p-1 flex-1 ${
            viewMode === 'feed' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Keşfet</span>
        </button>

        {/* Favoriler */}
        <button
          id="bottom-tab-favorites"
          onClick={() => setViewMode('favorites')}
          className={`relative flex flex-col items-center gap-0.5 p-1 flex-1 ${
            viewMode === 'favorites' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px]">Favoriler</span>
          {favorites.length > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        {/* Satış Yap (Center Highlighted Button) */}
        <button
          id="bottom-tab-sell"
          onClick={() => setViewMode('sell')}
          className="flex flex-col items-center justify-center -mt-5 mx-1"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-300 active:scale-95 transition-transform border-2 border-white">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-rose-600 mt-0.5">Satış Yap</span>
        </button>

        {/* Mesajlar */}
        <button
          id="bottom-tab-chat"
          onClick={() => setViewMode('chat')}
          className={`relative flex flex-col items-center gap-0.5 p-1 flex-1 ${
            viewMode === 'chat' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Mesajlar</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dolabım */}
        <button
          id="bottom-tab-profile"
          onClick={() => setViewMode('profile')}
          className={`flex flex-col items-center gap-0.5 p-1 flex-1 ${
            viewMode === 'profile' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Dolabım</span>
        </button>
      </div>
    </div>
  );
};
