import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageCheck, Truck, CheckCircle2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, confirmOrderDelivery, currentUser, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying');

  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id);
  const sellerOrders = orders.filter(o => o.sellerId === currentUser.id);

  const displayedOrders = activeTab === 'buying' ? buyerOrders : sellerOrders;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-rose-600" />
            <span>Siparişlerim & Satışlarım</span>
          </h1>
          <p className="text-xs text-slate-500">Güvenli havuz ödemeli kargo ve teslimat takibi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold">
        <button
          id="tab-orders-buying"
          onClick={() => setActiveTab('buying')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'buying' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Satın Aldıklarım ({buyerOrders.length})
        </button>

        <button
          id="tab-orders-selling"
          onClick={() => setActiveTab('selling')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'selling' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Satışlarım ({sellerOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2 text-slate-400 text-xs">
            <Truck className="w-10 h-10 mx-auto text-slate-300" />
            <p>Henüz bu kategoride gösterilecek bir siparişiniz bulunmuyor.</p>
          </div>
        ) : (
          displayedOrders.map(order => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
              {/* Order Top Bar */}
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">Sipariş No: #{order.orderNumber}</span>
                  <span className="text-[10px] text-slate-400">• {order.createdAt}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {order.status === 'completed' ? 'Tamamlandı' : 'Kargoda / Süreçte'}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-3">
                <img src={order.product.images[0]} alt={order.product.title} className="w-14 h-14 rounded-2xl object-cover border border-slate-100" />
                <div className="flex-1 truncate">
                  <h3 className="text-xs font-bold text-slate-800 truncate">{order.product.title}</h3>
                  <div className="text-[11px] text-slate-500">
                    {activeTab === 'buying' ? `Satıcı: ${order.sellerName}` : `Alıcı: ${order.buyerName}`}
                  </div>
                  <div className="text-xs font-black text-rose-600 mt-0.5">
                    ₺{order.totalPrice.toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>

              {/* Cargo Code Box */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Kargo Firması & Takip Kodu</span>
                  <span className="font-bold text-slate-800">{order.cargoCompany} • </span>
                  <span className="font-mono font-bold text-rose-600">{order.cargoCode}</span>
                </div>

                {/* Seller Action: Print Code */}
                {activeTab === 'selling' && (
                  <button
                    onClick={() => addNotification('Kargo Kodu Hazır 📦', `Paket üzerine ${order.cargoCode} kodunu yazmanız yeterlidir.`, 'info')}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold text-[11px] rounded-xl"
                  >
                    Kargo Kodunu Göster
                  </button>
                )}
              </div>

              {/* Tracking Stepper */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-slate-700">Kargo Süreç Çizelgesi</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {order.trackingSteps.map((step, idx) => (
                    <div key={idx} className={`p-2 rounded-xl text-[10px] border ${
                      step.completed ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className={`w-3 h-3 ${step.completed ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span className="truncate">{step.title}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{step.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Delivery Action (For Buyer) */}
              {activeTab === 'buying' && order.status !== 'completed' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Ürünü teslim aldınız ve sorun yok mu?</span>
                  <button
                    id={`confirm-delivery-btn-${order.id}`}
                    onClick={() => confirmOrderDelivery(order.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ürünü Onayla & Satıcıya Aktar</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
