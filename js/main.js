if (typeof lucide !== 'undefined') lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Menu ────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (hamburger) hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
        closeMobile();
      }
    }
  });

  // ── FAQ Accordion ──────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.classList.remove('open');
        if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // ── Active Nav Link ────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath !== '/' && href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  // ── Booking Form (async → Zapier webhook) ─────────────
  document.querySelectorAll('form.booking-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const fd = new FormData(form);
        const first = fd.get('first_name') || '';
        const last  = fd.get('last_name')  || '';
        if (first || last) fd.append('name', `${first} ${last}`.trim());
        const res = await fetch(form.action, {
          method: 'POST',
          body: fd
        });
        if (res.ok) {
          window.location.href = '/thank-you.html';
        } else {
          throw new Error();
        }
      } catch {
        const phone = form.dataset.phone || '';
        btn.textContent = phone ? `Error — call us at ${phone}` : 'Error sending — please call us';
        btn.style.background = '#dc2626';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }
    });
  });

  // ── Chat button ────────────────────────────────────────
  const chatBtn = document.querySelector('.chat-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      const form = document.getElementById('booking-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ── Video walkthroughs: click-to-play (no preload) ─────
  // Videos carry no src until the visitor presses play, so
  // no video bytes are downloaded on page load.
  document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const btn = card.querySelector('.video-play');
    if (!video || !btn) return;
    const loadAndPlay = () => {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', video.dataset.src);
        video.load();
      }
      video.controls = true;
      btn.classList.add('hidden');
      video.play().catch(() => { btn.classList.remove('hidden'); });
    };
    btn.addEventListener('click', loadAndPlay);
    video.addEventListener('click', () => { if (!video.getAttribute('src')) loadAndPlay(); });
  });

  // ── Footer year ────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
