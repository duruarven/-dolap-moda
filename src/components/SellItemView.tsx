import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCondition, ShippingType } from '../types';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  DollarSign, 
  Loader2,
  X
} from 'lucide-react';

const CATEGORIES = ['Kadın', 'Erkek', 'Çocuk', 'Lüks', 'Ayakkabı', 'Çanta', 'Aksesuar', 'Kozmetik', 'Ev & Yaşam'];
const BRANDS = ['Zara', 'Mango', 'Nike', 'Adidas', 'Gucci', 'LCW', 'Pull&Bear', 'Stradivarius', 'Bershka', 'Massimo Dutti', 'Vakko', 'Diğer'];
const SIZES = ['XS (34)', 'S (36)', 'M (38)', 'L (40)', 'XL (42)', '36 (EU)', '37 (EU)', '38 (EU)', '39 (EU)', '40 (EU)', 'Standart'];

export const SellItemView: React.FC = () => {
  const { addProduct, addNotification } = useApp();

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('Kadın');
  const [subcategory, setSubcategory] = useState('Elbise & Etek');
  const [brand, setBrand] = useState('Zara');
  const [size, setSize] = useState('S (36)');
  const [condition, setCondition] = useState<ProductCondition>('Az Kullanılmış');
  const [color, setColor] = useState('Bej / Krem');
  const [price, setPrice] = useState<number>(450);
  const [originalPrice, setOriginalPrice] = useState<number>(1200);
  const [shippingType, setShippingType] = useState<ShippingType>('Kargo Bedava');

  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Commission calculation (10% platform fee)
  const platformFee = Math.round(price * 0.1);
  const netEarnings = price - platformFee;

  // Handle Photo Upload Simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages(prev => [event.target!.result as string, ...prev]);
        addNotification('Fotoğraf Yüklendi 📸', 'Ürün görseli eklendi.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini AI Product Analysis
  const handleAiAutoFill = async () => {
    setAiAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Şık moda ürünü',
          imageBase64: images[0]?.startsWith('data:image') ? images[0] : undefined,
          categoryPrompt: category
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const { suggestedTitle, suggestedCategory, suggestedBrand, suggestedCondition, estimatedPrice, originalPrice: origPrice, autoDescription } = resData.data;
        
        if (suggestedTitle) setTitle(suggestedTitle);
        if (suggestedCategory && CATEGORIES.includes(suggestedCategory)) setCategory(suggestedCategory);
        if (suggestedBrand) setBrand(suggestedBrand);
        if (suggestedCondition) setCondition(suggestedCondition as ProductCondition);
        if (estimatedPrice) setPrice(Number(estimatedPrice));
        if (origPrice) setOriginalPrice(Number(origPrice));
        if (autoDescription) setDescription(autoDescription);

        addNotification('Yapay Zeka Tamamladı! ✨', 'Ürün bilgileri ve piyasa fiyat tahmini dolduruldu.', 'success');
      } else {
        throw new Error(resData.error || 'AI yanıt vermedi');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback auto fill
      setTitle('Zara Şık Krem Örme Elbise');
      setDescription('Krem tonlarında, vücuda oturan kumaş. Çok az kullanıldı, lekesi deformesi yoktur.');
      setPrice(380);
      setOriginalPrice(990);
      addNotification('Otomatik Dolduruldu', 'Varsayılan moda şablonu ile dolduruldu.', 'info');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) {
      addNotification('Eksik Bilgi', 'Lütfen ürün başlığı ve geçerli bir fiyat girin.', 'warning');
      return;
    }

    addProduct({
      title,
      description: description || 'DolapModa ürünü.',
      price,
      originalPrice: originalPrice > price ? originalPrice : Math.round(price * 1.5),
      category,
      subcategory,
      brand,
      size,
      condition,
      images,
      shippingType,
      tags: [brand, category, condition],
      color
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Dolabına Ürün Yükle & Sat
        </h1>
        <p className="text-xs text-slate-500">
          Fotoğraflarını yükle, yapay zeka ile otomatik fiyat ve başlık oluştur, hemen yayınla!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        {/* Photo Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Ürün Fotoğrafları (En az 1 fotoğraf)</span>
            <span className="text-[10px] text-slate-400 font-normal">{images.length}/5 Yüklendi</span>
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {/* Upload Button */}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 cursor-pointer flex flex-col items-center justify-center p-2 text-rose-600 transition-colors">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Fotoğraf Ekle</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {/* Photo Previews */}
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                <img src={img} alt="yüklenen ürün" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    KAPAK
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gemini AI Auto Fill Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Yapay Zeka ile Otomatik Doldur</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Yüklediğin fotoğraf ve başlığa göre en uygun kategoriyi, markayı ve piyasa fiyatını Gemini AI belirlesin.
            </p>
          </div>

          <button
            type="button"
            id="ai-autofill-btn"
            onClick={handleAiAutoFill}
            disabled={aiAnalyzing}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
          >
            {aiAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Tamamlasın</span>
              </>
            )}
          </button>
        </div>

        {/* Product Details Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Ürün Başlığı *</label>
            <input
              id="sell-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Zara Hakiki Deri Ceket S Beden"
              className="w-full px-3 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Açıklama</label>
            <textarea
              id="sell-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Ürünün durumu, kullanım sıklığı, kumaşı veya kusuru varsa detaylandırın..."
              className="w-full p-3 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white resize-none"
            />
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Kategori</label>
              <select
                id="sell-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Marka</label>
              <select
                id="sell-brand-select"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none cursor-pointer"
              >
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Size & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Beden / Ölçü</label>
              <select
                id="sell-size-select"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none cursor-pointer"
              >
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Kullanım Durumu</label>
              <select
                id="sell-condition-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full p-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none cursor-pointer"
              >
                <option value="Yeni & Etiketli">Yeni & Etiketli</option>
                <option value="Az Kullanılmış">Az Kullanılmış</option>
                <option value="Makul Durumda">Makul Durumda</option>
              </select>
            </div>
          </div>

          {/* Price & Earnings Calculator Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-rose-600" />
              <span>Fiyatlandırma & Komisyon Hesaplayıcı</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Satış Fiyatın (TL)</label>
                <input
                  id="sell-price-input"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 bg-white text-xs font-black border border-slate-300 rounded-xl outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Orijinal Mağaza Fiyatı (TL)</label>
                <input
                  id="sell-orig-price-input"
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full p-2 bg-white text-xs text-slate-500 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Live Earnings Result */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-emerald-800 font-semibold">Net Kazanacağın Bakiye (%10 Komisyon Kesintisi):</div>
                <div className="text-base font-black text-emerald-700">₺{netEarnings.toLocaleString('tr-TR')}</div>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Komisyon: ₺{platformFee}
              </span>
            </div>
          </div>

          {/* Shipping Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Kargo Ücreti Seçeneği</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShippingType('Kargo Bedava')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  shippingType === 'Kargo Bedava'
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Kargo Bedava (Alıcıyı çeker ✨)
              </button>

              <button
                type="button"
                onClick={() => setShippingType('Alıcı Öder')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  shippingType === 'Alıcı Öder'
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Alıcı Öder (Sabit ₺30)
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="publish-product-submit"
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Dolabımda Yayınla • ₺{price}</span>
        </button>
      </form>
    </div>
  );
};
