import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  CalendarRange, 
  ChevronDown, 
  Menu, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Calendar as CalendarIcon,
  AlertTriangle,
  Check,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Institution, TimePeriodFilter, UserRole } from '../types';
import { INSTITUTIONS } from '../data/mockData';

export interface CustomDateRange {
  start: string;
  end: string;
  label: string;
}

interface TopBarProps {
  selectedInstitution: Institution;
  onSelectInstitution: (institution: Institution) => void;
  periodFilter: TimePeriodFilter;
  onPeriodFilterChange: (period: TimePeriodFilter, customRange?: CustomDateRange) => void;
  customDateRange?: CustomDateRange;
  userRole: UserRole;
  onUserRoleChange: (role: UserRole) => void;
  onOpenMobileSidebar: () => void;
  onOpenCreateEvent?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedInstitution,
  onSelectInstitution,
  periodFilter,
  onPeriodFilterChange,
  customDateRange,
  userRole,
  onUserRoleChange,
  onOpenMobileSidebar,
  onOpenCreateEvent,
}) => {
  const [isInstDropdownOpen, setIsInstDropdownOpen] = useState(false);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Institution search & filter inside dropdown
  const [instSearch, setInstSearch] = useState('');
  const [instFilterQuality, setInstFilterQuality] = useState<'all' | 'verified' | 'divergence'>('all');

  // Custom date range form state inside date dropdown
  const [startDate, setStartDate] = useState(customDateRange?.start || '2026-08-08');
  const [endDate, setEndDate] = useState(customDateRange?.end || '2026-09-09');

  const instDropdownRef = useRef<HTMLDivElement>(null);
  const periodDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close any open dropdown
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (instDropdownRef.current && !instDropdownRef.current.contains(target)) {
        setIsInstDropdownOpen(false);
      }
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(target)) {
        setIsPeriodDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsInstDropdownOpen(false);
        setIsPeriodDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const periods: { id: TimePeriodFilter; label: string; sub: string }[] = [
    { id: 'custom', label: customDateRange?.label || '8 августа — 9 сентября', sub: 'Полный аналитический срез' },
    { id: 'today', label: 'Сегодня', sub: '11 сентября 2026' },
    { id: 'yesterday', label: 'Вчера', sub: '10 сентября 2026' },
    { id: 'week', label: 'Неделя', sub: '5–11 сентября 2026' },
    { id: 'month', label: 'Месяц', sub: 'Август — Сентябрь' },
    { id: 'quarter', label: 'Квартал', sub: 'III кв. 2026 г.' },
  ];

  const filteredInstitutions = INSTITUTIONS.filter((inst) => {
    const query = instSearch.toLowerCase();
    const matchesSearch = 
      inst.name.toLowerCase().includes(query) ||
      inst.city.toLowerCase().includes(query) ||
      inst.type.toLowerCase().includes(query) ||
      inst.id.toLowerCase().includes(query);
    
    const matchesQuality = 
      instFilterQuality === 'all' ||
      (instFilterQuality === 'verified' && inst.dataQuality !== 'divergence_detected') ||
      (instFilterQuality === 'divergence' && inst.dataQuality === 'divergence_detected');

    return matchesSearch && matchesQuality;
  });

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const startFormatted = new Date(startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const endFormatted = new Date(endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const label = `${startFormatted} — ${endFormatted}`;
    onPeriodFilterChange('custom', {
      start: startDate,
      end: endDate,
      label,
    });
    setIsPeriodDropdownOpen(false);
  };

  const getDisplayPeriodText = () => {
    if (periodFilter === 'custom') {
      return customDateRange?.label || '8 августа — 9 сентября';
    }
    const found = periods.find(p => p.id === periodFilter);
    return found ? found.label : '8 августа — 9 сентября';
  };

  return (
    <header className="h-[76px] px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 border-b border-[#e8e7e2]/70 bg-[#f5f5f2] sticky top-0 z-30">
      {/* Left: Mobile hamburger + Institution Chip */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-[#e8e7e2] text-[#121214] shadow-xs shrink-0"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Institution Selector Chip (КНОПКА СЛЕВА СВЕРХУ) */}
        <div className="relative" ref={instDropdownRef}>
          <button
            type="button"
            onClick={() => setIsInstDropdownOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 sm:gap-2.5 bg-white border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[14px] font-semibold text-[#121214] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] transition-all cursor-pointer select-none max-w-[210px] sm:max-w-[340px] ${
              isInstDropdownOpen ? 'border-[#ff7a45] ring-2 ring-[#ff7a45]/20' : 'border-[#e8e7e2] hover:border-[#ff7a45]'
            }`}
            title="Нажмите для выбора учреждения"
          >
            {/* Museum icon */}
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-[#8b8b92] shrink-0">
              <path d="M10 2 3 6v1.2h14V6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M4 8.2v7.4M7 8.2v7.4M13 8.2v7.4M16 8.2v7.4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <span className="truncate font-medium text-[#121214]">
              {selectedInstitution.name}
            </span>

            <ChevronDown className={`w-3.5 h-3.5 text-[#8b8b92] shrink-0 transition-transform ${isInstDropdownOpen ? 'rotate-180 text-[#ff7a45]' : ''}`} />

            {selectedInstitution.dataQuality === 'divergence_detected' && (
              <span 
                className="w-2 h-2 rounded-full bg-[#e8a13c] ring-2 ring-[#fbecd4] shrink-0" 
                title="Внимание: по данному учреждению зафиксированы расхождения"
              />
            )}
          </button>

          {/* Institution Dropdown Menu */}
          {isInstDropdownOpen && (
            <div className="absolute left-0 mt-2 w-[320px] sm:w-[420px] bg-white border border-[#e8e7e2] rounded-[20px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* Dropdown Header & Search */}
              <div className="p-3.5 border-b border-[#e8e7e2] bg-[#fafaf7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-[#121214] uppercase tracking-wider font-['Unbounded',sans-serif]">
                    Выбор учреждения (19 организаций)
                  </div>
                  <span className="text-[10px] text-[#8b8b92] font-semibold">
                    Минкультуры РФ
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9e9ea6] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instSearch}
                    onChange={(e) => setInstSearch(e.target.value)}
                    placeholder="Поиск по названию, городу или коду..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e8e7e2] rounded-full text-xs text-[#121214] placeholder:text-[#9e9ea6] focus:outline-none focus:border-[#ff7a45]"
                    autoFocus
                  />
                </div>

                {/* Filter toggles */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setInstFilterQuality('all')}
                    className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                      instFilterQuality === 'all' ? 'bg-[#121214] text-white' : 'bg-white text-[#73737a] border border-[#e8e7e2]'
                    }`}
                  >
                    Все (19)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstFilterQuality('verified')}
                    className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                      instFilterQuality === 'verified' ? 'bg-[#7fbf8a] text-white' : 'bg-white text-[#2e7d32] border border-[#e8e7e2]'
                    }`}
                  >
                    Верифицированы (16)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstFilterQuality('divergence')}
                    className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                      instFilterQuality === 'divergence' ? 'bg-[#e8a13c] text-white' : 'bg-white text-[#b45309] border border-[#e8e7e2]'
                    }`}
                  >
                    С расхождениями (3)
                  </button>
                </div>
              </div>

              {/* Institution list */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-[#e8e7e2]/60 p-1.5">
                {filteredInstitutions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8b8b92]">
                    Учреждений по запросу не найдено
                  </div>
                ) : (
                  filteredInstitutions.map((inst) => {
                    const isSelected = inst.id === selectedInstitution.id;
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => {
                          onSelectInstitution(inst);
                          setIsInstDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-[14px] flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#ff7a45]/10 border border-[#ff7a45]/30 text-[#121214]' 
                            : 'hover:bg-[#fafaf7] text-[#121214]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate">
                              {inst.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#ff7a45] shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#73737a] flex items-center gap-2 mt-0.5">
                            <span>{inst.city}</span>
                            <span>•</span>
                            <span>{inst.type}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-[#8b8b92]">{inst.id}</span>
                          </div>
                          <div className="text-[10px] text-[#8b8b92] mt-1">
                            Событий: <strong>{inst.events2026}</strong> • Выручка: <strong>{(inst.serviceRevenueTotal / 1_000_000).toFixed(1)} млн ₽</strong>
                          </div>
                        </div>

                        {inst.dataQuality === 'divergence_detected' ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30 shrink-0">
                            Расхождение
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#7fbf8a]/15 text-[#2e7d32] border border-[#7fbf8a]/30 shrink-0">
                            OK
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Date Picker Chip (КНОПКА СПРАВА СВЕРХУ) + User Chip */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Selector Chip */}
        <div className="relative" ref={periodDropdownRef}>
          <button
            type="button"
            onClick={() => setIsPeriodDropdownOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 sm:gap-2.5 bg-white border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[14px] font-semibold text-[#121214] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] transition-all cursor-pointer select-none ${
              isPeriodDropdownOpen ? 'border-[#ff7a45] ring-2 ring-[#ff7a45]/20' : 'border-[#e8e7e2] hover:border-[#ff7a45]'
            }`}
            title="Нажмите для выбора аналитического периода или дат"
          >
            <CalendarRange className="w-4 h-4 text-[#8b8b92] shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[190px]">
              {getDisplayPeriodText()}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8b8b92] shrink-0 transition-transform ${isPeriodDropdownOpen ? 'rotate-180 text-[#ff7a45]' : ''}`} />
          </button>

          {/* Date Picker Dropdown Menu */}
          {isPeriodDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[290px] sm:w-[340px] bg-white border border-[#e8e7e2] rounded-[20px] shadow-2xl z-50 overflow-hidden p-3 space-y-3 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[11px] font-bold text-[#121214] uppercase tracking-wider font-['Unbounded',sans-serif] px-1">
                Период выборки данных
              </div>

              {/* Presets List */}
              <div className="space-y-1">
                {periods.map((p) => {
                  const isActive = periodFilter === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onPeriodFilterChange(p.id);
                        setIsPeriodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-[12px] transition-all flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'bg-[#121214] text-white shadow-xs font-bold' 
                          : 'text-[#121214] hover:bg-[#fafaf7]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-white/70' : 'text-[#8b8b92]'}`}>
                          {p.sub}
                        </div>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-[#ff7a45]" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Date Range Selector Section */}
              <div className="pt-2.5 border-t border-[#e8e7e2]">
                <div className="text-[10px] font-bold text-[#8b8b92] uppercase tracking-wider mb-2 px-1">
                  Произвольный диапазон дат
                </div>
                <form onSubmit={handleApplyCustomRange} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-[#8b8b92] block mb-1">С даты:</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-2 py-1.5 bg-[#fafaf7] border border-[#e8e7e2] rounded-lg text-xs text-[#121214] focus:outline-none focus:border-[#ff7a45]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8b8b92] block mb-1">По дату:</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-2 py-1.5 bg-[#fafaf7] border border-[#e8e7e2] rounded-lg text-xs text-[#121214] focus:outline-none focus:border-[#ff7a45]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1 px-3 py-2 bg-[#ff7a45] hover:bg-[#f06833] text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Применить интервал</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* User Account Chip */}
        <div className="relative" ref={userDropdownRef}>
          <button
            type="button"
            onClick={() => setIsUserDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#121214] hover:opacity-80 transition-opacity cursor-pointer select-none"
            title="Настройки профиля и роли доступа"
          >
            <div className="w-8 h-8 rounded-full bg-[#121214] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              U
            </div>
            <span className="hidden md:inline text-[13px] text-[#121214] font-medium">
              user_login@mail.ru
            </span>
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e8e7e2] rounded-[20px] shadow-2xl z-50 p-3.5 text-xs divide-y divide-[#e8e7e2]/60 animate-in fade-in zoom-in-95 duration-100">
              <div className="pb-2.5">
                <div className="font-bold text-[#121214]">user_login@mail.ru</div>
                <div className="text-[11px] text-[#8b8b92]">Директор по развитию / Аналитик</div>
              </div>
              <div className="py-2.5 space-y-1">
                <div className="text-[10px] font-bold text-[#8b8b92] uppercase">Роль доступа</div>
                {(['organizer', 'admin', 'viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onUserRoleChange(r);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between text-xs cursor-pointer ${
                      userRole === r ? 'bg-[#ff7a45]/10 text-[#ff7a45] font-bold' : 'text-[#121214] hover:bg-[#fafaf7]'
                    }`}
                  >
                    <span>{r === 'organizer' ? 'Организатор' : r === 'admin' ? 'Руководитель' : 'Наблюдатель'}</span>
                    {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#ff7a45]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
