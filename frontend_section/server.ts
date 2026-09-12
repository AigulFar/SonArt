import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { evaluateEventIdea } from './src/utils/aiEvaluator.ts';
import { evaluateSonArtPrompt, AUDIENCE_RULES_TEXT } from './src/utils/sonartAI.ts';
import { AIAnalysisRequest } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client with User-Agent telemetry
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini generator with retry and model fallback cascade
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  contents: any,
  responseMimeType: string = 'application/json'
): Promise<string | null> {
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            responseMimeType,
          },
        });

        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err: any) {
        const isTransient =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.code === 503 ||
          err?.code === 429 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt === 0) {
          // Jittered backoff wait
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }

        // If this model is unavailable/busy, break to try the next candidate model
        break;
      }
    }
  }

  return null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'СанАрт',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// AI Event Validation Endpoint (Blueprint Pages 9, 10, 11)
app.post('/api/analyze-event', async (req, res) => {
  const eventInput = req.body as AIAnalysisRequest;

  // Baseline data-grounded evaluation calculated from database facts
  const baselineResult = evaluateEventIdea(eventInput);

  const ai = getGenAI();

  if (!ai) {
    // Return factual rule-based result instantly if no API key is configured
    return res.json({
      ...baselineResult,
      source: 'data_rules_engine',
      note: 'Анализ сформирован встроенной аналитической моделью СанАрт на основе 225 исторических событий учреждения.',
    });
  }

  try {
    const prompt = `Ты — AI-ассистент аналитической платформы культурных учреждений «СанАрт».
Тебе поступила идея нового мероприятия для проверки:
- Название: "${eventInput.title}"
- Формат: "${eventInput.eventType}"
- Целевая аудитория: "${eventInput.targetAge}"
- Время начала: "${eventInput.startTime}"
- Длительность: ${eventInput.durationMin} минут
- Вместимость: ${eventInput.capacity} человек
- Стоимость билета: ${eventInput.price} руб.
- Описание: "${eventInput.description || 'Не указано'}"

Данные и правила учреждения:
1. Базовый бенчмарк для формата: средняя заполняемость ${baselineResult.projectedAttendance.estimatedFillRatePct}%, средний no-show ${baselineResult.projectedAttendance.expectedNoShowPct}%.
2. Предыдущий расчет аналитического слоя СанАрт:
   Вердикт: "${baselineResult.verdict}" ("${baselineResult.verdictTitle}")
   Обоснование: "${baselineResult.verdictSummary}"
   Ключевые факты: ${JSON.stringify(baselineResult.dataGroundedReasons)}
   Рекомендации по корректировке: ${JSON.stringify(baselineResult.suggestedAdjustments)}

Твоя задача — строго следовать принципу «Не нейрослоуп»:
Числа и расчетные показатели ты НЕ придумываешь (используй предоставленные).
Сформулируй ясный управленческий ответ для организатора строго в формате JSON со следующими полями:
{
  "verdict": "${baselineResult.verdict}", // "approved" | "caution" | "rejected"
  "verdictTitle": "Краткий емкий заголовок решения",
  "verdictSummary": "Развернутое объяснение (2-3 предложения)",
  "dataGroundedReasons": ["факт 1 с опорой на данные учреждения", "факт 2"],
  "suggestedAdjustments": [
    {
      "field": "Поле",
      "currentValue": "текущее",
      "suggestedValue": "предлагаемое",
      "reason": "почему именно так"
    }
  ],
  "targetAudienceSegments": [
    {
      "segmentId": "active_loyal",
      "segmentName": "Активные лояльные",
      "fitScore": 85,
      "why": "почему подходит этому сегменту"
    }
  ],
  "identifiedRisks": ["риск 1", "риск 2"],
  "nextSteps": ["шаг 1", "шаг 2"],
  "projectedAttendance": {
    "estimatedVisitors": ${baselineResult.projectedAttendance.estimatedVisitors},
    "estimatedFillRatePct": ${baselineResult.projectedAttendance.estimatedFillRatePct},
    "expectedNoShowPct": ${baselineResult.projectedAttendance.expectedNoShowPct},
    "confidence": "${baselineResult.projectedAttendance.confidence}"
  }
}`;

    const responseText = await generateGeminiContentWithFallback(ai, prompt, 'application/json');
    if (responseText) {
      try {
        const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json({
          ...parsed,
          source: 'gemini_llm_hybrid',
        });
      } catch {
        // parsing failed, safely fallback
      }
    }

    return res.json({ ...baselineResult, source: 'data_rules_engine' });
  } catch {
    return res.json({
      ...baselineResult,
      source: 'data_rules_engine',
    });
  }
});

// Free-form AI Chat & Prompt Endpoint (from AigulFar/SonArt AI_section/ai_rec.py & ai_pipeline.py)
app.post('/api/ai-chat', async (req, res) => {
  const { query } = req.body as { query: string };
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Параметр query обязателен.' });
  }

  const baseline = evaluateSonArtPrompt(query);
  const ai = getGenAI();

  if (!ai) {
    return res.json(baseline);
  }

  try {
    const systemPrompt = `Ты строгий аналитик форматов мероприятий культурных учреждений «СанАрт». Твоя задача — проверить адекватность заявленного мероприятия (время, тема, формат) для указанной целевой аудитории, строго опираясь на переданные инструкции.
Выведи ответ СТРОГО в формате валидного JSON (без блоков \`\`\`json).
Ожидаемая структура ответа:
{
  "timing_evaluation": "Оценка адекватности времени суток и дня недели для заявленной аудитории.",
  "format_evaluation": "Оценка соответствия сложности темы и формата уровню аудитории.",
  "action": "${baseline.action}", // KEEP | RESCHEDULE | CHANGE_FORMAT | RESCHEDULE_AND_CHANGE_FORMAT
  "suggested_datetime": ${baseline.suggested_datetime ? `"${baseline.suggested_datetime}"` : 'null'},
  "suggested_format": ${baseline.suggested_format ? `"${baseline.suggested_format}"` : 'null'},
  "reasoning": "Жесткое обоснование вынесенного вердикта с опорой на правила аудитории."
}`;

    const userPrompt = `ЦЕЛЕВОЕ МЕРОПРИЯТИЕ:
Свободное описание от пользователя: "${query.trim()}"

ИНСТРУКЦИИ (ПРАВИЛА ПО АУДИТОРИИ):
${AUDIENCE_RULES_TEXT}`;

    const contents = [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
    ];

    const text = await generateGeminiContentWithFallback(ai, contents, 'application/json');
    if (text) {
      try {
        const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json({
          query,
          timing_evaluation: parsed.timing_evaluation || baseline.timing_evaluation,
          format_evaluation: parsed.format_evaluation || baseline.format_evaluation,
          action: parsed.action || baseline.action,
          suggested_datetime: parsed.suggested_datetime || baseline.suggested_datetime,
          suggested_format: parsed.suggested_format || baseline.suggested_format,
          reasoning: parsed.reasoning || baseline.reasoning,
          target_audience_detected: baseline.target_audience_detected,
          ml_context: baseline.ml_context,
          source: 'gemini',
        });
      } catch {
        // parsing fallback
      }
    }

    return res.json(baseline);
  } catch {
    return res.json(baseline);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`СанАрт server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
