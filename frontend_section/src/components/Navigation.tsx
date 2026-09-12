import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  MessageSquareHeart, 
  FileSpreadsheet,
  Compass,
  Sparkles,
  Bot,
  Building2
} from 'lucide-react';

export type TabType = 'dashboard' | 'audience' | 'events' | 'feedback' | 'reports' | 'ai_assistant' | 'institutions';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCreateEvent: () => void;
  onTriggerScenario: (scenarioNumber: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateEvent,
  onTriggerScenario,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Дашборд',
      question: 'Что сейчас происходит?',
      icon: LayoutDashboard,
      badge: '6 KPI',
    },
    {
      id: 'ai_assistant' as TabType,
      label: 'Нейросеть (AI)',
      question: 'Текстовый анализ идеи и подбор площадки',
      icon: Bot,
      badge: 'ai_rec.py + ML',
    },
    {
      id: 'audience' as TabType,
      label: 'Аудитория',
      question: 'Кто приходит и как работать?',
      icon: Users,
      badge: '4 сегмента',
    },
    {
      id: 'events' as TabType,
      label: 'Мероприятия',
      question: 'Какие форматы работают?',
      icon: CalendarDays,
      badge: '225 событий',
    },
    {
      id: 'feedback' as TabType,
      label: 'Отзывы',
      question: 'Что нравится и что исправить?',
      icon: MessageSquareHeart,
      badge: '2 699 отзывов',
    },
    {
      id: 'institutions' as TabType,
      label: 'Реестр 19 учреждений',
      question: 'Официальные показатели Минкультуры',
      icon: Building2,
      badge: 'CSV',
    },
    {
      id: 'reports' as TabType,
      label: 'Отчёты & Бенчмарки',
      question: 'Управленческий срез и Lineage',
      icon: FileSpreadsheet,
      badge: 'Аналитика',
    },
  ];

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f97316]' : 'text-neutral-500 group-hover:text-neutral-700'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Action button: Create Event with AI */}
          <div className="pb-2">
            <button
              onClick={onOpenCreateEvent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Создать событие + AI</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Scenarios Bar (Blueprint Page 14) */}
        <div className="py-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
            <Compass className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Демо-сценарии MVP:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onTriggerScenario(1)}
              className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-[11px] text-neutral-700 transition-colors"
            >
              <span className="font-bold text-neutral-900">1. Руководитель:</span> KPI & Drill-down
            </button>
            <button
              onClick={() => onTriggerScenario(2)}
              className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-[11px] text-neutral-700 transition-colors"
            >
              <span className="font-bold text-neutral-900">2. Организатор:</span> Карточка & Решение
            </button>
            <button
              onClick={() => onTriggerScenario(3)}
              className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-950 rounded text-[11px] transition-colors"
            >
              <span className="font-bold text-orange-900">3. AI Проверка:</span> «Хакатон в полночь»
            </button>
            <button
              onClick={() => onTriggerScenario(4)}
              className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-[11px] text-neutral-700 transition-colors"
            >
              <span className="font-bold text-neutral-900">4. Сегменты:</span> Связка аудитории
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
