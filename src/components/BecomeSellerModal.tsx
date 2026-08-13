import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  X,
  ShoppingBag
} from 'lucide-react';

interface BecomeSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomeSellerModal: React.FC<BecomeSellerModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, becomeSeller } = useApp();

  const [shopName, setShopName] = useState(currentUser.shopName || `${currentUser.name} Dolabı`);
  const [city, setCity] = useState(currentUser.city || 'İstanbul');
  const [iban, setIban] = useState(currentUser.iban || 'TR32 0006 2000 0000 1234 5678 90');
  const [bio, setBio] = useState(currentUser.bio || 'Sıfır etiketli ve temiz ikinci el kıyafetler, aksesuarlar.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    becomeSeller(shopName, city, iban, bio);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Background */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Zap className="w-3 h-3 fill-slate-950" /> Satıcı Modu
            </span>
          </div>

          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Store className="w-6 h-6" />
            <span>Satıcı Ol & Satışa Başla</span>
          </h2>
          <p className="text-xs text-rose-100 mt-1">
            Kendi dolabını veya mağazanı aç, sıfır ve ikinci el ürünlerini kolayca sat, binlerce alıcıya ulaş!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Perks Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-2xl space-y-1">
              <Sparkles className="w-4 h-4 text-rose-600 mx-auto" />
              <div className="font-bold text-slate-800">%0 Komisyon</div>
              <div className="text-[9px] text-slate-500">İlk satışlarında tam kazanç</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800">Güvenli Ödeme</div>
              <div className="text-[9px] text-slate-500">Havuz hesap güvencesi</div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-2xl space-y-1">
              <ShoppingBag className="w-4 h-4 text-indigo-600 mx-auto" />
              <div className="font-bold text-slate-800">Anında İlan</div>
              <div className="text-[9px] text-slate-500">AI ile hızlı yükleme</div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Shop Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-rose-600" />
                <span>Mağaza / Dolap Adı *</span>
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Örn: Selin Vintage Dolap"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-semibold border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Bulunduğun Şehir *</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Örn: İstanbul / Kadıköy"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-semibold border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* IBAN */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Satış Kazançların İçin IBAN *</span>
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-mono font-bold border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all"
                required
              />
              <span className="text-[10px] text-slate-400 block">Satış onaylandığında paranız bu IBAN hesabına yatırılır.</span>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>Mağaza Biyografisi / Tanıtım</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Satmak istediğin kıyafetler veya mağazan hakkında kısa bir bilgi yaz..."
                className="w-full p-3 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="flex-2 py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Satıcı Hesabımı Aktifleştir</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
