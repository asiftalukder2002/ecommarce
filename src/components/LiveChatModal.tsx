import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Product, UserProfile } from '../types';
import { subscribeToChatMessages, sendChatMessageToFirestore } from '../services/firebaseService';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  productContext?: Product | null;
  onOpenAuth: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  productContext,
  onOpenAuth,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [guestName, setGuestName] = useState(currentUser?.displayName || 'Customer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill inquiry greeting if productContext changed
  useEffect(() => {
    if (productContext && inputText === '') {
      setInputText(`Hello! Is "${productContext.name}" available in stock? What is the delivery time to Dhaka?`);
    }
  }, [productContext]);

  // Subscribe to real-time chat messages from Firestore
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToChatMessages((liveMessages) => {
      setMessages(liveMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const senderName = currentUser?.displayName || guestName || 'Customer';
      const senderAvatar = currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`;
      const senderRole = currentUser?.role === 'admin' ? 'support' : currentUser?.role === 'seller' ? 'seller' : 'user';

      const newMessage: Omit<ChatMessage, 'id'> = {
        userId: currentUser?.uid || 'guest-session',
        userName: senderName,
        userAvatar: senderAvatar,
        text: textToSend,
        senderRole: senderRole,
        productId: productContext?.id,
        productName: productContext?.name,
        createdAt: new Date().toISOString(),
      };

      await sendChatMessageToFirestore(newMessage);
    } catch (err) {
      console.error('Failed to send message to Firestore:', err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 flex flex-col h-[85vh] max-h-[640px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Chat Header */}
        <div className="bg-[#f0f4ff] p-4 border-b border-[#bbcbb9]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#006d2f] text-white flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#141b2b]">
                  Luma Live Support & Seller Inquiry
                </h3>
                <span className="text-[10px] font-extrabold bg-[#e9f7ef] text-[#006d2f] px-2 py-0.5 rounded-full">
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-[#3c4a3d]">
                {currentUser ? `Logged in as ${currentUser.displayName}` : 'Active customer help desk'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Product Context Banner (if inquiring about specific product) */}
        {productContext && (
          <div className="bg-[#fff9e6] px-4 py-2.5 border-b border-[#ffe082]/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={productContext.image}
                alt={productContext.name}
                className="w-8 h-8 rounded-lg object-cover border border-amber-200 shrink-0"
              />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-amber-900 block">Inquiring about:</span>
                <span className="font-bold text-[#141b2b] truncate">{productContext.name}</span>
              </div>
            </div>
            <span className="font-extrabold text-[#006d2f] shrink-0">
              {productContext.currency} {productContext.price.toLocaleString()}
            </span>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfbff]">
          {/* Welcome Message */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#006d2f] text-white flex items-center justify-center text-xs font-bold shrink-0">
              L
            </div>
            <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-xs border border-slate-200 shadow-xs text-xs text-[#141b2b]">
              <p className="font-bold text-[11px] text-[#006d2f] mb-1">Luma Official Support</p>
              <p>
                স্বাগতম! পণ্য সম্পর্কে যেকোনো তথ্য, স্টক কোয়েরি বা ডেলিভারি নিয়ে প্রশ্ন থাকলে এখানে লিখুন। সব মেসেজ সরাসরি ক্লাউড ফায়ারবেসে সেভ হচ্ছে।
              </p>
              <span className="block text-[9.5px] text-slate-400 text-right mt-1.5">Live 24/7</span>
            </div>
          </div>

          {/* Rendered Firestore Messages */}
          {messages.map((msg) => {
            const isMe =
              currentUser?.uid === msg.userId ||
              (msg.senderRole === 'user' && !currentUser && msg.userId === 'guest-session');

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isMe
                      ? 'bg-[#316bf3] text-white'
                      : msg.senderRole === 'seller'
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#006d2f] text-white'
                  }`}
                >
                  {msg.userName.charAt(0).toUpperCase()}
                </div>

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs shadow-xs ${
                    isMe
                      ? 'bg-[#006d2f] text-white rounded-tr-xs'
                      : 'bg-white text-[#141b2b] rounded-tl-xs border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`font-bold text-[10.5px] ${
                        isMe ? 'text-emerald-100' : 'text-[#006d2f]'
                      }`}
                    >
                      {msg.userName}{' '}
                      {msg.senderRole === 'seller' && '(Seller)'}
                      {msg.senderRole === 'support' && '(Support)'}
                    </span>
                    <span
                      className={`text-[9px] ${
                        isMe ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {msg.productName && (
                    <div
                      className={`text-[10px] px-2 py-0.5 rounded mb-1 font-semibold flex items-center gap-1 ${
                        isMe
                          ? 'bg-black/15 text-white'
                          : 'bg-[#f0f4ff] text-[#316bf3]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                      <span className="truncate">Product: {msg.productName}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 py-1.5 bg-[#f0f4ff]/60 border-t border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar">
          <button
            onClick={() => handleQuickQuestion('Is this available in stock? (মজুদ আছে কি?)')}
            className="text-[11px] font-medium bg-white hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0 text-[#141b2b] transition-colors"
          >
            📦 Check Stock (স্টক আছে?)
          </button>
          <button
            onClick={() => handleQuickQuestion('What is the delivery fee to Dhaka / Outside Dhaka?')}
            className="text-[11px] font-medium bg-white hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0 text-[#141b2b] transition-colors"
          >
            🚚 Delivery Info (ডেলিভারি চার্জ)
          </button>
          <button
            onClick={() => handleQuickQuestion('Can I pay Cash on Delivery (ক্যাশ অন ডেলিভারি)?')}
            className="text-[11px] font-medium bg-white hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0 text-[#141b2b] transition-colors"
          >
            💵 Cash on Delivery?
          </button>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex flex-col gap-2">
          {!currentUser && (
            <div className="flex items-center justify-between text-[11px] text-[#3c4a3d] px-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Chatting as:</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="px-2 py-0.5 rounded bg-slate-100 text-xs font-bold text-[#141b2b] border border-slate-200 outline-none w-28"
                  placeholder="Your Name"
                />
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-[#006d2f] font-bold hover:underline"
              >
                Login for sync
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message / প্রশ্ন লিখুন..."
              className="flex-1 h-11 px-4 bg-[#e9edff] rounded-2xl text-xs sm:text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f] transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="w-11 h-11 rounded-2xl bg-[#006d2f] text-white flex items-center justify-center hover:bg-[#005523] active:scale-95 transition-all disabled:opacity-40 shrink-0 shadow-sm"
            >
              {sending ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
