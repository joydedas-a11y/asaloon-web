const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
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
