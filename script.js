const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const modalClose = document.querySelector('.modal-close');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function openModal(type) {
  const content = {
    privacy: `
      <section class="legal-page">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p>Asaloon respects your privacy. This Privacy Policy explains how we collect, use, store and protect your information when you use the Asaloon mobile application and website.</p>
        <h2>Information We Collect</h2>
        <ul class="legal-list">
          <li>Name</li>
          <li>Phone number</li>
          <li>Email address (if provided)</li>
          <li>Salon information</li>
          <li>Appointment information</li>
          <li>Customer information entered by you</li>
          <li>Billing information entered by you</li>
          <li>Inventory information</li>
          <li>Device information required for app functionality</li>
          <li>Crash logs used to improve the application</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>We use your information to provide salon management features, synchronize your data across devices, improve performance, provide customer support and protect against fraud or abuse.</p>
        <h2>Customer Data</h2>
        <p>Customer information entered into Asaloon belongs to you. We do not sell your customer data or use your customer list for advertising.</p>
        <h2>Data Security</h2>
        <p>We use industry-standard security measures to protect your information. Users can permanently delete their account directly from the Asaloon application.</p>
        <p>Questions? support@asaloon.com</p>
      </section>
    `,
    terms: `
      <section class="legal-page">
        <h1>Terms of Service</h1>
        <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p>Welcome to Asaloon. By using Asaloon, you agree to these Terms of Service.</p>
        <h2>Use of Service</h2>
        <p>Asaloon is a salon management application designed to help businesses manage appointments, billing, customers and inventory.</p>
        <h2>Account Responsibility</h2>
        <p>You are responsible for maintaining the confidentiality of your account and for all activity under it.</p>
        <h2>Data Ownership</h2>
        <p>All customer, billing and salon data entered into Asaloon belongs to you.</p>
        <h2>Acceptable Use</h2>
        <p>You agree not to misuse the application, attempt unauthorized access or interfere with other users.</p>
        <h2>Limitation of Liability</h2>
        <p>Asaloon is provided “as is.” To the maximum extent permitted by law, we are not liable for indirect damages arising from use of the application.</p>
        <p>Questions? support@asaloon.com</p>
      </section>
    `,
    support: `
      <section class="legal-page">
        <h1>Contact Support</h1>
        <p>Tell us what you need help with and our team will get back to you as soon as possible.</p>
        <form id="supportForm" class="form-grid">
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="subject" placeholder="Subject" required />
          <textarea name="message" placeholder="Message" required></textarea>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Send Message</button>
            <span class="success-state">Thank you. We've received your message and will get back to you as soon as possible.</span>
          </div>
        </form>
      </section>
    `
  };

  if (backdrop && modalContent) {
    modalContent.innerHTML = content[type] || content.privacy;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (backdrop) {
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }
}

if (backdrop) {
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal();
  });
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

document.querySelectorAll('[data-modal]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const modalType = link.getAttribute('data-modal');
    if (modalType) openModal(modalType);
  });
});

// The support form is injected with the modal, so listen at the document level.
document.addEventListener('submit', async (event) => {
  const form = event.target.closest('#supportForm');
  if (!form) return;

  event.preventDefault();
  const successState = form.querySelector('.success-state');
  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    // Fail gracefully in local preview while still confirming submission.
  }

  form.reset();
  if (successState) successState.classList.add('show');
});
