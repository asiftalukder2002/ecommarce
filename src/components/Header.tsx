import React from 'react';
import { ActiveTab, AdminSubView, UserProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  adminSubView: AdminSubView;
  selectedProductId: string | null;
  currentUser: UserProfile | null;
  onBack: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  onOpenChat: () => void;
  onOpenAuth: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  adminSubView,
  selectedProductId,
  currentUser,
  onBack,
  onSearchClick,
  onProfileClick,
  onOpenChat,
  onOpenAuth,
  isMobileFrame,
  onToggleFrame,
}) => {
  // Determine if we should show a subpage header with Back button
  const isSubPage =
    selectedProductId !== null ||
    (activeTab === 'admin' && adminSubView !== 'dashboard');

  let title = 'LUMA STORE';
  if (selectedProductId) {
    title = 'Product Details';
  } else if (activeTab === 'seller') {
    title = 'Seller Panel';
  } else if (activeTab === 'admin') {
    if (adminSubView === 'add-product') {
      title = 'Admin Inventory';
    } else if (adminSubView === 'edit-product') {
      title = 'Edit Product';
    } else {
      title = 'Admin Control';
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#f9f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#bbcbb9]/20 transition-all">
      <div className="max-w-2xl mx-auto h-16 px-3 sm:px-4 flex items-center justify-between">
        {isSubPage ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-[#e9edff] active:scale-95 transition-all text-[#141b2b]"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
            <h1 className="font-semibold text-lg sm:text-xl text-[#141b2b] tracking-tight truncate">
              {title}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006d2f]/10 flex items-center justify-center text-[#006d2f]">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-[#141b2b] tracking-tight leading-tight">
                LUMA STORE
              </span>
              <span className="text-[9px] font-extrabold text-[#006d2f] uppercase tracking-wider -mt-0.5">
                Firebase Firestore
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live Chat Trigger */}
          <button
            onClick={onOpenChat}
            title="Live Firebase Chat & Inquiries"
            className="h-9 px-2.5 sm:px-3 rounded-full bg-[#f0f4ff] hover:bg-[#e1eaff] text-[#316bf3] flex items-center gap-1.5 transition-all text-xs font-bold border border-[#316bf3]/20 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[17px]">chat</span>
            <span className="hidden sm:inline">Live Chat</span>
          </button>

          {/* Mobile frame toggler for preview convenience on desktop */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? "Switch to Fullscreen Responsive View" : "Switch to Mobile Device Frame"}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-[#3c4a3d] hover:bg-[#e9edff] transition-colors text-xs font-medium border border-[#bbcbb9]/40"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMobileFrame ? 'fullscreen' : 'smartphone'}
            </span>
          </button>

          {!isSubPage && (
            <button
              onClick={onSearchClick}
              aria-label="Search"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#3c4a3d] hover:bg-[#e9edff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
          )}

          {/* User Auth Avatar / Login button */}
          {currentUser ? (
            <button
              onClick={onProfileClick}
              aria-label="User Profile"
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-200/50 transition-all border border-slate-200"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#006d2f] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="h-9 px-3 rounded-full bg-[#006d2f] hover:bg-[#005523] text-white flex items-center gap-1 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Login / সাইন ইন</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
