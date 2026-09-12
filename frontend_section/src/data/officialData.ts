// Generated from https://github.com/AigulFar/SonArt official dataset
export interface OfficialInstitution {
  institution_id: string;
  institution: string;
  center: string;
  institution_type: string;
  report_year: number;
  events_2025: number;
  events_2026: number;
  event_growth_pct: number;
  trained_people_total: number;
  resident_creators: number;
  creative_products_total: number;
  patents_copyrights_total: number;
  publications: number;
  service_revenue_total: number;
  data_quality: string;
  data_source: string;
}

export interface OfficialVenue {
  venue_id: string;
  institution_id: string;
  venue_name: string;
  capacity: number;
  suitable_event_types: string[];
  data_source: string;
}

export const OFFICIAL_INSTITUTIONS: OfficialInstitution[] = [
  {
    "institution_id": "INST_001",
    "institution": "Восточно-Сибирский ГИК",
    "center": "Центр прототипирования ВСГИК",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 29,
    "events_2026": 24,
    "event_growth_pct": -17.24137931034483,
    "trained_people_total": 205,
    "resident_creators": 264,
    "creative_products_total": 264,
    "patents_copyrights_total": 0,
    "publications": 3,
    "service_revenue_total": 1134043,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_002",
    "institution": "Уфимский ГИИ им. Загира Исмагилова",
    "center": "Центр прототипирования: Центр прототипирования \"Центр исполнительских искусств\"",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 24,
    "events_2026": 11,
    "event_growth_pct": -54.16666666666667,
    "trained_people_total": 339,
    "resident_creators": 28,
    "creative_products_total": 30,
    "patents_copyrights_total": 0,
    "publications": 8,
    "service_revenue_total": 1348248,
    "data_quality": "расхождение мероприятий 2025; расхождение выручки",
    "data_source": "official"
  },
  {
    "institution_id": "INST_003",
    "institution": "Московский ГИК",
    "center": "Центр создания прототипов и макетов изделий",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 6,
    "events_2026": 6,
    "event_growth_pct": 0,
    "trained_people_total": 58,
    "resident_creators": 131,
    "creative_products_total": 58,
    "patents_copyrights_total": 0,
    "publications": 57,
    "service_revenue_total": 1936180,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_004",
    "institution": "Академия акварели и изящных искусств Сергея Андрияки",
    "center": "Центр прототипирования и 3D технологий (название центра)",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 7,
    "events_2026": 7,
    "event_growth_pct": 0,
    "trained_people_total": 105,
    "resident_creators": 21,
    "creative_products_total": 21,
    "patents_copyrights_total": 0,
    "publications": 4,
    "service_revenue_total": 149600,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_005",
    "institution": "МГАХИ им. В.И. Сурикова",
    "center": "Белый квадрат",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 13,
    "events_2026": 7,
    "event_growth_pct": -46.15384615384615,
    "trained_people_total": 329,
    "resident_creators": 329,
    "creative_products_total": 200,
    "patents_copyrights_total": 0,
    "publications": 6,
    "service_revenue_total": 0,
    "data_quality": "расхождение мероприятий 2025; расхождение мероприятий 2026",
    "data_source": "official"
  },
  {
    "institution_id": "INST_006",
    "institution": "Алтайский ГИК",
    "center": "Центр цифрового контента",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 35,
    "events_2026": 23,
    "event_growth_pct": -34.28571428571428,
    "trained_people_total": 420,
    "resident_creators": 356,
    "creative_products_total": 115,
    "patents_copyrights_total": 0,
    "publications": 47,
    "service_revenue_total": 1224900,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_007",
    "institution": "Краснодарский ГИК",
    "center": "\"Центр исполнительских искусств\"",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 13,
    "events_2026": 28,
    "event_growth_pct": 115.3846153846154,
    "trained_people_total": 395,
    "resident_creators": 395,
    "creative_products_total": 397,
    "patents_copyrights_total": 0,
    "publications": 104,
    "service_revenue_total": 450000,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_008",
    "institution": "Пермское хореографическое училище / Театриум",
    "center": "ТЕАТРИУМ",
    "institution_type": "Театр / хореографическое",
    "report_year": 2026,
    "events_2025": 0,
    "events_2026": 1,
    "event_growth_pct": 0,
    "trained_people_total": 50,
    "resident_creators": 0,
    "creative_products_total": 0,
    "patents_copyrights_total": 0,
    "publications": 6,
    "service_revenue_total": 0,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_009",
    "institution": "Екатеринбургский ГТИ",
    "center": "Центр прототипирования",
    "institution_type": "Культурное / образовательное",
    "report_year": 2026,
    "events_2025": 8,
    "events_2026": 10,
    "event_growth_pct": 25,
    "trained_people_total": 99,
    "resident_creators": 33,
    "creative_products_total": 315,
    "patents_copyrights_total": 0,
    "publications": 182,
    "service_revenue_total": 2187565,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_010",
    "institution": "ГМПИ им. М.М. Ипполитова-Иванова",
    "center": "\"Центр производства акустической музыки\"",
    "institution_type": "Культурное / образовательное",
    "report_year": 2026,
    "events_2025": 4,
    "events_2026": 6,
    "event_growth_pct": 50,
    "trained_people_total": 17,
    "resident_creators": 55,
    "creative_products_total": 71,
    "patents_copyrights_total": 0,
    "publications": 43,
    "service_revenue_total": 936500,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_011",
    "institution": "Воронежский ГИИ",
    "center": "«Центр исполнительских искусств и светового дизайна»",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 16,
    "events_2026": 14,
    "event_growth_pct": -12.5,
    "trained_people_total": 172,
    "resident_creators": 160,
    "creative_products_total": 35,
    "patents_copyrights_total": 0,
    "publications": 31,
    "service_revenue_total": 3550500,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_012",
    "institution": "СПбГИКиТ",
    "center": "Центр прототипирования \"Цифра\"",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 10,
    "events_2026": 12,
    "event_growth_pct": 20,
    "trained_people_total": 115,
    "resident_creators": 115,
    "creative_products_total": 63,
    "patents_copyrights_total": 0,
    "publications": 11,
    "service_revenue_total": 700501,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_013",
    "institution": "Училище циркового и эстрадного искусства им. М.Н. Румянцева",
    "center": "Творческий инкубатор «Лонжа»",
    "institution_type": "Цирковое / эстрадное",
    "report_year": 2026,
    "events_2025": 0,
    "events_2026": 1,
    "event_growth_pct": 0,
    "trained_people_total": 34,
    "resident_creators": 34,
    "creative_products_total": 0,
    "patents_copyrights_total": 0,
    "publications": 22,
    "service_revenue_total": 0,
    "data_quality": "расхождение мероприятий 2026",
    "data_source": "official"
  },
  {
    "institution_id": "INST_014",
    "institution": "Орловский ГИК",
    "center": "Центр креативных индустрий",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 52,
    "events_2026": 31,
    "event_growth_pct": -40.38461538461539,
    "trained_people_total": 1479,
    "resident_creators": 1479,
    "creative_products_total": 31,
    "patents_copyrights_total": 0,
    "publications": 72,
    "service_revenue_total": 4206001,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_015",
    "institution": "Нижегородская государственная консерватория им. М.И. Глинки",
    "center": "Глинка-медиа",
    "institution_type": "Музыкальное",
    "report_year": 2026,
    "events_2025": 1,
    "events_2026": 3,
    "event_growth_pct": 200,
    "trained_people_total": 20,
    "resident_creators": 86,
    "creative_products_total": 66,
    "patents_copyrights_total": 0,
    "publications": 32,
    "service_revenue_total": 711500,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_016",
    "institution": "Пермский ГИК",
    "center": "Центр саунд дизайна и визуальных технологий",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 3,
    "events_2026": 2,
    "event_growth_pct": -33.33333333333334,
    "trained_people_total": 32,
    "resident_creators": 19,
    "creative_products_total": 32,
    "patents_copyrights_total": 0,
    "publications": 52,
    "service_revenue_total": 246890,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_017",
    "institution": "Саратовская государственная консерватория им. Л.В. Собинова",
    "center": "Центр креативных индустрий \"СОБИНОВ\"",
    "institution_type": "Музыкальное",
    "report_year": 2026,
    "events_2025": 36,
    "events_2026": 28,
    "event_growth_pct": -22.22222222222222,
    "trained_people_total": 241,
    "resident_creators": 263,
    "creative_products_total": 263,
    "patents_copyrights_total": 0,
    "publications": 25,
    "service_revenue_total": 2174000,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_018",
    "institution": "Челябинский ГИК",
    "center": "\"ВКУБЕ\"",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 8,
    "events_2026": 9,
    "event_growth_pct": 12.5,
    "trained_people_total": 50,
    "resident_creators": 55,
    "creative_products_total": 22,
    "patents_copyrights_total": 0,
    "publications": 30,
    "service_revenue_total": 1110000,
    "data_quality": "OK",
    "data_source": "official"
  },
  {
    "institution_id": "INST_019",
    "institution": "Кемеровский ГИК",
    "center": "цифрового контента",
    "institution_type": "Изобразительное искусство / культура",
    "report_year": 2026,
    "events_2025": 8,
    "events_2026": 2,
    "event_growth_pct": -75,
    "trained_people_total": 12,
    "resident_creators": 12,
    "creative_products_total": 12,
    "patents_copyrights_total": 0,
    "publications": 20,
    "service_revenue_total": 213750,
    "data_quality": "OK",
    "data_source": "official"
  }
];

export const OFFICIAL_VENUES: OfficialVenue[] = [
  {
    "venue_id": "INST_001_V1",
    "institution_id": "INST_001",
    "venue_name": "Малая площадка — Восточно-Сибирский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_001_V2",
    "institution_id": "INST_001",
    "venue_name": "Лекционный зал — Восточно-Сибирский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_001_V3",
    "institution_id": "INST_001",
    "venue_name": "Большой зал — Восточно-Сибирский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_002_V1",
    "institution_id": "INST_002",
    "venue_name": "Малая площадка — Уфимский ГИИ им. Загира Исмагилова",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_002_V2",
    "institution_id": "INST_002",
    "venue_name": "Лекционный зал — Уфимский ГИИ им. Загира Исмагилова",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_002_V3",
    "institution_id": "INST_002",
    "venue_name": "Большой зал — Уфимский ГИИ им. Загира Исмагилова",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_003_V1",
    "institution_id": "INST_003",
    "venue_name": "Малая площадка — Московский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_003_V2",
    "institution_id": "INST_003",
    "venue_name": "Лекционный зал — Московский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_003_V3",
    "institution_id": "INST_003",
    "venue_name": "Большой зал — Московский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_004_V1",
    "institution_id": "INST_004",
    "venue_name": "Малая площадка — Академия акварели и изящных искусств Сергея Андрияки",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_004_V2",
    "institution_id": "INST_004",
    "venue_name": "Лекционный зал — Академия акварели и изящных искусств Сергея Андрияки",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_004_V3",
    "institution_id": "INST_004",
    "venue_name": "Большой зал — Академия акварели и изящных искусств Сергея Андрияки",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_005_V1",
    "institution_id": "INST_005",
    "venue_name": "Малая площадка — МГАХИ им. В.И. Сурикова",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_005_V2",
    "institution_id": "INST_005",
    "venue_name": "Лекционный зал — МГАХИ им. В.И. Сурикова",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_005_V3",
    "institution_id": "INST_005",
    "venue_name": "Большой зал — МГАХИ им. В.И. Сурикова",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_006_V1",
    "institution_id": "INST_006",
    "venue_name": "Малая площадка — Алтайский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_006_V2",
    "institution_id": "INST_006",
    "venue_name": "Лекционный зал — Алтайский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_006_V3",
    "institution_id": "INST_006",
    "venue_name": "Большой зал — Алтайский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_007_V1",
    "institution_id": "INST_007",
    "venue_name": "Малая площадка — Краснодарский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_007_V2",
    "institution_id": "INST_007",
    "venue_name": "Лекционный зал — Краснодарский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_007_V3",
    "institution_id": "INST_007",
    "venue_name": "Большой зал — Краснодарский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_008_V1",
    "institution_id": "INST_008",
    "venue_name": "Малая площадка — Пермское хореографическое училище / Театриум",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_008_V2",
    "institution_id": "INST_008",
    "venue_name": "Лекционный зал — Пермское хореографическое училище / Театриум",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_008_V3",
    "institution_id": "INST_008",
    "venue_name": "Большой зал — Пермское хореографическое училище / Театриум",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_009_V1",
    "institution_id": "INST_009",
    "venue_name": "Малая площадка — Екатеринбургский ГТИ",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_009_V2",
    "institution_id": "INST_009",
    "venue_name": "Лекционный зал — Екатеринбургский ГТИ",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_009_V3",
    "institution_id": "INST_009",
    "venue_name": "Большой зал — Екатеринбургский ГТИ",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_010_V1",
    "institution_id": "INST_010",
    "venue_name": "Малая площадка — ГМПИ им. М.М. Ипполитова-Иванова",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_010_V2",
    "institution_id": "INST_010",
    "venue_name": "Лекционный зал — ГМПИ им. М.М. Ипполитова-Иванова",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_010_V3",
    "institution_id": "INST_010",
    "venue_name": "Большой зал — ГМПИ им. М.М. Ипполитова-Иванова",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_011_V1",
    "institution_id": "INST_011",
    "venue_name": "Малая площадка — Воронежский ГИИ",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_011_V2",
    "institution_id": "INST_011",
    "venue_name": "Лекционный зал — Воронежский ГИИ",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_011_V3",
    "institution_id": "INST_011",
    "venue_name": "Большой зал — Воронежский ГИИ",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_012_V1",
    "institution_id": "INST_012",
    "venue_name": "Малая площадка — СПбГИКиТ",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_012_V2",
    "institution_id": "INST_012",
    "venue_name": "Лекционный зал — СПбГИКиТ",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_012_V3",
    "institution_id": "INST_012",
    "venue_name": "Большой зал — СПбГИКиТ",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_013_V1",
    "institution_id": "INST_013",
    "venue_name": "Малая площадка — Училище циркового и эстрадного искусства им. М.Н. Румянцева",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_013_V2",
    "institution_id": "INST_013",
    "venue_name": "Лекционный зал — Училище циркового и эстрадного искусства им. М.Н. Румянцева",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_013_V3",
    "institution_id": "INST_013",
    "venue_name": "Большой зал — Училище циркового и эстрадного искусства им. М.Н. Румянцева",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_014_V1",
    "institution_id": "INST_014",
    "venue_name": "Малая площадка — Орловский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_014_V2",
    "institution_id": "INST_014",
    "venue_name": "Лекционный зал — Орловский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_014_V3",
    "institution_id": "INST_014",
    "venue_name": "Большой зал — Орловский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_015_V1",
    "institution_id": "INST_015",
    "venue_name": "Малая площадка — Нижегородская государственная консерватория им. М.И. Глинки",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_015_V2",
    "institution_id": "INST_015",
    "venue_name": "Лекционный зал — Нижегородская государственная консерватория им. М.И. Глинки",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_015_V3",
    "institution_id": "INST_015",
    "venue_name": "Большой зал — Нижегородская государственная консерватория им. М.И. Глинки",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_016_V1",
    "institution_id": "INST_016",
    "venue_name": "Малая площадка — Пермский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_016_V2",
    "institution_id": "INST_016",
    "venue_name": "Лекционный зал — Пермский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_016_V3",
    "institution_id": "INST_016",
    "venue_name": "Большой зал — Пермский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_017_V1",
    "institution_id": "INST_017",
    "venue_name": "Малая площадка — Саратовская государственная консерватория им. Л.В. Собинова",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_017_V2",
    "institution_id": "INST_017",
    "venue_name": "Лекционный зал — Саратовская государственная консерватория им. Л.В. Собинова",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_017_V3",
    "institution_id": "INST_017",
    "venue_name": "Большой зал — Саратовская государственная консерватория им. Л.В. Собинова",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_018_V1",
    "institution_id": "INST_018",
    "venue_name": "Малая площадка — Челябинский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_018_V2",
    "institution_id": "INST_018",
    "venue_name": "Лекционный зал — Челябинский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_018_V3",
    "institution_id": "INST_018",
    "venue_name": "Большой зал — Челябинский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_019_V1",
    "institution_id": "INST_019",
    "venue_name": "Малая площадка — Кемеровский ГИК",
    "capacity": 60,
    "suitable_event_types": [
      "Выставка",
      "Мастер-класс"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_019_V2",
    "institution_id": "INST_019",
    "venue_name": "Лекционный зал — Кемеровский ГИК",
    "capacity": 120,
    "suitable_event_types": [
      "Лекция",
      "Творческая встреча"
    ],
    "data_source": "synthetic"
  },
  {
    "venue_id": "INST_019_V3",
    "institution_id": "INST_019",
    "venue_name": "Большой зал — Кемеровский ГИК",
    "capacity": 220,
    "suitable_event_types": [
      "Концерт",
      "Спектакль",
      "Шоу"
    ],
    "data_source": "synthetic"
  }
];

export const SANART_KPI_BY_PERIOD = {
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
};

export const SANART_ATTENDANCE_SERIES = [
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
];

export const PRESET_AI_IDEAS = [
  {
    title: '«Хакатон для дошкольников в полночь»',
    eventType: 'Мастер-класс',
    targetAge: '3-6 лет (дошкольники)',
    startTime: '00:00',
    durationMin: 360,
    capacity: 100,
    price: 1500,
    description: 'Ночной хакатон по конструированию из кубиков и робототехнике для детей 3-6 лет.',
    note: 'Тот самый тестовый кейс из Blueprint: система должна выявить несовместимость времени, возраста и формата!',
  },
  {
    title: '«Ночная экскурсия по экспозиции цифрового искусства в пятницу»',
    eventType: 'Выставка',
    targetAge: '18-28 (студенты и молодежь)',
    startTime: '21:30',
    durationMin: 90,
    capacity: 60,
    price: 500,
    description: 'Камерная ночная экскурсия по светящимся инсталляциям при приглушенном общем свете с эмбиент-музыкой в наушниках.',
    note: 'Идеальное попадание в сегмент «Новые/редкие» и молодежь 18-24!',
  },
  {
    title: '«Семейный воскресный мастер-класс по лепке из глины»',
    eventType: 'Мастер-класс',
    targetAge: '7-14 лет с родителями',
    startTime: '12:00',
    durationMin: 120,
    capacity: 18,
    price: 900,
    description: 'Практическое занятие по ручной керамике с обжигом готовых изделий для родителей с детьми.',
    note: 'Высокая маржинальность и заполняемость в выходные (исторический fill rate 94%).',
  }
];

