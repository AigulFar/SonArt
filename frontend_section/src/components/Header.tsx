import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Institution, TimePeriodFilter, UserRole } from '../types';
import { INSTITUTIONS } from '../data/mockData';

interface HeaderProps {
  selectedInstitution: Institution;
  onSelectInstitution: (institution: Institution) => void;
  periodFilter: TimePeriodFilter;
  onPeriodFilterChange: (period: TimePeriodFilter) => void;
  userRole: UserRole;
  onUserRoleChange: (role: UserRole) => void;
  onResetData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedInstitution,
  onSelectInstitution,
  periodFilter,
  onPeriodFilterChange,
  userRole,
  onUserRoleChange,
}) => {
  const [isInstDropdownOpen, setIsInstDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const periodLabels: Record<TimePeriodFilter, string> = {
    today: 'Сегодня',
    yesterday: 'Вчера',
    week: 'Неделя',
    month: 'Месяц',
    quarter: 'Квартал',
    custom: '8 авг – 9 сен',
  };

  const roleLabels: Record<UserRole, { title: string; desc: string }> = {
    organizer: { title: 'Организатор', desc: 'Дашборд, аудитория, создание событий и AI' },
    admin: { title: 'Руководитель / Owner', desc: 'Управление учреждением, финансы, экспорт' },
    viewer: { title: 'Наблюдатель', desc: 'Только чтение аналитики и отчетов' },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
      {/* Top micro-bar for branding and status */}
      <div className="bg-[#111827] text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-[#f97316] uppercase text-[11px]">СанАрт • MVP BLUEPRINT</span>
          <span className="hidden sm:inline text-neutral-400">|</span>
          <span className="hidden sm:inline text-neutral-300">Искусство становится ближе: Big Data & AI аналитика</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Контур данных синхронизирован
          </span>
          <span className="hidden md:inline">19 учреждений • 225 событий • 5 000 профилей</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img 
              src="/logo_.png" 
              alt="СанАрт" 
              className="h-8 sm:h-9 object-contain"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} 
            />
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-neutral-900 font-['Unbounded',sans-serif]">
              СанАрт
            </span>
            <span className="text-xl font-black text-[#ff7a45] ml-0.5">*</span>
          </div>
          <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              аналитика для культуры
            </span>
            <span className="text-[11px] text-neutral-400">
              замкнутый цикл: данные → AI → решение
            </span>
          </div>
        </div>

        {/* Center: Institution Selector */}
        <div className="relative">
          <button
            onClick={() => setIsInstDropdownOpen(!isInstDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-left transition-colors"
          >
            <div className="p-1.5 bg-neutral-200 text-neutral-700 rounded">
              <Building2 className="w-4 h-4 text-neutral-800" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1.5">
                <span>Учреждение</span>
                {selectedInstitution.dataQuality === 'divergence_detected' && (
                  <span className="inline-flex items-center gap-0.5 text-amber-700 bg-amber-100 px-1 py-0.2 rounded text-[9px] font-bold">
                    <AlertTriangle className="w-2.5 h-2.5" /> Внимание к данным
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-neutral-900 truncate max-w-[220px] sm:max-w-[280px]">
                {selectedInstitution.name}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 ml-1" />
          </button>

          {isInstDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto divide-y divide-neutral-100">
              <div className="p-2.5 bg-neutral-50 text-xs font-semibold text-neutral-500 flex justify-between items-center">
                <span>Выберите учреждение (19 в базе)</span>
                <span className="text-[10px] text-neutral-400">3 с отметкой качества</span>
              </div>
              {INSTITUTIONS.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => {
                    onSelectInstitution(inst);
                    setIsInstDropdownOpen(false);
                  }}
                  className={`w-full text-left p-3 hover:bg-neutral-50 flex items-start justify-between gap-2 transition-colors ${
                    inst.id === selectedInstitution.id ? 'bg-amber-50/50 font-medium' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-900 leading-snug">
                      {inst.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {inst.city} • {inst.type} • {inst.events2026} событий
                    </div>
                  </div>
                  {inst.dataQuality === 'divergence_detected' ? (
                    <span className="shrink-0 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      Расхождение
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      OK
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Period Selector & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Period Tabs */}
          <div className="hidden lg:flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs font-medium">
            {(['today', 'yesterday', 'week', 'month', 'quarter', 'custom'] as TimePeriodFilter[]).map((period) => (
              <button
                key={period}
                onClick={() => onPeriodFilterChange(period)}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  periodFilter === period
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                U
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-neutral-400 leading-tight">user_login@mail.ru</div>
                <div className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
                  {roleLabels[userRole].title}
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </div>
              </div>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 p-2 text-xs divide-y divide-neutral-100">
                <div className="p-2 text-neutral-500 font-semibold">
                  Роль доступа (разграничение прав)
                </div>
                {(['organizer', 'admin', 'viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onUserRoleChange(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-neutral-50 transition-colors ${
                      userRole === r ? 'bg-orange-50 text-orange-950 font-semibold' : 'text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">{roleLabels[r].title}</span>
                      {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#f97316]" />}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{roleLabels[r].desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
