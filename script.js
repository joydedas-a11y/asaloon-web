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

// Contact modal. The trigger is a real link to /contact/, so it still works
// if this script fails to load; we only intercept the click when we can show
// the dialog instead.
const contactModal = document.querySelector('#contactModal');
const contactTriggers = document.querySelectorAll('[data-contact-modal]');

if (contactModal && contactTriggers.length) {
  const panel = contactModal.querySelector('.modal-panel');
  const closeButton = contactModal.querySelector('.modal-close');
  let lastFocused = null;

  const openModal = () => {
    lastFocused = document.activeElement;
    contactModal.hidden = false;
    document.body.style.overflow = 'hidden';
    // Let the browser paint the hidden state once so the transition runs.
    requestAnimationFrame(() => contactModal.classList.add('open'));
    closeButton.focus();
  };

  const closeModal = () => {
    contactModal.classList.remove('open');
    document.body.style.overflow = '';

    const finish = () => {
      contactModal.hidden = true;
      if (lastFocused) lastFocused.focus();
    };

    // Wait for the fade-out, but don't rely on the event firing.
    const done = setTimeout(finish, 240);
    contactModal.addEventListener('transitionend', () => {
      clearTimeout(done);
      finish();
    }, { once: true });
  };

  contactTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeButton.addEventListener('click', closeModal);
  contactModal.querySelector('.modal-dismiss').addEventListener('click', closeModal);

  // Click outside the panel dismisses.
  contactModal.addEventListener('click', (event) => {
    if (!panel.contains(event.target)) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !contactModal.hidden) closeModal();

    // Keep tabbing inside the dialog while it is open.
    if (event.key === 'Tab' && !contactModal.hidden) {
      const focusable = panel.querySelectorAll('a[href], button');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
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
