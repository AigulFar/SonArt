import React, { useState, useMemo } from 'react';
import { 
  MessageSquareHeart, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Wrench,
  AlertCircle,
  Building2,
  CalendarRange
} from 'lucide-react';
import { SAMPLE_REVIEWS, TOTAL_DATASET_METRICS } from '../data/mockData';
import { ReviewItem, Institution, TimePeriodFilter, CustomDateRange, getPeriodDisplayLabel } from '../types';

interface FeedbackViewProps {
  institution?: Institution;
  periodFilter?: TimePeriodFilter;
  customDateRange?: CustomDateRange;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  institution,
  periodFilter = 'month',
  customDateRange,
}) => {
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const periodLabel = getPeriodDisplayLabel(periodFilter, customDateRange);

  // Institution and period calculations
  const instEvents = institution?.events2026 || 225;
  const instScale = Math.max(0.4, Math.min(2.5, instEvents / 225));
  const isDivergence = institution?.dataQuality === 'divergence_detected';

  const periodMultiplier = periodFilter === 'today' ? 0.06 : periodFilter === 'yesterday' ? 0.05 : periodFilter === 'week' ? 0.28 : 1.0;
  const scaledReviewsTotal = Math.max(8, Math.round(142 * instScale * periodMultiplier));

  const avgRating = isDivergence ? 4.18 : +(4.55 + (instScale * 0.05)).toFixed(2);
  const positiveReviewsPct = isDivergence ? 61.5 : 72.8;
  const negativeReviewsPct = isDivergence ? 14.5 : 8.4;
  const neutralReviewsPct = +(100 - positiveReviewsPct - negativeReviewsPct).toFixed(1);

  const positiveReviewsCount = Math.round(scaledReviewsTotal * (positiveReviewsPct / 100));
  const neutralReviewsCount = Math.round(scaledReviewsTotal * (neutralReviewsPct / 100));
  const negativeReviewsCount = scaledReviewsTotal - positiveReviewsCount - neutralReviewsCount;

  const filteredReviews = useMemo(() => {
    return SAMPLE_REVIEWS.filter((rev) => {
      if (sentimentFilter !== 'all' && rev.sentiment !== sentimentFilter) return false;
      if (periodFilter === 'today' && rev.date < '2026-08-26') return false;
      if (periodFilter === 'yesterday' && rev.date < '2026-08-24') return false;
      if (periodFilter === 'week' && rev.date < '2026-08-22') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          rev.text.toLowerCase().includes(q) ||
          rev.eventTitle.toLowerCase().includes(q) ||
          rev.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [sentimentFilter, searchQuery, periodFilter]);

  return (
    <div className="space-y-6">
      {/* Live Filter Context Card */}
      {institution && (
        <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#121214] font-['Unbounded',sans-serif]">
                  Отзывы учреждения: {institution.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                  {institution.city}
                </span>
              </div>
              <div className="text-xs text-[#73737a] mt-0.5 flex flex-wrap items-center gap-2">
                <span>Отзывов за период: <strong className="text-[#121214]">{scaledReviewsTotal} шт.</strong></span>
                <span>•</span>
                <span>Средний рейтинг: <strong className="text-[#e8a13c]">{avgRating} ★</strong></span>
                <span>•</span>
                <span>Удовлетворенность: <strong className="text-[#2e7d32]">{positiveReviewsPct}%</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-[#fafaf7] border border-[#e8e7e2] text-[#121214] font-medium flex items-center gap-1.5">
              <CalendarRange className="w-3.5 h-3.5 text-[#ff7a45]" />
              <span>{periodLabel}</span>
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                09 ОБРАТНАЯ СВЯЗЬ
              </span>
              <span className="text-[11px] text-[#8b8b92] font-semibold">Слой объяснений и тональность</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121214] font-['Unbounded',sans-serif] tracking-tight">
              Отзывы, тональность и первопричины {institution ? `• ${institution.name}` : ''}
            </h2>
            <p className="text-xs sm:text-sm text-[#73737a] mt-1 max-w-2xl leading-relaxed">
              Отзывы не лежат изолированно: тональность и проблемы связываются с конкретными событиями и сразу превращаются в управленческие действия.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
          <span className="text-[11px] font-semibold uppercase text-[#8b8b92] block">Средний рейтинг</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#e8a13c] font-['Unbounded',sans-serif]">
              {avgRating}
            </span>
            <span className="text-xs text-[#9e9ea6]">из 5.0</span>
          </div>
          <div className="text-xs text-[#73737a] mt-1">
            На основе {scaledReviewsTotal} отзывов за {periodLabel}
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-[#8b8b92]">Позитивная тональность</span>
            <ThumbsUp className="w-4 h-4 text-[#7fbf8a]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#2e7d32] font-['Unbounded',sans-serif]">
              {positiveReviewsPct}%
            </span>
            <span className="text-xs text-[#9e9ea6]">({positiveReviewsCount})</span>
          </div>
          <div className="text-xs text-[#73737a] mt-1">
            Атмосфера, концепции, свет и звук
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-[#8b8b92]">Нейтральные отзывы</span>
            <Minus className="w-4 h-4 text-[#9e9ea6]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#73737a] font-['Unbounded',sans-serif]">
              {neutralReviewsPct}%
            </span>
            <span className="text-xs text-[#9e9ea6]">({neutralReviewsCount})</span>
          </div>
          <div className="text-xs text-[#73737a] mt-1">
            Пожелания по навигации и кофе-зоне
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-[#8b8b92]">Критические сигналы</span>
            <ThumbsDown className="w-4 h-4 text-[#c62828]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#c62828] font-['Unbounded',sans-serif]">
              {negativeReviewsPct}%
            </span>
            <span className="text-xs text-[#9e9ea6]">({negativeReviewsCount})</span>
          </div>
          <div className="text-xs text-[#73737a] mt-1">
            Точки устранения трения (пуфы, сканеры)
          </div>
        </div>
      </div>

      {/* Repeating Problem Themes & Action Signals */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <h3 className="text-sm font-bold text-[#121214] mb-4 flex items-center gap-2 font-['Unbounded',sans-serif]">
          <Wrench className="w-4 h-4 text-[#ff7a45]" />
          <span>Выделенные проблемные темы и управленческие действия {institution ? `(площадки: ${institution.name})` : 'СанАрт'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#121214] font-['Unbounded',sans-serif]">Усталость и нехватка мест</span>
              <span className="text-[10px] bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30 px-2 py-0.5 rounded-full font-bold">14 отзывов</span>
            </div>
            <p className="text-xs text-[#73737a] leading-relaxed">
              Посетители выставки «Время и пространство» устают ходить 2 часа пешком по экспозиции.
            </p>
            <div className="pt-2.5 border-t border-[#e8e7e2] text-[11px] font-semibold text-[#2e7d32] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#2e7d32]" />
              <span>Действие: Закуплено 12 эргономичных пуфов в зал кинетики</span>
            </div>
          </div>

          <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#121214] font-['Unbounded',sans-serif]">Звук в малом лектории</span>
              <span className="text-[10px] bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30 px-2 py-0.5 rounded-full font-bold">9 отзывов</span>
            </div>
            <p className="text-xs text-[#73737a] leading-relaxed">
              Эхо и слабый микрофон на теоретических лекциях дальше 5-го ряда зрителей.
            </p>
            <div className="pt-2.5 border-t border-[#e8e7e2] text-[11px] font-semibold text-[#2e7d32] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#2e7d32]" />
              <span>Действие: Смонтирована акустическая колонка и радиомикрофон</span>
            </div>
          </div>

          <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#121214] font-['Unbounded',sans-serif]">Очередь на турникетах</span>
              <span className="text-[10px] bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30 px-2 py-0.5 rounded-full font-bold">11 отзывов</span>
            </div>
            <p className="text-xs text-[#73737a] leading-relaxed">
              Задержка считывания QR-билетов со смартфонов при темной теме в пиковые часы.
            </p>
            <div className="pt-2.5 border-t border-[#e8e7e2] text-[11px] font-semibold text-[#2e7d32] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#2e7d32]" />
              <span>Действие: Обновлена прошивка сканеров и добавлены слоты входа</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSentimentFilter('all')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              sentimentFilter === 'all'
                ? 'bg-[#121214] text-white shadow-xs'
                : 'bg-white text-[#73737a] border border-[#e8e7e2] hover:text-[#121214] hover:bg-[#fafaf7]'
            }`}
          >
            Все отзывы
          </button>
          <button
            onClick={() => setSentimentFilter('positive')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              sentimentFilter === 'positive'
                ? 'bg-[#7fbf8a] text-white shadow-xs'
                : 'bg-white text-[#2e7d32] border border-[#e8e7e2] hover:bg-[#fafaf7]'
            }`}
          >
            Позитивные ({positiveReviewsPct}%)
          </button>
          <button
            onClick={() => setSentimentFilter('negative')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              sentimentFilter === 'negative'
                ? 'bg-[#c62828] text-white shadow-xs'
                : 'bg-white text-[#c62828] border border-[#e8e7e2] hover:bg-[#fafaf7]'
            }`}
          >
            Критические ({negativeReviewsPct}%)
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#9e9ea6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по тексту, тегам или событию..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e8e7e2] rounded-full text-xs text-[#121214] placeholder:text-[#9e9ea6] focus:outline-none focus:border-[#ff7a45]"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-5 sm:p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-3 hover:border-[#ff7a45]/30 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#e8a13c] text-sm">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </span>
                <span className="font-bold text-[#121214] font-['Unbounded',sans-serif]">{rev.eventTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-[#8b8b92]">
                <span>Возраст: {rev.authorAgeGroup}</span>
                <span>•</span>
                <span>{rev.date}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    rev.sentiment === 'positive'
                      ? 'bg-[#7fbf8a]/15 text-[#2e7d32] border-[#7fbf8a]/30'
                      : rev.sentiment === 'negative'
                      ? 'bg-[#c62828]/10 text-[#c62828] border-[#c62828]/20'
                      : 'bg-[#fafaf7] text-[#73737a] border-[#e8e7e2]'
                  }`}
                >
                  {rev.sentiment === 'positive' ? 'Позитивный' : rev.sentiment === 'negative' ? 'Критический' : 'Нейтральный'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#121214] leading-relaxed">
              «{rev.text}»
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#e8e7e2]/70">
              <div className="flex flex-wrap gap-1.5">
                {rev.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 bg-[#fafaf7] border border-[#e8e7e2] text-[#73737a] rounded-full text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {rev.actionTaken && (
                <div className="text-[11px] font-semibold text-[#2e7d32] flex items-center gap-1.5 bg-[#7fbf8a]/10 border border-[#7fbf8a]/25 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Решение принято: {rev.actionTaken}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
