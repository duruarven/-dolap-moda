import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  quickSuggestions?: string[];
}

export const AiAssistantView: React.FC = () => {
  const { selectedProduct, setViewMode, setSelectedProduct } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Merhaba! Ben CepteModa Yapay Zeka Moda & Pazarlık Asistanıyım. ✨\n\nİkinci el ürün seçimi, kombin önerileri, fiyatta ne kadar pazarlık yapabileceğin veya ilan açıklaması yazma konusunda sana yardımcı olabilirim.',
      quickSuggestions: [
        'Bu ayakkabı hangi kombinle giyilir?',
        'İkinci el ürüne teklif verirken nelere dikkat etmeliyim?',
        'CepteModa Alıcı Güvencesi nasıl çalışır?'
      ]
    }
  ]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/fashion-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          contextProduct: selectedProduct ? {
            title: selectedProduct.title,
            brand: selectedProduct.brand,
            price: selectedProduct.price,
            condition: selectedProduct.condition
          } : undefined
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: resData.data.reply,
          quickSuggestions: resData.data.quickSuggestions
        }]);
      } else {
        throw new Error(resData.error || 'AI yanıt veremedi');
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Size şu an cevap verirken bir aksaklık oluştu. Genel tavsiyem: Dolap ve Gardrops gibi platformlarda satıcı puanı yüksek olan ve detaylı fotoğraf yükleyen ilanları tercih etmenizdir.',
        quickSuggestions: ['Başka ne sorabilirim?']
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-4 rounded-3xl shadow-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold flex items-center gap-1.5">
            <span>CepteModa AI Moda Asistanı</span>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-2 py-0.2 rounded-full">
              GEMINI 3.6
            </span>
          </h1>
          <p className="text-xs text-slate-300">Pazarlık tüyoları, kombin tavsiyeleri ve ilan rehberi</p>
        </div>
      </div>

      {/* Product context banner if inspecting a product */}
      {selectedProduct && (
        <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <img src={selectedProduct.images[0]} alt="ürün" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-slate-800 truncate">İncelenen Ürün: {selectedProduct.title} (₺{selectedProduct.price})</span>
          </div>
          <button
            onClick={() => {
              setViewMode('product_detail');
            }}
            className="text-rose-600 font-bold hover:underline shrink-0 text-[11px]"
          >
            Ürüne Git
          </button>
        </div>
      )}

      {/* Messages Window */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3 min-h-[420px] max-h-[500px] overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
            <div className={`p-3.5 rounded-2xl text-xs space-y-1.5 max-w-lg shadow-2xs ${
              m.sender === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 pb-1 border-b border-slate-200/40">
                {m.sender === 'user' ? <User className="w-3 h-3 text-rose-400" /> : <Bot className="w-3 h-3 text-purple-600" />}
                <span>{m.sender === 'user' ? 'Sen' : 'Moda AI Asistanı'}</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-xs">{m.text}</p>
            </div>

            {/* Quick Suggestions Chips */}
            {m.quickSuggestions && m.quickSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {m.quickSuggestions.map((qs, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qs)}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded-full border border-rose-200 transition-colors flex items-center gap-1"
                  >
                    <span>{qs}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
            <Bot className="w-4 h-4 text-purple-600" />
            <span>AI Asistan düşünüyor...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Moda, kombin veya teklif tavsiyesi isteyin (örn: Zara elbise için kaç TL teklif edeyim?)..."
          className="flex-1 px-4 py-3 bg-white text-xs border border-slate-200 rounded-2xl outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Gönder</span>
        </button>
      </form>
    </div>
  );
};
