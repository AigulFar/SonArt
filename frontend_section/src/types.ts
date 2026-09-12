export type InstitutionType = 'Музей' | 'Галерея' | 'Библиотека' | 'Культурный центр' | 'Театральный музей';

export type DataQualityStatus = 'verified' | 'divergence_detected';

export interface Institution {
  id: string;
  name: string;
  center: string;
  city: string;
  type: InstitutionType;
  events2025: number;
  events2026: number;
  growthPct: number;
  trainedPeopleTotal: number;
  creativeProductsTotal: number;
  publicationsTotal: number;
  serviceRevenueTotal: number; // in RUB (e.g. 42_850_000)
  revenueGrowthPct: number;
  dataQuality: DataQualityStatus;
  dataQualityNote?: string;
}

export type EventType = 'Выставка' | 'Лекция' | 'Мастер-класс' | 'Творческая встреча' | 'Концерт';

export interface CulturalEvent {
  id: string;
  institutionId: string;
  title: string;
  type: EventType;
  date: string;
  dayOfWeek: string;
  startTime: string;
  durationMin: number;
  capacity: number;
  price: number; // 0 = free
  targetAge: string;
  description: string;
  status: 'completed' | 'scheduled' | 'draft';
  // Attendance metrics
  registered: number;
  visitors: number;
  repeatVisitors: number;
  newVisitors: number;
  fillRatePct: number;
  noShowRatePct: number;
  // Quality metrics
  avgRating: number;
  reviewCount: number;
  sentimentScore: number; // -1 to 1
  // Decision metadata
  benchmarkDiffPct: number; // vs similar events
  decisionSummary?: {
    repeat: string[];
    change: string[];
    testNext: string[];
  };
}

export type ClusterSegmentId = 'active_loyal' | 'new_rare' | 'engaged_critics' | 'format_niches';

export interface AudienceSegment {
  id: ClusterSegmentId;
  name: string;
  tagline: string;
  sharePct: number;
  count: number;
  avgVisitsPerYear: number;
  avgEngagementScore: number; // 0-10
  avgRating: number;
  primaryAgeGroups: string[];
  favoriteFormats: EventType[];
  profileDescription: string;
  recommendedAction: string;
  retentionScenario: string;
  badgeColor: string;
}

export interface ReviewItem {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  authorAgeGroup: string;
  rating: number; // 1 to 5
  sentiment: 'positive' | 'neutral' | 'negative';
  text: string;
  tags: string[];
  problemCategory?: 'навигация' | 'звук/свет' | 'длительность' | 'комфорт' | 'контент';
  actionTaken?: string;
}

export interface AIAnalysisRequest {
  title: string;
  eventType: EventType;
  targetAge: string;
  date?: string;
  dayOfWeek?: string;
  startTime: string;
  durationMin: number;
  capacity: number;
  price: number;
  description?: string;
  institutionId: string;
}

export interface AIAnalysisResult {
  verdict: 'approved' | 'caution' | 'rejected';
  verdictTitle: string;
  verdictSummary: string;
  dataGroundedReasons: string[];
  suggestedAdjustments: {
    field: string;
    currentValue: string;
    suggestedValue: string;
    reason: string;
  }[];
  targetAudienceSegments: {
    segmentId: ClusterSegmentId;
    segmentName: string;
    fitScore: number; // 0-100
    why: string;
  }[];
  identifiedRisks: string[];
  nextSteps: string[];
  projectedAttendance: {
    estimatedVisitors: number;
    estimatedFillRatePct: number;
    expectedNoShowPct: number;
    confidence: string;
  };
}

export type LLMAction = 'KEEP' | 'RESCHEDULE' | 'CHANGE_FORMAT' | 'RESCHEDULE_AND_CHANGE_FORMAT';

export interface MLVenueRecommendation {
  recommendation_rank: number;
  institution: string;
  institution_id: string;
  venue_id: string;
  capacity: number;
  predicted_fill_pct: number;
  expected_visitors: number;
  expected_revenue_rub: number;
}

export interface SonArtAIChatResponse {
  query: string;
  timing_evaluation: string;
  format_evaluation: string;
  action: LLMAction;
  suggested_datetime: string | null;
  suggested_format: string | null;
  reasoning: string;
  target_audience_detected?: string;
  ml_context?: {
    model_mae_percentage_points: number;
    recommendations: MLVenueRecommendation[];
    note: string;
  };
  source: 'gemini' | 'rules_and_ml';
}

export type TimePeriodFilter = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'custom';

export interface CustomDateRange {
  start: string;
  end: string;
  label: string;
}

export function getPeriodDisplayLabel(period?: TimePeriodFilter | string, customRange?: CustomDateRange): string {
  if (period === 'custom' && customRange) return customRange.label;
  switch (period) {
    case 'today':
      return 'Сегодня (11 сен)';
    case 'yesterday':
      return 'Вчера (10 сен)';
    case 'week':
      return 'Неделя (5–11 сен)';
    case 'month':
      return 'Месяц (8 авг — 9 сен)';
    case 'quarter':
      return 'III кв. 2026 г.';
    case 'custom':
      return customRange?.label || '8 авг — 9 сен';
    default:
      return '8 авг — 9 сен 2026';
  }
}

export type UserRole = 'organizer' | 'admin' | 'viewer';
