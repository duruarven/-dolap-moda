import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/FeedView';
import { ProductDetailView } from './components/ProductDetailView';
import { SellItemView } from './components/SellItemView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { OrdersView } from './components/OrdersView';
import { AiAssistantView } from './components/AiAssistantView';
import { ToastContainer } from './components/ToastContainer';
import { Smartphone, Monitor, ShieldCheck, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { viewMode, setViewMode, deviceFrame, setDeviceFrame, favorites } = useApp();

  const renderActiveView = () => {
    switch (viewMode) {
      case 'feed':
      case 'favorites':
        return <FeedView />;
      case 'product_detail':
        return <ProductDetailView />;
      case 'sell':
        return <SellItemView />;
      case 'chat':
        return <ChatView />;
      case 'profile':
        return <ProfileView />;
      case 'orders':
        return <OrdersView />;
      case 'ai_assistant':
        return <AiAssistantView />;
      default:
        return <FeedView />;
    }
  };

  // Device Frame Wrapper Layout
  if (deviceFrame === 'mobile_ios' || deviceFrame === 'mobile_android') {
    return (
      <div className="min-h-screen bg-slate-950 py-6 px-2 flex flex-col items-center justify-center font-sans antialiased">
        <ToastContainer />

        {/* Mobile Device Mockup Frame */}
        <div className={`relative w-full max-w-[410px] h-[850px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 ${
          deviceFrame === 'mobile_ios' ? 'border-slate-800 shadow-rose-900/20' : 'border-slate-800 shadow-emerald-900/20'
        } flex flex-col overflow-hidden`}>
          
          {/* iOS Notch / Island or Android Camera Hole */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center pt-2.5 pointer-events-none">
            {deviceFrame === 'mobile_ios' ? (
              <div className="w-28 h-5 bg-black rounded-full flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800"></div>
            )}
          </div>

          {/* Inner Phone Screen Canvas */}
          <div className="w-full h-full bg-slate-100 rounded-[38px] overflow-y-auto flex flex-col relative scrollbar-none">
            <Navbar />
            <main className="flex-1 pb-16">
              {renderActiveView()}
            </main>
            <BottomNav />
          </div>

          {/* Home Indicator Bar */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-center pb-1 pointer-events-none">
            <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>

        {/* Device Mode Switcher Footer Helper */}
        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
          <span>Şu anki simülasyon: <strong className="text-white uppercase">{deviceFrame === 'mobile_ios' ? 'iOS App' : 'Android App'}</strong></span>
          <button 
            onClick={() => setDeviceFrame('desktop')}
            className="text-rose-400 hover:text-rose-300 font-bold underline"
          >
            Masaüstü Ekrana Geç
          </button>
        </div>
      </div>
    );
  }

  // Desktop Full View Mode
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <ToastContainer />
      <Navbar />
      <main className="flex-1">
        {renderActiveView()}
      </main>
      <BottomNav />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              CM
            </div>
            <span className="font-bold text-slate-200">CepteModa • İkinci El Moda Pazaryeri</span>
          </div>
          <p className="text-center sm:text-right text-slate-400">
            iOS & Android Uyumlu Alıcı & Satıcı Pazaryeri Uygulaması © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
