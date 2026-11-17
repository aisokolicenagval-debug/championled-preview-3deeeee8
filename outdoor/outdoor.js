(() => {
  const model = document.querySelector('#model-select');
  const accessoryNote = document.querySelector('#accessory-note');
  const detailCells = document.querySelectorAll('[data-detail]');
  const modelProductLink = document.querySelector('[data-model-product-link]');

  function updateSpecification() {
    const details = JSON.parse(model.selectedOptions[0].dataset.spec);
    for (const cell of detailCells) {
      cell.textContent = details[cell.dataset.detail];
    }
    accessoryNote.hidden = model.value !== 'gektor';
    modelProductLink.href = details.productUrl;
    modelProductLink.setAttribute('aria-label', 'Открыть карточку товара «' + model.selectedOptions[0].text + '»');
  }

  model.addEventListener('change', updateSpecification);
  for (const link of document.querySelectorAll('[data-pick-model]')) {
    link.addEventListener('click', () => {
      model.value = link.dataset.pickModel;
      updateSpecification();
    });
  }
  updateSpecification();

  const catalogFilters = document.querySelectorAll('[data-catalog-category]');
  const catalogLink = document.querySelector('[data-catalog-link]');
  const catalogCards = document.querySelectorAll('[data-product-category]');
  for (const filter of catalogFilters) {
    filter.addEventListener('click', () => {
      const category = filter.dataset.catalogCategory;
      for (const option of catalogFilters) {
        option.setAttribute('aria-pressed', String(option === filter));
      }
      for (const card of catalogCards) {
        card.hidden = category !== 'ulichnye-svetilniki' && card.dataset.productCategory !== category;
      }
      catalogLink.href = 'https://championled.ru/catalog/' + category;
    });
  }

  const dialog = document.querySelector('#outdoor-document-request');
  const form = dialog.querySelector('form');
  const context = dialog.querySelector('#out-request-context');
  const result = dialog.querySelector('.out-request-result');
  const emailLink = result.querySelector('[data-request-email]');
  const requestModes = {
    documents: {
      title: 'Запросить документы',
      intro: 'Укажите, какие документы вам нужны для выбранного светильника.',
      submit: 'Отправить запрос',
    },
    catalog: {
      title: 'Запросить каталог',
      intro: 'Укажите имя, почту и номер телефона. Форма подготовит письмо с запросом каталога уличных светильников.',
      subject: 'Запрос каталога уличных светильников ChampionLED',
    },
    custom: {
      title: 'Запрос на спецзаказ',
      intro: 'Выберите модель и укажите нужный цвет корпуса или технические параметры. Уточним, какие варианты доступны.',
      subject: 'Спецзаказ уличного светильника ChampionLED',
    },
  };
  let requestMode = 'documents';

  function showForm() {
    result.hidden = true;
    form.hidden = false;
  }

  for (const button of document.querySelectorAll('[data-open-request]')) {
    button.addEventListener('click', () => {
      requestMode = button.dataset.openRequest;
      const mode = requestModes[requestMode];
      dialog.querySelector('#outdoor-request-title').textContent = mode.title;
      dialog.querySelector('.request-intro').textContent = mode.intro;
      form.querySelector('button[type="submit"]').textContent = mode.submit || 'Подготовить письмо';
      context.hidden = requestMode !== 'documents';
      const sku = document.querySelector('[data-detail="sku"]').textContent;
      context.textContent = context.hidden ? '' : model.selectedOptions[0].text + ' · ' + sku;
      for (const fields of form.querySelectorAll('[data-request-fields]')) {
        fields.disabled = fields.hidden = fields.dataset.requestFields !== requestMode;
      }
      showForm();
      dialog.showModal();
      if (requestMode === 'custom') form.elements.model.focus();
    });
  }

  const parameters = form.elements.parameters;
  const ral = form.elements.ral;
  for (const field of [parameters, ral]) {
    field.addEventListener('input', () => parameters.setCustomValidity(''));
  }

  dialog.querySelector('[data-close-request]').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const mode = requestModes[requestMode];
    const data = new FormData(form);
    const wantedParameters = data.get('parameters')?.trim();
    const wantedColor = data.get('ral')?.trim();
    if (requestMode === 'custom' && !wantedParameters && !wantedColor) {
      parameters.setCustomValidity('Укажите цвет корпуса или технические параметры.');
      parameters.reportValidity();
      return;
    }
    if (mode.subject) {
      const lines = requestMode === 'catalog'
        ? ['Прошу прислать каталог уличных светильников ChampionLED.']
        : ['Прошу уточнить возможность спецзаказа.', `Модель: ${data.get('model')}`];
      if (wantedColor) lines.push(`Цвет корпуса: ${wantedColor}`);
      if (wantedParameters) lines.push(`Технические параметры: ${wantedParameters}`);
      lines.push('', `Имя: ${data.get('name').trim()}`, `Почта для ответа: ${data.get('email')}`);
      lines.push(`Номер телефона: ${data.get('phone').trim()}`);
      lines.push('Согласие на обработку персональных данных: дано.');
      if (data.has('marketing')) lines.push('Согласие на получение рекламных и информационных сообщений: дано.');
      emailLink.href = `mailto:order@championled.ru?subject=${encodeURIComponent(mode.subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
    } else {
      emailLink.removeAttribute('href');
    }
    emailLink.hidden = !mode.subject;
    result.querySelector('h3').textContent = mode.subject ? 'Письмо готово к отправке' : 'Запрос подготовлен';
    result.querySelector('[data-request-status]').textContent = mode.subject
      ? 'Откройте письмо в почтовом приложении и отправьте его в ChampionLED.'
      : 'Форма заполнена. Данные остались в форме.';
    form.hidden = true;
    result.hidden = false;
    result.querySelector('h3').focus();
  });
  dialog.querySelector('[data-edit-request]').addEventListener('click', () => {
    showForm();
    form.elements[{ custom: 'model', catalog: 'name', documents: 'message' }[requestMode]].focus();
  });
})();
