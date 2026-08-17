import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EditProfileModal } from './EditProfileModal';
import { 
  User, 
  Wallet, 
  Zap, 
  CheckCircle2, 
  Building2, 
  Plus,
  Store,
  Sparkles,
  Heart,
  LogIn,
  UserPlus,
  Settings,
  Edit3,
  MapPin,
  Phone,
  ShieldCheck,
  Landmark,
  BadgeCheck,
  FileCheck
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    isLoggedIn,
    openAuthModal,
    products, 
    favorites, 
    toggleFavorite, 
    setSelectedProduct, 
    setViewMode, 
    withdrawWalletBalance,
    openBecomeSellerModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'reviews'>('listings');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
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

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-600 shadow-inner">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Hesabınıza Giriş Yapın</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dolabınızı yönetmek, siparişlerinizi takip etmek ve ilan vermek için giriş yapın veya hemen ücretsiz üye olun.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="flex-1 py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-black text-xs rounded-2xl shadow-md shadow-rose-200 flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Giriş Yap</span>
          </button>

          <button
            onClick={() => openAuthModal('register')}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Üye Ol</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 relative">
          {currentUser.isSeller && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {currentUser.isEDevletVerified ? (
                <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/30">
                  <Landmark className="w-3.5 h-3.5" /> 🏛️ e-DEVLET ONAYLI SATICI
                </span>
              ) : (
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-slate-950" /> ONAYLI SATICI
                </span>
              )}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
              {currentUser.isEDevletVerified && (
                <span className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md border-2 border-white" title="e-Devlet Onaylı Satıcı">
                  <BadgeCheck className="w-4 h-4" />
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>{currentUser.name}</span>
                {currentUser.isEDevletVerified ? (
                  <BadgeCheck className="w-5 h-5 text-red-600 fill-red-100" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-rose-500 fill-rose-100" />
                )}
              </h1>
              <p className="text-xs text-slate-500 font-semibold">{currentUser.username}</p>
              {currentUser.shopName && (
                <div className="text-xs font-bold text-rose-600 flex items-center justify-center sm:justify-start gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  <span>{currentUser.shopName}</span>
                  {currentUser.isEDevletVerified && (
                    <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-1">
                      <Landmark className="w-3 h-3" /> e-Devlet Onaylı
                    </span>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-600 max-w-md">{currentUser.bio}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="profile-edit-btn"
              onClick={() => setShowEditProfileModal(true)}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-rose-500" />
              <span>Profili Düzenle</span>
            </button>

            {!currentUser.isSeller ? (
              <button
                id="profile-become-seller-btn"
                onClick={openBecomeSellerModal}
                className="px-4 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-black text-xs rounded-2xl shadow-md shadow-rose-200 hover:from-rose-700 transition-all flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span>Satıcı Ol</span>
              </button>
            ) : (
              <button
                id="profile-sell-new-btn"
                onClick={() => setViewMode('sell')}
                className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-200 hover:from-rose-700 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Ürün Yükle</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 border-t border-slate-100 bg-slate-50/50 text-center py-3 text-xs">
          <div>
            <span className="block font-black text-slate-900 text-sm">⭐ {currentUser.rating}</span>
            <span className="text-[10px] text-slate-400">Puan</span>
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
            <span className="block font-black text-slate-900 text-sm">{myActiveListings.length}</span>
            <span className="text-[10px] text-slate-400">Yayındaki İlan</span>
          </div>
        </div>
      </div>

      {/* e-Devlet Verified Seller Official Credential Card */}
      {currentUser.isSeller && currentUser.isEDevletVerified && (
        <div className="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-red-800/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-900/50 shrink-0 border border-white/20">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white tracking-wide uppercase">T.C. e-Devlet Kapısı Onaylı Satıcı</span>
                  <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> NVİ Onaylı
                  </span>
                </div>
                <p className="text-[11px] text-red-200">
                  Kimlik bilgileriniz e-Devlet Kimlik Paylaşım Sistemi (KPS) üzerinden doğrulanmıştır. Alıcılar mağazanıza %100 güvenir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white/10 p-2.5 rounded-2xl border border-white/10 text-xs">
              <div className="px-2">
                <div className="text-[9px] text-slate-400 font-semibold">T.C. Kimlik</div>
                <div className="font-mono font-bold text-white text-[11px]">{currentUser.tcKimlikMasked || '123*****890'}</div>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <div className="px-2">
                <div className="text-[9px] text-slate-400 font-semibold">Belge No</div>
                <div className="font-mono font-bold text-amber-300 text-[11px]">{currentUser.sellerVerificationDocNo || 'EDV-2026-921481'}</div>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <div className="px-2">
                <div className="text-[9px] text-slate-400 font-semibold">Güvenlik Düzeyi</div>
                <div className="font-bold text-emerald-400 text-[11px]">Tier-1 Tam Onay</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Become Seller Callout Banner if not a seller */}
      {!currentUser.isSeller && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Kendi Dolabını Aç, Kazanç Sağla!</span>
            </div>
            <h3 className="text-base font-black">CepteModa Satıcısı Olmak Çok Kolay</h3>
            <p className="text-xs text-rose-100">
              Giymediğin kıyafetleri fotoğrafla, mağazanı aktifleştir ve satışa başla.
            </p>
          </div>

          <button
            id="profile-banner-become-seller"
            onClick={openBecomeSellerModal}
            className="px-5 py-3 bg-white text-rose-600 font-black text-xs rounded-2xl shadow-md hover:bg-rose-50 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Store className="w-4 h-4" />
            <span>Satıcı Hesabımı Aç</span>
          </button>
        </div>
      )}

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
      </div>

      {/* Tab Contents */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {myActiveListings.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Yayında hiç ilanınız bulunmuyor</div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {currentUser.isSeller 
                  ? 'Ürün yükle butonunu kullanarak dolabınızdaki ürünleri sergileyebilirsiniz.' 
                  : 'Satıcı hesabı oluşturup hemen ürün satmaya başlayabilirsiniz.'}
              </p>
              {!currentUser.isSeller ? (
                <button
                  onClick={openBecomeSellerModal}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Satıcı Ol
                </button>
              ) : (
                <button
                  onClick={() => setViewMode('sell')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Ürün Yükle
                </button>
              )}
            </div>
          ) : (
            myActiveListings.map(product => (
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
            ))
          )}
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

      {/* Account Details & Saved Address Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Address Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Kayıtlı Teslimat Adresi</h3>
                <p className="text-[10px] text-slate-400">Siparişlerinizde varsayılan adres</p>
              </div>
            </div>

            <button
              id="edit-address-btn"
              onClick={() => setShowEditProfileModal(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Düzenle
            </button>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {currentUser.deliveryAddress || 'Henüz bir teslimat adresi tanımlanmamış. Sipariş vermeden önce adresinizi ekleyebilirsiniz.'}
            </p>
            {currentUser.phone && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-semibold">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Settings Quick Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Hesap & Güvenlik Özeti</h3>
                <p className="text-[10px] text-slate-400">Profil durumunuz ve doğrulamalar</p>
              </div>
            </div>

            <button
              id="edit-account-btn"
              onClick={() => setShowEditProfileModal(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
            >
              <Settings className="w-3.5 h-3.5" /> Ayarlar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block">Şehir / Lokasyon</span>
              <span className="font-bold text-slate-800 text-xs">{currentUser.city || 'Belirtilmedi'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block">E-Posta Doğrulama</span>
              <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Doğrulandı
              </span>
            </div>
          </div>
        </div>
      </div>

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
              <div className="font-mono font-bold text-slate-800">{currentUser.iban || 'Tanımlı IBAN Yok'}</div>
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
    </div>
  );
};
