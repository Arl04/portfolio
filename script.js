/* ============================================================
   script.js — Portfolio Arl04
   Typewriter · Scroll animations · Hamburger · Form validation
   ============================================================ */

/* ── Helpers ─────────────────────────────────────────────────── */

/** Return an element by CSS selector */
const $ = (sel) => document.querySelector(sel);
/** Return a NodeList by CSS selector */
const $$ = (sel) => document.querySelectorAll(sel);

/* ── 1. Menu Hamburger (mobile) ──────────────────────────────── */
(function initHamburger() {
  const btn   = $('#hamburger');
  const links = $('#nav-links');

  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Fermer le menu quand on clique sur un lien
  links.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Fermer le menu quand on clique en dehors
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── 2. Typewriter (hero subtitle) ───────────────────────────── */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const roles = ['DevOps Engineer', 'Backend Developer', 'Cloud Infrastructure Expert', 'Fintech Specialist'];
  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  const typingSpeed   = 90;   // ms par caractère
  const deletingSpeed = 50;
  const pauseAfter    = 1800; // pause après avoir fini de taper
  const pauseBefore   = 400;  // pause avant de recommencer

  function type() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, pauseAfter);
        return;
      }
      setTimeout(type, typingSpeed);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        setTimeout(type, pauseBefore);
        return;
      }
      setTimeout(type, deletingSpeed);
    }
  }

  setTimeout(type, 800);
})();

/* ── 3. Intersection Observer — animations au scroll ─────────── */
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('.fade-in').forEach((el) => observer.observe(el));
})();

/* ── 4. Animation des barres de progression ──────────────────── */
(function initSkillBars() {
  const bars = $$('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width  = target.dataset.width || '0';
          // Petit délai pour que l'animation de fade-in finisse d'abord
          setTimeout(() => {
            target.style.width = `${width}%`;
          }, 200);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();

/* ── 5. Smooth scroll pour les liens d'ancre ─────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return; // liens placeholder

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = $('#navbar')?.offsetHeight ?? 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── 6. Active nav link selon la section visible ─────────────── */
(function initActiveNav() {
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');
  const navHeight = 64;

  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    const scrollY = window.scrollY + navHeight + 80;

    let currentId = sections[0].id;
    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ── 8. Calcul dynamique de l'âge ────────────────────────────── */
(function initAge() {
  const el = $('#age-display');
  if (!el) return;

  const birthDate = new Date(2001, 3, 4); // 04 Avril 2001
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  el.textContent = age;
})();
(function initContactForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const fields  = {
    name:    { el: $('#name'),    error: $('#name-error') },
    email:   { el: $('#email'),   error: $('#email-error') },
    subject: { el: $('#subject'), error: $('#subject-error') },
    message: { el: $('#message'), error: $('#message-error') },
  };
  const successMsg = $('#form-success');

  /** Valide un champ et retourne true si valide */
  function validateField(name, value) {
    const { error } = fields[name];
    let msg = '';

    if (!value.trim()) {
      msg = 'Ce champ est requis.';
    } else if (name === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) {
        msg = 'Veuillez entrer une adresse email valide.';
      }
    } else if (name === 'message' && value.trim().length < 10) {
      msg = 'Le message doit contenir au moins 10 caractères.';
    }

    if (error) error.textContent = msg;
    if (fields[name].el) {
      fields[name].el.classList.toggle('error', msg !== '');
    }
    return msg === '';
  }

  // Validation en temps réel (blur)
  Object.entries(fields).forEach(([name, { el }]) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(name, el.value));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        validateField(name, el.value);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.entries(fields).map(([name, { el }]) =>
      validateField(name, el ? el.value : '')
    );

    const allValid = results.every(Boolean);
    if (!allValid) return;

    // Simulation d'envoi (pas de backend réel)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    setTimeout(() => {
      if (successMsg) {
        successMsg.textContent = '✅ Message envoyé ! Je vous répondrai dans les plus brefs délais.';
      }
      form.reset();
      Object.values(fields).forEach(({ el, error }) => {
        if (el)    el.classList.remove('error');
        if (error) error.textContent = '';
      });
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Envoyer`;

      // Effacer le message de succès après 6 secondes
      setTimeout(() => {
        if (successMsg) successMsg.textContent = '';
      }, 6000);
    }, 1200);
  });
})();
