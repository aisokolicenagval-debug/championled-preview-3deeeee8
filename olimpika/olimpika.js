const navigation = document.querySelector('.header-secondary');
const menuToggle = document.querySelector('.mobile-nav-toggle');
const collapsedNavigation = matchMedia('(max-width: 900px)');

function setNavigation(open) {
  document.body.classList.toggle('mobile-nav-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню сайта' : 'Открыть меню сайта');
}

menuToggle.addEventListener('click', () => setNavigation(menuToggle.getAttribute('aria-expanded') === 'false'));
collapsedNavigation.addEventListener('change', () => setNavigation(false));
document.addEventListener('click', (event) => {
  if (!event.target.closest('header') || event.target.closest('.header-secondary a, .catalog-btn')) {
    setNavigation(false);
  }
});

const footerMenus = document.querySelectorAll('.footer-menu');
const collapsedFooter = matchMedia('(max-width: 767px)');
function adaptFooter() {
  footerMenus.forEach((group) => { group.open = !collapsedFooter.matches; });
}
collapsedFooter.addEventListener('change', adaptFooter);
adaptFooter();

const diagram = document.querySelector('.concept-hotspots');
let activePoint = null;
let selectedPoint = null;

function showPoint(point) {
  activePoint?.removeAttribute('data-active');
  activePoint = point;
  activePoint?.setAttribute('data-active', '');
}

for (const point of diagram.children) {
  const marker = point.querySelector('button');

  point.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && !selectedPoint) showPoint(point);
  });
  point.addEventListener('pointerleave', () => {
    if (activePoint === point && !selectedPoint && !marker.matches(':focus-visible')) showPoint(null);
  });
  marker.addEventListener('focus', () => {
    if (marker.matches(':focus-visible')) showPoint(point);
  });
  marker.addEventListener('blur', () => {
    if (activePoint === point && !selectedPoint) showPoint(null);
  });

  point.addEventListener('click', (event) => {
    if (!event.target.closest('button, .concept-art')) return;
    selectedPoint = selectedPoint === point ? null : point;
    showPoint(selectedPoint);
  });
}

document.addEventListener('click', (event) => {
  if (!diagram.contains(event.target) && activePoint) {
    selectedPoint = null;
    showPoint(null);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (menuToggle.getAttribute('aria-expanded') === 'true') {
    const returnFocus = navigation.contains(document.activeElement);
    setNavigation(false);
    if (returnFocus) menuToggle.focus();
  }
  selectedPoint = null;
  showPoint(null);
});

// Fallback for browsers that support dialog but lack declarative dialog commands.
if (!('commandForElement' in HTMLButtonElement.prototype)) {
  for (const button of document.querySelectorAll('[commandfor="olimpika-document-request"]')) {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.getAttribute('commandfor'));
      if (button.getAttribute('command') === 'show-modal') dialog.showModal();
      else dialog.close();
    });
  }
}
