import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen,
  Printer,
  ChevronRight
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'kvkk';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms'
}) => {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'kvkk'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleAccept = () => {
    addNotification('Sözleşme Onaylandı', 'Kullanıcı sözleşmesi ve gizlilik politikasını kabul ettiniz.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-rose-500/30">
              <Scale className="w-3 h-3 text-rose-400" /> Yasal Bilgilendirme
            </span>
            <span className="text-slate-400 text-[10px] font-mono">Son Güncelleme: 12 Ağustos 2026</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>CepteModa Yasal Metinler</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            CepteModa platformunu kullanırken haklarınızı, yükümlülüklerinizi ve kişisel verilerinizin nasıl korunduğunu detaylarıyla inceleyin.
          </p>

          {/* Navigation Tabs */}
          <div className="flex bg-white/10 p-1 rounded-2xl mt-4 border border-white/10 overflow-x-auto">
            <button
              id="legal-tab-terms"
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kullanıcı Sözleşmesi</span>
            </button>

            <button
              id="legal-tab-privacy"
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Gizlilik Politikası</span>
            </button>

            <button
              id="legal-tab-kvkk"
              onClick={() => setActiveTab('kvkk')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === 'kvkk'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KVKK & Çerezler</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed flex-1">
          
          {/* TAB 1: KULLANICI SÖZLEŞMESİ */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
                <BookOpen className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">CepteModa Sıfır Etiketli & İkinci El Pazaryeri Kullanım Şartları</h4>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    İşbu Kullanıcı Sözleşmesi, CepteModa mobil uygulaması ve web platformu üzerinden alım-satım yapan tüm kullanıcıların hak ve sorumluluklarını düzenler.
                  </p>
                </div>
              </div>

              {/* Clause 1 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Taraflar ve Amaç</span>
                </h3>
                <p className="pl-7">
                  Bu sözleşme, CepteModa Teknoloji A.Ş. ("Platform") ile www.ceptemoda.com ve CepteModa uygulamasına üye olan veya uygulamayı ziyaret eden "Kullanıcı" arasında akdedilmiştir. Platform, sıfır etiketli ve ikinci el moda ve tekstil ürünlerinin alıcı ve satıcılar arasında güvenle el değiştirmesine aracılık eden pazaryeri sağlayıcısıdır.
                </p>
              </section>

              {/* Clause 2 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Üyelik Şartları ve Mağaza Açma</span>
                </h3>
                <ul className="pl-7 space-y-1.5 list-disc list-inside">
                  <li>Üye olmak isteyen kullanıcıların 18 yaşını doldurmuş olması gerekmektedir.</li>
                  <li>Satıcı hesabı açarak ilan yayınlayan kullanıcılar, sattıkları ürünlerin orijinal ve hukuka uygun olduğunu beyan ederler. Sahte, taklit veya replika ürün satışı kesinlikle yasaktır.</li>
                  <li>Satıcı, ilan başlığı, açıklaması ve görsellerinin ürünü doğru ve dürüst biçimde yansıttığını kabul ve taahhüt eder.</li>
                </ul>
              </section>

              {/* Clause 3 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Güvenli Ödeme ve Havuz Hesap Sistemi</span>
                </h3>
                <p className="pl-7">
                  CepteModa platformundaki tüm ödemeler <strong>Güvenli Havuz Hesap</strong> sistemi ile korunur. Alıcı sipariş verdiğinde ödeme CepteModa havuz hesabında bloke edilir. Ürün alıcıya ulaşıp onay verdikten veya yasal 48 saatlik onay süresi dolduktan sonra tutar satıcının cüzdan bakiyesine aktarılır.
                </p>
              </section>

              {/* Clause 4 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Kargo, İade ve Cayma Hakkı</span>
                </h3>
                <ul className="pl-7 space-y-1.5 list-disc list-inside">
                  <li>Satıcılar onaylanan siparişleri 3 iş günü içerisinde sisteme entegre kargo koduyla kargoya vermekle yükümlüdür.</li>
                  <li>İkinci el ürün satışında, satıcının ilanda belirttiği kusurlar haricinde giysinin tanımından farklı, hasarlı veya sahte çıkması durumunda alıcı koşulsuz iade hakkına sahiptir.</li>
                  <li>İade süreçleri CepteModa müşteri temsilcileri ve uzman kontrol ekibi tarafından incelenerek sonuçlandırılır.</li>
                </ul>
              </section>

              {/* Clause 5 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">5</span>
                  <span>Yasaklı Ürünler ve İhlaller</span>
                </h3>
                <p className="pl-7">
                  İkinci el iç giyim, kozmetik tester/kullanılmış ürünler, ateşli silahlar, taklit marka kıyafetler ve yasal mevzuata aykırı içerikler ilana koyulamaz. İhlal durumunda kullanıcının hesabı kalıcı olarak kapatılabilir.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: GİZLİLİK POLITIKASI */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3 text-indigo-900">
                <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">CepteModa Gizlilik ve Veri Güvenliği Taahhüdü</h4>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Kişisel verilerinizin gizliliği ve güvenliği bizim için en yüksek önceliktir. Bilgilerinizin nasıl toplandığını ve korunduğunu aşağıdan inceleyebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                  <span>1. Hangi Bilgileri Topluyoruz?</span>
                </h3>
                <p className="pl-6">
                  Üyelik kaydı esnasında verdiğiniz ad-soyad, e-posta adresi, telefon numarası, teslimat adresi, profil fotoğrafı ve alım-satım işlemlerine ait bakiye/IBAN bilgileriniz sistemimizde güvenle saklanır.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                  <span>2. Verilerin Kullanım Amaçları</span>
                </h3>
                <ul className="pl-6 space-y-1.5 list-disc list-inside">
                  <li>Siparişlerinizin kargolanması ve teslimat süreçlerinin takibi,</li>
                  <li>Ödeme işlemlerinin güvenli havuz altyapısı ile tamamlanması,</li>
                  <li>Kullanıcılar arası mesajlaşma ve teklif verme süreçlerinin yürütülmesi,</li>
                  <li>Şüpheli işlemlerin ve sahteciliğin önlenmesi amacıyla güvenlik denetimleri.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                  <span>3. Veri Paylaşımı ve Üçüncü Taraflar</span>
                </h3>
                <p className="pl-6">
                  Teslimatınızın gerçekleşmesi için adres ve telefon bilginiz anlaşmalı kargo firmalarıyla (Yurtiçi Kargo, Aras Kargo vb.) paylaşılır. Ödeme bilgileriniz 256-Bit SSL şifrelemeli BDDK lisanslı ödeme kuruluşları tarafından işlenir. Kart bilgileriniz kesinlikle CepteModa sunucularında tutulmaz.
                </p>
              </section>

              {/* Section 4 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                  <span>4. Veri Güvenliği ve Altyapı</span>
                </h3>
                <p className="pl-6">
                  Sunucularımız güncel güvenlik duvarları, veri şifreleme protokolleri ve sürekli siber güvenlik denetimleri ile korunmaktadır. Hesabınıza yetkisiz erişimi engellemek için güçlü şifre kombinasyonları kullanmanız önerilir.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: KVKK & ÇEREZLER */}
          {activeTab === 'kvkk' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">6698 Sayılı KVKK Aydınlatma Metni</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla haklarınız ve başvuru yollarınız aşağıda bilgilerinize sunulmuştur.
                  </p>
                </div>
              </div>

              {/* KVKK 1 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Veri Sahibi Olarak Haklarınız (Madde 11)</span>
                </h3>
                <p>KVKK'nın 11. maddesi uyarınca CepteModa'ya başvurarak:</p>
                <ul className="pl-6 space-y-1.5 list-disc list-inside">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>Verilerin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                  <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                  <li>KVKK'da öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme haklarına sahipsiniz.</li>
                </ul>
              </section>

              {/* KVKK 2 */}
              <section className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-600" />
                  <span>Çerez (Cookie) Kullanım Politikası</span>
                </h3>
                <p>
                  CepteModa, kullanıcı deneyimini iyileştirmek, oturumunuzu açık tutmak ve kişiselleştirilmiş ürün tavsiyeleri sunmak için zorunlu ve analitik çerezler kullanır.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <div className="font-bold text-slate-800">• Zorunlu Çerezler:</div>
                  <p className="text-slate-600">Sisteme güvenli giriş yapmanızı ve sepet/favori listenizi tutmanızı sağlar.</p>
                  <div className="font-bold text-slate-800 mt-2">• Performans ve Analiz Çerezleri:</div>
                  <p className="text-slate-600">Sitenin en çok ziyaret edilen kategorilerini tespit etmek ve hızı artırmak için kullanılır.</p>
                </div>
              </section>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Metni Yazdır / PDF İndir</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Okudum, Anladım ve Kabul Ediyorum</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
