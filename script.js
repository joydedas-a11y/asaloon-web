// Replace these with the actual Asaloon store listing URLs after publication.
const APP_STORE_URL = 'https://apps.apple.com/';
const GOOGLE_PLAY_URL = 'https://play.google.com/store';

const STORES = {
  apple: { url: APP_STORE_URL, message: 'Asaloon is launching soon on the App Store.' },
  google: { url: GOOGLE_PLAY_URL, message: 'Asaloon is launching soon on Google Play.' }
};

const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Store buttons: the href in the markup is the no-JS fallback; the constants
// above are the single source of truth once this runs. The click is never
// cancelled, so target="_blank" opens the store in a new tab either way.
const storeButtons = document.querySelectorAll('[data-store]');

if (storeButtons.length) {
  let toast;
  let toastTimer;

  const showToast = (message) => {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    // Restart the animation if a second click lands while one is showing.
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  };

  storeButtons.forEach((button) => {
    const store = STORES[button.dataset.store];
    if (!store) return;

    button.href = store.url;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';

    button.addEventListener('click', () => showToast(store.message));
  });
}

// Support form. GitHub Pages is static hosting and cannot process a POST, so
// instead of pretending to send, we hand the message off to the user's email
// client. Replace with a real endpoint when one exists.
const supportForm = document.querySelector('#supportForm');
const formError = document.querySelector('#formError');

if (supportForm) {
  supportForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = {};
    for (const [key, value] of new FormData(supportForm).entries()) {
      values[key] = String(value).trim();
    }

    if (!values.name || !values.email || !values.subject || !values.message) {
      if (formError) formError.textContent = 'Please fill in every field.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      if (formError) formError.textContent = 'Please enter a valid email address.';
      return;
    }

    if (formError) formError.textContent = '';

    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      '',
      'Message:',
      values.message
    ].join('\n');

    window.location.href =
      'mailto:support@asaloon.com' +
      `?subject=${encodeURIComponent(values.subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
}
