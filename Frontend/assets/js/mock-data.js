/**
 * СанАрт — мок-данные дашборда.
 * Структура повторяет реальные таблицы проекта (institutions_official,
 * events_synthetic, attendance_synthetic, audience_synthetic, feedback_synthetic),
 * чтобы замену на реальный API можно было сделать без переписывания вёрстки —
 * компоненты читают только из объекта SANART_DATA ниже.
 */

const SANART_DATA = {
  organization: {
    name: "Музей современного искусства",
    period: "8 августа – 9 сентября",
    user: "user_login@mail.ru",
  },

  // TOR §07/§08 — 3 из 19 учреждений имеют расхождения в data_quality.
  // Это должно быть видно в UI, а не скрыто.
  dataQuality: {
    institutionsTotal: 19,
    institutionsFlagged: 3,
    message: "Качество данных: у 3 из 19 учреждений есть расхождения в отчётности — показатели по ним помечены отдельно.",
  },

  // KPI по выбранному периоду. Ключи = id таба периода.
  kpiByPeriod: {
    today: {
      visitors: { value: 1284, deltaPct: 12, deltaDir: "up", caption: "чем вчера" },
      newVisitors: { value: 892, deltaPct: 18, deltaDir: "up", caption: "доля 69%" },
      eventsHeld: { value: 6, deltaPct: 50, deltaDir: "up", caption: "чем на прошлой неделе" },
      avgDwellTime: { value: "1 ч 24 мин", deltaPct: 7, deltaDir: "up", caption: "чем в прошлом месяце" },
    },
    yesterday: {
      visitors: { value: 1147, deltaPct: 4, deltaDir: "up", caption: "чем позавчера" },
      newVisitors: { value: 760, deltaPct: 9, deltaDir: "up", caption: "доля 66%" },
      eventsHeld: { value: 4, deltaPct: 20, deltaDir: "down", caption: "чем на прошлой неделе" },
      avgDwellTime: { value: "1 ч 18 мин", deltaPct: 2, deltaDir: "up", caption: "чем в прошлом месяце" },
    },
    week: {
      visitors: { value: 8214, deltaPct: 9, deltaDir: "up", caption: "чем на прошлой неделе" },
      newVisitors: { value: 5340, deltaPct: 14, deltaDir: "up", caption: "доля 65%" },
      eventsHeld: { value: 21, deltaPct: 31, deltaDir: "up", caption: "чем на прошлой неделе" },
      avgDwellTime: { value: "1 ч 22 мин", deltaPct: 5, deltaDir: "up", caption: "чем в прошлом месяце" },
    },
    month: {
      visitors: { value: 32480, deltaPct: 11, deltaDir: "up", caption: "чем в прошлом месяце" },
      newVisitors: { value: 19870, deltaPct: 16, deltaDir: "up", caption: "доля 61%" },
      eventsHeld: { value: 78, deltaPct: 24, deltaDir: "up", caption: "чем в прошлом месяце" },
      avgDwellTime: { value: "1 ч 19 мин", deltaPct: 3, deltaDir: "up", caption: "чем в прошлом квартале" },
    },
    quarter: {
      visitors: { value: 96120, deltaPct: 8, deltaDir: "up", caption: "чем в прошлом квартале" },
      newVisitors: { value: 54290, deltaPct: 12, deltaDir: "up", caption: "доля 57%" },
      eventsHeld: { value: 225, deltaPct: 19, deltaDir: "up", caption: "чем в прошлом квартале" },
      avgDwellTime: { value: "1 ч 15 мин", deltaPct: 1, deltaDir: "down", caption: "чем в прошлом году" },
    },
  },

  // attendance_synthetic — посещаемость по дням (area chart)
  attendanceSeries: [
    { date: "8 авг", value: 640 },
    { date: "9 авг", value: 820 },
    { date: "10 авг", value: 710 },
    { date: "11 авг", value: 900 },
    { date: "12 авг", value: 1040 },
    { date: "13 авг", value: 960 },
    { date: "14 авг", value: 880 },
    { date: "15 авг", value: 760 },
    { date: "16 авг", value: 1010 },
    { date: "17 авг", value: 1180 },
    { date: "18 авг", value: 1090 },
    { date: "19 авг", value: 1220 },
    { date: "20 авг", value: 1340 },
    { date: "21 авг", value: 1260 },
    { date: "22 авг", value: 1400 },
    { date: "23 авг", value: 1520 },
    { date: "24 авг", value: 1672 },
    { date: "25 авг", value: 1380 },
    { date: "26 авг", value: 1190 },
    { date: "27 авг", value: 980 },
    { date: "28 авг", value: 860 },
    { date: "29 авг", value: 1050 },
    { date: "30 авг", value: 1240 },
    { date: "31 авг", value: 1360 },
    { date: "1 сен", value: 1180 },
    { date: "2 сен", value: 1020 },
    { date: "3 сен", value: 1160 },
    { date: "4 сен", value: 1300 },
    { date: "5 сен", value: 1420 },
    { date: "6 сен", value: 1260 },
    { date: "7 сен", value: 1080 },
    { date: "8 сен", value: 1220 },
    { date: "9 сен", value: 1340 },
  ],

  // Источники посещений — donut
  visitSources: [
    { label: "Офлайн", value: 42, color: "var(--color-accent-orange)" },
    { label: "Сайт музея", value: 24, color: "var(--color-accent-purple)" },
    { label: "Соц. сети", value: 18, color: "var(--color-accent-blue)" },
    { label: "Партнёры", value: 8, color: "var(--color-accent-green)" },
    { label: "Другое", value: 8, color: "var(--color-accent-gray)" },
  ],

  // Популярные экспозиции — рейтинг с прогресс-барами
  popularExhibitions: [
    { label: "Время и пространство", value: 412, color: "var(--color-accent-orange)" },
    { label: "Городские метаморфозы", value: 356, color: "var(--color-accent-purple)" },
    { label: "Человек и природа", value: 298, color: "var(--color-accent-green)" },
    { label: "Цифровые сны", value: 241, color: "var(--color-accent-blue)" },
    { label: "Искусство завтра", value: 198, color: "var(--color-accent-gray)" },
  ],

  // audience_synthetic — распределение по возрасту
  ageGroups: [
    { label: "до 18", pct: 12, color: "var(--color-accent-blue-soft)" },
    { label: "18–24", pct: 28, color: "var(--color-accent-orange)" },
    { label: "25–34", pct: 32, color: "var(--color-accent-purple)" },
    { label: "35–44", pct: 18, color: "var(--color-accent-green)" },
    { label: "45–54", pct: 8, color: "var(--color-accent-gray)" },
    { label: "55+", pct: 2, color: "var(--color-accent-gray-soft)" },
  ],

  geography: [
    { city: "Москва", pct: 38 },
    { city: "Санкт-Петербург", pct: 21 },
    { city: "Казань", pct: 8 },
    { city: "Екатеринбург", pct: 6 },
    { city: "Новосибирск", pct: 4 },
    { city: "Другие города", pct: 23 },
  ],
};
