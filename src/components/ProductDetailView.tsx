import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  ShoppingBag, 
  Tag, 
  Zap, 
  MapPin, 
  ChevronLeft, 
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  X,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { OfferModal } from './OfferModal';
import { CheckoutModal } from './CheckoutModal';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    favorites, 
    toggleFavorite, 
    setViewMode, 
    sendOffer, 
    setActiveConversation,
    conversations,
    currentUser,
    addNotification
  } = useApp();

  if (!selectedProduct) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: selectedProduct.title,
      text: `${selectedProduct.title} - DolapModa'da ₺${selectedProduct.price} fiyatıyla satışta!`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addNotification('Paylaşıldı 🔗', 'Ürün bağlantısı paylaşıldı.', 'success');
        return;
      } catch (err) {
        // Fallback to modal if cancelled or unsupported
      }
    }
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    addNotification('Bağlantı Kopyalandı 📋', 'Ürün linki panoya kopyalandı.', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };
  const [comments, setComments] = useState<{ id: string; user: string; text: string; date: string }[]>([
    { id: '1', user: 'Zeynep M.', text: 'Merhaba, en son ne kadar olur acaba?', date: '1 saat önce' },
    { id: '2', user: selectedProduct.seller.name, text: 'Merhaba! Fiyat zaten çok uygun ama makul bir teklife açığım 😊', date: '45 dk önce' }
  ]);

  const isFav = favorites.includes(selectedProduct.id);
  const discountPercent = Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now().toString(),
      user: currentUser.name,
      text: commentText,
      date: 'Şimdi'
    }]);
    setCommentText('');
    addNotification('Soru Gönderildi 📩', 'Sorunuz satıcıya iletildi.', 'success');
  };

  const handleOpenChat = () => {
    let conv = conversations.find(c => c.productId === selectedProduct.id && c.buyerId === currentUser.id);
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        productImage: selectedProduct.images[0],
        productPrice: selectedProduct.price,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerAvatar: currentUser.avatar,
        sellerId: selectedProduct.seller.id,
        sellerName: selectedProduct.seller.name,
        sellerAvatar: selectedProduct.seller.avatar,
        lastMessage: 'Sohbet başlatıldı.',
        lastMessageTime: 'Şimdi',
        unreadCount: 0
      };
    }
    setActiveConversation(conv);
    setViewMode('chat');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Back Button */}
      <button
        id="back-to-feed-btn"
        onClick={() => setViewMode('feed')}
        className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Keşfet'e Dön</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
        {/* Left Column: Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
              alt={selectedProduct.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                %{discountPercent} İNDİRİM
              </span>
            )}

            {/* Action Buttons Top Right Overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {/* Share Button */}
              <button
                id="detail-share-btn"
                onClick={handleShare}
                className="p-3 rounded-full bg-white/90 text-slate-700 hover:bg-white backdrop-blur-md transition-transform active:scale-95 shadow-md"
                title="Ürünü Paylaş"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Favorite Button */}
              <button
                id="detail-fav-btn"
                onClick={() => toggleFavorite(selectedProduct.id)}
                className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-95 shadow-md ${
                  isFav ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
                }`}
                title="Favorilere Ekle"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  id={`thumb-img-${idx}`}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx ? 'border-rose-600 scale-105' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="küçük görsel" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price, Seller, Specs */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Brand & Category */}
            <div className="flex items-center justify-between text-xs">
              <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {selectedProduct.brand}
              </span>
              <span className="text-slate-400 font-medium">İlan koda: #{selectedProduct.id}</span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {selectedProduct.title}
            </h1>

            {/* Price Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Satış Fiyatı</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-rose-600">
                    ₺{selectedProduct.price.toLocaleString('tr-TR')}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm font-medium text-slate-400 line-through">
                      ₺{selectedProduct.originalPrice.toLocaleString('tr-TR')}
                    </span>
                  )}
                </div>
              </div>

              {/* Shipping Badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                  <Truck className="w-3.5 h-3.5" />
                  {selectedProduct.shippingType}
                </span>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3 rounded-2xl flex items-center gap-3 text-xs">
              <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-emerald-300">%100 Alıcı Koruma Güvencesi</div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Ödemeniz DolapModa güvenceli havuz hesabında tutulur. Ürünü teslim alıp onaylayana kadar para satıcıya aktarılmaz.
                </p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Beden / Ölçü</span>
                <span className="font-bold text-slate-800">{selectedProduct.size}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Kullanım Durumu</span>
                <span className="font-bold text-slate-800">{selectedProduct.condition}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Renk</span>
                <span className="font-bold text-slate-800">{selectedProduct.color}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Kargo Firması</span>
                <span className="font-bold text-slate-800">Trendyol Express / PTT</span>
              </div>
            </div>

            {/* Shipping Options & Carrier Estimates Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-rose-600" />
                  <span>Kargo Seçenekleri & Tahmini Teslimat</span>
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  selectedProduct.shippingType === 'Kargo Bedava' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {selectedProduct.shippingType}
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: 'Trendyol Express', time: '1-2 İş Günü', badge: 'Hızlı Teslimat ⚡', price: selectedProduct.shippingType === 'Kargo Bedava' ? 'Ücretsiz' : '₺29.90' },
                  { name: 'Yurtiçi Kargo', time: '1-2 İş Günü', badge: 'Popüler', price: selectedProduct.shippingType === 'Kargo Bedava' ? 'Ücretsiz' : '₺34.90' },
                  { name: 'Aras Kargo', time: '2-3 İş Günü', badge: 'Standart', price: selectedProduct.shippingType === 'Kargo Bedava' ? 'Ücretsiz' : '₺32.90' },
                  { name: 'MNG Kargo', time: '2-3 İş Günü', badge: 'Standart', price: selectedProduct.shippingType === 'Kargo Bedava' ? 'Ücretsiz' : '₺31.90' },
                  { name: 'PTT Kargo', time: '2-4 İş Günü', badge: 'Ekonomik', price: selectedProduct.shippingType === 'Kargo Bedava' ? 'Ücretsiz' : '₺24.90' },
                ].map((carrier, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/60 hover:border-rose-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{carrier.name}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-slate-400" /> Tahmini {carrier.time}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-black block text-xs ${carrier.price === 'Ücretsiz' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {carrier.price}
                      </span>
                      <span className="text-[9px] text-slate-400">{carrier.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-800">Ürün Açıklaması</h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 whitespace-pre-line">
                {selectedProduct.description}
              </p>
            </div>

            {/* Seller Info Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedProduct.seller.avatar}
                    alt={selectedProduct.seller.name}
                    className="w-10 h-10 rounded-full object-cover border border-rose-200"
                  />
                  {selectedProduct.seller.isSuperSeller && (
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <span>{selectedProduct.seller.name}</span>
                    {selectedProduct.seller.isSuperSeller && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                        SÜPER SATICI
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>⭐ {selectedProduct.seller.rating} ({selectedProduct.seller.salesCount} satış)</span>
                    <span>• {selectedProduct.seller.city}</span>
                  </div>
                </div>
              </div>

              <button
                id="seller-profile-btn"
                onClick={() => setViewMode('profile')}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Dolabı Gör
              </button>
            </div>

            {/* Safety Tips Collapsible Accordion */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl overflow-hidden text-xs transition-all">
              <button
                id="toggle-safety-tips-btn"
                onClick={() => setShowSafetyTips(prev => !prev)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-950 block leading-tight">Güvenli Alışveriş İpuçları 🛡️</span>
                    <span className="text-[10px] text-amber-700 font-medium">Dolandırılmaktan ve hatalı işlemlerden korunma rehberi</span>
                  </div>
                </div>
                {showSafetyTips ? (
                  <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-800 shrink-0" />
                )}
              </button>

              {showSafetyTips && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-amber-200/60 text-amber-900 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold text-[11px]">DolapModa Havuz Hesabı Kullanın</strong>
                      <p className="text-[10px] text-slate-600 leading-normal">
                        Ödemenizi asla harici IBAN veya kişisel hesaba yapmayın. Paranız ürün elinize ulaşıp onay verene kadar havuz hesabında güvendedir.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold text-[11px]">Kişisel Bilgilerinizi Paylaşmayın</strong>
                      <p className="text-[10px] text-slate-600 leading-normal">
                        Sohbet alanında T.C. Kimlik numaranızı, kart bilgilerinizi veya şifrelerinizi kesinlikle paylaşmayın.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <Truck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold text-[11px]">Kargo Paketini Kontrol Edin</strong>
                      <p className="text-[10px] text-slate-600 leading-normal">
                        Ürünü teslim alırken paketi kontrol edin. Deforme veya eksik durumunda kargo görevlisiyle tutanak tutturun.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-2">
              {/* Make an Offer Button */}
              <button
                id="make-offer-btn"
                onClick={() => setShowOfferModal(true)}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Tag className="w-4 h-4 text-rose-600" />
                <span>Teklif Ver</span>
              </button>

              {/* Chat Button */}
              <button
                id="ask-seller-btn"
                onClick={handleOpenChat}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>Mesaj At</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              id="buy-now-btn"
              onClick={() => setShowCheckoutModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Hemen Al • ₺{selectedProduct.price.toLocaleString('tr-TR')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Questions / Comments Section */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-rose-600" />
          <span>Satıcıya Sorulan Sorular ({comments.length})</span>
        </h3>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {comments.map(c => (
            <div key={c.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{c.user}</span>
                <span className="text-[10px] text-slate-400 font-normal">{c.date}</span>
              </div>
              <p className="text-slate-600">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSendComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Satıcıya kamuya açık bir soru sorun (örn: Kumaşı esnek mi?)..."
            className="flex-1 px-3 py-2 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Soru Sor
          </button>
        </form>
      </div>

      {/* Modals */}
      {showOfferModal && (
        <OfferModal
          product={selectedProduct}
          onClose={() => setShowOfferModal(false)}
          onSendOffer={(amount) => {
            sendOffer(selectedProduct.id, amount);
            setShowOfferModal(false);
          }}
        />
      )}

      {showCheckoutModal && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ürünü Arkadaşlarınla Paylaş</h3>
                  <p className="text-[11px] text-slate-400">Harika bir moda parçası keşfettin!</p>
                </div>
              </div>
              <button
                id="close-share-modal-btn"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Card Preview */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-wider block">
                  {selectedProduct.brand}
                </span>
                <h4 className="font-bold text-xs text-slate-900 truncate">{selectedProduct.title}</h4>
                <div className="text-xs font-black text-slate-900 mt-0.5">
                  ₺{selectedProduct.price.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>

            {/* Quick Social Sharing Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${selectedProduct.title} - DolapModa'da ₺${selectedProduct.price} fiyatıyla satışta! ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  addNotification('WhatsApp Açılıyor 📱', 'Paylaşım bağlantısı WhatsApp ile açılıyor.', 'info');
                }}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp'ta Gönder</span>
              </a>

              <button
                id="copy-share-link-btn"
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 py-3 px-3 font-bold text-xs rounded-2xl transition-all shadow-xs border ${
                  copiedLink
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
              </button>
            </div>

            {/* Link Preview Box */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] text-slate-400 font-medium mb-1">Doğrudan Ürün Bağlantısı</div>
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent text-xs text-slate-600 flex-1 outline-none font-mono truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-white text-slate-800 font-bold text-[10px] rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors shrink-0"
                >
                  Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
