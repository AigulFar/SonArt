import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Users, 
  Building2, 
  ArrowRight, 
  RotateCcw,
  Layers,
  HelpCircle,
  TrendingUp,
  Flame,
  Lightbulb,
  CalendarRange
} from 'lucide-react';
import { SonArtAIChatResponse, LLMAction, MLVenueRecommendation, Institution, TimePeriodFilter, CustomDateRange, getPeriodDisplayLabel } from '../types';
import { evaluateSonArtPrompt, AUDIENCE_RULES_TEXT } from '../utils/sonartAI';

interface AIChatViewProps {
  institution?: Institution;
  periodFilter?: TimePeriodFilter;
  customDateRange?: CustomDateRange;
  onApplyToCreateEvent?: (eventDraft: any) => void;
}

const PRESET_QUERIES = [
  {
    title: 'Мероприятие для детей про СУБД (из ai_rec.py)',
    query: 'хочу провести в субботу мероприятие для детей про субд',
    tag: 'ai_rec.py',
  },
  {
    title: 'Диффузионные модели для школьников (из ai_rec.py)',
    query: 'Математика диффузионных моделей и SDE, время 10:00, для школьников 5-7 классов, трехчасовая лекция',
    tag: 'ai_rec.py',
  },
  {
    title: 'Хакатон для дошкольников в полночь (ТЗ Blueprint)',
    query: 'Хочу сделать хакатон для дошкольников в полночь',
    tag: 'Кейс ТЗ',
  },
  {
    title: 'Воркшоп для студентов в пятницу вечер',
    query: 'Воркшоп по генеративному арту и саунд-дизайну для студентов в пятницу в 18:30',
    tag: 'Оптимальный',
  },
  {
    title: 'Круглый стол экспертов арт-рынка',
    query: 'Закрытый круглый стол и нетворкинг для арт-кураторов и галеристов в четверг в 19:00',
    tag: 'Профессионалы',
  },
];

export const AIChatView: React.FC<AIChatViewProps> = ({ 
  institution,
  periodFilter = 'month',
  customDateRange,
  onApplyToCreateEvent 
}) => {
  const periodLabel = getPeriodDisplayLabel(periodFilter, customDateRange);

  const [initialPrefill] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('sanart_prefill_prompt') : null;
  });

  const [inputQuery, setInputQuery] = useState(() => {
    if (initialPrefill) {
      sessionStorage.removeItem('sanart_prefill_prompt');
      return initialPrefill;
    }
    return 'хочу провести в субботу мероприятие для детей про субд';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SonArtAIChatResponse | null>(() => {
    const q = initialPrefill || 'хочу провести в субботу мероприятие для детей про субд';
    return evaluateSonArtPrompt(q);
  });
  const [history, setHistory] = useState<SonArtAIChatResponse[]>(() => {
    const q = initialPrefill || 'хочу провести в субботу мероприятие для детей про субд';
    return [evaluateSonArtPrompt(q)];
  });

  React.useEffect(() => {
    if (initialPrefill) {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputQuery }),
      });

      if (res.ok) {
        const data: SonArtAIChatResponse = await res.json();
        setResult(data);
        setHistory((prev) => [data, ...prev.slice(0, 4)]);
      } else {
        const fallback = evaluateSonArtPrompt(inputQuery);
        setResult(fallback);
        setHistory((prev) => [fallback, ...prev.slice(0, 4)]);
      }
    } catch {
      const fallback = evaluateSonArtPrompt(inputQuery);
      setResult(fallback);
      setHistory((prev) => [fallback, ...prev.slice(0, 4)]);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionBadge = (action: LLMAction) => {
    switch (action) {
      case 'KEEP':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#7fbf8a]/15 text-[#2e7d32] border border-[#7fbf8a]/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
            KEEP (Утверждено)
          </span>
        );
      case 'RESCHEDULE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30">
            <AlertTriangle className="w-3.5 h-3.5 text-[#b45309]" />
            RESCHEDULE (Требуется перенос времени)
          </span>
        );
      case 'CHANGE_FORMAT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#ff7a45]/15 text-[#ff7a45] border border-[#ff7a45]/30">
            <RotateCcw className="w-3.5 h-3.5 text-[#ff7a45]" />
            CHANGE_FORMAT (Требуется смена формата)
          </span>
        );
      case 'RESCHEDULE_AND_CHANGE_FORMAT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#c62828]/15 text-[#c62828] border border-[#c62828]/30">
            <XCircle className="w-3.5 h-3.5 text-[#c62828]" />
            RESCHEDULE_AND_CHANGE_FORMAT (Критическое несоответствие)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Filter Context Card */}
      {institution && (
        <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#121214] font-['Unbounded',sans-serif]">
                  Фокус AI-консультанта: {institution.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                  {institution.city}
                </span>
              </div>
              <div className="text-xs text-[#73737a] mt-0.5 flex flex-wrap items-center gap-2">
                <span>План 2026: <strong className="text-[#121214]">{institution.events2026} событий</strong></span>
                <span>•</span>
                <span>Период анализа: <strong className="text-[#ff7a45]">{periodLabel}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const prompt = `Как оптимизировать посещаемость и расписание для ${institution.name} в ${institution.city}?`;
                setInputQuery(prompt);
                setIsLoading(true);
                setTimeout(() => {
                  setResult(evaluateSonArtPrompt(prompt));
                  setIsLoading(false);
                }, 400);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20 hover:bg-[#ff7a45] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Спросить AI про {institution.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                08 НЕЙРОСЕТЬ (AI) & CATBOOST
              </span>
              <span className="text-[11px] text-[#8b8b92] font-semibold">Валидация гипотез и ML-подбор</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121214] font-['Unbounded',sans-serif] tracking-tight">
              Текстовое обращение к нейросети и CatBoost ML
            </h2>
            <p className="text-xs sm:text-sm text-[#73737a] mt-1 max-w-3xl leading-relaxed">
              Интеграция алгоритмов <code className="bg-[#fafaf7] px-1.5 py-0.5 rounded text-[#121214] font-mono border border-[#e8e7e2]">ai_rec.py</code> (проверка правил аудитории) и <code className="bg-[#fafaf7] px-1.5 py-0.5 rounded text-[#121214] font-mono border border-[#e8e7e2]">ai_pipeline.py</code> (ML-подбор 57 площадок 19 официальных учреждений с прогнозом посещаемости).
            </p>
          </div>

          <div className="bg-[#fafaf7] p-4 rounded-[16px] border border-[#e8e7e2] text-xs text-[#73737a] max-w-xs">
            <span className="font-bold text-[#ff7a45] block mb-0.5">Принцип СанАрт:</span>
            Числа рассчитывает CatBoost ML (MAE 11.4 п.п.), а нейросеть объясняет правила аудитории и формирует управленческий вердикт.
          </div>
        </div>
      </div>

      {/* Interactive Input Form */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-xs font-bold text-[#121214] block font-['Unbounded',sans-serif]">
            Опишите идею мероприятия свободной фразой:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Например: хочу провести в субботу мероприятие для детей про субд..."
              className="w-full p-4 pr-32 bg-[#fafaf7] border border-[#e8e7e2] rounded-[16px] text-sm text-[#121214] focus:outline-none focus:border-[#ff7a45] focus:bg-white transition-all resize-none font-medium placeholder:text-[#9e9ea6]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="absolute right-3.5 bottom-4 px-5 py-2 bg-[#121214] hover:bg-[#ff7a45] text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-40 shadow-xs"
            >
              <Send className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Анализ...' : 'Спросить AI'}</span>
            </button>
          </div>
        </form>

        {/* Presets Chips */}
        <div>
          <span className="text-[11px] font-bold text-[#8b8b92] uppercase tracking-wider block mb-2.5">
            Готовые тестовые запросы:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => {
                  setInputQuery(preset.query);
                }}
                className="px-3.5 py-1.5 bg-[#fafaf7] hover:bg-white hover:border-[#ff7a45]/40 border border-[#e8e7e2] rounded-full text-xs font-medium text-[#121214] transition-all flex items-center gap-2 text-left"
              >
                <span>{preset.title}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#121214]/5 text-[#73737a]">
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-6 animate-in fade-in zoom-in-95">
          {/* Top Verdict Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e8e7e2]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8b92] block">
                Вердикт модели аудитории (llm_output_schema.json)
              </span>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                {getActionBadge(result.action)}
                <span className="text-xs text-[#73737a] font-medium">
                  Определенная группа: <strong className="text-[#121214]">{result.target_audience_detected}</strong>
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-[#73737a] bg-[#fafaf7] border border-[#e8e7e2] px-3 py-1 rounded-full">
              Источник: {result.source === 'gemini' ? 'Gemini 3.8 + ML' : 'Встроенный движок правил + ML'}
            </span>
          </div>

          {/* 2-Column Evaluations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Timing */}
            <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
                <Clock className="w-4 h-4 text-[#ff7a45]" />
                <span>Оценка времени (timing_evaluation)</span>
              </div>
              <p className="text-[#73737a] leading-relaxed">
                {result.timing_evaluation}
              </p>
              {result.suggested_datetime && (
                <div className="pt-2.5 border-t border-[#e8e7e2] font-semibold text-[#2e7d32]">
                  → Предлагаемое время: <strong>{result.suggested_datetime}</strong>
                </div>
              )}
            </div>

            {/* Format */}
            <div className="p-5 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
                <Layers className="w-4 h-4 text-[#6c9bf5]" />
                <span>Оценка формата (format_evaluation)</span>
              </div>
              <p className="text-[#73737a] leading-relaxed">
                {result.format_evaluation}
              </p>
              {result.suggested_format && (
                <div className="pt-2.5 border-t border-[#e8e7e2] font-semibold text-[#ff7a45]">
                  → Предлагаемый формат: <strong>{result.suggested_format}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Strict Reasoning */}
          <div className="p-5 bg-[#121214] text-white rounded-[16px] text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#ff7a45] uppercase tracking-wider text-[10px] font-['Unbounded',sans-serif]">
              <Lightbulb className="w-3.5 h-3.5 text-[#ff7a45]" />
              Обоснование вердикта (reasoning)
            </div>
            <p className="text-[#e8e7e2] leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* CatBoost ML Venue Recommendations Table */}
          {result.ml_context && result.ml_context.recommendations.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#121214] font-['Unbounded',sans-serif]">
                    Подбор организаций и площадок (CatBoost ML)
                  </h4>
                  <p className="text-xs text-[#73737a] mt-0.5">
                    Ранжирование по прогнозной посещаемости и вместимости залов (MAE: {result.ml_context.model_mae_percentage_points} п.п.)
                  </p>
                </div>
                <span className="text-[11px] text-[#73737a] bg-[#fafaf7] border border-[#e8e7e2] px-3 py-1 rounded-full">
                  Топ-{result.ml_context.recommendations.length} из 57 площадок
                </span>
              </div>

              <div className="overflow-x-auto rounded-[16px] border border-[#e8e7e2]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e8e7e2] bg-[#fafaf7] text-[#73737a] font-bold uppercase text-[10px] font-['Unbounded',sans-serif]">
                      <th className="py-3 px-3.5">Ранг</th>
                      <th className="py-3 px-3.5">Учреждение</th>
                      <th className="py-3 px-3.5">Площадка</th>
                      <th className="py-3 px-3.5 text-right">Вместимость</th>
                      <th className="py-3 px-3.5 text-right">Прогноз Fill %</th>
                      <th className="py-3 px-3.5 text-right">Ожидаемо гостей</th>
                      <th className="py-3 px-3.5 text-right">Ожидаемая выручка</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e7e2]/60">
                    {result.ml_context.recommendations.map((rec) => (
                      <tr key={rec.venue_id} className="hover:bg-[#fafaf7] transition-colors">
                        <td className="py-3 px-3.5 font-bold text-[#ff7a45]">
                          #{rec.recommendation_rank}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#121214]">
                          {rec.institution}
                        </td>
                        <td className="py-3 px-3.5 text-[#73737a] font-mono text-[11px]">
                          {rec.venue_id}
                        </td>
                        <td className="py-3 px-3.5 text-right text-[#73737a]">
                          {rec.capacity} мест
                        </td>
                        <td className="py-3 px-3.5 text-right font-black text-[#121214] font-['Unbounded',sans-serif]">
                          {rec.predicted_fill_pct}%
                        </td>
                        <td className="py-3 px-3.5 text-right font-black text-[#2e7d32] font-['Unbounded',sans-serif]">
                          {rec.expected_visitors} чел.
                        </td>
                        <td className="py-3 px-3.5 text-right font-black text-[#121214] font-['Unbounded',sans-serif]">
                          {rec.expected_revenue_rub.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer action */}
          <div className="pt-4 border-t border-[#e8e7e2] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#8b8b92]">
              Запрос: «{result.query}»
            </span>
            <button
              onClick={() => {
                if (onApplyToCreateEvent) {
                  onApplyToCreateEvent({
                    title: result.query,
                    suggestedDatetime: result.suggested_datetime,
                    suggestedFormat: result.suggested_format,
                  });
                }
              }}
              className="px-5 py-2.5 bg-[#ff7a45] hover:bg-[#f06833] text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Создать событие на основе рекомендаций</span>
            </button>
          </div>
        </div>
      )}

      {/* Rules Information Reference Box */}
      <div className="bg-[#fafaf7] p-6 rounded-[20px] border border-[#e8e7e2] text-xs text-[#73737a] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#121214] font-['Unbounded',sans-serif]">
          <HelpCircle className="w-4 h-4 text-[#ff7a45]" />
          <span>Нормативные правила аудитории (audience_rules.txt)</span>
        </div>
        <div className="whitespace-pre-line font-mono text-[11px] text-[#121214] leading-relaxed bg-white p-4 rounded-[16px] border border-[#e8e7e2]">
          {AUDIENCE_RULES_TEXT}
        </div>
      </div>
    </div>
  );
};
