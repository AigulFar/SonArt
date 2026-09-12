import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Clock, 
  Users, 
  ShieldAlert, 
  Calendar,
  Layers,
  Sliders,
  BookmarkPlus
} from 'lucide-react';
import { EventType, AIAnalysisRequest, AIAnalysisResult, AudienceSegment } from '../types';
import { PRESET_AI_IDEAS } from '../data/mockData';
import { evaluateEventIdea } from '../utils/aiEvaluator';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: (event: any) => void;
  initialSegment?: AudienceSegment | null;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSaveDraft,
  initialSegment,
}) => {
  const [formData, setFormData] = useState<AIAnalysisRequest>({
    title: initialSegment 
      ? `Спецпрограмма для сегмента «${initialSegment.name}»`
      : 'Ночная экскурсия по цифровым инсталляциям',
    eventType: (initialSegment?.favoriteFormats[0] || 'Выставка') as EventType,
    targetAge: initialSegment ? initialSegment.primaryAgeGroups.join(', ') : '18-28',
    startTime: '21:30',
    durationMin: 90,
    capacity: 60,
    price: 500,
    description: 'Интерактивная вечерняя экскурсия при приглушенном свете с персональными аудиогидами.',
    institutionId: 'inst-1',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setHasSavedDraft(false);

    try {
      // Call server backend (Express + Gemini)
      const res = await fetch('/api/analyze-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      } else {
        // Fallback to client-side evaluator
        const fallback = evaluateEventIdea(formData);
        setAnalysisResult(fallback);
      }
    } catch {
      const fallback = evaluateEventIdea(formData);
      setAnalysisResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAdjustments = () => {
    if (!analysisResult) return;

    let updated = { ...formData };
    analysisResult.suggestedAdjustments.forEach((adj) => {
      if (adj.field.includes('Время')) {
        updated.startTime = '11:00';
      }
      if (adj.field.includes('Длительность')) {
        updated.durationMin = 75;
      }
      if (adj.field.includes('Стоимость')) {
        updated.price = 500;
      }
      if (adj.field.includes('Вместимость')) {
        updated.capacity = 30;
      }
      if (adj.field.includes('Формат') || adj.field.includes('Название')) {
        updated.title = 'Семейная творческая мастерская: Первые изобретения';
        updated.eventType = 'Мастер-класс';
        updated.targetAge = '5-10 лет с родителями';
      }
    });

    setFormData(updated);
    // Re-evaluate automatically to show improved result!
    const newEval = evaluateEventIdea(updated);
    setAnalysisResult(newEval);
  };

  const handleApplyPreset = (preset: typeof PRESET_AI_IDEAS[0]) => {
    setFormData({
      title: preset.title,
      eventType: preset.eventType,
      targetAge: preset.targetAge,
      startTime: preset.startTime,
      durationMin: preset.durationMin,
      capacity: preset.capacity,
      price: preset.price,
      description: preset.description,
      institutionId: 'inst-1',
    });
    setAnalysisResult(null);
    setHasSavedDraft(false);
  };

  const handleSaveToDrafts = () => {
    const newEvent = {
      id: `ev-${Date.now()}`,
      institutionId: formData.institutionId,
      title: formData.title,
      type: formData.eventType,
      date: '2026-09-18',
      dayOfWeek: 'Пятница',
      startTime: formData.startTime,
      durationMin: formData.durationMin,
      capacity: formData.capacity,
      price: formData.price,
      targetAge: formData.targetAge,
      description: formData.description || '',
      status: 'draft',
      registered: 0,
      visitors: 0,
      repeatVisitors: 0,
      newVisitors: 0,
      fillRatePct: analysisResult?.projectedAttendance.estimatedFillRatePct || 80,
      noShowRatePct: analysisResult?.projectedAttendance.expectedNoShowPct || 10,
      avgRating: 0,
      reviewCount: 0,
      sentimentScore: 0,
      benchmarkDiffPct: 5,
    };
    onSaveDraft(newEvent);
    setHasSavedDraft(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#f97316] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              ■ 11 Сценарий AI: проверка идеи мероприятия
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1 font-['Unbounded',sans-serif]">
              Конструктор события + AI-валидация
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Сопоставляет гипотезу организатора с 225 событиями учреждения, правилами аудитории и историей заполняемости.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-800 text-2xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Presets Bar (including the blueprint example: "Хакатон для дошкольников в полночь") */}
        <div className="my-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
            Быстрые тестовые кейсы из Blueprint:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_AI_IDEAS.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 text-left transition-colors flex items-center gap-1.5"
              >
                <span>{p.title}</span>
                {p.title.includes('полночь') && (
                  <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1 rounded">Кейс ТЗ</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Working Interface: Form & AI Structured Response */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left Column: Form Inputs */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Название / Основная идея события
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                placeholder="Например: Ночная экскурсия по авангарду"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Формат</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316] bg-white"
                >
                  <option value="Выставка">Выставка</option>
                  <option value="Лекция">Лекция</option>
                  <option value="Мастер-класс">Мастер-класс</option>
                  <option value="Творческая встреча">Творческая встреча</option>
                  <option value="Концерт">Концерт</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Целевая аудитория</label>
                <input
                  type="text"
                  value={formData.targetAge}
                  onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                  placeholder="18-28, дошкольники, семьи..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Время начала</label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                  placeholder="21:30"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Длительность (мин)</label>
                <input
                  type="number"
                  value={formData.durationMin}
                  onChange={(e) => setFormData({ ...formData, durationMin: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Вместимость</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Цена билета (₽)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                  placeholder="0 = бесплатно"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Тайм-слот</label>
                <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600 text-[11px] font-medium">
                  {parseInt(formData.startTime.split(':')[0] || '12') >= 22 ? '🌙 Ночной слот' : '☀️ Дневной/вечерний'}
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Краткое описание / замысел
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#f97316] text-xs resize-none"
                placeholder="Опишите концепцию события..."
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-[#f97316] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Сопоставление с данными учреждения...' : 'Запустить AI-анализ идеи'}</span>
            </button>
          </div>

          {/* Right Column: AI Structured Response Output (Blueprint Page 10) */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col justify-between max-h-[550px] overflow-y-auto">
            {analysisResult ? (
              <div className="space-y-4 text-xs">
                {/* Verdict Card */}
                <div className={`p-4 rounded-xl border ${
                  analysisResult.verdict === 'approved'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : analysisResult.verdict === 'caution'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-red-50 border-red-300 text-red-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                    {analysisResult.verdict === 'approved' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : analysisResult.verdict === 'caution' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>Вердикт: {analysisResult.verdictTitle}</span>
                  </div>
                  <p className="mt-1.5 leading-relaxed font-medium">
                    {analysisResult.verdictSummary}
                  </p>
                </div>

                {/* Projected Attendance Numbers calculated from dataset */}
                <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-neutral-200 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Ожидаемые визиты</span>
                    <span className="text-base font-bold text-neutral-900 font-['Unbounded',sans-serif]">
                      {analysisResult.projectedAttendance.estimatedVisitors}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Fill Rate</span>
                    <span className="text-base font-bold text-[#f97316] font-['Unbounded',sans-serif]">
                      {analysisResult.projectedAttendance.estimatedFillRatePct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Риск No-show</span>
                    <span className="text-base font-bold text-neutral-700 font-['Unbounded',sans-serif]">
                      {analysisResult.projectedAttendance.expectedNoShowPct}%
                    </span>
                  </div>
                </div>

                {/* Data-Grounded Reasons (Facts from institution data) */}
                <div>
                  <span className="font-bold text-neutral-700 block mb-1 uppercase text-[10px]">
                    Фактическое обоснование (опора на данные):
                  </span>
                  <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                    {analysisResult.dataGroundedReasons.map((r, i) => (
                      <li key={i} className="leading-tight">{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Adjustments (What to change) */}
                {analysisResult.suggestedAdjustments.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 uppercase text-[10px]">
                        Что скорректировать:
                      </span>
                      <button
                        onClick={handleApplyAdjustments}
                        className="text-[11px] font-bold text-[#f97316] hover:underline flex items-center gap-1"
                      >
                        <span>Применить правки в 1 клик</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    {analysisResult.suggestedAdjustments.map((adj, i) => (
                      <div key={i} className="text-[11px] border-t border-neutral-100 pt-1.5">
                        <span className="font-semibold text-neutral-800">{adj.field}: </span>
                        <span className="line-through text-neutral-400">{adj.currentValue}</span>
                        <span className="font-bold text-emerald-700 ml-1.5">→ {adj.suggestedValue}</span>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{adj.reason}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Target Audience Segments */}
                <div>
                  <span className="font-bold text-neutral-700 block mb-1 uppercase text-[10px]">
                    Целевые сегменты аудитории:
                  </span>
                  <div className="space-y-1.5">
                    {analysisResult.targetAudienceSegments.map((seg, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200">
                        <div>
                          <span className="font-bold text-neutral-900">{seg.segmentName}</span>
                          <p className="text-[10px] text-neutral-500">{seg.why}</p>
                        </div>
                        <span className="font-bold text-[#f97316] text-xs shrink-0 ml-2">{seg.fitScore}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identified Risks */}
                {analysisResult.identifiedRisks.length > 0 && (
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                    <span className="font-bold block mb-0.5">Выявленные риски:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {analysisResult.identifiedRisks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-3">
                <Sparkles className="w-8 h-8 text-neutral-300" />
                <div>
                  <h4 className="font-bold text-neutral-700 text-sm">
                    Готово к оценке гипотезы
                  </h4>
                  <p className="text-xs mt-1 text-neutral-500 max-w-xs">
                    Заполните параметры слева или выберите готовый кейс из верхнего списка и нажмите «Запустить AI-анализ идеи».
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
              <span className="text-[10px] text-neutral-400">
                Замкнутый цикл: гипотеза → AI → план
              </span>
              <button
                disabled={!analysisResult || hasSavedDraft}
                onClick={handleSaveToDrafts}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {hasSavedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Сохранено в черновики!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Сохранить черновик в программу</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
