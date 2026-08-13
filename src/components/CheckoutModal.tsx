import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Truck, CreditCard, MapPin, CheckCircle2, Lock } from 'lucide-react';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose }) => {
  const { createOrder, setViewMode, currentUser } = useApp();

  const [address, setAddress] = useState('Atatürk Mahallesi, Karanfil Sokak No:12 D:4, Karşıyaka / İZMİR');
  const [courier, setCourier] = useState('Trendyol Express');
  const [paymentType, setPaymentType] = useState<'card' | 'balance'>('card');
  const [cardNumber, setCardNumber] = useState('4543 **** **** 8821');

  const serviceFee = 9;
  const shippingFee = product.shippingType === 'Kargo Bedava' ? 0 : 117;
  const totalPrice = product.price + serviceFee + shippingFee;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder(product, address, courier);
    onClose();
    setViewMode('orders');
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Güvenli Satın Alım</h3>
              <p className="text-[11px] text-emerald-600 font-semibold">%100 CepteModa Koruma Havuz Hesabı</p>
            </div>
          </div>
          <button id="close-checkout-modal" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snippet */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <img src={product.images[0]} alt={product.title} className="w-14 h-14 rounded-xl object-cover" />
          <div className="flex-1 truncate">
            <h4 className="text-xs font-bold text-slate-800 truncate">{product.title}</h4>
            <div className="text-[11px] text-slate-500">Satıcı: <span className="font-semibold text-slate-700">{product.seller.name}</span></div>
            <div className="text-xs font-black text-rose-600 mt-0.5">₺{product.price.toLocaleString('tr-TR')}</div>
          </div>
        </div>

        <form onSubmit={handleCompleteOrder} className="space-y-4">
          {/* Delivery Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Teslimat Adresi</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white resize-none"
              required
            />
          </div>

          {/* Cargo Courier Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Kargo Şirketi</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCourier('Trendyol Express')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  courier === 'Trendyol Express'
                    ? 'bg-rose-50 border-rose-500 font-bold text-rose-800'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold">Trendyol Express ⚡</div>
                <div className="text-[10px] text-slate-400">Hızlı Teslimat (1-2 Gün)</div>
              </button>

              <button
                type="button"
                onClick={() => setCourier('PTT Kargo')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  courier === 'PTT Kargo'
                    ? 'bg-rose-50 border-rose-500 font-bold text-rose-800'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold">PTT Kargo 📦</div>
                <div className="text-[10px] text-slate-400">Tüm Türkiye Güvenli</div>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ödeme Yöntemi</span>
            </label>
            <div className="space-y-2">
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs ${
                paymentType === 'card' ? 'bg-slate-50 border-rose-500 font-bold' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === 'card'}
                    onChange={() => setPaymentType('card')}
                    className="accent-rose-600"
                  />
                  <span>Kredi / Banka Kartı ({cardNumber})</span>
                </div>
                <span className="text-[10px] text-slate-400">3D Secure</span>
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs ${
                paymentType === 'balance' ? 'bg-slate-50 border-rose-500 font-bold' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === 'balance'}
                    onChange={() => setPaymentType('balance')}
                    className="accent-rose-600"
                  />
                  <span>Dolap Bakiyem (Mevcut: ₺{currentUser.walletBalance})</span>
                </div>
              </label>
            </div>
          </div>

          {/* Price Breakdown Box */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Ürün Tutarı:</span>
              <span>₺{product.price.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Alıcı Koruma Güvence Bedeli:</span>
              <span>₺{serviceFee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Kargo Ücreti (KDV Dahil):</span>
              <span className="text-emerald-600 font-bold">{shippingFee === 0 ? 'BEDAVA' : `₺${shippingFee}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>Toplam Ödenecek:</span>
              <span className="text-rose-600">₺{totalPrice.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          <button
            id="complete-order-submit-btn"
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Siparişi Tamamla • ₺{totalPrice.toLocaleString('tr-TR')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
