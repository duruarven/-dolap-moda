import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_REVIEWS } from '../data/mockData';
import { 
  User, 
  Wallet, 
  Star, 
  Zap, 
  ShoppingBag, 
  Heart, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight, 
  Settings,
  Tag,
  Plus
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    products, 
    favorites, 
    toggleFavorite, 
    setSelectedProduct, 
    setViewMode, 
    withdrawWalletBalance,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'sold' | 'favorites' | 'reviews'>('listings');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(currentUser.walletBalance);

  const myProducts = products.filter(p => p.seller.id === currentUser.id);
  const myActiveListings = myProducts.filter(p => p.status === 'active');
  const myFavoritesList = products.filter(p => favorites.includes(p.id));

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;
    withdrawWalletBalance(withdrawAmount);
    setShowWithdrawModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 relative">
          {currentUser.isSuperSeller && (
            <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-slate-950" /> SÜPER SATICI
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>{currentUser.name}</span>
                <CheckCircle2 className="w-4 h-4 text-rose-500 fill-rose-100" />
              </h1>
              <p className="text-xs text-slate-500 font-semibold">{currentUser.username}</p>
              <p className="text-xs text-slate-600 max-w-md">{currentUser.bio}</p>
            </div>
          </div>

          {/* Sell New Item Shortcut */}
          <button
            id="profile-sell-new-btn"
            onClick={() => setViewMode('sell')}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-200 hover:from-rose-700 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ürün Yükle</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 border-t border-slate-100 bg-slate-50/50 text-center py-3 text-xs">
          <div>
            <span className="block font-black text-slate-900 text-sm">⭐ {currentUser.rating}</span>
            <span className="text-[10px] text-slate-400">Dolap Puanı</span>
          </div>
          <div className="border-l border-slate-200">
            <span className="block font-black text-slate-900 text-sm">{currentUser.totalSales}</span>
            <span className="text-[10px] text-slate-400">Başarılı Satış</span>
          </div>
          <div className="border-l border-slate-200">
            <span className="block font-black text-slate-900 text-sm">{currentUser.followersCount}</span>
            <span className="text-[10px] text-slate-400">Takipçi</span>
          </div>
          <div className="border-l border-slate-200">
            <span className="block font-black text-slate-900 text-sm">{currentUser.activeListingsCount}</span>
            <span className="text-[10px] text-slate-400">Yayındaki İlan</span>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dolap Bakiyem</div>
            <div className="text-2xl font-black text-emerald-400">
              ₺{currentUser.walletBalance.toLocaleString('tr-TR')}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Bekleyen Bakiye: <span className="text-amber-300 font-bold">₺{currentUser.pendingBalance.toLocaleString('tr-TR')}</span> (Kargo Onayında Aktarılır)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="withdraw-balance-btn"
            onClick={() => {
              setWithdrawAmount(currentUser.walletBalance);
              setShowWithdrawModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-4 h-4" />
            <span>IBAN'a Aktar</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-600 overflow-x-auto">
        <button
          id="tab-my-listings"
          onClick={() => setActiveTab('listings')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'listings' ? 'border-rose-600 text-rose-600 font-extrabold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Yayındaki İlanlarım ({myActiveListings.length})
        </button>

        <button
          id="tab-my-favorites"
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'favorites' ? 'border-rose-600 text-rose-600 font-extrabold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Favorilerim ({myFavoritesList.length})
        </button>

        <button
          id="tab-my-reviews"
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'reviews' ? 'border-rose-600 text-rose-600 font-extrabold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Değerlendirmeler ({MOCK_REVIEWS.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {myActiveListings.map(product => (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setViewMode('product_detail');
              }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs cursor-pointer group hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-slate-100 overflow-hidden relative">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  ₺{product.price}
                </span>
              </div>
              <div className="p-2.5 space-y-1">
                <h4 className="text-xs font-bold text-slate-800 truncate">{product.title}</h4>
                <div className="text-[10px] text-slate-400">{product.favoriteCount} favori</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {myFavoritesList.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Henüz favorilere eklenmiş bir ürün yok.
            </div>
          ) : (
            myFavoritesList.map(product => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setViewMode('product_detail');
                }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs cursor-pointer group"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-md"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
                <div className="p-2.5 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{product.title}</h4>
                  <div className="text-xs font-black text-rose-600">₺{product.price}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {MOCK_REVIEWS.map(rev => (
            <div key={rev.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={rev.buyerAvatar} alt={rev.buyerName} className="w-7 h-7 rounded-full object-cover" />
                  <span className="font-bold text-slate-800">{rev.buyerName}</span>
                </div>
                <span className="text-amber-500 font-bold">{"⭐".repeat(rev.rating)}</span>
              </div>
              <p className="text-slate-600">{rev.comment}</p>
              <div className="text-[10px] text-slate-400 italic">Satın alınan ürün: {rev.productTitle} • {rev.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* IBAN Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Bakiye Çek (IBAN Transferi)</span>
            </h3>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="text-slate-500 font-semibold">Tanımlı IBAN:</div>
              <div className="font-mono font-bold text-slate-800">{currentUser.iban}</div>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Çekilecek Tutar (TL)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  max={currentUser.walletBalance}
                  className="w-full p-2.5 bg-slate-50 text-sm font-black border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Transfer Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
