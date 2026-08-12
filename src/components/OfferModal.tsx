import React, { useState } from 'react';
import { Product } from '../types';
import { Tag, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface OfferModalProps {
  product: Product;
  onClose: () => void;
  onSendOffer: (amount: number) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ product, onClose, onSendOffer }) => {
  const [customAmount, setCustomAmount] = useState<number>(Math.round(product.price * 0.9));

  const offer10 = Math.round(product.price * 0.9);
  const offer15 = Math.round(product.price * 0.85);
  const offer20 = Math.round(product.price * 0.8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmount <= 0) return;
    onSendOffer(customAmount);
  };

  return (
    <div id="offer-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Satıcıya Teklif Ver</h3>
              <p className="text-[11px] text-slate-400">Teklif kabul edilirse 24 saat geçerlidir</p>
            </div>
          </div>
          <button id="close-offer-modal" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Card Snippet */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-xl object-cover" />
          <div className="flex-1 truncate">
            <h4 className="text-xs font-bold text-slate-800 truncate">{product.title}</h4>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Etiket Fiyatı: <span className="text-rose-600 font-bold">₺{product.price.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* Preset Percentage Offer Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Hızlı Teklif Seçenekleri</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              id="offer-pct-10"
              type="button"
              onClick={() => setCustomAmount(offer10)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                customAmount === offer10 
                  ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
              }`}
            >
              <div className="text-[10px] text-slate-400">%10 İndirim</div>
              <div className="text-xs font-black">₺{offer10}</div>
            </button>

            <button
              id="offer-pct-15"
              type="button"
              onClick={() => setCustomAmount(offer15)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                customAmount === offer15 
                  ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
              }`}
            >
              <div className="text-[10px] text-slate-400">%15 İndirim</div>
              <div className="text-xs font-black">₺{offer15}</div>
            </button>

            <button
              id="offer-pct-20"
              type="button"
              onClick={() => setCustomAmount(offer20)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                customAmount === offer20 
                  ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
              }`}
            >
              <div className="text-[10px] text-slate-400">%20 İndirim</div>
              <div className="text-xs font-black">₺{offer20}</div>
            </button>
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Özel Teklif Tutarınız (TL)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold text-sm">₺</span>
              <input
                id="custom-offer-input"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                min={1}
                max={product.price}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 text-sm font-black border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
            {customAmount < product.price && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" />
                Satıcıya ₺{(product.price - customAmount).toLocaleString('tr-TR')} tasarruf teklifi sunuyorsunuz.
              </p>
            )}
          </div>

          <button
            id="submit-offer-btn"
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Teklifi Gönder • ₺{customAmount}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
