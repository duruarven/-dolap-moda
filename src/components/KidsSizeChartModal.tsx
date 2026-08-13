import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check, Info, Baby } from 'lucide-react';

interface KidsSizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
  selectedSize?: string;
}

export interface KidsSizeData {
  ageGroup: string;
  height: string;
  weight: string;
  chest: string;
  waist: string;
  sizeCode: string;
  category: 'bebek' | 'cocuk';
}

export const KIDS_SIZE_CHART: KidsSizeData[] = [
  // Bebek (0 - 24 Ay)
  { ageGroup: '0 - 3 Ay', height: '56 - 62 cm', weight: '3 - 5 kg', chest: '40 - 43 cm', waist: '41 - 43 cm', sizeCode: '0-3 Ay (56-62 cm)', category: 'bebek' },
  { ageGroup: '3 - 6 Ay', height: '62 - 68 cm', weight: '5 - 7.5 kg', chest: '43 - 45 cm', waist: '43 - 45 cm', sizeCode: '3-6 Ay (62-68 cm)', category: 'bebek' },
  { ageGroup: '6 - 12 Ay', height: '68 - 80 cm', weight: '7.5 - 10 kg', chest: '45 - 47 cm', waist: '45 - 47 cm', sizeCode: '6-12 Ay (68-80 cm)', category: 'bebek' },
  { ageGroup: '12 - 18 Ay', height: '80 - 86 cm', weight: '10 - 11.5 kg', chest: '47 - 49 cm', waist: '47 - 49 cm', sizeCode: '12-18 Ay (80-86 cm)', category: 'bebek' },
  { ageGroup: '18 - 24 Ay', height: '86 - 92 cm', weight: '11.5 - 13 kg', chest: '49 - 51 cm', waist: '49 - 50 cm', sizeCode: '18-24 Ay (86-92 cm)', category: 'bebek' },
  
  // Çocuk (2 - 14 Yaş)
  { ageGroup: '2 - 3 Yaş', height: '92 - 98 cm', weight: '13 - 15 kg', chest: '51 - 53 cm', waist: '50 - 52 cm', sizeCode: '2-3 Yaş (92-98 cm)', category: 'cocuk' },
  { ageGroup: '3 - 4 Yaş', height: '98 - 104 cm', weight: '15 - 17 kg', chest: '53 - 55 cm', waist: '52 - 54 cm', sizeCode: '3-4 Yaş (98-104 cm)', category: 'cocuk' },
  { ageGroup: '4 - 5 Yaş', height: '104 - 110 cm', weight: '17 - 19 kg', chest: '55 - 57 cm', waist: '54 - 55 cm', sizeCode: '4-5 Yaş (104-110 cm)', category: 'cocuk' },
  { ageGroup: '6 - 7 Yaş', height: '116 - 122 cm', weight: '22 - 25 kg', chest: '59 - 62 cm', waist: '56 - 58 cm', sizeCode: '6-7 Yaş (116-122 cm)', category: 'cocuk' },
  { ageGroup: '8 - 9 Yaş', height: '128 - 134 cm', weight: '28 - 32 kg', chest: '64 - 67 cm', waist: '59 - 61 cm', sizeCode: '8-9 Yaş (128-134 cm)', category: 'cocuk' },
  { ageGroup: '10 - 12 Yaş', height: '140 - 152 cm', weight: '36 - 45 kg', chest: '70 - 75 cm', waist: '62 - 65 cm', sizeCode: '10-12 Yaş (140-152 cm)', category: 'cocuk' },
  { ageGroup: '13 - 14 Yaş', height: '158 - 164 cm', weight: '48 - 55 kg', chest: '78 - 82 cm', waist: '66 - 69 cm', sizeCode: '13-14 Yaş (158-164 cm)', category: 'cocuk' },
];

export const KidsSizeChartModal: React.FC<KidsSizeChartModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
  selectedSize,
}) => {
  const [activeTab, setActiveTab] = useState<'hepsi' | 'bebek' | 'cocuk'>('hepsi');

  if (!isOpen) return null;

  const filteredData = KIDS_SIZE_CHART.filter(item => {
    if (activeTab === 'bebek') return item.category === 'bebek';
    if (activeTab === 'cocuk') return item.category === 'cocuk';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Çocuk Beden Ölçü Tablosu</span>
                <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full font-bold">
                  Standart Ölçüler
                </span>
              </h2>
              <p className="text-xs text-amber-100">
                Bebek ve çocuk giyiminde yaş, boy ve kilo uyum rehberi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveTab('hepsi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hepsi'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tüm Yaş Grupları
            </button>
            <button
              onClick={() => setActiveTab('bebek')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bebek'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              👶 Bebek (0 - 24 Ay)
            </button>
            <button
              onClick={() => setActiveTab('cocuk')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cocuk'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🧒 Çocuk (2 - 14 Yaş)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
            <Ruler className="w-3.5 h-3.5 text-slate-400" />
            <span>Ölçüler cm cinsindendir</span>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  <th className="p-3 border-b border-slate-200">Yaş / Ay Grubu</th>
                  <th className="p-3 border-b border-slate-200">Boy (cm)</th>
                  <th className="p-3 border-b border-slate-200">Tahmini Kilo</th>
                  <th className="p-3 border-b border-slate-200">Göğüs Çevresi</th>
                  <th className="p-3 border-b border-slate-200">Bel Çevresi</th>
                  {onSelectSize && <th className="p-3 border-b border-slate-200 text-right">Seç</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredData.map((row, idx) => {
                  const isSelected = selectedSize === row.sizeCode || selectedSize === row.ageGroup;
                  return (
                    <tr
                      key={idx}
                      className={`transition-colors hover:bg-rose-50/50 ${
                        isSelected ? 'bg-rose-100/60 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>{row.ageGroup}</span>
                      </td>
                      <td className="p-3 text-slate-700 font-semibold">{row.height}</td>
                      <td className="p-3 text-slate-600">{row.weight}</td>
                      <td className="p-3 text-slate-600">{row.chest}</td>
                      <td className="p-3 text-slate-600">{row.waist}</td>
                      {onSelectSize && (
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSize(row.sizeCode);
                              onClose();
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-200 hover:bg-rose-600 hover:text-white text-slate-800'
                            }`}
                          >
                            {isSelected ? 'Seçili ✓' : 'Seç'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tips Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Çocuk Beden Seçim İpuçları 💡</span>
            </div>
            <ul className="list-disc list-inside text-amber-800 space-y-1 text-[11px] leading-relaxed">
              <li>Çocuklar hızlı büyüdüğü için iki beden arasında kalındığında <strong>bir büyük bedeni</strong> tercih etmeniz önerilir.</li>
              <li>Bebek tulumlarında boy ölçüsü en belirleyici kriterdir; bebeğinizin tepeden topuğa olan uzunluğunu baz alın.</li>
              <li>Sıkı oturan giysiler yerine esnek ve nefes alabilen pamuklu kumaşları tercih edebilirsiniz.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Markaların kalıplarına göre 1-2 cm farklılık gösterebilir.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
