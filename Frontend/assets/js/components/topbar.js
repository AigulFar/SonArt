/**
 * СанАрт — компонент верхней панели: организация / период / профиль.
 * Данные читаются из SANART_DATA (assets/js/mock-data.js).
 */

function renderTopbar() {
  const mount = document.getElementById("topbar-mount");
  if (!mount) return;

  const { organization, dataQuality } = SANART_DATA;
  const initial = organization.user.charAt(0).toUpperCase();

  mount.innerHTML = `
    <header class="topbar">
      <div class="topbar__left">
        <button class="selector-chip selector-chip--dq" type="button" title="${dataQuality.message}">
          <span class="selector-chip__icon">${SANART_ICONS.building}</span>
          <span>${organization.name}</span>
          <span class="selector-chip__chevron">${SANART_ICONS.chevronDown}</span>
          <span class="dq-dot" aria-hidden="true"></span>
        </button>
      </div>
      <div class="topbar__right">
        <button class="selector-chip" type="button">
          <span class="selector-chip__icon">${SANART_ICONS.calendarRange}</span>
          <span>${organization.period}</span>
          <span class="selector-chip__chevron">${SANART_ICONS.chevronDown}</span>
        </button>
        <button class="user-chip" type="button">
          <span class="user-chip__avatar">${initial}</span>
          <span>${organization.user}</span>
        </button>
      </div>
    </header>`;
}
