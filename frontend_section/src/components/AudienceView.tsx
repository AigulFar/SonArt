import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  HeartHandshake, 
  Compass, 
  AlertCircle, 
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Filter,
  Check,
  Building2,
  CalendarRange
} from 'lucide-react';
import { AUDIENCE_SEGMENTS, AGE_DISTRIBUTION, FORMAT_BENCHMARKS } from '../data/mockData';
import { AudienceSegment, ClusterSegmentId, Institution, TimePeriodFilter, CustomDateRange, getPeriodDisplayLabel } from '../types';

interface AudienceViewProps {
  institution?: Institution;
  periodFilter?: TimePeriodFilter;
  customDateRange?: CustomDateRange;
  onOpenCreateEventWithSegment?: (segment: AudienceSegment) => void;
  onNavigateEvents?: () => void;
}

export const AudienceView: React.FC<AudienceViewProps> = ({
  institution,
  periodFilter = 'month',
  customDateRange,
  onOpenCreateEventWithSegment,
  onNavigateEvents,
}) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<ClusterSegmentId>('active_loyal');

  const periodLabel = getPeriodDisplayLabel(periodFilter, customDateRange);

  // Institution-specific scaling
  const instEvents = institution?.events2026 || 225;
  const instScale = Math.max(0.4, Math.min(2.8, instEvents / 225));
  const totalProfiles = Math.round(5000 * instScale);

  // Period activity multiplier
  const periodMultiplier = periodFilter === 'today' ? 0.04 : periodFilter === 'yesterday' ? 0.038 : periodFilter === 'week' ? 0.23 : 1.0;
  const periodActiveVisitors = Math.round(totalProfiles * periodMultiplier);

  const selectedSegmentRaw = AUDIENCE_SEGMENTS.find(s => s.id === selectedSegmentId) || AUDIENCE_SEGMENTS[0];
  const selectedSegment: AudienceSegment = {
    ...selectedSegmentRaw,
    count: Math.round(selectedSegmentRaw.count * instScale),
  };

  const getSegmentIcon = (id: ClusterSegmentId, isSelected: boolean) => {
    switch (id) {
      case 'active_loyal':
        return <Flame className={`w-5 h-5 ${isSelected ? 'text-[#ff7a45]' : 'text-[#ff7a45]'}`} />;
      case 'new_rare':
        return <Compass className={`w-5 h-5 ${isSelected ? 'text-[#6c9bf5]' : 'text-[#4878d6]'}`} />;
      case 'engaged_critics':
        return <AlertCircle className={`w-5 h-5 ${isSelected ? 'text-[#e8a13c]' : 'text-[#d97706]'}`} />;
      case 'format_niches':
        return <Layers className={`w-5 h-5 ${isSelected ? 'text-[#a78bfa]' : 'text-[#7c3aed]'}`} />;
    }
  };

  const getBadgeStyle = (id: ClusterSegmentId) => {
    switch (id) {
      case 'active_loyal':
        return 'bg-[#ff7a45]/10 text-[#ff7a45] border-[#ff7a45]/20';
      case 'new_rare':
        return 'bg-[#6c9bf5]/10 text-[#2563eb] border-[#6c9bf5]/20';
      case 'engaged_critics':
        return 'bg-[#e8a13c]/10 text-[#b45309] border-[#e8a13c]/20';
      case 'format_niches':
        return 'bg-[#a78bfa]/10 text-[#7c3aed] border-[#a78bfa]/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Filter Context Card */}
      {institution && (
        <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#121214] font-['Unbounded',sans-serif]">
                  Аудитория учреждения: {institution.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                  {institution.city}
                </span>
              </div>
              <div className="text-xs text-[#73737a] mt-0.5 flex flex-wrap items-center gap-2">
                <span>Профилей в базе: <strong className="text-[#121214]">{totalProfiles.toLocaleString('ru-RU')}</strong></span>
                <span>•</span>
                <span>Активно за период (<strong className="text-[#121214]">{periodLabel}</strong>): <strong className="text-[#ff7a45]">{periodActiveVisitors.toLocaleString('ru-RU')}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#fafaf7] border border-[#e8e7e2] text-[#121214] font-medium flex items-center gap-1.5">
              <CalendarRange className="w-3.5 h-3.5 text-[#ff7a45]" />
              <span>{periodLabel}</span>
            </span>
          </div>
        </div>
      )}

      {/* Header and Methodology banner */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                05 ПОСЕТИТЕЛИ
              </span>
              <span className="text-[11px] text-[#8b8b92] font-semibold">Поведенческая кластеризация K-Means</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121214] font-['Unbounded',sans-serif] tracking-tight">
              Сегментация и поведенческие кластеры
            </h2>
            <p className="text-xs sm:text-sm text-[#73737a] mt-1 max-w-3xl leading-relaxed">
              {totalProfiles.toLocaleString('ru-RU')} профилей посетителей {institution ? `«${institution.name}»` : ''} кластеризованы по признакам: возраст, частота визитов 2026, число отзывов, средняя оценка, engagement score и любимый формат.
            </p>
          </div>

          <div className="bg-[#fafaf7] p-3.5 rounded-[16px] border border-[#e8e7e2] text-xs text-[#73737a] max-w-xs">
            <span className="font-bold text-[#121214] block mb-0.5">Принцип СанАрт:</span>
            Связать каждый сегмент с конкретным решением по программированию расписания, а не показывать абстрактный список.
          </div>
        </div>
      </div>

      {/* 4 Segment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AUDIENCE_SEGMENTS.map((segment) => {
          const isSelected = segment.id === selectedSegmentId;
          const scaledSegmentCount = Math.round(segment.count * instScale);
          return (
            <div
              key={segment.id}
              onClick={() => setSelectedSegmentId(segment.id)}
              className={`p-5 rounded-[20px] border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#121214] text-white border-[#121214] shadow-[0_12px_32px_rgba(18,18,20,0.18)] scale-[1.02]'
                  : 'bg-white text-[#121214] border-[#e8e7e2] hover:border-[#ff7a45]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-[12px] ${isSelected ? 'bg-white/10' : 'bg-[#fafaf7] border border-[#e8e7e2]'}`}>
                    {getSegmentIcon(segment.id, isSelected)}
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      isSelected ? 'bg-white/10 text-white border-white/20' : getBadgeStyle(segment.id)
                    }`}
                  >
                    {segment.sharePct}% базы
                  </span>
                </div>

                <h3 className={`text-base font-bold mt-3 font-['Unbounded',sans-serif] ${isSelected ? 'text-white' : 'text-[#121214]'}`}>
                  {segment.name}
                </h3>
                <div className={`text-xs mt-1.5 leading-snug line-clamp-2 ${isSelected ? 'text-[#a0a0a8]' : 'text-[#73737a]'}`}>
                  {segment.tagline}
                </div>

                {/* Micro metrics */}
                <div className={`grid grid-cols-2 gap-2 mt-4 pt-3 border-t text-xs ${isSelected ? 'border-white/10' : 'border-[#e8e7e2]'}`}>
                  <div>
                    <span className={`block text-[10px] font-semibold uppercase ${isSelected ? 'text-[#888892]' : 'text-[#9e9ea6]'}`}>Визиты в год</span>
                    <span className={`font-black text-sm font-['Unbounded',sans-serif] ${isSelected ? 'text-white' : 'text-[#121214]'}`}>
                      {segment.avgVisitsPerYear}
                    </span>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-semibold uppercase ${isSelected ? 'text-[#888892]' : 'text-[#9e9ea6]'}`}>Engagement</span>
                    <span className={`font-black text-sm font-['Unbounded',sans-serif] ${isSelected ? 'text-[#ff7a45]' : 'text-[#ff7a45]'}`}>
                      {segment.avgEngagementScore} <span className="text-[10px] font-normal text-[#888892]">/10</span>
                    </span>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-semibold uppercase ${isSelected ? 'text-[#888892]' : 'text-[#9e9ea6]'}`}>Оценка</span>
                    <span className={`font-black text-sm font-['Unbounded',sans-serif] ${isSelected ? 'text-white' : 'text-[#121214]'}`}>
                      {segment.avgRating} ★
                    </span>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-semibold uppercase ${isSelected ? 'text-[#888892]' : 'text-[#9e9ea6]'}`}>Объем</span>
                    <span className={`font-black text-sm font-['Unbounded',sans-serif] ${isSelected ? 'text-white' : 'text-[#121214]'}`}>
                      ~{scaledSegmentCount.toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t text-xs font-bold flex items-center justify-between ${
                isSelected ? 'border-white/10 text-[#ff7a45]' : 'border-[#e8e7e2] text-[#73737a]'
              }`}>
                <span>{isSelected ? 'Активный сегмент' : 'Выбрать сегмент'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Card for the Selected Segment */}
      <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#e8e7e2]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px]">
              {getSegmentIcon(selectedSegment.id, false)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#121214] font-['Unbounded',sans-serif]">
                  Сегмент «{selectedSegment.name}»
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getBadgeStyle(selectedSegment.id)}`}>
                  {selectedSegment.count} чел. ({selectedSegment.sharePct}%)
                </span>
              </div>
              <p className="text-xs text-[#73737a] mt-0.5">
                {selectedSegment.profileDescription}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenCreateEventWithSegment && onOpenCreateEventWithSegment(selectedSegment)}
            className="px-5 py-2.5 bg-[#ff7a45] hover:bg-[#f06833] text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Создать событие под этот сегмент</span>
          </button>
        </div>

        {/* 2-column detailed breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Product Action & Retention Playbook */}
          <div className="space-y-4">
            <div className="p-5 bg-[#fafaf7] border border-[#ff7a45]/30 rounded-[16px]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#ff7a45] font-['Unbounded',sans-serif]">
                <CheckCircle2 className="w-4 h-4 text-[#ff7a45]" />
                Что делать организатору (Продуктовое действие)
              </div>
              <p className="text-xs text-[#121214] mt-2 font-medium leading-relaxed">
                {selectedSegment.recommendedAction}
              </p>
            </div>

            <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#121214] font-['Unbounded',sans-serif]">
                <HeartHandshake className="w-4 h-4 text-[#73737a]" />
                Сценарий удержания (Retention Loop)
              </div>
              <p className="text-xs text-[#73737a] mt-2 leading-relaxed">
                {selectedSegment.retentionScenario}
              </p>
            </div>

            <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px]">
              <span className="text-xs font-bold text-[#121214] block mb-2.5 font-['Unbounded',sans-serif]">
                Предпочитаемые форматы мероприятий:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSegment.favoriteFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-3 py-1 bg-white border border-[#e8e7e2] text-[#121214] rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-[#ff7a45]" />
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Behavioral Stats & Age Correlation */}
          <div className="space-y-4">
            <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px]">
              <span className="text-xs font-bold text-[#121214] block mb-3 font-['Unbounded',sans-serif]">
                Поведенческие метрики кластера (vs среднее по учреждению)
              </span>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-[#73737a] mb-1.5">
                    <span className="font-medium">Частота визитов в год:</span>
                    <span className="font-bold text-[#121214]">{selectedSegment.avgVisitsPerYear} раз (ср. 2.9)</span>
                  </div>
                  <div className="w-full bg-[#e8e7e2] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#121214] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (selectedSegment.avgVisitsPerYear / 7) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#73737a] mb-1.5">
                    <span className="font-medium">Вовлеченность (Engagement Index):</span>
                    <span className="font-bold text-[#ff7a45]">{selectedSegment.avgEngagementScore} / 10 (ср. 6.2)</span>
                  </div>
                  <div className="w-full bg-[#e8e7e2] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ff7a45] h-full rounded-full transition-all"
                      style={{ width: `${selectedSegment.avgEngagementScore * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#73737a] mb-1.5">
                    <span className="font-medium">Средняя оценка в отзывах:</span>
                    <span className="font-bold text-[#121214]">{selectedSegment.avgRating} ★ (ср. 4.15)</span>
                  </div>
                  <div className="w-full bg-[#e8e7e2] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedSegment.avgRating < 3.8 ? 'bg-[#e8a13c]' : 'bg-[#7fbf8a]'
                      }`}
                      style={{ width: `${(selectedSegment.avgRating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px]">
              <span className="text-xs font-bold text-[#121214] block mb-2 font-['Unbounded',sans-serif]">
                Возрастные группы сегмента:
              </span>
              <div className="flex items-center gap-2">
                {selectedSegment.primaryAgeGroups.map((grp) => (
                  <span
                    key={grp}
                    className="px-3 py-1 bg-[#121214] text-white rounded-full text-xs font-bold"
                  >
                    {grp} лет
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#73737a] mt-2.5 leading-relaxed">
                Сконцентрированы в ключевой аудиторной когорте с максимальной восприимчивостью к цифровым форматам и вечерним кураторским программам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
