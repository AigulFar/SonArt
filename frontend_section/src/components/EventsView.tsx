import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  ThumbsUp, 
  AlertCircle, 
  Filter, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  X,
  Building2,
  CalendarRange
} from 'lucide-react';
import { CulturalEvent, EventType, Institution, TimePeriodFilter, CustomDateRange, getPeriodDisplayLabel } from '../types';
import { EVENTS_DATA, FORMAT_BENCHMARKS } from '../data/mockData';

interface EventsViewProps {
  institution?: Institution;
  periodFilter?: TimePeriodFilter;
  customDateRange?: CustomDateRange;
  onOpenCreateEvent: () => void;
  selectedExhibitionTitle?: string | null;
  onClearSelectedExhibition?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  institution,
  periodFilter = 'month',
  customDateRange,
  onOpenCreateEvent,
  selectedExhibitionTitle,
  onClearSelectedExhibition,
}) => {
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [filterOnlyPeriod, setFilterOnlyPeriod] = useState(false);
  const [activeEventModal, setActiveEventModal] = useState<CulturalEvent | null>(
    selectedExhibitionTitle 
      ? (EVENTS_DATA.find(e => e.title.includes(selectedExhibitionTitle)) || null)
      : null
  );

  const periodLabel = getPeriodDisplayLabel(periodFilter, customDateRange);

  // Institution scaling
  const instEvents = institution?.events2026 || 225;
  const instScale = Math.max(0.4, Math.min(2.5, instEvents / 225));

  const isDateInPeriod = (dateStr: string) => {
    if (periodFilter === 'today') return dateStr >= '2026-09-06';
    if (periodFilter === 'yesterday') return dateStr >= '2026-09-01';
    if (periodFilter === 'week') return dateStr >= '2026-08-28';
    return true; // 'month', 'quarter', 'custom' includes 8 авг - 9 сен
  };

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((e) => {
      if (selectedType !== 'all' && e.type !== selectedType) return false;
      if (selectedExhibitionTitle && !e.title.includes(selectedExhibitionTitle)) return false;
      if (filterOnlyPeriod && !isDateInPeriod(e.date)) return false;
      return true;
    }).map((e) => ({
      ...e,
      visitors: Math.round(e.visitors * instScale),
      capacity: Math.round(e.capacity * instScale),
      newVisitors: Math.round(e.newVisitors * instScale),
      repeatVisitors: Math.round(e.repeatVisitors * instScale),
      registered: Math.round(e.registered * instScale),
    }));
  }, [selectedType, selectedExhibitionTitle, filterOnlyPeriod, instScale, periodFilter]);

  return (
    <div className="space-y-6">
      {/* Live Filter Context Card */}
      {institution && (
        <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#121214] font-['Unbounded',sans-serif]">
                  События учреждения: {institution.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                  {institution.city}
                </span>
              </div>
              <div className="text-xs text-[#73737a] mt-0.5 flex flex-wrap items-center gap-2">
                <span>План 2026: <strong className="text-[#121214]">{institution.events2026} событий</strong> (+{institution.growthPct}%)</span>
                <span>•</span>
                <span>Выручка: <strong className="text-[#121214]">{(institution.serviceRevenueTotal / 1_000_000).toFixed(1)} млн ₽</strong></span>
                <span>•</span>
                <span>В текущем каталоге: <strong className="text-[#ff7a45]">{filteredEvents.length} событий</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterOnlyPeriod(!filterOnlyPeriod)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterOnlyPeriod
                  ? 'bg-[#ff7a45] text-white shadow-xs'
                  : 'bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2] hover:text-[#121214]'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>{filterOnlyPeriod ? `Только за ${periodLabel}` : `Фильтр: за ${periodLabel}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Header with Blueprint Philosophy */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                06 МЕРОПРИЯТИЯ
              </span>
              <span className="text-[11px] text-[#8b8b92] font-semibold">Центр принятия решений и замкнутый контур</span>
              {institution && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f2] text-[#121214] border border-[#e8e7e2]">
                  {institution.name} ({institution.city})
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121214] font-['Unbounded',sans-serif] tracking-tight">
              Каталог событий и управленческие выводы
            </h2>
            <p className="text-xs sm:text-sm text-[#73737a] mt-1 max-w-2xl leading-relaxed">
              Прошлое мероприятие = проверенные данные. Будущее = тестируемая гипотеза. Карточка события связывает факт и следующий управленческий шаг.
            </p>
          </div>

          <button
            onClick={onOpenCreateEvent}
            className="px-5 py-2.5 bg-[#ff7a45] hover:bg-[#f06833] text-white rounded-full text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Создать событие + AI-анализ</span>
          </button>
        </div>
      </div>

      {/* Benchmark Summary Bar across the 5 Cultural Formats */}
      <div className="bg-[#121214] text-white p-6 rounded-[20px] shadow-[0_12px_32px_rgba(18,18,20,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff7a45] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a0a0a8]">
              Отраслевые бенчмарки по типам событий (225 событий датасета)
            </span>
          </div>
          <span className="text-xs text-[#a0a0a8]">
            Средний fill rate: <strong className="text-white font-['Unbounded',sans-serif]">71.4%</strong> • No-show: <strong className="text-white font-['Unbounded',sans-serif]">10.6%</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FORMAT_BENCHMARKS.map((bench) => {
            const isSelected = selectedType === bench.type;
            return (
              <button
                key={bench.type}
                onClick={() => setSelectedType(bench.type as EventType)}
                className={`p-4 rounded-[16px] text-left transition-all border ${
                  isSelected
                    ? 'bg-white/10 border-[#ff7a45] shadow-sm'
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#a0a0a8] font-medium">
                  <span className={isSelected ? 'text-white font-bold' : ''}>{bench.type}</span>
                  <span className="text-[10px] text-[#888892]">{bench.totalEvents} соб.</span>
                </div>
                <div className="text-xl font-black text-white mt-1.5 font-['Unbounded',sans-serif]">
                  {bench.avgFillRatePct}%
                </div>
                <div className="text-[10px] text-[#888892] mt-0.5">
                  ср. {bench.avgVisitors} чел.
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs & Active Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              setSelectedType('all');
              if (onClearSelectedExhibition) onClearSelectedExhibition();
            }}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              selectedType === 'all' && !selectedExhibitionTitle
                ? 'bg-[#121214] text-white shadow-xs'
                : 'bg-white text-[#73737a] border border-[#e8e7e2] hover:text-[#121214] hover:bg-[#fafaf7]'
            }`}
          >
            Все форматы ({EVENTS_DATA.length})
          </button>
          {(['Выставка', 'Лекция', 'Мастер-класс', 'Творческая встреча', 'Концерт'] as EventType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                if (onClearSelectedExhibition) onClearSelectedExhibition();
              }}
              className={`px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
                selectedType === type && !selectedExhibitionTitle
                  ? 'bg-[#121214] text-white shadow-xs'
                  : 'bg-white text-[#73737a] border border-[#e8e7e2] hover:text-[#121214] hover:bg-[#fafaf7]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {selectedExhibitionTitle && (
          <div className="flex items-center gap-2 bg-[#ff7a45]/10 border border-[#ff7a45]/30 px-3.5 py-1.5 rounded-full text-xs text-[#ff7a45] font-bold">
            <span>Фильтр: «{selectedExhibitionTitle}»</span>
            <button
              onClick={() => onClearSelectedExhibition && onClearSelectedExhibition()}
              className="hover:text-black font-black ml-1 text-sm leading-none"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => setActiveEventModal(event)}
            className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] hover:border-[#ff7a45]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Type, Date, Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-[#fafaf7] text-[#121214] border border-[#e8e7e2]">
                  {event.type}
                </span>
                <span className="text-[#8b8b92] font-medium">
                  {event.date} • {event.startTime} ({event.durationMin} мин)
                </span>
              </div>

              <h3 className="text-base font-bold text-[#121214] mt-3 group-hover:text-[#ff7a45] transition-colors line-clamp-1 font-['Unbounded',sans-serif]">
                {event.title}
              </h3>
              <p className="text-xs text-[#73737a] mt-1 line-clamp-2 leading-relaxed">
                {event.description}
              </p>

              {/* Attendance Bar */}
              <div className="mt-4 p-4 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#121214] mb-1.5">
                  <span className="font-bold font-['Unbounded',sans-serif]">Заполняемость: {event.fillRatePct}%</span>
                  <span className="text-[#73737a] font-normal">
                    {event.visitors} / {event.capacity} мест
                  </span>
                </div>
                <div className="w-full bg-[#e8e7e2] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      event.fillRatePct >= 85 ? 'bg-[#7fbf8a]' : 'bg-[#ff7a45]'
                    }`}
                    style={{ width: `${Math.min(100, event.fillRatePct)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-[#73737a] mt-2.5">
                  <span>Новые: <strong className="text-[#121214]">{event.newVisitors}</strong></span>
                  <span>Повторные: <strong className="text-[#121214]">{event.repeatVisitors}</strong></span>
                  <span>No-show: <strong className="text-[#121214]">{event.noShowRatePct}%</strong></span>
                </div>
              </div>

              {/* Quality & Benchmark Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#e8a13c]">★ {event.avgRating || '—'}</span>
                  <span className="text-[#9e9ea6]">({event.reviewCount} отзывов)</span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  event.benchmarkDiffPct >= 0 
                    ? 'bg-[#7fbf8a]/10 text-[#2e7d32] border-[#7fbf8a]/20' 
                    : 'bg-[#e8a13c]/10 text-[#b45309] border-[#e8a13c]/20'
                }`}>
                  {event.benchmarkDiffPct >= 0 ? '+' : ''}{event.benchmarkDiffPct}% к бенчмарку
                </span>
              </div>
            </div>

            {/* Decision Preview Footer */}
            <div className="mt-4 pt-3.5 border-t border-[#e8e7e2] flex items-center justify-between text-xs font-bold text-[#73737a] group-hover:text-[#121214]">
              <span className="text-[#ff7a45] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#ff7a45]" />
                Карточка решения СанАрт
              </span>
              <ChevronRight className="w-4 h-4 text-[#9e9ea6] group-hover:text-[#ff7a45] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Complete Event Details Modal */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-7 shadow-[0_24px_64px_rgba(18,18,20,0.2)] border border-[#e8e7e2] my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#e8e7e2] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#fafaf7] text-[#121214] border border-[#e8e7e2]">
                    {activeEventModal.type}
                  </span>
                  <span className="text-xs text-[#9e9ea6]">ID: {activeEventModal.id}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#121214] mt-2 font-['Unbounded',sans-serif]">
                  {activeEventModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveEventModal(null)}
                className="w-8 h-8 rounded-full bg-[#fafaf7] border border-[#e8e7e2] flex items-center justify-center text-[#73737a] hover:text-[#121214] hover:bg-[#e8e7e2] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Structured Zones from Blueprint */}
            <div className="py-4 space-y-5 text-xs text-[#73737a] max-h-[70vh] overflow-y-auto pr-1">
              {/* Zone 1: Context */}
              <div>
                <span className="font-bold text-[#9e9ea6] uppercase tracking-wider text-[10px] block mb-2 font-['Unbounded',sans-serif]">
                  1. Контекст мероприятия
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#fafaf7] p-4 rounded-[16px] border border-[#e8e7e2]">
                  <div>
                    <span className="text-[#9e9ea6] block text-[10px]">Дата и день</span>
                    <span className="font-bold text-[#121214]">{activeEventModal.date} ({activeEventModal.dayOfWeek})</span>
                  </div>
                  <div>
                    <span className="text-[#9e9ea6] block text-[10px]">Время и длительность</span>
                    <span className="font-bold text-[#121214]">{activeEventModal.startTime}, {activeEventModal.durationMin} мин</span>
                  </div>
                  <div>
                    <span className="text-[#9e9ea6] block text-[10px]">Цена билета</span>
                    <span className="font-bold text-[#121214]">{activeEventModal.price > 0 ? `${activeEventModal.price} ₽` : 'Бесплатно'}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9ea6] block text-[10px]">Целевая аудитория</span>
                    <span className="font-bold text-[#121214]">{activeEventModal.targetAge} лет</span>
                  </div>
                </div>
              </div>

              {/* Zone 2: Attendance Metrics */}
              <div>
                <span className="font-bold text-[#9e9ea6] uppercase tracking-wider text-[10px] block mb-2 font-['Unbounded',sans-serif]">
                  2. Посещаемость и структура конверсии
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center bg-[#fafaf7] p-4 rounded-[16px] border border-[#e8e7e2]">
                  <div>
                    <span className="text-[10px] text-[#9e9ea6] block">Заявки</span>
                    <span className="text-base font-black text-[#121214] font-['Unbounded',sans-serif]">{activeEventModal.registered}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9e9ea6] block">Визиты</span>
                    <span className="text-base font-black text-[#7fbf8a] font-['Unbounded',sans-serif]">{activeEventModal.visitors}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9e9ea6] block">Новые</span>
                    <span className="text-base font-black text-[#6c9bf5] font-['Unbounded',sans-serif]">{activeEventModal.newVisitors}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9e9ea6] block">Повторные</span>
                    <span className="text-base font-black text-[#a78bfa] font-['Unbounded',sans-serif]">{activeEventModal.repeatVisitors}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9e9ea6] block">Fill Rate</span>
                    <span className="text-base font-black text-[#ff7a45] font-['Unbounded',sans-serif]">{activeEventModal.fillRatePct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9e9ea6] block">No-show</span>
                    <span className="text-base font-black text-[#73737a] font-['Unbounded',sans-serif]">{activeEventModal.noShowRatePct}%</span>
                  </div>
                </div>
              </div>

              {/* Zone 3: Quality & Benchmark Comparison */}
              <div>
                <span className="font-bold text-[#9e9ea6] uppercase tracking-wider text-[10px] block mb-2 font-['Unbounded',sans-serif]">
                  3. Оценка качества и позиция относительно бенчмарка
                </span>
                <div className="p-4 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-[#9e9ea6] block">Средний рейтинг</span>
                      <span className="text-base font-bold text-[#e8a13c]">★ {activeEventModal.avgRating} / 5</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9e9ea6] block">Отзывов</span>
                      <span className="text-base font-bold text-[#121214]">{activeEventModal.reviewCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9e9ea6] block">Тональность</span>
                      <span className="text-xs font-bold text-[#2e7d32] bg-[#7fbf8a]/15 px-2.5 py-0.5 rounded-full">
                        {activeEventModal.sentimentScore > 0.7 ? 'Позитивная (высокая)' : 'Умеренная'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#9e9ea6] block">К бенчмарку формата</span>
                    <span className="text-sm font-bold text-[#2e7d32]">
                      +{activeEventModal.benchmarkDiffPct}% выше среднего
                    </span>
                  </div>
                </div>
              </div>

              {/* Zone 4: The Decision */}
              {activeEventModal.decisionSummary && (
                <div className="p-5 bg-[#ff7a45]/5 border border-[#ff7a45]/20 rounded-[16px] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#ff7a45] font-['Unbounded',sans-serif]">
                    <Zap className="w-4 h-4 text-[#ff7a45]" />
                    4. Управленческое решение СанАрт (Замкнутый контур)
                  </div>

                  {/* Repeat */}
                  <div>
                    <span className="text-[11px] font-bold text-[#2e7d32] block mb-1">
                      ✓ Что повторить (Успешные паттерны):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#121214] pl-1">
                      {activeEventModal.decisionSummary.repeat.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Change */}
                  <div>
                    <span className="text-[11px] font-bold text-[#b45309] block mb-1">
                      ⚠ Что изменить (Точки трения):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#121214] pl-1">
                      {activeEventModal.decisionSummary.change.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Test next */}
                  <div>
                    <span className="text-[11px] font-bold text-[#2563eb] block mb-1">
                      ✦ Что тестировать в следующий раз (Гипотезы):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#121214] pl-1">
                      {activeEventModal.decisionSummary.testNext.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#e8e7e2]">
              <button
                onClick={() => setActiveEventModal(null)}
                className="px-5 py-2.5 bg-[#fafaf7] hover:bg-[#e8e7e2] text-[#73737a] hover:text-[#121214] rounded-full text-xs font-bold transition-colors"
              >
                Закрыть карточку
              </button>

              <button
                onClick={() => {
                  setActiveEventModal(null);
                  onOpenCreateEvent();
                }}
                className="px-5 py-2.5 bg-[#ff7a45] hover:bg-[#f06833] text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Создать следующее событие с рекомендацией</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
