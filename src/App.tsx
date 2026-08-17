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
import { BecomeSellerModal } from './components/BecomeSellerModal';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { 
  FeedSkeleton, 
  ProductDetailSkeleton, 
  ProfileSkeleton, 
  OrdersSkeleton, 
  ChatSkeleton, 
  AiAssistantSkeleton 
} from './components/skeletons';

const MainAppContent: React.FC = () => {
  const { 
    viewMode, 
    isPageLoading,
    isBecomeSellerModalOpen, 
    closeBecomeSellerModal,
    isAuthModalOpen,
    closeAuthModal,
    authInitialMode,
    isLegalModalOpen,
    closeLegalModal,
    legalActiveTab,
    openLegalModal
  } = useApp();

  const renderActiveView = () => {
    // Show high-fidelity Skeleton screens during view transitions & data loads
    if (isPageLoading) {
      switch (viewMode) {
        case 'feed':
        case 'favorites':
          return <FeedSkeleton />;
        case 'product_detail':
          return <ProductDetailSkeleton />;
        case 'profile':
          return <ProfileSkeleton />;
        case 'orders':
          return <OrdersSkeleton />;
        case 'chat':
          return <ChatSkeleton />;
        case 'ai_assistant':
          return <AiAssistantSkeleton />;
        default:
          return <FeedSkeleton />;
      }
    }

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <ToastContainer />
      <Navbar />
      
      {/* Become Seller Modal */}
      <BecomeSellerModal 
        isOpen={isBecomeSellerModalOpen} 
        onClose={closeBecomeSellerModal} 
      />

      {/* Auth Modal (Giriş Yap & Üye Ol) */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authInitialMode}
      />

      {/* Legal Modal (Kullanıcı Sözleşmesi & Gizlilik Politikası) */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={closeLegalModal}
        initialTab={legalActiveTab}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {renderActiveView()}
      </main>
      <BottomNav />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mb-14 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              CM
            </div>
            <span className="font-bold text-slate-200">CepteModa • Gardırobunun Akıllı Dönüşüm Noktası</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <button 
              onClick={() => openLegalModal('terms')} 
              className="hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              Kullanıcı Sözleşmesi
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => openLegalModal('privacy')} 
              className="hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              Gizlilik Politikası
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => openLegalModal('kvkk')} 
              className="hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              KVKK & Çerezler
            </button>
          </div>

          <p className="text-center md:text-right text-slate-500 text-[11px]">
            CepteModa © 2026 - Tüm Hakları Saklıdır
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
