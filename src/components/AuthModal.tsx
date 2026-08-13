import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { login, register, addNotification, openLegalModal } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addNotification('Hata', 'Lütfen tüm alanları doldurunuz.', 'warning');
      return;
    }

    login(email, password);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      addNotification('Hata', 'Lütfen zorunlu alanları doldurunuz.', 'warning');
      return;
    }
    if (!agreeTerms) {
      addNotification('Uyarı', 'Lütfen üyelik sözleşmesini onaylayınız.', 'warning');
      return;
    }

    register(fullName, email, password);
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    addNotification('Sosyal Giriş Yapıldı', `${provider} hesabınız ile giriş yapıldı.`, 'success');
    login(`${provider.toLowerCase()}@user.com`, '123456');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" /> CepteModa Ailesi
            </span>
          </div>

          <h2 className="text-xl font-black text-white">
            {mode === 'login' ? 'Hoş Geldiniz 👋' : 'Aramıza Katılın 🌟'}
          </h2>
          <p className="text-xs text-rose-100 mt-1">
            {mode === 'login' 
              ? 'Hesabınıza giriş yaparak fırsatları kaçırmayın.' 
              : 'Ücretsiz hesap oluşturun, alıp satmaya hemen başlayın.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/20 p-1 rounded-2xl mt-4">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login' 
                  ? 'bg-white text-rose-700 shadow-sm' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Giriş Yap</span>
            </button>

            <button
              id="auth-tab-register"
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register' 
                  ? 'bg-white text-rose-700 shadow-sm' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Üye Ol</span>
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-4">
          
          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>E-posta Adresi *</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Şifre *</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => addNotification('Bilgi', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.', 'info')} 
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <span>Beni Hatırla</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-600" />
                  <span>Ad Soyad *</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>E-posta Adresi *</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Telefon Numarası</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Şifre Belirleyin *</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 leading-tight">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 mt-0.5"
                  />
                  <span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLegalModal('terms');
                      }}
                      className="font-bold text-rose-600 hover:underline inline"
                    >
                      Kullanıcı Sözleşmesi
                    </button>
                    {' '}ve{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLegalModal('privacy');
                      }}
                      className="font-bold text-rose-600 hover:underline inline"
                    >
                      Gizlilik Politikası
                    </button>
                    'nı okudum, kabul ediyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>Aramıza Katıl (Üye Ol)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">veya hızlı bağlantı</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.6-.5-2.4z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.81 1.12-1.94.99-3.09-0.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1.01 2.99 1.08.08 2.17-.53 2.84-1.34z"/>
              </svg>
              <span>Apple ID</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL ile %100 Güvenli İşlem
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
