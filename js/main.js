'use strict';

/* Enhancements only: navigation, project notes, and content also work without JS. */
function initTheme() {
  const button = document.getElementById('theme-toggle');
  const system = window.matchMedia('(prefers-color-scheme: light)');
  let preference = null;

  try {
    const saved = localStorage.getItem('satria-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // Storage may be blocked; theme switching still works for this visit.
  }

  const apply = (theme) => {
    const light = theme === 'light';
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f2f0e8' : '#111815');
    if (button) {
      button.setAttribute('aria-label', light ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
      button.firstElementChild.textContent = light ? '☾' : '☼';
    }
  };

  apply(preference || (system.matches ? 'light' : 'dark'));
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      apply(preference);
      try { localStorage.setItem('satria-theme', preference); } catch { /* Optional persistence. */ }
    });
  }
  system.addEventListener('change', (event) => {
    if (!preference) apply(event.matches ? 'light' : 'dark');
  });
}

function initNavigation() {
  const navigation = document.querySelector('.navigation');
  const button = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  if (!navigation || !button || !menu) return;

  const desktop = window.matchMedia('(min-width: 821px)');
  const closeMenu = (returnFocus = false) => {
    if (returnFocus) button.focus();
    menu.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Buka navigasi');
    button.lastElementChild.textContent = '+';
  };

  navigation.classList.add('is-enhanced');
  button.hidden = false;
  button.addEventListener('click', (event) => {
    if (button.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      return;
    }
    menu.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Tutup navigasi');
    button.lastElementChild.textContent = '−';
    // The navigation links precede this control in the document.
    // Move keyboard users directly into its links when opening on mobile.
    if (event.detail === 0) menu.querySelector('a')?.focus();
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  navigation.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!navigation.contains(document.activeElement)) closeMenu();
    });
  });
  desktop.addEventListener('change', () => {
    closeMenu(!desktop.matches && menu.contains(document.activeElement));
  });

  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  let scheduled = false;
  const updateCurrentSection = () => {
    let active = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) active = section.id;
    }
    links.forEach((link) => {
      if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateCurrentSection);
    }
  }, { passive: true });
  window.addEventListener('resize', updateCurrentSection);
  window.addEventListener('load', updateCurrentSection);
  updateCurrentSection();
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
      status.replaceChildren();
    });
  });
  form.querySelector('select')?.addEventListener('change', () => status.replaceChildren());

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.namedItem('name');
    const message = form.elements.namedItem('message');
    name.setCustomValidity(name.value.trim() ? '' : 'Masukkan nama Anda, bukan hanya spasi.');
    message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Tuliskan pesan minimal 10 karakter.');
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = String(data.get('subject')) + ' — ' + name.value.trim();
    const body = [
      'Halo Satria,', '', message.value.trim(), '',
      'Salam,', name.value.trim(), String(data.get('email')).trim()
    ].join('\r\n');
    const mailto = form.action + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const fallback = document.createElement('a');
    fallback.href = mailto;
    fallback.textContent = 'buka draf kembali';
    status.replaceChildren(
      document.createTextNode('Draf siap. Jika aplikasi email belum terbuka, '),
      fallback,
      document.createTextNode('. Pesan belum terkirim. Anda juga dapat memakai kontak langsung di halaman ini.')
    );
    window.location.href = mailto;
  });
}

initTheme();
initNavigation();
initContactForm();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const printButton = document.getElementById('print-cv');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}
