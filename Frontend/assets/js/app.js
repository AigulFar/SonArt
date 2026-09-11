/**
 * СанАрт — точка сборки страницы «Дашборд».
 * Инициализирует общие блоки (сайдбар/хедер), KPI, переключатель периода
 * и все графики. Источник данных — SANART_DATA (mock-data.js).
 */

const SPARKLINES = {
  visitors: "M0,20 L10,17 L20,19 L30,12 L40,14 L50,8 L60,10 L70,4 L80,6 L90,1",
  newVisitors: "M0,22 L10,20 L20,15 L30,17 L40,10 L50,12 L60,6 L70,8 L80,3 L90,5",
  eventsHeld: "M0,6 L10,10 L20,4 L30,12 L40,8 L50,16 L60,10 L70,18 L80,12 L90,6",
  avgDwellTime: "M0,14 L10,15 L20,13 L30,16 L40,12 L50,14 L60,11 L70,13 L80,10 L90,12",
};

const KPI_META = [
  { key: "visitors", icon: "audience", label: "Посетители", color: "var(--color-accent-orange)" },
  { key: "newVisitors", icon: "userPlus", label: "Новые посетители", color: "var(--color-accent-green)" },
  { key: "eventsHeld", icon: "events", label: "Проведено мероприятий", color: "var(--color-accent-purple)" },
  { key: "avgDwellTime", icon: "clock", label: "Среднее время на экспозиции", color: "var(--color-accent-gray)" },
];

function renderKpiCards(periodId) {
  const mount = document.getElementById("kpi-grid");
  if (!mount) return;

  const kpis = SANART_DATA.kpiByPeriod[periodId];

  mount.innerHTML = KPI_META.map((meta) => {
    const kpi = kpis[meta.key];
    const isUp = kpi.deltaDir === "up";
    const deltaClass = isUp ? "kpi-card__delta--up" : "kpi-card__delta--down";
    const deltaIcon = isUp ? SANART_ICONS.arrowUp : SANART_ICONS.arrowDown;

    return `
      <div class="card kpi-card">
        <div class="kpi-card__head">
          <span class="kpi-card__icon">${SANART_ICONS[meta.icon]}</span>
          <span>${meta.label}</span>
        </div>
        <div class="kpi-card__value-row">
          <span class="kpi-card__value">${typeof kpi.value === "number" ? formatNumber(kpi.value) : kpi.value}</span>
          <span class="kpi-card__delta ${deltaClass}">
            <span class="kpi-card__delta-icon">${deltaIcon}</span>${kpi.deltaPct}%
          </span>
        </div>
        <p class="kpi-card__caption">${kpi.caption}</p>
        <svg class="kpi-card__spark" viewBox="0 0 90 24" preserveAspectRatio="none">
          <path d="${SPARKLINES[meta.key]}" fill="none" stroke="${meta.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>`;
  }).join("");
}

function renderDataQualityBanner() {
  const mount = document.getElementById("dq-banner");
  if (!mount) return;

  const { institutionsFlagged, institutionsTotal } = SANART_DATA.dataQuality;

  mount.innerHTML = `
    <div class="dq-banner">
      <span class="dq-banner__icon">${SANART_ICONS.warning}</span>
      <span><strong>Контроль качества:</strong> у ${institutionsFlagged} из ${institutionsTotal} учреждений обнаружены расхождения в исходных данных — значения по ним помечены и не скрыты из отчётов.</span>
    </div>`;
}

function initPeriodTabs() {
  const tabs = document.querySelectorAll(".period-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("period-tab--active"));
      tab.classList.add("period-tab--active");
      renderKpiCards(tab.dataset.period);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("dashboard");
  renderTopbar();
  renderDataQualityBanner();
  renderKpiCards("today");
  initPeriodTabs();

  renderAreaChart("attendance-chart", SANART_DATA.attendanceSeries);
  renderDonutChart(
    "sources-donut",
    SANART_DATA.visitSources,
    SANART_DATA.kpiByPeriod.today.visitors.value,
    "посетителя"
  );
  renderRankList("popular-exhibitions", SANART_DATA.popularExhibitions);
  renderBarChart("age-bar-chart", SANART_DATA.ageGroups);
  renderGeoList("geo-list", SANART_DATA.geography);
});
