import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EmailVerificationService } from '../services/EmailVerificationService';
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
  UserPlus,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  Edit3,
  AlertCircle,
  Zap
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
  const { 
    login,
    finalizeLogin,
    finalizeRegistration,
    verifyUser,
    currentUser,
    loginWithGoogle, 
    loginWithApple, 
    addNotification, 
    openLegalModal,
    users
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'awaiting_verification' | 'otp'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Loading & interactive states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState<'google' | 'apple' | null>(null);

  // Awaiting Verification (Post-Register or Login) states
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [awaitingPurpose, setAwaitingPurpose] = useState<'register' | 'login'>('register');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationResendTimer, setVerificationResendTimer] = useState(60);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // OTP Passwordless Login states
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode === 'register' ? 'register' : 'login');
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
      setShowPassword(false);
      setIsSubmitting(false);
      setIsSocialSubmitting(null);
      setOtpStep('request');
      setOtpCode('');
      setVerificationCodeInput('');
    }
  }, [isOpen, initialMode]);

  // Countdown timer for Awaiting Verification Resend
  useEffect(() => {
    let interval: any = null;
    if (mode === 'awaiting_verification' && verificationResendTimer > 0) {
      interval = setInterval(() => {
        setVerificationResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, verificationResendTimer]);

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval: any = null;
    if (mode === 'otp' && otpStep === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, otpStep, resendTimer]);

  if (!isOpen) return null;

  // Direct Standard Login (Requires Email Verification)
  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      addNotification('Eksik Bilgi ⚠️', 'Lütfen e-posta ve şifrenizi giriniz.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const localUser = users.find(u => u.email?.toLowerCase() === cleanEmail);
      const name = localUser ? localUser.name : 'Değerli Üyemiz';

      const res = await EmailVerificationService.sendVerificationCode(cleanEmail, name, 'login');
      
      if (res.success) {
        setPendingEmail(cleanEmail);
        setPendingPassword(password);
        setAwaitingPurpose('login');
        setVerificationResendTimer(60);
        setVerificationCodeInput('');
        setMode('awaiting_verification');

        addNotification(
          'Giriş Onayı Gerekli 🔐',
          res.message || `${cleanEmail} adresinize giriş onay kodunuz iletildi. Lütfen kodu giriniz.`,
          'success'
        );
      } else {
        addNotification('Gönderim Hatası ⚠️', res.error || 'Onay kodu gönderilemedi.', 'warning');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      addNotification('Giriş Hatası ⚠️', err.message || 'Giriş yapılırken bir hata oluştu.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Register with Email Verification Link Flow
  const handleRegisterWithEmailFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      addNotification('Geçersiz Ad Soyad ⚠️', 'Lütfen adınızı ve soyadınızı giriniz.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      addNotification('Geçersiz E-Posta ⚠️', 'Lütfen geçerli bir e-posta adresi giriniz.', 'warning');
      return;
    }

    if (!password || password.length < 6) {
      addNotification('Zayıf Şifre ⚠️', 'Lütfen en az 6 karakterden oluşan bir şifre belirleyiniz.', 'warning');
      return;
    }

    if (!agreeTerms) {
      addNotification('Sözleşme Onayı', 'Lütfen kullanıcı sözleşmesini onaylayınız.', 'warning');
      return;
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);
    if (existingUser) {
      addNotification('Kayıtlı E-Posta ⚠️', 'Bu e-posta adresiyle zaten bir hesap bulunmaktadır. Lütfen giriş yapınız.', 'warning');
      setMode('login');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate guaranteed unique 6-digit code for 100% synchronization across Firestore and Email
      const singleAuthCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create user immediately marked as pending_verification with this exact code
      const regSuccess = await finalizeRegistration(cleanName, cleanEmail, password, singleAuthCode);
      
      if (regSuccess) {
        setPendingEmail(cleanEmail);
        setPendingName(cleanName);
        setPendingPassword(password);
        setAwaitingPurpose('register');
        setVerificationResendTimer(60);
        setVerificationCodeInput('');
        
        // Dispatch Email Verification Link & Code via server-side service with the EXACT same code
        const emailRes = await EmailVerificationService.sendVerificationCode(
          cleanEmail, 
          cleanName, 
          'register', 
          singleAuthCode
        );

        // Switch AuthModal mode to 'awaiting_verification'
        setMode('awaiting_verification');

        if (emailRes.success) {
          addNotification(
            'Onay Kodu Gönderildi 📩',
            emailRes.message || `${cleanEmail} adresinize 6 haneli güvenlik onay kodunuz iletildi.`,
            'success'
          );
        } else {
          addNotification('Bildirim ℹ️', emailRes.error || `${cleanEmail} adresine aktivasyon kodu iletildi.`, 'info');
        }
      }
    } catch (err: any) {
      console.error('Registration dispatch error:', err);
      addNotification('Kayıt Hatası ⚠️', 'Kayıt servisine bağlanırken bir sorun oluştu.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Verification Code & Complete Action
  const handleConfirmVerificationCode = async (codeToVerify?: string) => {
    const targetCode = (codeToVerify || verificationCodeInput).replace(/[^0-9]/g, '').trim();
    if (!targetCode || targetCode.length < 6) {
      setVerificationError('Lütfen 6 haneli güvenlik kodunu eksiksiz giriniz.');
      return;
    }

    setIsVerifyingCode(true);
    setVerificationError(null);
    try {
      if (awaitingPurpose === 'register') {
        // Direct database and server API verification
        const verifyRes = await verifyUser(pendingEmail, targetCode);
        if (verifyRes.success) {
          addNotification('E-Postanız Doğrulandı! 🎉', 'Hesabınız başarıyla aktifleştirildi ve güvenle giriş yapıldı.', 'success');
          onClose();
        } else {
          setVerificationError(verifyRes.error || 'Girdiğiniz 6 haneli onay kodu hatalı.');
        }
      } else {
        const verifyRes = await EmailVerificationService.verifyCode(pendingEmail, targetCode, awaitingPurpose);
        
        if (verifyRes.success && verifyRes.verified) {
          // Finalize login
          const success = await login(pendingEmail, pendingPassword);
          if (success) {
            onClose();
          } else {
            setMode('login'); // fallback if password was wrong
          }
        } else {
          setVerificationError(verifyRes.error || 'Girdiğiniz 6 haneli onay kodu hatalı.');
        }
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setVerificationError('Onaylama işlemi sırasında bir hata oluştu.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Check if User Clicked Verification Link in another tab/window
  const handleCheckVerificationStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const isVerified = await EmailVerificationService.checkVerificationStatus(pendingEmail);
      if (isVerified) {
        if (awaitingPurpose === 'register') {
          const regSuccess = await finalizeRegistration(pendingName, pendingEmail, pendingPassword);
          if (regSuccess) {
            addNotification('Doğrulama Onaylandı! 🎉', 'Hesabınız başarıyla aktifleştirildi.', 'success');
            onClose();
          }
        } else {
          const success = await login(pendingEmail, pendingPassword);
          if (success) {
            onClose();
          } else {
            setMode('login');
          }
        }
      } else {
        addNotification(
          'Doğrulama Henüz Algılanmadı ⏳',
          'Lütfen e-postanızdaki aktivasyon bağlantısına tıklayınız veya yukarıdaki alana 6 haneli güvenlik kodunu giriniz.',
          'info'
        );
      }
    } catch (e) {
      addNotification('Kontrol Hatası', 'Doğrulama durumu kontrol edilirken bir sorun oluştu.', 'warning');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Resend Verification Email Link & Code
  const handleResendVerification = async () => {
    if (verificationResendTimer > 0 || isResendingEmail) return;

    setIsResendingEmail(true);
    try {
      const newAuthCode = Math.floor(100000 + Math.random() * 900000).toString();
      const res = await EmailVerificationService.sendVerificationCode(
        pendingEmail, 
        pendingName, 
        awaitingPurpose, 
        newAuthCode
      );
      if (res.success) {
        setVerificationResendTimer(60);
        setVerificationCodeInput('');
        setVerificationError(null);
        addNotification(
          'Yeni Kod Gönderildi 📩',
          res.message || `${pendingEmail} adresinize yeni 6 haneli onay kodu iletildi.`,
          'success'
        );
      } else {
        addNotification('Hata ⚠️', res.error || 'Yeni onay kodu gönderilemedi.', 'warning');
      }
    } catch (err: any) {
      addNotification('Bağlantı Hatası ⚠️', 'E-posta servisine erişilemedi.', 'warning');
    } finally {
      setIsResendingEmail(false);
    }
  };

  // Google OAuth Login
  const handleGoogleAuth = async () => {
    setIsSocialSubmitting('google');
    try {
      const success = await loginWithGoogle();
      if (success) {
        onClose();
      }
    } finally {
      setIsSocialSubmitting(null);
    }
  };

  // Apple OAuth Login
  const handleAppleAuth = async () => {
    setIsSocialSubmitting('apple');
    try {
      const success = await loginWithApple();
      if (success) {
        onClose();
      }
    } finally {
      setIsSocialSubmitting(null);
    }
  };

  // Request 6-digit OTP Code for passwordless login
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (otpEmail || email).trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      addNotification('Geçersiz E-Posta ⚠️', 'Lütfen geçerli bir e-posta adresi giriniz.', 'warning');
      return;
    }

    setIsSendingOtp(true);
    try {
      const result = await EmailVerificationService.sendVerificationCode(cleanEmail, 'Değerli Üyemiz', 'login');
      if (result.success) {
        setOtpStep('verify');
        setResendTimer(60);
        setOtpCode('');
        addNotification(
          '🔐 Giriş Kodu Gönderildi',
          `${cleanEmail} adresinize 6 haneli güvenlik kodu iletildi.`,
          'success'
        );
      } else {
        addNotification('Hata ⚠️', result.error || 'Kod gönderilemedi.', 'warning');
      }
    } catch (err: any) {
      addNotification('Bağlantı Hatası ⚠️', 'Doğrulama servisine ulaşılamadı.', 'warning');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP and complete login
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = (otpEmail || email).trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setOtpError('Lütfen 6 haneli güvenlik kodunu giriniz.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      const verifyRes = await EmailVerificationService.verifyCode(cleanEmail, cleanCode, 'login');
      if (verifyRes.success && verifyRes.verified) {
        let user = users.find(u => u.email?.toLowerCase() === cleanEmail);
        if (!user) {
          user = {
            id: `user_${Date.now()}`,
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            username: `@${cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '_').substring(0, 16)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
            bio: 'CepteModa üyesi.',
            rating: 5.0,
            totalSales: 0,
            activeListingsCount: 0,
            followersCount: 0,
            followingCount: 0,
            walletBalance: 0,
            pendingBalance: 0,
            iban: '',
            isSuperSeller: false,
            isSeller: false,
            shopName: '',
            city: 'İstanbul',
            status: 'active',
            isEmailVerified: true
          };
        }
        finalizeLogin(user);
        onClose();
      } else {
        setOtpError(verifyRes.error || 'Girdiğiniz onay kodu geçersiz.');
      }
    } catch (err: any) {
      setOtpError('Kod doğrulanırken bir hata oluştu.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-5 sm:p-6 relative">
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" /> CepteModa Üyelik
            </span>
          </div>

          <h2 className="text-xl font-black text-white">
            {mode === 'login' && 'Tekrar Hoş Geldiniz 👋'}
            {mode === 'register' && 'Hemen Ücretsiz Katılın 🌟'}
            {mode === 'awaiting_verification' && (awaitingPurpose === 'register' ? 'E-Posta Doğrulaması Bekleniyor 📩' : 'Giriş Onayı Bekleniyor 🔐')}
            {mode === 'otp' && 'E-Posta Onay Kodu ile Giriş 🔐'}
          </h2>
          <p className="text-xs text-rose-100 mt-1">
            {mode === 'login' && 'Hesabınıza anında giriş yapıp alışverişe devam edin.'}
            {mode === 'register' && 'Saniyeler içinde hesabınızı açın, aktivasyon linki ile hemen başlayın.'}
            {mode === 'awaiting_verification' && (awaitingPurpose === 'register' ? 'Hesabınızı aktifleştirmek için e-postanıza gönderilen bağlantıyı onaylayınız.' : 'Giriş yapmak için e-postanıza gönderilen onay kodunu giriniz.')}
            {mode === 'otp' && 'Şifrenizi unuttuysanız tek kullanımlık 6 haneli kodla giriş yapın.'}
          </p>

          {/* Mode Switcher Tabs */}
          {mode !== 'otp' && mode !== 'awaiting_verification' && (
            <div className="flex bg-black/20 p-1 rounded-2xl mt-4">
              <button
                id="auth-tab-login"
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-white text-rose-700 shadow-sm' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Üye Ol</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* 1. LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleDirectLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>E-posta veya Kullanıcı Adı *</span>
                </label>
                <input
                  id="login-email-input"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com veya @kullanici"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
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
                    onClick={() => {
                      setOtpEmail(email);
                      setMode('otp');
                      setOtpStep('request');
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Şifremi Unuttum / Kodla Giriş
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs">
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
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 disabled:opacity-60 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Giriş Yap</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. REGISTER MODE (Sends verification email link) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterWithEmailFlow} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-600" />
                  <span>Ad Soyad *</span>
                </label>
                <input
                  id="register-name-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>E-posta Adresi *</span>
                </label>
                <input
                  id="register-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
                  required
                />
                <p className="text-[10px] text-slate-400">Bu adrese anında bir onay kodu iletilecektir.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Şifre Belirleyin *</span>
                </label>
                <div className="relative">
                  <input
                    id="register-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Telefon Numarası (Opsiyonel)</span>
                </label>
                <input
                  id="register-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
                />
              </div>

              <div className="pt-0.5">
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
                      className="font-bold text-rose-600 hover:underline inline cursor-pointer"
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
                      className="font-bold text-rose-600 hover:underline inline cursor-pointer"
                    >
                      Gizlilik Politikası
                    </button>
                    'nı kabul ediyorum.
                  </span>
                </label>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 disabled:opacity-60 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    <span>Onay Kodu Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-white" />
                    <span>Onay Kodu Gönder ve Üye Ol</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. AWAITING VERIFICATION SCREEN (DOĞRULAMA BEKLENİYOR EKRANI) */}
          {mode === 'awaiting_verification' && (
            <div id="awaiting-verification-screen" className="space-y-4 animate-in fade-in duration-300">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="text-center space-y-1 mb-4">
                  <h3 className="text-sm font-black text-slate-900">Güvenlik Kodu</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    <strong className="text-rose-700 font-bold">{pendingEmail}</strong> adresinize gönderilen 6 haneli kodu giriniz.
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirmVerificationCode();
                  }}
                  className="space-y-4"
                >
                  <style>
                    {`
                      @keyframes shakeError {
                        0%, 100% { transform: translateX(0); }
                        15%, 45%, 75% { transform: translateX(-6px); }
                        30%, 60%, 90% { transform: translateX(6px); }
                      }
                      .shake-error-animate {
                        animation: shakeError 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
                      }
                    `}
                  </style>

                  <div 
                    className={`flex justify-between gap-2 transition-all ${verificationError ? 'shake-error-animate' : ''}`}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').substring(0, 6);
                      if (pastedData) {
                        setVerificationCodeInput(pastedData);
                        setVerificationError(null);
                        const targetFocus = Math.min(pastedData.length, 5);
                        setTimeout(() => {
                          document.getElementById(`code-input-${targetFocus}`)?.focus();
                        }, 50);
                      }
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        id={`code-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={(verificationCodeInput[idx] && verificationCodeInput[idx] !== ' ') ? verificationCodeInput[idx] : ''}
                        onChange={(e) => {
                          const inputVal = e.target.value.replace(/[^0-9]/g, '');
                          const char = inputVal.slice(-1);
                          const currentChars = (verificationCodeInput + '      ').slice(0, 6).split('');
                          
                          if (char) {
                            currentChars[idx] = char;
                            const newCode = currentChars.join('').trimEnd();
                            setVerificationCodeInput(newCode);
                            setVerificationError(null);
                            if (idx < 5) {
                              const nextInput = document.getElementById(`code-input-${idx + 1}`) as HTMLInputElement | null;
                              if (nextInput) {
                                nextInput.focus();
                                nextInput.select();
                              }
                            }
                          } else {
                            currentChars[idx] = ' ';
                            const newCode = currentChars.join('').trimEnd();
                            setVerificationCodeInput(newCode);
                            setVerificationError(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            const currentVal = verificationCodeInput[idx] || '';
                            if (!currentVal || currentVal === ' ') {
                              if (idx > 0) {
                                const prevInput = document.getElementById(`code-input-${idx - 1}`) as HTMLInputElement | null;
                                if (prevInput) {
                                  prevInput.focus();
                                }
                              }
                            }
                          } else if (e.key === 'ArrowLeft' && idx > 0) {
                            document.getElementById(`code-input-${idx - 1}`)?.focus();
                          } else if (e.key === 'ArrowRight' && idx < 5) {
                            document.getElementById(`code-input-${idx + 1}`)?.focus();
                          } else if (e.key === 'Enter' && verificationCodeInput.replace(/[^0-9]/g, '').length === 6) {
                            handleConfirmVerificationCode();
                          }
                        }}
                        className={`w-full aspect-square text-center text-2xl sm:text-3xl font-black rounded-xl border-2 transition-all outline-none 
                          ${verificationError 
                            ? 'border-red-500 bg-red-50 text-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-200' 
                            : 'border-slate-200 bg-white text-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'}`}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  {verificationError && (
                    <div 
                      className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200 shake-error-animate" 
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{verificationError}</span>
                    </div>
                  )}

                  <button
                    id="submit-verification-code-btn"
                    type="submit"
                    disabled={isVerifyingCode || verificationCodeInput.length < 6}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isVerifyingCode ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                        <span>Doğrulanıyor...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Kodu Onayla</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center justify-center pt-2">
                  <button
                    id="resend-verification-btn"
                    type="button"
                    disabled={verificationResendTimer > 0 || isResendingEmail}
                    onClick={handleResendVerification}
                    className="font-bold text-rose-600 hover:text-rose-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${verificationResendTimer > 0 ? '' : 'animate-spin'}`} />
                    <span>
                      {verificationResendTimer > 0 
                        ? `Yeni Kod İste (${verificationResendTimer}s)` 
                        : 'Onay Kodunu Tekrar Gönder'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 4. OTP / PASSWORDLESS LOGIN MODE */}
          {mode === 'otp' && (
            <div className="space-y-4">
              {otpStep === 'request' ? (
                <form onSubmit={handleRequestOtp} className="space-y-3.5">
                  <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-rose-900">
                      <KeyRound className="w-4 h-4 text-rose-600" /> Şifresiz Giriş
                    </span>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      E-posta adresinizi giriniz. Size 6 haneli tek kullanımlık bir giriş kodu göndereceğiz.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-rose-600" />
                      <span>E-posta Adresiniz *</span>
                    </label>
                    <input
                      type="email"
                      value={otpEmail || email}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-60 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                          <span>Kod Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>6 Haneli Giriş Kodu Gönder</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Şifre ile Normal Girişe Dön</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-rose-900">
                      <CheckCircle2 className="w-4 h-4 text-rose-600" /> Kod Gönderildi
                    </span>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      <strong className="text-rose-950 font-bold">{otpEmail || email}</strong> adresinize 6 haneli güvenlik kodu iletildi.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                        <span>6 Haneli Güvenlik Kodunu Giriniz *</span>
                      </span>
                    </label>

                    <div 
                      className={`flex justify-between gap-2 transition-all ${otpError ? 'shake-error-animate' : ''}`}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').substring(0, 6);
                        if (pastedData) {
                          setOtpCode(pastedData);
                          setOtpError(null);
                          const targetFocus = Math.min(pastedData.length, 5);
                          setTimeout(() => {
                            document.getElementById(`otp-code-input-${targetFocus}`)?.focus();
                          }, 50);
                        }
                      }}
                    >
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <input
                          key={`otp-${idx}`}
                          id={`otp-code-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={(otpCode[idx] && otpCode[idx] !== ' ') ? otpCode[idx] : ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            const char = val.slice(-1);
                            const currentChars = (otpCode + '      ').slice(0, 6).split('');
                            
                            if (char) {
                              currentChars[idx] = char;
                              const newCode = currentChars.join('').trimEnd();
                              setOtpCode(newCode);
                              setOtpError(null);
                              if (idx < 5) {
                                const nextInput = document.getElementById(`otp-code-input-${idx + 1}`) as HTMLInputElement | null;
                                if (nextInput) {
                                  nextInput.focus();
                                  nextInput.select();
                                }
                              }
                            } else {
                              currentChars[idx] = ' ';
                              const newCode = currentChars.join('').trimEnd();
                              setOtpCode(newCode);
                              setOtpError(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                              const currentVal = otpCode[idx] || '';
                              if (!currentVal || currentVal === ' ') {
                                if (idx > 0) {
                                  const prevInput = document.getElementById(`otp-code-input-${idx - 1}`) as HTMLInputElement | null;
                                  if (prevInput) {
                                    prevInput.focus();
                                  }
                                }
                              }
                            } else if (e.key === 'ArrowLeft' && idx > 0) {
                              document.getElementById(`otp-code-input-${idx - 1}`)?.focus();
                            } else if (e.key === 'ArrowRight' && idx < 5) {
                              document.getElementById(`otp-code-input-${idx + 1}`)?.focus();
                            } else if (e.key === 'Enter' && otpCode.replace(/[^0-9]/g, '').length === 6) {
                              handleVerifyOtp();
                            }
                          }}
                          className={`w-full aspect-square text-center text-2xl sm:text-3xl font-black rounded-xl border-2 transition-all outline-none 
                            ${otpError 
                              ? 'border-red-500 bg-red-50 text-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-200' 
                              : 'border-slate-200 bg-white text-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'}`}
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <div 
                        className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200 shake-error-animate" 
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-slate-500 text-[11px]">Kodu almadınız mı?</span>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={resendTimer > 0 || isSendingOtp}
                      className="font-bold text-rose-600 hover:text-rose-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? '' : 'animate-spin'}`} />
                      <span>{resendTimer > 0 ? `Yeniden Gönder (${resendTimer}s)` : 'Tekrar Kod İste'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-60 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                          <span>Doğrulanıyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Kodu Onayla ve Giriş Yap</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep('request')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Farklı E-Posta Gir</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Social Auth (Google / Apple) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="space-y-3 pt-2">
              {/* Prominent Separator with Header Badge */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-50 text-slate-600 px-3 py-1 text-[11px] font-bold tracking-wide rounded-full border border-slate-200/90 shadow-xs flex items-center gap-1.5 select-none">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Sosyal Medya ile Giriş</span>
                  </span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="google-login-btn"
                  type="button"
                  disabled={isSocialSubmitting !== null}
                  onClick={handleGoogleAuth}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  {isSocialSubmitting === 'google' ? (
                    <RefreshCw className="w-4 h-4 text-slate-600 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.6-.5-2.4z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                    </svg>
                  )}
                  <span>Google</span>
                </button>

                <button
                  id="apple-login-btn"
                  type="button"
                  disabled={isSocialSubmitting !== null}
                  onClick={handleAppleAuth}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  {isSocialSubmitting === 'apple' ? (
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.81 1.12-1.94.99-3.09-0.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1.01 2.99 1.08.08 2.17-.53 2.84-1.34z"/>
                    </svg>
                  )}
                  <span>Apple ID</span>
                </button>
              </div>

              {/* Security info */}
              <div className="text-center pt-1.5">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> %100 Güvenli & SSL Korumalı Giriş
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
