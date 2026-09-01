import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  wishlistCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: 'home' },
    { id: 'categories' as ActiveTab, label: 'Categories', icon: 'category' },
    { id: 'search' as ActiveTab, label: 'Search', icon: 'explore' },
    { id: 'seller' as ActiveTab, label: 'Seller', icon: 'storefront' },
    { id: 'admin' as ActiveTab, label: 'Admin', icon: 'admin_panel_settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#f9f9ff]/90 backdrop-blur-xl pb-safe shadow-[0_-1px_12px_rgba(0,0,0,0.06)] border-t border-[#bbcbb9]/20">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full py-1.5 gap-1 transition-all duration-200 ${
                isActive
                  ? 'text-[#006d2f] font-semibold scale-105'
                  : 'text-[#3c4a3d]/80 hover:text-[#006d2f] active:scale-95'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-[12px] font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
