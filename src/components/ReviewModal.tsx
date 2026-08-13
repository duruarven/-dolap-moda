import React, { useState } from 'react';
import { Star, X, Check, Sparkles, MessageSquare, Tag, ShieldCheck, Heart } from 'lucide-react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';

interface ReviewModalProps {
  order: Order;
  onClose: () => void;
}

const PRESET_TAGS = [
  '🚚 Hızlı Kargo',
  '📦 Özenli Paketleme',
  '✨ Açıklandığı Gibi',
  '👌 Temiz İkinci El',
  '😊 Güler Yüzlü Satıcı',
  '💯 Harika Kalite',
  '💖 Çok Şık'
];

const RATING_LABELS: Record<number, { title: string; subtitle: string; color: string }> = {
  1: { title: 'Çok Kötü 😞', subtitle: 'Ürün veya kargo beklentimi hiç karşılamadı', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  2: { title: 'Kötü / Yetersiz 🙁', subtitle: 'Eksikler veya küçük sorunlar var', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  3: { title: 'Orta / İdare Eder 😐', subtitle: 'Normal bir alışveriş deneyimiydi', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  4: { title: 'İyi / Beğendim 😊', subtitle: 'Genel olarak çok memnun kaldım', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  5: { title: 'Mükemmel! ⭐', subtitle: 'Ürün, kargo ve satıcı harikaydı!', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

export const ReviewModal: React.FC<ReviewModalProps> = ({ order, onClose }) => {
  const { addReview } = useApp();
  const existingReview = order.review;

  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(existingReview?.comment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(existingReview?.tags || ['🚚 Hızlı Kargo', '✨ Açıklandığı Gibi']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && selectedTags.length === 0) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addReview(order.id, rating, comment.trim() || 'Ürünü çok beğendim, sorunsuz ulaştı!', selectedTags);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-pink-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                {existingReview ? 'Değerlendirmeyi Düzenle' : 'Ürün & Satıcı Değerlendirmesi'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Sipariş No: #{order.orderNumber}
              </p>
            </div>
          </div>

          <button
            id="close-review-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          {/* Product Summary Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
            <img
              src={order.product.images[0]}
              alt={order.product.title}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs">
              <h3 className="font-bold text-slate-900 truncate">{order.product.title}</h3>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Satıcı: <strong className="text-slate-700">{order.sellerName}</strong></span>
                <span>•</span>
                <span className="font-black text-rose-600">₺{order.totalPrice.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="space-y-2 text-center bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800">
              Satıcıyı ve Ürünü Puanlayın ⭐
            </label>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= activeRating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1.5 transition-transform transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300 fill-slate-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating Label Badge */}
            <div className="inline-block mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border transition-all ${RATING_LABELS[activeRating].color}`}>
                {RATING_LABELS[activeRating].title} — <span className="font-normal">{RATING_LABELS[activeRating].subtitle}</span>
              </span>
            </div>
          </div>

          {/* Quick Tags Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              <span>Öne Çıkan Etiketler (İsteğe Bağlı)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Comment Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                <span>Yorumunuz & Deneyiminiz</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {comment.length}/300
              </span>
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              rows={3}
              placeholder="Ürünün durumu, kumaş kalitesi, kargo hızı veya satıcının iletişimi hakkında düşüncelerinizi yazın..."
              className="w-full p-3 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-2xl outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all resize-none"
            />
          </div>

          {/* Buyer Protection Guarantee Disclaimer */}
          <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-[11px] leading-tight">
              Değerlendirmeniz CepteModa topluluğunun diğer üyelerine rehberlik edecek ve satıcı profiline yansıtılacaktır.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Kaydediliyor...' : 'Değerlendirmeyi Yayınla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
