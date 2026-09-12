import React from 'react';
import { TabType } from './Navigation';
import { 
  Sparkles,
  Bot
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Дашборд',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.6" fill="currentColor" />
          <rect x="11" y="2.5" width="6.5" height="6.5" rx="1.6" fill="currentColor" opacity="0.4" />
          <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.6" fill="currentColor" opacity="0.4" />
          <rect x="11" y="11" width="6.5" height="6.5" rx="1.6" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'audience' as TabType,
      label: 'Посетители',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <circle cx="10" cy="6.6" r="3.1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 17c.7-3.4 3.4-5.4 6.5-5.4s5.8 2 6.5 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'events' as TabType,
      label: 'Мероприятия',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <rect x="2.8" y="3.8" width="14.4" height="13" rx="2.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2.8 8h14.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6.4 2.5v2.6M13.6 2.5v2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'institutions' as TabType,
      label: 'Коллекция',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.6" rx="2" />
          <path d="M7 4v12M4 8h12M4 12h12" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: 'feedback' as TabType,
      label: 'Отзывы',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <path d="M3 4.6A2.1 2.1 0 0 1 5.1 2.5h9.8A2.1 2.1 0 0 1 17 4.6v6.3a2.1 2.1 0 0 1-2.1 2.1H8.6L5 16.2v-3.2H5.1A2.1 2.1 0 0 1 3 10.9V4.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'reports' as TabType,
      label: 'Отчеты',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <path d="M5.5 2.8h6.2l3.3 3.3v10.4a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M7 10.5h6M7 13.3h6M7 7.7h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'ai_assistant' as TabType,
      label: 'Нейросеть (AI)',
      icon: <Sparkles className="w-5 h-5 text-[#ff7a45]" />,
      badge: 'ML',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[248px] bg-[#f5f5f2] border-r border-[#e8e7e2] p-5 flex flex-col justify-between transition-transform duration-200 lg:sticky lg:h-screen lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Brand Logo matching screenshot */}
          <div className="pl-1 pt-1">
            <div className="flex items-start justify-between">
              <div 
                onClick={() => { onSelectTab('dashboard'); onCloseMobile?.(); }}
                className="cursor-pointer group select-none"
              >
                <div className="flex items-baseline gap-0.5">
                  <span className="font-extrabold text-[26px] tracking-tight text-[#17171a] font-['Unbounded',sans-serif] leading-none">
                    СанАрт
                  </span>
                  {/* Pixel Asterisk Mark */}
                  <span className="inline-flex flex-col ml-0.5 -translate-y-1">
                    <span className="w-1.5 h-1.5 bg-[#ff7a45] rounded-[1px]" />
                    <span className="w-1.5 h-1.5 bg-[#17171a] rounded-[1px] ml-1 -mt-0.5" />
                  </span>
                </div>
                <div className="mt-1.5 font-bold text-[9.5px] leading-tight tracking-[0.08em] text-[#8b8b92] uppercase font-['Manrope',sans-serif]">
                  ИСКУССТВО<br />В ДВИЖЕНИИ
                </div>
              </div>

              {/* Close on mobile */}
              {isOpenMobile && (
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-1 text-[#8b8b92] hover:text-[#17171a]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-[14px] transition-all text-left group ${
                    isActive
                      ? 'bg-white text-[#17171a] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]'
                      : 'text-[#8b8b92] hover:text-[#17171a] hover:bg-[#ecece9]/60'
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-[#17171a]' : 'text-[#8b8b92] group-hover:text-[#17171a]'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-[#ff7a45] text-white' : 'bg-[#e8e7e2] text-[#8b8b92]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer watermark matching screenshot */}
        <div className="pt-4 border-t border-[#e8e7e2]/60 flex items-end justify-between pl-1">
          <div className="font-bold text-[10px] leading-[1.3] tracking-[0.08em] text-[#b7b7bc] uppercase font-['Manrope',sans-serif]">
            КУЛЬТУРА<br />
            ЛЮДИ<br />
            ДАННЫЕ<br />
            ВОЗМОЖНОСТИ
          </div>

          {/* 3 black square pixels in L-shape / corner */}
          <div className="text-[#17171a] shrink-0 mb-0.5">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <rect x="0" y="0" width="7" height="7" fill="currentColor" />
              <rect x="10" y="0" width="4" height="4" fill="currentColor" />
              <rect x="0" y="10" width="4" height="4" fill="currentColor" />
              <rect x="8" y="8" width="8" height="8" fill="currentColor" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
};
