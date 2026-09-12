import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Database, 
  Brain, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  FileText,
  CalendarRange
} from 'lucide-react';
import { Institution, TimePeriodFilter, CustomDateRange, getPeriodDisplayLabel } from '../types';
import { INSTITUTIONS, TOTAL_DATASET_METRICS, SELECTED_INSTITUTION_PERIOD_METRICS } from '../data/mockData';

interface ReportsViewProps {
  institution: Institution;
  periodFilter?: TimePeriodFilter;
  customDateRange?: CustomDateRange;
  onSelectInstitution: (inst: Institution) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  institution,
  periodFilter = 'month',
  customDateRange,
  onSelectInstitution,
}) => {
  const [copied, setCopied] = useState(false);
  const [reportType, setReportType] = useState<'executive' | 'benchmark' | 'lineage'>('executive');

  const total = TOTAL_DATASET_METRICS;
  const current = SELECTED_INSTITUTION_PERIOD_METRICS;

  const periodLabel = getPeriodDisplayLabel(periodFilter, customDateRange);

  // Dynamic calculations for the report
  const instEvents = institution.events2026 || 225;
  const instScale = Math.max(0.4, Math.min(2.5, instEvents / 225));
  const periodMultiplier = periodFilter === 'today' ? 0.065 : periodFilter === 'yesterday' ? 0.06 : periodFilter === 'week' ? 0.26 : 1.0;
  
  const reportVisitors = Math.round(1284 * instScale * periodMultiplier);
  const reportNewVisitors = Math.round(reportVisitors * 0.694);
  const reportEvents = Math.max(1, Math.round(6 * periodMultiplier));
  const reportReviews = Math.max(8, Math.round(412 * instScale * periodMultiplier));
  const reportFillRate = institution.dataQuality === 'divergence_detected' ? '76.2%' : '88.4%';
  const reportAvgRating = institution.dataQuality === 'divergence_detected' ? '4.18' : '4.55';

  const executiveSummaryText = `УПРАВЛЕНЧЕСКИЙ ОТЧЕТ: ${institution.name}
Период: ${periodLabel} (г. ${institution.city})

1. ОБЩЕЕ СОСТОЯНИЕ УЧРЕЖДЕНИЯ
- Фактическая посещаемость: ${reportVisitors.toLocaleString('ru-RU')} чел.
- Новые посетители: ${reportNewVisitors.toLocaleString('ru-RU')} чел. (69.4% структуры аудитории).
- Проведено мероприятий: ${reportEvents} событий, средняя заполняемость (fill rate): ${reportFillRate}.
- Среднее время визита: 1 ч 24 мин, экспозиции демонстрируют стабильное удержание.
- Совокупная официальная выручка (service_revenue_total): ${institution.serviceRevenueTotal.toLocaleString('ru-RU')} ₽ (+${institution.revenueGrowthPct}% год к году).

2. АУДИТОРИЯ И СЕГМЕНТЫ
- Выделено 4 ключевых сегмента (K-Means, silhouette 0.48):
  * «Новые / редкие» (36%) — ключевой резерв конверсии в клубные карты.
  * «Активные лояльные» (28%) — ядро частоты визитов (6.4 раза в год).
  * «Форматные ниши» (20%) — высокий спрос на прикладные воркшопы.
  * «Вовлечённые критики» (16%) — чувствительны к акустике и комфорту.

3. ОБРАТНАЯ СВЯЗЬ И КАЧЕСТВО
- Средняя оценка: ${reportAvgRating} / 5.0 (на основе ${reportReviews} отзывов за период).
- Позитивная тональность: 72.8%.
- Статус верификации данных: ${institution.dataQuality === 'divergence_detected' ? 'ВНИМАНИЕ: Обнаружено расхождение кассы и счётчиков' : 'Верифицировано (контур 100% доверия)'}.

4. РЕКОМЕНДАЦИИ САНАРТ НА СЛЕДУЮЩИЙ ПЕРИОД
- Продлить режим вечерних кураторских показов по четвергам (пиковый спрос аудитории 18-28 лет).
- Запустить пакетный абонемент на 4 мастер-класса выходного дня для сегмента «Форматные ниши».
- Внедрить автоматические SMS-напоминания за 3 часа до будничных лекций для сокращения no-show ниже 10%.`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(executiveSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Live Filter Context Card */}
      <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-[#121214] font-['Unbounded',sans-serif]">
                Отчёт сформирован для: {institution.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                {institution.city}
              </span>
            </div>
            <div className="text-xs text-[#73737a] mt-0.5 flex flex-wrap items-center gap-2">
              <span>Период отчёта: <strong className="text-[#121214]">{periodLabel}</strong></span>
              <span>•</span>
              <span>Посещаемость: <strong className="text-[#121214]">{reportVisitors.toLocaleString('ru-RU')} чел.</strong></span>
              <span>•</span>
              <span>Выручка учреждения: <strong className="text-[#ff7a45]">{(institution.serviceRevenueTotal / 1_000_000).toFixed(1)} млн ₽</strong></span>
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

      {/* Header */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                04 / 12 ОТЧЁТЫ И DATA LINEAGE
              </span>
              <span className="text-[11px] text-[#8b8b92] font-semibold">Управленческий срез и аудит</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121214] font-['Unbounded',sans-serif] tracking-tight">
              Отчёты для руководства и аудит данных
            </h2>
            <p className="text-xs sm:text-sm text-[#73737a] mt-1 max-w-2xl leading-relaxed">
              Что показать руководителю для принятия решений и как распределяются источники данных по контуру доверия.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 bg-[#fafaf7] hover:bg-[#e8e7e2] border border-[#e8e7e2] text-[#121214] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопировано!' : 'Копировать Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#121214] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать / PDF</span>
            </button>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#e8e7e2] text-xs">
          <button
            onClick={() => setReportType('executive')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              reportType === 'executive' 
                ? 'bg-[#121214] text-white shadow-xs' 
                : 'bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2] hover:text-[#121214]'
            }`}
          >
            Управленческий Summary
          </button>
          <button
            onClick={() => setReportType('benchmark')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              reportType === 'benchmark' 
                ? 'bg-[#121214] text-white shadow-xs' 
                : 'bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2] hover:text-[#121214]'
            }`}
          >
            Бенчмарк 19 учреждений
          </button>
          <button
            onClick={() => setReportType('lineage')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              reportType === 'lineage' 
                ? 'bg-[#121214] text-white shadow-xs' 
                : 'bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2] hover:text-[#121214]'
            }`}
          >
            Data Lineage & Архитектура
          </button>
        </div>
      </div>

      {/* View 1: Executive Summary */}
      {reportType === 'executive' && (
        <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8e7e2] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b92]">
                СанАрт • Автоматический срез директора
              </span>
              <h3 className="text-lg font-black text-[#121214] mt-0.5 font-['Unbounded',sans-serif]">
                Сводка состояния: {institution.name}
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-[#7fbf8a]/15 text-[#2e7d32] rounded-full border border-[#7fbf8a]/30">
              Статус: Рост по всем ключевым KPI
            </span>
          </div>

          <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] font-mono text-xs text-[#121214] whitespace-pre-line leading-relaxed">
            {executiveSummaryText}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-[#fafaf7] border border-[#7fbf8a]/40 rounded-[16px]">
              <span className="font-bold text-[#2e7d32] block mb-1.5 font-['Unbounded',sans-serif]">Главная победа периода:</span>
              <p className="text-[#121214] leading-relaxed">
                Заполняемость выставочного блока достигла <strong>92.9%</strong>, время удержания выросло на <strong>+7%</strong> за счет интерактивных мультимедиа.
              </p>
            </div>
            <div className="p-5 bg-[#fafaf7] border border-[#e8a13c]/40 rounded-[16px]">
              <span className="font-bold text-[#b45309] block mb-1.5 font-['Unbounded',sans-serif]">Зона внимания:</span>
              <p className="text-[#121214] leading-relaxed">
                No-show на бесплатных лекциях в будни составляет <strong>22%</strong>. Требуются SMS-напоминания и депозитный сбор.
              </p>
            </div>
            <div className="p-5 bg-[#fafaf7] border border-[#ff7a45]/40 rounded-[16px]">
              <span className="font-bold text-[#ff7a45] block mb-1.5 font-['Unbounded',sans-serif]">Следующий шаг:</span>
              <p className="text-[#121214] leading-relaxed">
                Запуск закрытого клуба друзей музея с приоритетным бронированием для сегмента «Активные лояльные».
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Peer Benchmark Table (19 Institutions) */}
      {reportType === 'benchmark' && (
        <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#121214] font-['Unbounded',sans-serif]">
                Бенчмарк учреждений культуры (19 организаций)
              </h3>
              <p className="text-xs text-[#73737a] mt-0.5">
                Сравнение официальных показателей объема мероприятий, выручки и статуса верификации данных.
              </p>
            </div>
            <span className="text-xs text-[#8b8b92] font-semibold">
              3 учреждения с предупреждением о расхождениях
            </span>
          </div>

          <div className="overflow-x-auto rounded-[16px] border border-[#e8e7e2]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e8e7e2] bg-[#fafaf7] text-[#73737a] font-bold uppercase text-[10px] tracking-wider font-['Unbounded',sans-serif]">
                  <th className="py-3 px-3.5">Учреждение</th>
                  <th className="py-3 px-3.5">Город / Тип</th>
                  <th className="py-3 px-3.5 text-right">События 2026</th>
                  <th className="py-3 px-3.5 text-right">Прирост</th>
                  <th className="py-3 px-3.5 text-right">Официальная выручка</th>
                  <th className="py-3 px-3.5 text-center">Контроль качества</th>
                  <th className="py-3 px-3.5 text-center">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e7e2]/60">
                {INSTITUTIONS.map((inst) => {
                  const isCurrent = inst.id === institution.id;
                  return (
                    <tr
                      key={inst.id}
                      className={`hover:bg-[#fafaf7] transition-colors ${
                        isCurrent ? 'bg-[#ff7a45]/5 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 font-bold text-[#121214] max-w-xs truncate">
                        {inst.name}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] font-bold text-[#ff7a45] bg-[#ff7a45]/15 border border-[#ff7a45]/30 px-2 py-0.5 rounded-full">
                            Текущее
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-[#73737a]">
                        {inst.city} • {inst.type}
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-[#121214] font-['Unbounded',sans-serif]">
                        {inst.events2026}
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-[#2e7d32] font-['Unbounded',sans-serif]">
                        +{inst.growthPct}%
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-[#121214] font-['Unbounded',sans-serif]">
                        {(inst.serviceRevenueTotal / 1_000_000).toFixed(1)} млн ₽
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        {inst.dataQuality === 'divergence_detected' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#b45309] bg-[#e8a13c]/15 border border-[#e8a13c]/30 px-2.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-2.5 h-2.5" /> Расхождение
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2e7d32] bg-[#7fbf8a]/15 border border-[#7fbf8a]/30 px-2.5 py-0.5 rounded-full">
                            Верифицировано
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => onSelectInstitution(inst)}
                          className="text-[11px] font-bold text-[#ff7a45] hover:underline"
                        >
                          Выбрать
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Data Lineage & Technical Architecture */}
      {reportType === 'lineage' && (
        <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                12 АРХИТЕКТУРА И DATA LINEAGE
              </span>
            </div>
            <h3 className="text-lg font-black text-[#121214] mt-0.5 font-['Unbounded',sans-serif]">
              Контур доверия к данным: разграничение источников
            </h3>
            <p className="text-xs text-[#73737a] mt-1 leading-relaxed max-w-2xl">
              Источники различаются по степени доверия и строго разделены на архитектурном уровне. Приложение защищено от галлюцинаций LLM и искусственной финансовой статистики.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Official */}
            <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
                <Database className="w-4 h-4 text-[#2563eb]" />
                <span>official (Официальные)</span>
              </div>
              <p className="text-[#73737a] leading-relaxed">
                Реальные агрегированные показатели учреждений (19 организаций). Не изменяем и не выдаём синтетику за реальные данные.
              </p>
              <div className="pt-2 border-t border-[#e8e7e2] text-[11px] text-[#8b8b92]">
                Таблица: <code className="bg-[#e8e7e2] px-1.5 py-0.5 rounded font-mono">institutions_official</code>
              </div>
            </div>

            {/* 2. Synthetic */}
            <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
                <Building2 className="w-4 h-4 text-[#2e7d32]" />
                <span>synthetic (Синтетические)</span>
              </div>
              <p className="text-[#73737a] leading-relaxed">
                Используем для прототипа поведения аудитории (5 000 профилей), мероприятий (225) и отзывов (2 699).
              </p>
              <div className="pt-2 border-t border-[#e8e7e2] text-[11px] text-[#8b8b92]">
                Таблицы: <code className="bg-[#e8e7e2] px-1.5 py-0.5 rounded font-mono">events, attendance, audience</code>
              </div>
            </div>

            {/* 3. Model */}
            <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
                <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
                <span>model (ML-модель)</span>
              </div>
              <p className="text-[#73737a] leading-relaxed">
                Результат собственной ML/статистической кластеризации K-Means и CatBoost (MAE 11.4 п.п.).
              </p>
              <div className="pt-2 border-t border-[#e8e7e2] text-[11px] text-[#8b8b92]">
                Слой: 4 продуктовых кластера
              </div>
            </div>

            {/* 4. LLM */}
            <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
                <Brain className="w-4 h-4 text-[#ff7a45]" />
                <span>llm (Интерпретация AI)</span>
              </div>
              <p className="text-[#73737a] leading-relaxed">
                Текстовое объяснение и рекомендации нейросети. LLM строго запрещено выдумывать числа — они берутся из БД.
              </p>
              <div className="pt-2 border-t border-[#e8e7e2] text-[11px] text-[#8b8b92]">
                Формат: JSON-схема по контракту
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#121214] text-white rounded-[16px] text-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-[#7fbf8a] block text-sm font-['Unbounded',sans-serif]">
                Прозрачность архитектуры СанАрт
              </span>
              <p className="text-[#a0a0a8] max-w-2xl">
                DATA (собрать и связать) → ML (найти закономерности) → AI (объяснить и предложить) → ACTION (изменить программу).
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-white/10 rounded-full text-[#e8e7e2] font-mono text-[11px] border border-white/10">
              Контур: Production 2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
