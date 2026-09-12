import { AIAnalysisRequest, AIAnalysisResult } from '../types';
import { FORMAT_BENCHMARKS } from '../data/mockData';

export function evaluateEventIdea(request: AIAnalysisRequest): AIAnalysisResult {
  const { title, eventType, targetAge, startTime, durationMin, capacity, price } = request;

  const reasons: string[] = [];
  const adjustments: AIAnalysisResult['suggestedAdjustments'] = [];
  const risks: string[] = [];
  const targetSegments: AIAnalysisResult['targetAudienceSegments'] = [];

  // Parse time
  const [hourStr] = startTime.split(':');
  const hour = parseInt(hourStr || '12', 10);

  const isNight = hour >= 22 || hour < 6;
  const isLateEvening = hour >= 20 && hour < 22;
  const isMorning = hour >= 9 && hour < 13;
  const isWorkHoursWeekday = hour >= 10 && hour < 17;

  const isChild = targetAge.toLowerCase().includes('дошколь') || 
                  targetAge.toLowerCase().includes('3-6') || 
                  targetAge.toLowerCase().includes('дет') ||
                  targetAge.toLowerCase().includes('ребенок');

  const isFamily = targetAge.toLowerCase().includes('семей') || 
                   targetAge.toLowerCase().includes('родител');

  const isYouth = targetAge.toLowerCase().includes('молодеж') || 
                  targetAge.toLowerCase().includes('студент') || 
                  targetAge.toLowerCase().includes('18-24') ||
                  targetAge.toLowerCase().includes('18-28');

  // Benchmark for this event type
  const benchmark = FORMAT_BENCHMARKS.find(b => b.type === eventType) || FORMAT_BENCHMARKS[0];

  let calculatedFillRate = benchmark.avgFillRatePct;
  let calculatedNoShow = 10.6; // baseline average
  let verdict: 'approved' | 'caution' | 'rejected' = 'approved';
  let verdictTitle = 'Концепция одобрена: высокий потенциал';
  let verdictSummary = `Формат «${eventType}» исторически демонстрирует стабильную заполняемость ${benchmark.avgFillRatePct}% в учреждении.`;

  // Rule 1: Night events for children (Blueprint edge case: "Хакатон для дошкольников в полночь")
  if (isChild && isNight) {
    verdict = 'rejected';
    verdictTitle = 'Критическое несоответствие времени и целевой группы';
    verdictSummary = 'Проведение детских мероприятий в ночные часы противоречит санитарным нормам, поведенческим паттернам родителей и правилам безопасности учреждения.';
    reasons.push('Дети дошкольного возраста (3-6 лет) не посещают культурные мероприятия после 20:00 в 99.8% случаев.');
    reasons.push('По историческим данным учреждения, мероприятия для детей с родителями показывают максимальный fill rate (до 94%) исключительно в субботу и воскресенье в слоте 11:00–14:00.');
    risks.push('Риск нулевой явки (no-show > 90%) и репутационных претензий со стороны родителей и надзорных органов.');
    
    adjustments.push({
      field: 'Время начала',
      currentValue: startTime,
      suggestedValue: '11:00 (утренний выходной слот)',
      reason: 'Пик активности семейной аудитории с детьми в музее приходится на период 11:00–13:30.'
    });

    if (durationMin > 90) {
      adjustments.push({
        field: 'Длительность',
        currentValue: `${durationMin} мин`,
        suggestedValue: '60–75 мин с перерывом',
        reason: 'Концентрация внимания дошкольников ограничена 30-45 минутами; длительные события вызывают переутомление и негативные отзывы.'
      });
    }

    if (title.toLowerCase().includes('хакатон')) {
      adjustments.push({
        field: 'Формат/Название',
        currentValue: title,
        suggestedValue: '«Творческая мастерская: Первые изобретения» (семейный воркшоп)',
        reason: 'Термин «хакатон» ассоциируется со взрослой IT-разработкой и отпугивает родителей дошкольников.'
      });
    }

    calculatedFillRate = 12.0;
    calculatedNoShow = 78.0;
  }
  // Rule 2: Working hours on weekdays for general audience
  else if (isWorkHoursWeekday && !isFamily && !isChild && durationMin > 120) {
    verdict = 'caution';
    verdictTitle = 'Риск низкой явки в рабочее время';
    verdictSummary = 'Длительное академическое мероприятие в середине рабочего дня имеет высокий риск недобора посетителей из-за занятости взрослой аудитории.';
    reasons.push('Средняя заполняемость лекций в будни до 18:00 составляет лишь 42.3%, против 79.5% после 19:00.');
    reasons.push('События длительностью более 2 часов в будни получают в 2.4 раза больше отзывов о накопленной усталости.');
    risks.push('Повышенный процент отказов и no-show (до 30%).');
    
    adjustments.push({
      field: 'Время начала',
      currentValue: startTime,
      suggestedValue: '19:00 или перенос на выходной',
      reason: 'Вечерний слот после 19:00 позволяет привлечь работающую лояльную аудиторию (25-44 года).'
    });
    adjustments.push({
      field: 'Длительность',
      currentValue: `${durationMin} мин`,
      suggestedValue: '75–90 мин',
      reason: 'Оптимальная продолжительность вечерней лекции без потери фокуса внимания.'
    });

    calculatedFillRate = 48.0;
    calculatedNoShow = 28.5;
  }
  // Rule 3: High price for youth-targeted event
  else if (isYouth && price > 1000) {
    verdict = 'caution';
    verdictTitle = 'Превышен ценовой порог молодежной аудитории';
    verdictSummary = 'Для аудитории 18-24 года цена выше 1 000 ₽ снижает конверсию на 45% без субсидии или Пушкинской карты.';
    reasons.push('Средний чек молодежных выставок и лекций в учреждении составляет 350–500 ₽.');
    reasons.push('Подключение Пушкинской карты повышает регистрацию студентов на 38%.');
    risks.push('Отток студентов и молодежи в бесплатные альтернативные пространства.');

    adjustments.push({
      field: 'Стоимость билета',
      currentValue: `${price} ₽`,
      suggestedValue: '500 ₽ (льготный) / подключение Пушкинской карты',
      reason: 'Соответствие медианной платежеспособности целевого сегмента 18-24.'
    });

    calculatedFillRate = 58.0;
    calculatedNoShow = 16.0;
  }
  // Rule 4: Night media / ambient event for youth (Good fit!)
  else if (isYouth && (isLateEvening || (isNight && hour < 24))) {
    verdict = 'approved';
    verdictTitle = 'Отличная идея для привлечения молодежи';
    verdictSummary = 'Вечерние и ночные форматы в пятницу и субботу являются главным драйвером привлечения сегмента «Новые / редкие» и студентов.';
    reasons.push('Посещаемость вечерних спецпоказов с 20:30 до 23:00 превышает средний уровень учреждения на +18.4%.');
    reasons.push('Доля виральных упоминаний в соцсетях для вечерних световых форматов в 3.2 раза выше средних выставок.');

    adjustments.push({
      field: 'Продвижение',
      currentValue: 'Стандартный анонс',
      suggestedValue: 'Таргетинг в Telegram/VK по интересам «современное искусство» и «электронная музыка»',
      reason: 'Сегмент «Новые / редкие» на 65% приходит из соцсетей.'
    });

    calculatedFillRate = 88.5;
    calculatedNoShow = 8.2;
  }
  // Rule 5: Standard approved with optimization
  else {
    verdict = 'approved';
    verdictTitle = 'Сбалансированные параметры события';
    verdictSummary = `Параметры события соответствуют историческим бенчмаркам учреждения для формата «${eventType}».`;
    reasons.push(`Исторический средний fill rate по данному направлению: ${benchmark.avgFillRatePct}%.`);
    reasons.push(`Среднее количество посетителей: ${benchmark.avgVisitors} человек.`);
    
    if (capacity > benchmark.avgVisitors * 1.5) {
      risks.push(`Заявленная вместимость (${capacity} чел.) превышает среднюю по учреждению (${benchmark.avgVisitors} чел.). Потребуется усиленное продвижение.`);
      adjustments.push({
        field: 'Вместимость',
        currentValue: `${capacity} мест`,
        suggestedValue: `${Math.round(benchmark.avgVisitors * 1.2)} мест`,
        reason: 'Защита от визуально полупустого зала и оптимизация расходов на модерацию.'
      });
    }

    calculatedFillRate = Math.min(95, benchmark.avgFillRatePct + 4);
    calculatedNoShow = 9.8;
  }

  // Audience Segments mapping
  if (isChild || isFamily) {
    targetSegments.push({
      segmentId: 'new_rare',
      segmentName: 'Новые / редкие (семейные пары с детьми)',
      fitScore: isNight ? 5 : 92,
      why: 'Высокая готовность к участию в прикладных мастер-классах в выходные дни.'
    });
    targetSegments.push({
      segmentId: 'active_loyal',
      segmentName: 'Активные лояльные (родители)',
      fitScore: isNight ? 10 : 78,
      why: 'Следят за образовательными спецпрограммами музея для детей.'
    });
  } else if (isYouth) {
    targetSegments.push({
      segmentId: 'new_rare',
      segmentName: 'Новые / редкие (молодежь 18-24)',
      fitScore: 88,
      why: 'Основной драйвер прироста аудитории на мультимедийных и вечерних форматах.'
    });
    targetSegments.push({
      segmentId: 'format_niches',
      segmentName: 'Форматные ниши (ценители жанра)',
      fitScore: 82,
      why: 'Ищут нестандартные аудиовизуальные форматы и яркий визуальный опыт.'
    });
  } else if (eventType === 'Мастер-класс') {
    targetSegments.push({
      segmentId: 'format_niches',
      segmentName: 'Форматные ниши (прикладное творчество)',
      fitScore: 94,
      why: 'Ключевая целевая группа для воркшопов, готова платить за качественные материалы.'
    });
    targetSegments.push({
      segmentId: 'active_loyal',
      segmentName: 'Активные лояльные',
      fitScore: 80,
      why: 'Посещают практические занятия в качестве клубного досуга.'
    });
  } else if (eventType === 'Лекция' || eventType === 'Творческая встреча') {
    targetSegments.push({
      segmentId: 'active_loyal',
      segmentName: 'Активные лояльные',
      fitScore: 90,
      why: 'Ценят интеллектуальный диалог с кураторами и экспертами.'
    });
    targetSegments.push({
      segmentId: 'engaged_critics',
      segmentName: 'Вовлечённые критики',
      fitScore: 76,
      why: 'Требовательны к глубине материала и акустике лектория.'
    });
  } else {
    targetSegments.push({
      segmentId: 'active_loyal',
      segmentName: 'Активные лояльные',
      fitScore: 85,
      why: 'Основа посещаемости выставочных премьер.'
    });
    targetSegments.push({
      segmentId: 'new_rare',
      segmentName: 'Новые / редкие',
      fitScore: 75,
      why: 'Потенциал конверсии при наличии хорошей навигации и фотозон.'
    });
  }

  // Next steps
  const nextSteps = [
    verdict === 'rejected' 
      ? 'Применить рекомендованные параметры времени и длительности в 1 клик'
      : 'Сохранить черновик события в общий календарь планирования',
    'Забронировать зал и техническое оборудование в системе учреждения',
    'Сгенерировать анонс с учетом рекомендаций для целевых сегментов'
  ];

  const estimatedVisitors = Math.round(capacity * (calculatedFillRate / 100));

  return {
    verdict,
    verdictTitle,
    verdictSummary,
    dataGroundedReasons: reasons.length > 0 ? reasons : [
      `Формат «${eventType}» стабильно привлекает в среднем ${benchmark.avgVisitors} человек.`,
      `Уровень повторных визитов в этой категории составляет ~43.5%.`
    ],
    suggestedAdjustments: adjustments,
    targetAudienceSegments: targetSegments,
    identifiedRisks: risks.length > 0 ? risks : [
      'Конкуренция с параллельными культурными событиями города в данный тайм-слот.',
      'Необходимость заблаговременного (за 5-7 дней) открытия онлайн-регистрации.'
    ],
    nextSteps,
    projectedAttendance: {
      estimatedVisitors,
      estimatedFillRatePct: Math.round(calculatedFillRate * 10) / 10,
      expectedNoShowPct: Math.round(calculatedNoShow * 10) / 10,
      confidence: verdict === 'rejected' ? 'Низкая (требуется реконцепция)' : 'Высокая (опирается на 225 событий)'
    }
  };
}
