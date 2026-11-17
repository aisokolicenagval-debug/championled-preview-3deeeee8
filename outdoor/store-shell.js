(() => {
  const header = document.querySelector('#out-store-header');
  const catalog = header.querySelector('#chh-catalog');
  const tabs = [...catalog.querySelectorAll('[data-store-tab]')];
  const templates = new Map(
    [...document.querySelectorAll('[data-store-template]')].map(template => [template.dataset.storeTemplate, template]),
  );
  let activeTab = '0';

  function showPanel(tab, variant) {
    const template = templates.get(tab + ':' + variant);
    if (!template) return;
    const previous = catalog.querySelector('[data-store-panel]');
    const panel = template.content.firstElementChild.cloneNode(true);
    previous.replaceWith(panel);
  }

  catalog.addEventListener('click', event => {
    const tab = event.target.closest('[data-store-tab]');
    if (tab) {
      activeTab = tab.dataset.storeTab;
      for (const option of tabs) {
        option.classList.toggle('is-active', option === tab);
        option.setAttribute('aria-pressed', String(option === tab));
      }
      showPanel(activeTab, '0');
      return;
    }
    const option = event.target.closest('[data-store-variant]');
    if (!option) return;
    const variant = option.dataset.storeVariant;
    showPanel(activeTab, variant);
    catalog.querySelector(`[data-store-panel] [data-store-variant="${variant}"]`)?.focus();
  });

  document.addEventListener('click', event => {
    const path = event.composedPath();
    for (const menu of header.querySelectorAll('details[open]')) {
      if (!path.includes(menu)) menu.open = false;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    for (const menu of header.querySelectorAll('details[open]')) {
      if (!menu.contains(document.activeElement)) continue;
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();
