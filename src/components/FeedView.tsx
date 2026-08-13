import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Tag, 
  ArrowUpDown, 
  Filter, 
  X,
  Check,
  Zap,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = [
  { id: 'Tümü', label: 'Tümü', icon: '✨' },
  { id: 'Kadın', label: 'Kadın', icon: '👗' },
  { id: 'Erkek', label: 'Erkek', icon: '👔' },
  { id: 'Çocuk', label: 'Çocuk', icon: '🧸' },
  { id: 'Lüks', label: 'Lüks Moda', icon: '💎' },
  { id: 'Ayakkabı', label: 'Ayakkabı', icon: '👟' },
  { id: 'Çanta', label: 'Çanta', icon: '👜' },
  { id: 'Aksesuar', label: 'Aksesuar', icon: '👓' },
  { id: 'Kozmetik', label: 'Kozmetik', icon: '💄' },
];

const BRANDS = ['Tümü', 'Zara', 'Nike', 'Mango', 'Gucci', 'Adidas', 'Massimo Dutti', 'Vakko', 'LCW'];

export const FeedView: React.FC = () => {
  const { 
    currentUser,
    products, 
    favorites, 
    toggleFavorite, 
    selectedCategory, 
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    searchQuery,
    selectedCondition,
    setSelectedCondition,
    freeShippingOnly,
    setFreeShippingOnly,
    sortBy,
    setSortBy,
    setSelectedProduct,
    setViewMode,
    resetFilters,
    openBecomeSellerModal
  } = useApp();

  // Filter products logic
  const filteredProducts = products.filter(p => {
    // Category
    if (selectedCategory !== 'Tümü' && p.category !== selectedCategory) return false;
    // Brand
    if (selectedBrand !== 'Tümü' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    // Condition
    if (selectedCondition !== 'Tümü' && p.condition !== selectedCondition) return false;
    // Free Shipping
    if (freeShippingOnly && p.shippingType !== 'Kargo Bedava') return false;
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchSeller = p.seller.name.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCategory && !matchSeller) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'popular') return b.favoriteCount - a.favoriteCount;
    return 0; // Default newest
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-20">
      {/* Campaign Banners Slider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10 space-y-1">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sınırlı Süre
            </span>
            <h3 className="text-base font-bold leading-tight">Tüm Siparişlerde ₺0 Kargo Bedava!</h3>
            <p className="text-xs text-rose-100">CepteModa güvencesiyle ilk siparişine kargo ücreti ödeme.</p>
          </div>
          <Truck className="w-16 h-16 text-white/20 shrink-0 transform group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-4 text-white shadow-md flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10 space-y-1">
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Pazaryeri
            </span>
            <h3 className="text-base font-bold leading-tight">Dolabını Döndür, Tarzını Yenile!</h3>
            <p className="text-xs text-slate-300">Sıfır etiketli parçalardan stil sahibi ikinci ele, aradığın her şey burada.</p>
          </div>
          <Sparkles className="w-16 h-16 text-amber-400/20 shrink-0 transform group-hover:scale-110 transition-transform" />
        </div>

        <div 
          onClick={openBecomeSellerModal}
          className="hidden md:flex bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md items-center justify-between overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="relative z-10 space-y-1">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Satıcı Ol
            </span>
            <h3 className="text-base font-bold leading-tight">Mağazanı Aç & Satışa Başla</h3>
            <p className="text-xs text-emerald-100">%0 Komisyonlu satıcı hesabını aktifleştir.</p>
          </div>
          <Store className="w-16 h-16 text-white/20 shrink-0 transform group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Category Horizontal Scroll Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
          <span>Kategoriler</span>
          {selectedCategory !== 'Tümü' && (
            <button 
              onClick={() => setSelectedCategory('Tümü')} 
              className="text-rose-600 hover:underline"
            >
              Temizle
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              id={`cat-chip-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-rose-200 scale-102'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Brand Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-2xl scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Marka:</span>
          {BRANDS.map(b => (
            <button
              key={b}
              id={`brand-chip-${b}`}
              onClick={() => setSelectedBrand(b)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedBrand === b
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            id="toggle-free-shipping"
            onClick={() => setFreeShippingOnly(!freeShippingOnly)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              freeShippingOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kargo Bedava</span>
            {freeShippingOnly && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
          </button>

          <div className="relative">
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 outline-none cursor-pointer"
            >
              <option value="newest">En Yeniler</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="popular">En Çok Favorilenenler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Grid Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
        <div>
          <span className="font-bold text-slate-800">{filteredProducts.length}</span> ürün listeleniyor
          {searchQuery && <span className="ml-1 text-rose-600">("{searchQuery}" araması için)</span>}
        </div>
        {(selectedCategory !== 'Tümü' || selectedBrand !== 'Tümü' || freeShippingOnly || searchQuery) && (
          <button
            id="reset-all-filters-btn"
            onClick={resetFilters}
            className="text-rose-600 hover:underline font-semibold"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Clean Empty State with Become Seller & Post Item CTA */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 max-w-xl mx-auto shadow-2xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            <Store className="w-8 h-8 text-rose-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Henüz Listelenmiş İlan Yok</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Mevcut tüm demolar temizlendi. Satıcı olarak ilk ürünü hemen yükleyebilir, dolabındaki kıyafetleri alıcılarla buluşturabilirsin!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!currentUser.isSeller && (
              <button
                id="empty-state-become-seller"
                onClick={openBecomeSellerModal}
                className="px-5 py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-black rounded-2xl shadow-md shadow-rose-200 transition-all flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Satıcı Ol & Mağazanı Aç</span>
              </button>
            )}

            <button
              id="empty-state-add-product"
              onClick={() => setViewMode('sell')}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>İlk Ürününü Yükle</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map(product => {
          const isFav = favorites.includes(product.id);
          const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group relative"
            >
              {/* Product Image Box */}
              <div 
                id={`product-card-img-${product.id}`}
                onClick={() => {
                  setSelectedProduct(product);
                  setViewMode('product_detail');
                }}
                className="relative aspect-4/5 bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    %{discountPercent} İNDİRİM
                  </span>
                )}

                {/* Free Shipping Badge */}
                {product.shippingType === 'Kargo Bedava' && (
                  <span className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Truck className="w-2.5 h-2.5" /> Kargo Bedava
                  </span>
                )}

                {/* Favorite Heart Button */}
                <button
                  id={`fav-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isFav 
                      ? 'bg-rose-500 text-white scale-110' 
                      : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Product Info */}
              <div 
                id={`product-card-body-${product.id}`}
                onClick={() => {
                  setSelectedProduct(product);
                  setViewMode('product_detail');
                }}
                className="p-3 flex-1 flex flex-col justify-between cursor-pointer space-y-2"
              >
                {/* Brand & Size */}
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="font-bold text-slate-800 uppercase tracking-wider">{product.brand}</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-semibold">{product.size}</span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                  {product.title}
                </h4>

                {/* Price Box */}
                <div className="pt-1 flex items-baseline gap-2">
                  <span className="text-sm font-black text-slate-900">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[11px] font-medium text-slate-400 line-through">
                      ₺{product.originalPrice.toLocaleString('tr-TR')}
                    </span>
                  )}
                </div>

                {/* Seller Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <img src={product.seller.avatar} alt={product.seller.name} className="w-4 h-4 rounded-full object-cover" />
                    <span className="text-slate-600 truncate font-medium text-[10px]">{product.seller.name}</span>
                    {product.seller.isSuperSeller && (
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" title="Süper Satıcı" />
                    )}
                  </div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-0.5 shrink-0">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    <span>{product.favoriteCount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
