import React, { useState, useEffect } from 'react';
import { Product, UserProfile, Order } from '../types';
import { subscribeToOrders } from '../services/firebaseService';

interface UserProfileModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  wishlistProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onGoToAdmin: () => void;
  onGoToSeller: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenChat: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  onClose,
  wishlistProducts,
  onSelectProduct,
  onGoToAdmin,
  onGoToSeller,
  onOpenAuth,
  onLogout,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders'>('wishlist');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      const unsubscribe = subscribeToOrders((orders) => {
        if (currentUser) {
          setUserOrders(orders.filter(o => o.userId === currentUser.uid || (currentUser.phone && o.customerPhone === currentUser.phone)));
        } else {
          setUserOrders(orders.slice(0, 5));
        }
        setLoadingOrders(false);
      });
      return () => unsubscribe();
    }
  }, [activeTab, currentUser]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006d2f] text-[22px]">
              account_circle
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#141b2b]">
              User Profile (ব্যবহারকারী একাউন্ট)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* User Card / Login Prompt */}
        {currentUser ? (
          <div className="my-4 bg-[#f0f4ff] p-4 rounded-2xl border border-[#bbcbb9]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#006d2f] text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-[#141b2b] truncate">
                    {currentUser.displayName || 'Luma Member'}
                  </h4>
                  <span
                    className="material-symbols-outlined text-[16px] text-[#006d2f]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="text-xs text-[#3c4a3d] truncate">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-[#25d366]/20 text-[#005523] text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {currentUser.role || 'customer'}
                  </span>
                  <span className="text-[10px] text-slate-500">Firebase Synced</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="Log out of account"
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 border border-rose-200"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="my-4 bg-[#f9f9ff] p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">person_off</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#141b2b]">Guest User (লগইন করা নেই)</h4>
                <p className="text-xs text-[#3c4a3d]">Login to track orders and sync data</p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-3.5 py-2 bg-[#006d2f] text-white rounded-xl text-xs font-bold hover:bg-[#005523] active:scale-95 transition-all shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Login / লগইন</span>
            </button>
          </div>
        )}

        {/* Tab switchers: Wishlist / Orders */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#3c4a3d]/80 hover:text-[#141b2b]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">favorite</span>
            <span>Wishlist ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#3c4a3d]/80 hover:text-[#141b2b]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>My Orders ({userOrders.length})</span>
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'wishlist' ? (
          <div className="my-2">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#3c4a3d]/70">
                <span className="material-symbols-outlined text-slate-300 text-[32px] block mb-1">
                  favorite_border
                </span>
                No saved items yet. Tap the heart icon on any product to save it!
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-[#e9edff] cursor-pointer transition-colors border border-slate-100"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#141b2b] truncate">{p.name}</p>
                      <p className="text-[11px] font-semibold text-[#006d2f]">
                        {p.currency} {p.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="my-2">
            {loadingOrders ? (
              <div className="text-center py-6 text-xs text-slate-500 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Loading orders from Firebase...</span>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#3c4a3d]/70">
                <span className="material-symbols-outlined text-slate-300 text-[32px] block mb-1">
                  shopping_cart_checkout
                </span>
                No purchase orders found. Orders placed via WhatsApp or checkout will appear here in real-time.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {userOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#141b2b]">
                        Order #{o.id.slice(0, 6).toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 uppercase">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3c4a3d] truncate">
                      {o.items?.map((it) => `${it.name} (x${it.quantity})`).join(', ') || '1 item'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-semibold pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[#006d2f] font-extrabold">
                        ৳ {o.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shortcuts & Live Chat Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenChat();
            }}
            className="w-full py-2.5 bg-[#f0f4ff] text-[#316bf3] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#e1eaff] transition-colors border border-[#316bf3]/20"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Live Chat Support (লাইভ চ্যাট সহায়তা)</span>
          </button>

          <button
            onClick={() => {
              onGoToSeller();
              onClose();
            }}
            className="w-full py-2.5 bg-[#e9f7ef] text-[#006d2f] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#d5f0e1] transition-colors border border-[#006d2f]/20"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Seller Hub & Stock Panel (সেলার প্যানেল)</span>
          </button>

          <a
            href="https://api.whatsapp.com/send?phone=8801319967499&text=Hello%20Luma%20Store!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#006d2f] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span
              className="material-symbols-outlined text-[18px] text-[#25D366]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>WhatsApp Helpline: 01319967499</span>
          </a>

          <button
            onClick={() => {
              onGoToAdmin();
              onClose();
            }}
            className="w-full py-2.5 bg-[#e1e8fd] text-[#0051d5] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#dbe1ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Switch to Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
