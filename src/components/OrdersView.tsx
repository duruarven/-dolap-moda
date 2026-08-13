import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Box,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package
} from 'lucide-react';
import { Order } from '../types';

interface CargoProgressBarProps {
  order: Order;
  activeTab: 'buying' | 'selling';
  addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CargoProgressBar: React.FC<CargoProgressBarProps> = ({ order, activeTab, addNotification }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Calculate current stage index: 0 = Hazırlanıyor, 1 = Kargoya Verildi, 2 = Teslim Edildi
  const isCompleted = order.status === 'completed' || order.status === 'delivered';
  const isShipped = order.status === 'shipped';
  
  let currentStageIndex = 0; // Hazırlanıyor
  if (isCompleted) {
    currentStageIndex = 2; // Teslim Edildi
  } else if (isShipped) {
    currentStageIndex = 1; // Kargoya Verildi
  } else if (order.trackingSteps[2]?.completed) {
    currentStageIndex = 1;
  }

  // Calculate filled progress percentage (0%, 50%, 100%)
  const progressPercent = currentStageIndex === 2 ? 100 : currentStageIndex === 1 ? 50 : 15;

  const stages = [
    {
      id: 'preparing',
      title: 'Hazırlanıyor',
      subtitle: activeTab === 'buying' ? 'Satıcı Hazırlıyor' : 'Siz Hazırlıyorsunuz',
      icon: Box,
      stepIndex: 0,
      date: order.trackingSteps[1]?.date !== '-' ? order.trackingSteps[1]?.date : order.trackingSteps[0]?.date
    },
    {
      id: 'shipped',
      title: 'Kargoya Verildi',
      subtitle: 'Kargo Yolda',
      icon: Truck,
      stepIndex: 1,
      date: order.trackingSteps[2]?.date !== '-' ? order.trackingSteps[2]?.date : 'Bekleniyor'
    },
    {
      id: 'delivered',
      title: 'Teslim Edildi',
      subtitle: 'Teslimat & Onay',
      icon: CheckCircle2,
      stepIndex: 2,
      date: order.trackingSteps[3]?.date !== '-' ? order.trackingSteps[3]?.date : 'Bekleniyor'
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(order.cargoCode);
    addNotification('Kargo Kodu Kopyalandı 📋', `${order.cargoCode} panoya kopyalandı.`, 'info');
  };

  return (
    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
            <Package className="w-3.5 h-3.5 text-rose-600" />
            <span>{order.cargoCompany}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono font-bold text-[11px] transition-all cursor-pointer"
            title="Kargo Takip Kodunu Kopyala"
          >
            <span>{order.cargoCode}</span>
            <Copy className="w-3 h-3 text-rose-500" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          {currentStageIndex === 2 ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
              <Check className="w-3.5 h-3.5" /> Teslim Edildi
            </span>
          ) : currentStageIndex === 1 ? (
            <span className="inline-flex items-center gap-1.5 text-blue-800 bg-blue-100/90 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Kargoda / Yolda
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              Sipariş Hazırlanıyor
            </span>
          )}
        </div>
      </div>

      {/* Visual Cargo Progress Bar */}
      <div className="pt-2 pb-1 relative px-2 sm:px-6">
        {/* Progress Line Track Background */}
        <div className="absolute top-5 left-8 right-8 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              currentStageIndex === 2 
                ? 'bg-emerald-500' 
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stage Nodes */}
        <div className="relative flex justify-between items-start z-10">
          {stages.map((stage) => {
            const isStageCompleted = stage.stepIndex < currentStageIndex || (stage.stepIndex === 2 && currentStageIndex === 2);
            const isStageActive = stage.stepIndex === currentStageIndex && currentStageIndex !== 2;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center max-w-[90px] sm:max-w-[120px]">
                {/* Node Circle */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isStageCompleted
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-md border-2 border-white'
                      : isStageActive
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-md shadow-rose-200 animate-pulse border-2 border-white'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isStageCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Node Text Label */}
                <div className="mt-2 space-y-0.5">
                  <span className={`text-[11px] block leading-tight ${
                    isStageCompleted
                      ? 'font-extrabold text-slate-900'
                      : isStageActive
                        ? 'font-extrabold text-rose-600'
                        : 'font-medium text-slate-400'
                  }`}>
                    {stage.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-none">
                    {stage.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible Detailed Tracking Logs */}
      <div className="pt-1">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span>Detaylı Kargo Hareketleri ({order.trackingSteps.filter(s => s.completed).length}/{order.trackingSteps.length})</span>
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs animate-in fade-in duration-200">
            {order.trackingSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`mt-0.5 p-1 rounded-full ${
                  step.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{step.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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

                {/* Seller Action: Print Code */}
                {activeTab === 'selling' && (
                  <button
                    onClick={() => addNotification('Kargo Kodu Hazır 📦', `Paket üzerine ${order.cargoCode} kodunu yazmanız yeterlidir.`, 'info')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl cursor-pointer transition-colors shrink-0"
                  >
                    Kargo Kodunu Göster
                  </button>
                )}
              </div>

              {/* Visual Cargo Progress Bar Component */}
              <CargoProgressBar 
                order={order} 
                activeTab={activeTab} 
                addNotification={addNotification} 
              />

              {/* Confirm Delivery Action (For Buyer) */}
              {activeTab === 'buying' && order.status !== 'completed' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Ürünü teslim aldınız ve sorun yok mu?</span>
                  <button
                    id={`confirm-delivery-btn-${order.id}`}
                    onClick={() => confirmOrderDelivery(order.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
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

