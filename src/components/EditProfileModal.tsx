import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera, 
  User, 
  AtSign, 
  MapPin, 
  Phone, 
  FileText, 
  Save, 
  Sparkles, 
  Building2, 
  Upload, 
  Check, 
  RefreshCw,
  CreditCard,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset fashionable avatars for quick selection
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
];

const TURKISH_CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 
  'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Kocaeli', 
  'Eskişehir', 'Samsun', 'Denizli', 'Muğla', 'Trabzon', 
  'Kayseri', 'Diyarbakır', 'Sakarya', 'Aydın', 'Balıkesir'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile, addNotification } = useApp();

  const [name, setName] = useState(currentUser.name || '');
  const [username, setUsername] = useState(currentUser.username?.replace('@', '') || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [city, setCity] = useState(currentUser.city || 'İstanbul');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.deliveryAddress || '');
  const [shopName, setShopName] = useState(currentUser.shopName || '');
  const [iban, setIban] = useState(currentUser.iban || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'seller'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload for profile image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification('Görsel Çok Büyük ⚠️', 'Profil fotoğrafı en fazla 5 MB olabilir.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        addNotification('Görsel Yüklendi 📸', 'Profil fotoğrafınız güncellendi.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate a random fun avatar with Dicebear
  const handleGenerateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=ffd5dc,d1d4f9,c0aede,b6e3f4`;
    setAvatar(newAvatar);
  };

  // Save profile changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!cleanName) {
      addNotification('Eksik Bilgi ⚠️', 'Ad Soyad alanı boş bırakılamaz.', 'warning');
      return;
    }

    if (!cleanUsername) {
      addNotification('Eksik Bilgi ⚠️', 'Kullanıcı adı alanı boş bırakılamaz.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserProfile({
        name: cleanName,
        username: `@${cleanUsername}`,
        avatar: avatar.trim(),
        bio: bio.trim(),
        city,
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        ...(currentUser.isSeller ? {
          shopName: shopName.trim(),
          iban: iban.trim()
        } : {})
      });

      addNotification('Profil Güncellendi! ✨', 'Profil ve adres bilgileriniz başarıyla kaydedildi.', 'success');
      onClose();
    } catch (err: any) {
      console.error('Profile update error:', err);
      addNotification('Hata ⚠️', 'Profil güncellenirken bir sorun oluştu.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="edit-profile-modal-overlay" 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-pink-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Profili Düzenle</h2>
              <p className="text-xs text-slate-500">Kişisel bilgilerinizi ve teslimat adresinizi güncelleyin</p>
            </div>
          </div>
          <button 
            id="close-edit-profile-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Genel Bilgiler & Fotoğraf</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'address'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Teslimat Adresi & İletişim</span>
          </button>

          {currentUser.isSeller && (
            <button
              type="button"
              onClick={() => setActiveTab('seller')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'seller'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Mağaza & IBAN</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: GENERAL & AVATAR */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              
              {/* Profile Avatar Section */}
              <div className="bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-rose-500" /> Profil Fotoğrafı
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateRandomAvatar}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" /> Rastgele Avatar Üret
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Current Selected Avatar Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt="Profil Önizleme"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white ring-2 ring-rose-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
                    >
                      <Camera className="w-6 h-6" />
                      <span className="text-[9px] font-bold mt-0.5">Değiştir</span>
                    </button>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5 text-rose-500" />
                        <span>Cihazdan Fotoğraf Yükle</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent rounded-xl border border-slate-200 hover:bg-white transition-all"
                      >
                        URL ile Ekle
                      </button>
                    </div>

                    {showUrlInput && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="url"
                          placeholder="https://gorsel-linki.com/foto.jpg"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customAvatarUrl.trim()) {
                              setAvatar(customAvatarUrl.trim());
                              setShowUrlInput(false);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl"
                        >
                          Uygula
                        </button>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400">
                      JPG, PNG veya WEBP formatında, maksimum 5 MB.
                    </p>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <label className="text-[11px] font-bold text-slate-500">Veya Hazır Avatarlardan Seçin:</label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((preset, idx) => {
                      const isSelected = avatar === preset;
                      return (
                        <button
                          key={`preset-${idx}`}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`relative rounded-full shrink-0 transition-transform ${
                            isSelected ? 'ring-3 ring-rose-500 scale-105' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset}
                            alt={`Avatar ${idx + 1}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {isSelected && (
                            <span className="absolute bottom-0 right-0 bg-rose-500 text-white rounded-full p-0.5 shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Name & Username Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Ad Soyad <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız ve Soyadınız"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-slate-400" /> Kullanıcı Adı <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="kullanici_adiniz"
                      className="w-full pl-8 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Yaşadığınız Şehir
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800"
                >
                  {TURKISH_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Dolap / Profil Açıklaması (Biyografi)
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">{bio.length}/200</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kendinizden, stilinizden veya dolabınızdaki parçalardan bahsedin..."
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800 resize-none"
                />
              </div>

            </div>
          )}

          {/* TAB 2: ADDRESS & CONTACT */}
          {activeTab === 'address' && (
            <div className="space-y-5">
              
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-0.5">
                  <span className="font-bold block">Güvenli Sipariş & Teslimat Bilgisi</span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Sipariş verdiğiniz ürünler buraya kaydettiğiniz adrese kargolanır. Sipariş anında tekrar adres yazmanıza gerek kalmaz.
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> İletişim Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block">Kargo kuryesi teslimat durumunda bu numaradan iletişime geçebilir.</span>
              </div>

              {/* Delivery Full Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Tam Teslimat Adresi
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">{deliveryAddress.length}/300</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={300}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Mahalle, Cadde/Sokak, Bina No, Daire No, İlçe / Şehir..."
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800 resize-none"
                />
              </div>

              {/* Saved Address Preview Card */}
              {deliveryAddress && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> Kaydedilecek Varsayılan Adres
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">Varsayılan</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                    {deliveryAddress}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SELLER DETAILS */}
          {activeTab === 'seller' && currentUser.isSeller && (
            <div className="space-y-5">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-0.5">
                  <span className="font-bold block">Mağaza ve Ödeme Alma Ayarları</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Satışlarınız onaylandığında kazancınız belirttiğiniz IBAN hesabına aktarılır.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Mağaza / Butik Adı
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Örn: Vintage Moda Butik"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Kazanç Çekim IBAN No
                </label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-800 uppercase"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
            >
              Vazgeç
            </button>

            <button
              id="save-profile-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-200 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Değişiklikleri Kaydet</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;
