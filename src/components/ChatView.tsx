import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, Tag, Check, X, ShieldCheck, ChevronRight, ShoppingBag } from 'lucide-react';

export const ChatView: React.FC = () => {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    messages, 
    sendMessage, 
    respondToOffer, 
    currentUser,
    products,
    setSelectedProduct,
    setViewMode
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');

  const activeMessages = activeConversation 
    ? messages.filter(m => m.conversationId === activeConversation.id)
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const currentProduct = activeConversation 
    ? products.find(p => p.id === activeConversation.productId)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-24">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
        {/* Left Column: Conversations List */}
        <div className="border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-600" />
              <span>Sohbetler & Teklifler</span>
            </h2>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[500px]">
            {conversations.map(conv => {
              const isActive = activeConversation?.id === conv.id;
              const isSellerMe = conv.sellerId === currentUser.id;
              const otherPartyName = isSellerMe ? conv.buyerName : conv.sellerName;
              const otherPartyAvatar = isSellerMe ? conv.buyerAvatar : conv.sellerAvatar;

              return (
                <button
                  key={conv.id}
                  id={`conv-item-${conv.id}`}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-3.5 flex items-center gap-3 transition-colors text-left ${
                    isActive ? 'bg-rose-50/70 border-l-4 border-rose-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <img src={otherPartyAvatar} alt={otherPartyName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate">{otherPartyName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">{conv.productTitle}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{conv.lastMessage}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Chat Room */}
        <div className="col-span-2 flex flex-col justify-between bg-slate-50/50">
          {activeConversation ? (
            <>
              {/* Top Product Header */}
              <div className="bg-white p-3 border-b border-slate-200 flex items-center justify-between shadow-2xs">
                <div 
                  id="chat-product-header"
                  onClick={() => {
                    if (currentProduct) {
                      setSelectedProduct(currentProduct);
                      setViewMode('product_detail');
                    }
                  }}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1 truncate"
                >
                  <img src={activeConversation.productImage} alt="ürün" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="truncate">
                    <h3 className="text-xs font-bold text-slate-800 truncate">{activeConversation.productTitle}</h3>
                    <div className="text-xs font-black text-rose-600">₺{activeConversation.productPrice.toLocaleString('tr-TR')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="chat-view-product-btn"
                    onClick={() => {
                      if (currentProduct) {
                        setSelectedProduct(currentProduct);
                        setViewMode('product_detail');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Ürünü İncele
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[420px]">
                {activeMessages.map(m => {
                  const isMe = m.senderId === currentUser.id;

                  if (m.type === 'offer') {
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-sm w-full bg-white p-3.5 rounded-2xl border-2 border-rose-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-rose-700 border-b border-rose-100 pb-1.5">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5" /> Fiyat Teklifi
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{m.createdAt}</span>
                          </div>

                          <div className="text-xs text-slate-700 font-medium">
                            <span className="font-bold text-slate-900">{m.senderName}</span> bu ürün için <span className="text-sm font-black text-rose-600">₺{m.offerAmount}</span> teklif yaptı.
                          </div>

                          {/* Offer Status & Interactive Buttons */}
                          {m.offerStatus === 'pending' ? (
                            activeConversation.sellerId === currentUser.id ? (
                              <div className="flex gap-2 pt-1">
                                <button
                                  id={`accept-offer-${m.id}`}
                                  onClick={() => respondToOffer(m.id, 'accept')}
                                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Kabul Et
                                </button>
                                <button
                                  id={`decline-offer-${m.id}`}
                                  onClick={() => respondToOffer(m.id, 'decline')}
                                  className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" /> Reddet
                                </button>
                              </div>
                            ) : (
                              <div className="text-[11px] bg-rose-50 text-rose-700 font-bold p-2 rounded-xl text-center">
                                ⏳ Satıcının teklifinizi yanıtlaması bekleniyor.
                              </div>
                            )
                          ) : m.offerStatus === 'accepted' ? (
                            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-bold space-y-1.5 border border-emerald-200">
                              <div className="flex items-center gap-1 text-emerald-700">
                                <Check className="w-4 h-4" /> Teklif Kabul Edildi!
                              </div>
                              <p className="text-[11px] text-emerald-600 font-normal">
                                ₺{m.offerAmount} özel teklif fiyatıyla ürünü şimdi satın alabilirsiniz.
                              </p>
                              <button
                                id="chat-buy-accepted-offer"
                                onClick={() => {
                                  if (currentProduct) {
                                    setSelectedProduct({ ...currentProduct, price: m.offerAmount! });
                                    setViewMode('product_detail');
                                  }
                                }}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" /> hemen al • ₺{m.offerAmount}
                              </button>
                            </div>
                          ) : (
                            <div className="bg-slate-100 text-slate-500 p-2 rounded-xl text-xs font-semibold text-center">
                              ❌ Teklif reddedildi.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs space-y-1 shadow-2xs ${
                        isMe ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                      }`}>
                        <p className="leading-relaxed">{m.text}</p>
                        <span className={`text-[9px] block text-right font-medium ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                          {m.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-1 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => sendMessage('Kargoya ne zaman verebilirsiniz acaba?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-full whitespace-nowrap"
                >
                  🚚 Kargoya ne zaman verilir?
                </button>
                <button
                  onClick={() => sendMessage('Herhangi bir deformesi veya lekesi var mı?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-full whitespace-nowrap"
                >
                  ✨ Deforme var mı?
                </button>
                <button
                  onClick={() => sendMessage('En son kaç yapabilirsiniz?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-full whitespace-nowrap"
                >
                  💰 En son kaç olur?
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  id="chat-text-input"
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white"
                />
                <button
                  id="chat-send-btn"
                  type="submit"
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <h3 className="font-bold text-slate-700 text-sm">Sohbet Seçin</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Sol taraftan bir sohbet seçerek satıcı veya alıcılar ile mesajlaşabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
