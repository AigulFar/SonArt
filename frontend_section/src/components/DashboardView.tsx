import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  CalendarDays, 
  Clock, 
  ArrowRight, 
  MapPin,
  Sparkles,
  Bot,
  Send,
  HelpCircle,
  ChevronDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Institution, CulturalEvent, TimePeriodFilter } from '../types';
import { TabType } from './Navigation';
import { SANART_KPI_BY_PERIOD, SANART_ATTENDANCE_SERIES, PRESET_AI_IDEAS } from '../data/officialData';
import { CustomDateRange } from './TopBar';

interface DashboardViewProps {
  institution: Institution;
  periodFilter?: TimePeriodFilter;
  onPeriodFilterChange?: (period: TimePeriodFilter) => void;
  customDateRange?: CustomDateRange;
  onNavigateTab: (tab: TabType) => void;
  onOpenCreateEvent: () => void;
  onSelectExhibition: (title: string) => void;
}

type KpiPeriod = 'today' | 'yesterday' | 'week' | 'month' | 'quarter';

export const DashboardView: React.FC<DashboardViewProps> = ({
  institution,
  periodFilter = 'custom',
  onPeriodFilterChange,
  customDateRange,
  onNavigateTab,
  onOpenCreateEvent,
  onSelectExhibition,
}) => {
  const [localKpiPeriod, setLocalKpiPeriod] = useState<KpiPeriod>('today');
  const [quickAiPrompt, setQuickAiPrompt] = useState('');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(16); // default to 24 авг peak (index 16)

  // Sync with global periodFilter or fallback to local
  const effectivePeriod: KpiPeriod = useMemo(() => {
    if (periodFilter === 'custom') return 'month';
    if (['today', 'yesterday', 'week', 'month', 'quarter'].includes(periodFilter)) {
      return periodFilter as KpiPeriod;
    }
    return localKpiPeriod;
  }, [periodFilter, localKpiPeriod]);

  const handleSelectPeriod = (period: KpiPeriod) => {
    setLocalKpiPeriod(period);
    if (onPeriodFilterChange) {
      onPeriodFilterChange(period);
    }
  };

  // Scale statistics and charts according to selected institution size
  const instScale = useMemo(() => {
    // Base is INST_001 (events2026 = 225)
    return Math.max(0.3, Math.min(2.5, (institution.events2026 || 225) / 225));
  }, [institution.events2026]);

  const baseKpi = SANART_KPI_BY_PERIOD[effectivePeriod] || SANART_KPI_BY_PERIOD.today;

  const currentKpi = useMemo(() => {
    return {
      visitors: {
        value: Math.round(baseKpi.visitors.value * instScale),
        deltaPct: baseKpi.visitors.deltaPct,
        caption: baseKpi.visitors.caption,
      },
      newVisitors: {
        value: Math.round(baseKpi.newVisitors.value * instScale),
        deltaPct: baseKpi.newVisitors.deltaPct,
        caption: baseKpi.newVisitors.caption,
      },
      eventsHeld: {
        value: Math.max(1, Math.round(baseKpi.eventsHeld.value * instScale)),
        deltaPct: baseKpi.eventsHeld.deltaPct,
        caption: baseKpi.eventsHeld.caption,
      },
      avgDwellTime: baseKpi.avgDwellTime,
    };
  }, [baseKpi, instScale]);

  // Series data for attendance area chart scaled by institution
  const series = useMemo(() => {
    return SANART_ATTENDANCE_SERIES.map((d) => ({
      date: d.date,
      value: Math.round(d.value * instScale),
    }));
  }, [instScale]);

  const values = series.map(d => d.value);
  const maxVal = Math.max(1000, Math.ceil((Math.max(...values) * 1.18) / 500) * 500);
  const minVal = 0;

  // Chart dimensions
  const svgW = 900;
  const svgH = 260;
  const padTop = 20;
  const padBottom = 32;
  const padLeft = 45;
  const padRight = 15;
  const plotW = svgW - padLeft - padRight;
  const plotH = svgH - padTop - padBottom;
  const xStep = plotW / (series.length - 1);

  const points = series.map((d, i) => {
    const x = padLeft + i * xStep;
    const y = padTop + plotH - ((d.value - minVal) / (maxVal - minVal)) * plotH;
    return [x, y];
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1][0].toFixed(1)} ${padTop + plotH} L ${points[0][0].toFixed(1)} ${padTop + plotH} Z`;

  // Grid lines based on maxVal
  const ySteps = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];

  // X labels
  const xLabelIndices = [0, 4, 8, 12, 16, 20, 24, 28, 32]; // 8 авг, 12 авг, 16 авг, 20 авг, 24 авг, 28 авг, 1 сен, 5 сен, 9 сен

  // Active hover/peak point
  const activeIdx = hoveredPointIndex !== null ? hoveredPointIndex : 16;
  const activePoint = points[activeIdx] || points[16];
  const activeItem = series[activeIdx] || series[16];

  // Visit sources for Donut chart
  const visitSources = [
    { label: 'Офлайн', value: 42, color: '#ff7a45' },
    { label: 'Сайт музея', value: 24, color: '#a78bfa' },
    { label: 'Соц. сети', value: 18, color: '#6c9bf5' },
    { label: 'Партнеры', value: 8, color: '#7fbf8a' },
    { label: 'Другое', value: 8, color: '#c7c7cc' },
  ];

  // Donut geometry
  const donutSize = 168;
  const strokeW = 22;
  const radius = (donutSize - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAccumulator = 0;

  // Popular exhibitions
  const popularExhibitions = [
    { label: 'Время и пространство', value: 412, color: '#ff7a45' },
    { label: 'Городские метаморфозы', value: 356, color: '#a78bfa' },
    { label: 'Человек и природа', value: 298, color: '#7fbf8a' },
    { label: 'Цифровые сны', value: 241, color: '#6c9bf5' },
    { label: 'Искусство завтра', value: 198, color: '#c7c7cc' },
  ];
  const maxExhibitionVal = 412;

  // Age groups
  const ageGroups = [
    { label: 'до 18', pct: 12, color: '#b9d4fd' },
    { label: '18–24', pct: 28, color: '#ff9d75' },
    { label: '25–34', pct: 32, color: '#c4b5fd' },
    { label: '35–44', pct: 18, color: '#a7d8af' },
    { label: '45–54', pct: 8, color: '#e5e4de' },
    { label: '55+', pct: 2, color: '#ecece9' },
  ];
  const maxAgePct = 32;

  // Geography
  const geography = [
    { city: 'Москва', pct: 38 },
    { city: 'Санкт-Петербург', pct: 21 },
    { city: 'Казань', pct: 8 },
    { city: 'Екатеринбург', pct: 6 },
    { city: 'Новосибирск', pct: 4 },
    { city: 'Другие города', pct: 23 },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAiPrompt.trim()) {
      sessionStorage.setItem('sanart_prefill_prompt', quickAiPrompt.trim());
    }
    onNavigateTab('ai_assistant');
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pt-2">
      {/* 1. Hero Section matching screenshot */}
      <section className="flex items-start justify-between gap-6 pt-2 pb-1">
        <div>
          <h1 className="pixel-heading text-[36px] sm:text-[46px] font-extrabold leading-[1.05] tracking-tight text-[#17171a] select-none uppercase">
            ДОБРО<br />ПОЖАЛОВАТЬ
          </h1>
          <p className="mt-2.5 font-bold text-[11px] sm:text-[12.5px] leading-snug tracking-[0.08em] text-[#8b8b92] uppercase font-['Manrope',sans-serif]">
            ЗДЕСЬ ИСКУССТВО<br />СТАНОВИТСЯ БЛИЖЕ
          </p>
        </div>

        {/* Top-right corner watermark */}
        <div className="text-right flex flex-col items-end pt-1">
          <div className="font-bold text-[10px] sm:text-[11px] leading-[1.25] tracking-[0.08em] text-[#b7b7bc] uppercase font-['Manrope',sans-serif]">
            БОЛЬШЕ<br />ЧЕМ<br />ИСКУССТВО
          </div>
          <div className="mt-2 text-[#b7b7bc]">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <rect x="0" y="0" width="8" height="8" />
              <rect x="11" y="0" width="4" height="4" />
              <rect x="0" y="11" width="4" height="4" />
              <rect x="9" y="9" width="9" height="9" />
            </svg>
          </div>
        </div>
      </section>

      {/* Selected Institution Live Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4 transition-all hover:border-[#ff7a45]/40">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-[#121214] font-['Unbounded',sans-serif] truncate">
                {institution.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                {institution.city}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#8b8b92] bg-[#f5f5f2]">
                {institution.id}
              </span>
            </div>
            <div className="text-xs text-[#73737a] mt-1 flex flex-wrap items-center gap-2">
              <span>{institution.type}</span>
              <span>•</span>
              <span>Событий 2026: <strong className="text-[#121214]">{institution.events2026}</strong> (+{institution.growthPct}%)</span>
              <span>•</span>
              <span>Бюджет / Выручка: <strong className="text-[#121214]">{(institution.serviceRevenueTotal / 1_000_000).toFixed(1)} млн ₽</strong></span>
              <span>•</span>
              <span>Обучено: <strong className="text-[#121214]">{institution.trainedPeopleTotal} чел.</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {institution.dataQuality === 'divergence_detected' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30">
              <AlertTriangle className="w-3.5 h-3.5 text-[#e8a13c]" />
              <span>Расхождения в данных</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#7fbf8a]/15 text-[#2e7d32] border border-[#7fbf8a]/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Верифицировано Минкультуры</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => onNavigateTab('institutions')}
            className="px-3.5 py-1.5 rounded-full bg-[#fafaf7] hover:bg-[#e8e7e2] text-xs font-bold text-[#121214] border border-[#e8e7e2] transition-colors cursor-pointer"
          >
            Все 19 учреждений →
          </button>
        </div>
      </div>

      {/* 2. Period Switcher Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap items-center gap-1 bg-white border border-[#e8e7e2] rounded-full p-1 shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
          {periodFilter === 'custom' && (
            <button
              type="button"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-[#ff7a45] text-white shadow-xs whitespace-nowrap flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{customDateRange?.label || '8 авг — 9 сен (выбор)'}</span>
            </button>
          )}

          {(['today', 'yesterday', 'week', 'month', 'quarter'] as KpiPeriod[]).map((period) => {
            const labels: Record<KpiPeriod, string> = {
              today: 'Сегодня',
              yesterday: 'Вчера',
              week: 'Неделя',
              month: 'Месяц',
              quarter: 'Квартал',
            };
            const isActive = periodFilter !== 'custom' && effectivePeriod === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => handleSelectPeriod(period)}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#121214] text-white shadow-xs'
                    : 'text-[#8b8b92] hover:text-[#17171a]'
                }`}
              >
                {labels[period]}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#8b8b92] font-medium hidden sm:block">
          Синхронизировано с фильтром в шапке
        </div>
      </div>

      {/* 3. Section Title & 4 KPI Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#17171a]">
            Общие показатели
          </h2>
          <span className="text-xs text-[#8b8b92]">
            Показатели учреждения: <strong className="text-[#121214]">{institution.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Visitors */}
          <div 
            onClick={() => onNavigateTab('audience')}
            className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] relative overflow-hidden flex flex-col justify-between h-[152px] group cursor-pointer hover:border-[#ff7a45] transition-all"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#8b8b92]">
              <Users className="w-4 h-4 text-[#8b8b92]" />
              <span>Посетители</span>
            </div>
            
            <div className="flex items-baseline gap-2.5">
              <span className="text-[32px] font-bold text-[#17171a] font-['Unbounded',sans-serif] tracking-tight leading-none">
                {currentKpi.visitors.value.toLocaleString('ru-RU')}
              </span>
              <span className="inline-flex items-center text-[12.5px] font-bold text-[#ff7a45]">
                ↑ +{currentKpi.visitors.deltaPct}%
              </span>
            </div>

            <div className="text-[12px] text-[#b7b7bc]">
              {currentKpi.visitors.caption}
            </div>

            {/* Orange wavy sparkline on right */}
            <svg 
              className="absolute right-6 bottom-6 w-[96px] h-[36px] opacity-90" 
              viewBox="0 0 90 24" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,20 L10,17 L20,19 L30,12 L40,14 L50,8 L60,10 L70,4 L80,6 L90,1" 
                fill="none" 
                stroke="#ff7a45" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* Card 2: New Visitors */}
          <div 
            onClick={() => onNavigateTab('audience')}
            className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] relative overflow-hidden flex flex-col justify-between h-[152px] group cursor-pointer hover:border-[#7fbf8a] transition-all"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#8b8b92]">
              <UserPlus className="w-4 h-4 text-[#8b8b92]" />
              <span>Новые посетители</span>
            </div>
            
            <div className="flex items-baseline gap-2.5">
              <span className="text-[32px] font-bold text-[#17171a] font-['Unbounded',sans-serif] tracking-tight leading-none">
                {currentKpi.newVisitors.value.toLocaleString('ru-RU')}
              </span>
              <span className="inline-flex items-center text-[12.5px] font-bold text-[#ff7a45]">
                ↑ +{currentKpi.newVisitors.deltaPct}%
              </span>
            </div>

            <div className="text-[12px] text-[#b7b7bc]">
              {currentKpi.newVisitors.caption}
            </div>

            {/* Green wavy sparkline on right */}
            <svg 
              className="absolute right-6 bottom-6 w-[96px] h-[36px] opacity-90" 
              viewBox="0 0 90 24" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,22 L10,20 L20,15 L30,17 L40,10 L50,12 L60,6 L70,8 L80,3 L90,5" 
                fill="none" 
                stroke="#7fbf8a" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* Card 3: Events Held */}
          <div 
            onClick={() => onNavigateTab('events')}
            className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] relative overflow-hidden flex flex-col justify-between h-[152px] group cursor-pointer hover:border-[#a78bfa] transition-all"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#8b8b92]">
              <CalendarDays className="w-4 h-4 text-[#8b8b92]" />
              <span>Проведено мероприятий</span>
            </div>
            
            <div className="flex items-baseline gap-2.5">
              <span className="text-[32px] font-bold text-[#17171a] font-['Unbounded',sans-serif] tracking-tight leading-none">
                {currentKpi.eventsHeld.value}
              </span>
              <span className="inline-flex items-center text-[12.5px] font-bold text-[#ff7a45]">
                ↑ +{currentKpi.eventsHeld.deltaPct}%
              </span>
            </div>

            <div className="text-[12px] text-[#b7b7bc]">
              {currentKpi.eventsHeld.caption}
            </div>

            {/* Purple wavy sparkline on right */}
            <svg 
              className="absolute right-6 bottom-6 w-[96px] h-[36px] opacity-90" 
              viewBox="0 0 90 24" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,6 L10,10 L20,4 L30,12 L40,8 L50,16 L60,10 L70,18 L80,12 L90,6" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* Card 4: Avg Dwell Time */}
          <div 
            onClick={() => onNavigateTab('reports')}
            className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] relative overflow-hidden flex flex-col justify-between h-[152px] group cursor-pointer hover:border-[#c7c7cc] transition-all"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#8b8b92]">
              <Clock className="w-4 h-4 text-[#8b8b92]" />
              <span>Среднее время на экспозиции</span>
            </div>
            
            <div className="flex items-baseline gap-2.5">
              <span className="text-[30px] font-bold text-[#17171a] font-['Unbounded',sans-serif] tracking-tight leading-none">
                {currentKpi.avgDwellTime.value}
              </span>
              <span className="inline-flex items-center text-[12.5px] font-bold text-[#ff7a45]">
                ↑ +{currentKpi.avgDwellTime.deltaPct}%
              </span>
            </div>

            <div className="text-[12px] text-[#b7b7bc]">
              {currentKpi.avgDwellTime.caption}
            </div>

            {/* Slate wavy sparkline on right */}
            <svg 
              className="absolute right-6 bottom-6 w-[96px] h-[36px] opacity-90" 
              viewBox="0 0 90 24" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,14 L10,15 L20,13 L30,16 L40,12 L50,14 L60,11 L70,13 L80,10 L90,12" 
                fill="none" 
                stroke="#c7c7cc" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Promo Banner "ИСКУССТВО ОБЪЕДИНЯЕТ" */}
      <div 
        onClick={() => onNavigateTab('reports')}
        className="relative rounded-[20px] overflow-hidden min-h-[96px] flex items-center justify-between px-6 sm:px-8 py-5 border border-[#e8e7e2]/60 cursor-pointer group shadow-sm transition-all"
        style={{
          background: 'radial-gradient(60% 140% at 8% 50%, rgba(255, 122, 69, 0.45), transparent 60%), radial-gradient(55% 160% at 35% 20%, rgba(167, 139, 250, 0.4), transparent 65%), radial-gradient(60% 160% at 62% 80%, rgba(108, 155, 245, 0.4), transparent 65%), radial-gradient(55% 160% at 92% 40%, rgba(127, 191, 138, 0.4), transparent 65%), #ecece9'
        }}
      >
        <div className="flex items-center gap-4">
          <div className="text-[#17171a] shrink-0">
            <svg viewBox="0 0 20 20" width="22" height="22" fill="none">
              <rect width="8" height="8" fill="currentColor" />
              <rect x="11" width="4" height="4" fill="currentColor" />
              <rect y="11" width="4" height="4" fill="currentColor" />
            </svg>
          </div>
          <div className="pixel-heading text-[18px] sm:text-[20px] font-extrabold leading-[1.05] tracking-tight text-[#17171a] uppercase">
            ИСКУССТВО<br />ОБЪЕДИНЯЕТ
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-white/75 hover:bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 text-[14px] font-bold text-[#17171a] transition-all shadow-xs group-hover:shadow">
          <span>Смотреть отчет</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 5. Row 1: Attendance Area Chart (2/3) + Visit Sources Donut (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Card: Посещаемость музея */}
        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#17171a]">
              Посещаемость музея
            </h3>
            <button 
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8e7e2] text-xs font-semibold text-[#17171a] hover:bg-[#f5f5f2] transition-colors"
            >
              <span>По дням</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8b8b92]" />
            </button>
          </div>

          {/* SVG Area Chart matching screenshot */}
          <div className="relative w-full overflow-x-auto select-none pt-4">
            <svg 
              viewBox={`0 0 ${svgW} ${svgH}`} 
              className="w-full h-auto min-h-[220px]"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaFillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#ff7a45" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {ySteps.map((val) => {
                const y = padTop + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;
                return (
                  <g key={val}>
                    <line 
                      x1={padLeft} 
                      y1={y} 
                      x2={svgW - padRight} 
                      y2={y} 
                      stroke="#e8e7e2" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={padLeft - 10} 
                      y={y + 3} 
                      textAnchor="end" 
                      className="fill-[#b7b7bc] text-[11px] font-sans"
                    >
                      {val === 0 ? '0' : val.toLocaleString('ru-RU')}
                    </text>
                  </g>
                );
              })}

              {/* Area path */}
              <path d={areaPath} fill="url(#areaFillGradient)" stroke="none" />

              {/* Curved Line path */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#ff7a45" 
                strokeWidth="2.5" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />

              {/* X-Axis date labels */}
              {xLabelIndices.map((idx) => {
                const p = points[idx];
                const d = series[idx];
                if (!p || !d) return null;
                return (
                  <text 
                    key={idx} 
                    x={p[0]} 
                    y={svgH - 8} 
                    textAnchor="middle" 
                    className="fill-[#8b8b92] text-[11px] font-medium font-sans"
                  >
                    {d.date}
                  </text>
                );
              })}

              {/* Active Marker Dot */}
              <circle 
                cx={activePoint[0]} 
                cy={activePoint[1]} 
                r="5" 
                fill="#ff7a45" 
                stroke="#ffffff" 
                strokeWidth="2" 
              />

              {/* Invisible interactive hover rectangles */}
              {series.map((d, i) => {
                const x = padLeft + i * xStep - xStep / 2;
                return (
                  <rect
                    key={i}
                    x={Math.max(padLeft, x)}
                    y={0}
                    width={xStep}
                    height={svgH}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                  />
                );
              })}
            </svg>

            {/* Floating Tooltip matching screenshot above 24 авг */}
            <div 
              className="absolute pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(activePoint[0] / svgW) * 100}%`,
                top: `${(activePoint[1] / svgH) * 100 - 8}%`,
              }}
            >
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-[0_8px_20px_rgba(16,16,15,0.10),0_2px_6px_rgba(16,16,15,0.06)] border border-[#e8e7e2] text-center min-w-[80px]">
                <div className="font-bold text-[13px] text-[#17171a] leading-tight font-['Unbounded',sans-serif]">
                  {activeItem.value.toLocaleString('ru-RU')}
                </div>
                <div className="text-[10px] text-[#8b8b92] leading-tight mt-0.5">
                  {activeItem.date.includes('авг') ? `${activeItem.date.replace('авг', 'августа')}` : activeItem.date}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Источники посещений */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-col justify-between">
          <h3 className="text-[16px] font-bold text-[#17171a] mb-2">
            Источники посещений
          </h3>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-6 my-auto">
            {/* Donut graphic */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`}>
                {visitSources.map((seg, i) => {
                  const segLen = (seg.value / 100) * circumference;
                  const dasharray = `${segLen} ${circumference - segLen}`;
                  const dashoffset = -offsetAccumulator;
                  offsetAccumulator += segLen;
                  return (
                    <circle
                      key={i}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={strokeW}
                      strokeDasharray={dasharray}
                      strokeDashoffset={dashoffset}
                      transform={`rotate(-90 ${donutSize / 2} ${donutSize / 2})`}
                      strokeLinecap="butt"
                    />
                  );
                })}
              </svg>

              {/* Inside center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[24px] font-bold text-[#17171a] font-['Unbounded',sans-serif] leading-tight">
                  {currentKpi.visitors.value.toLocaleString('ru-RU')}
                </span>
                <span className="text-[11px] text-[#8b8b92]">
                  посетителя
                </span>
              </div>
            </div>

            {/* Legend list on the right */}
            <div className="flex-1 w-full space-y-2.5">
              {visitSources.map((source, i) => (
                <div key={i} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: source.color }} 
                    />
                    <span className="text-[#17171a] font-medium">{source.label}</span>
                  </div>
                  <span className="font-bold text-[#17171a]">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Row 2: Popular Exhibitions + Age Groups + Geography (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Col 1: Популярные экспозиции */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-col justify-between">
          <h3 className="text-[16px] font-bold text-[#17171a] mb-4">
            Популярные экспозиции
          </h3>

          <div className="space-y-4 my-auto">
            {popularExhibitions.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectExhibition(item.label)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className="text-[13px] font-bold text-[#b7b7bc] w-3 shrink-0">
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#17171a] truncate group-hover:text-[#ff7a45] transition-colors mb-1.5">
                    {item.label}
                  </div>
                  <div className="h-2 w-full bg-[#f5f5f2] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.value / maxExhibitionVal) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>

                <span className="text-[13px] font-bold text-[#17171a] w-9 text-right shrink-0">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Возраст посетителей */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-col justify-between">
          <h3 className="text-[16px] font-bold text-[#17171a] mb-4">
            Возраст посетителей
          </h3>

          <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-1 px-1">
            {ageGroups.map((group, idx) => {
              const barHeightPct = (group.pct / maxAgePct) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-bold text-[#17171a]">
                    {group.pct}%
                  </span>
                  <div 
                    className="w-full max-w-[38px] rounded-t-md transition-all duration-500"
                    style={{ 
                      height: `${barHeightPct}%`,
                      backgroundColor: group.color 
                    }}
                  />
                  <span className="text-[11px] text-[#8b8b92] whitespace-nowrap pt-1">
                    {group.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 3: География */}
        <div className="bg-white rounded-[20px] p-6 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#17171a]">
                География
              </h3>
              <button 
                onClick={() => onNavigateTab('audience')}
                className="text-[12px] font-semibold text-[#8b8b92] hover:text-[#17171a] flex items-center gap-1 transition-colors"
              >
                <span>Смотреть все →</span>
              </button>
            </div>

            <div className="space-y-3">
              {geography.map((geo, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#b7b7bc] shrink-0" />
                    <span className="text-[#17171a] font-medium">{geo.city}</span>
                  </div>
                  <span className="font-bold text-[#17171a]">{geo.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom right watermark matching screenshot */}
          <div className="pt-4 text-right">
            <div className="font-bold text-[9.5px] leading-[1.3] tracking-[0.08em] text-[#b7b7bc] uppercase font-['Manrope',sans-serif]">
              ДАННЫЕ<br />
              СОЗДАЮТ<br />
              ВОЗМОЖНОСТИ
            </div>
          </div>
        </div>
      </div>

      {/* 7. Quick AI Prompt Field (Integrated directly at the bottom for instant access) */}
      <div className="bg-white rounded-[20px] p-5 border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ff7a45]/10 text-[#ff7a45] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#17171a]">
                AI-ассистент культурных форматов
              </span>
              <span className="text-xs text-[#8b8b92] ml-2 hidden sm:inline">
                (модель на базе CatBoost ML + ai_rec.py + Gemini)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('ai_assistant')}
            className="text-xs font-bold text-[#ff7a45] hover:underline flex items-center gap-1"
          >
            <span>Открыть полный AI-модуль</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <input
            type="text"
            value={quickAiPrompt}
            onChange={(e) => setQuickAiPrompt(e.target.value)}
            placeholder="Опишите мероприятие (например: «хочу провести в субботу мероприятие для детей про субд»)..."
            className="flex-1 px-4 py-2.5 bg-[#f5f5f2] border border-[#e8e7e2] rounded-xl text-sm focus:outline-none focus:border-[#ff7a45] transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#121214] hover:bg-black text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#ff7a45]" />
            <span>Проверить идею</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#8b8b92]">
          <span className="font-semibold text-[#17171a]">Примеры запросов из репозитория:</span>
          {PRESET_AI_IDEAS.slice(0, 2).map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuickAiPrompt(preset.title);
              }}
              className="px-2.5 py-1 bg-[#f5f5f2] hover:bg-[#ecece9] rounded-lg text-[12px] text-[#17171a] transition-colors truncate max-w-[280px]"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
