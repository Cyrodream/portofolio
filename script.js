/* ============================================================
   PORTFOLIO FAIRUZ AZZAHRAN — MAIN SCRIPT
   ============================================================ */

const $  = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- SAFE STORAGE ---------- */
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch {} }
};

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  const preloader = $('#preloader');
  if (!preloader) return;
  setTimeout(() => preloader.classList.add('hidden'), 700);
});

/* ---------- TAHUN OTOMATIS ---------- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- THEME ---------- */
const themeToggle = $('#themeToggle');
if (storage.get('fairuz-portfolio-theme') === 'light') {
  document.body.classList.add('light-theme');
}
function updateThemeIcon() {
  if (!themeToggle) return;
  themeToggle.textContent = document.body.classList.contains('light-theme') ? '☾' : '☼';
}
updateThemeIcon();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  storage.set('fairuz-portfolio-theme', theme);
  updateThemeIcon();
});

/* ---------- NAV MOBILE ---------- */
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('click', (e) => {
  if (!navLinks?.classList.contains('open')) return;
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- CUSTOM CURSOR ---------- */
const cursorDot = $('#cursorDot');
const cursorRing = $('#cursorRing');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && cursorDot && cursorRing && !prefersReducedMotion) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverables = 'a, button, input, textarea, .tilt, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) cursorRing.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) cursorRing.classList.remove('hover');
  });
}

/* ---------- BACKGROUND PARTICLES ---------- */
(function initParticles() {
  const canvas = $('#bgCanvas');
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height, particles = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 26000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.55)';
      ctx.fill();
    }

    // connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 15000) {
          const alpha = (1 - dist2 / 15000) * 0.28;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(85, 214, 190, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      // mouse connection
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 22000) {
        const alpha = (1 - dist2 / 22000) * 0.35;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  draw();
})();

/* ---------- TYPING EFFECT ---------- */
const typingText = $('#typingText');
if (typingText) {
  const roles = ['Web Developer', 'IT Enthusiast', 'Creative Coder'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  (function typeRole() {
    const role = roles[roleIndex];
    typingText.textContent = role.slice(0, charIndex);
    let delay = deleting ? 48 : 90;
    if (!deleting && charIndex === role.length) { deleting = true; delay = 1300; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
    else charIndex += deleting ? -1 : 1;
    setTimeout(typeRole, delay);
  })();
}

/* ---------- REVEAL ON SCROLL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(el);
});

/* ---------- SKILL BARS ANIMATE ---------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
$$('[data-skill]').forEach(el => skillObserver.observe(el));

/* ---------- COUNTERS ---------- */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
$$('[data-count]').forEach(el => counterObserver.observe(el));

/* ---------- PROJECT FILTER ---------- */
const filterButtons = $$('.filter-btn');
const projectCards = $$('.project-card');
const projectEmpty = $('#projectEmpty');

filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  let shown = 0;
  projectCards.forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    if (match) {
      card.hidden = false;
      card.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 380, easing: 'ease-out' }
      );
      shown++;
    } else {
      card.hidden = true;
    }
  });
  if (projectEmpty) projectEmpty.hidden = shown > 0;
}));

/* ---------- MODAL ---------- */
const projectDetails = {
  portfolio: {
    title: 'Personal Portfolio',
    description: 'Website personal untuk memperkenalkan diri, menampilkan keahlian, memamerkan proyek, dan menyediakan cara bagi pengunjung untuk menghubungi kamu. Kembangkan dengan data dan tautan proyek asli.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI']
  },
  taskflow: {
    title: 'TaskFlow App',
    description: 'Aplikasi pengelola tugas. Tantangan lanjutan: tambahkan fitur menambah, menyelesaikan, menghapus, dan menyimpan tugas dengan localStorage agar data tetap ada setelah halaman dimuat ulang.',
    tags: ['DOM Manipulation', 'LocalStorage', 'CRUD']
  },
  weather: {
    title: 'Weather Dashboard',
    description: 'Dashboard untuk menampilkan informasi cuaca berdasarkan kota. Untuk versi nyata, hubungkan ke layanan API cuaca, tangani loading dan error, serta simpan API key dengan aman di sisi server bila diperlukan.',
    tags: ['Fetch API', 'Async/Await', 'API']
  }
};

const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDescription');
const modalTags = $('#modalTags');
const modalClose = $('#modalClose');
let lastFocused = null;

function openModal(data) {
  if (!modal || !data) return;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.description;
  modalTags.replaceChildren(
    ...data.tags.map(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    })
  );
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lastFocused = document.activeElement;
  modalClose?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocused?.focus?.();
}

$$('.project-open').forEach(button => {
  button.addEventListener('click', () => {
    const data = projectDetails[button.dataset.project];
    if (data) openModal(data);
  });
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  // simple focus trap
  if (e.key === 'Tab' && modal?.classList.contains('open')) {
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
});

/* ---------- SCROLL PROGRESS + BACK TO TOP ---------- */
const backToTop = $('#backToTop');
const scrollProgress = $('#scrollProgress');
const ringProgress = $('#ringProgress');
const RING_CIRCUMFERENCE = 2 * Math.PI * 16; // r = 16

if (ringProgress) {
  ringProgress.style.strokeDasharray = RING_CIRCUMFERENCE;
  ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;
}

let ticking = false;
function handleScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;

  if (scrollProgress) scrollProgress.style.width = `${ratio * 100}%`;
  backToTop?.classList.toggle('visible', window.scrollY > 450);

  if (ringProgress) {
    ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - ratio);
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });
handleScroll();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- ACTIVE NAV LINK ---------- */
const sections = $$('main section[id]');
if (sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.nav-link').forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        );
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => navObserver.observe(section));
}

/* ---------- TILT EFFECT ---------- */
if (finePointer && !prefersReducedMotion) {
  $$('.tilt').forEach(card => {
    let rafId = null;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-5px)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = '';
    });
  });
}

/* ---------- MAGNETIC BUTTONS ---------- */
if (finePointer && !prefersReducedMotion) {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ---------- CONTACT FORM ---------- */
const contactForm = $('#contactForm');
const toast = $('#toast');
let toastTimer = null;

function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();

  if (!name || !email || !message) {
    showToast('Mohon isi semua kolom ya 🙏', 'error');
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    showToast('Format email tidak valid', 'error');
    return;
  }

  const subject = encodeURIComponent(`Kolaborasi dari ${name}`);
  const body = encodeURIComponent(`Halo Fairuz,\n\n${message}\n\n— ${name}\n${email}`);
  const mailtoUrl = `mailto:fairuzazzahran86@gmail.com?subject=${subject}&body=${body}`;

  window.location.href = mailtoUrl;
  showToast('Membuka aplikasi email kamu...', 'success');
  contactForm.reset();
});

/* ---------- PARALLAX HERO (SUBTLE) ---------- */
if (finePointer && !prefersReducedMotion) {
  const heroVisual = $('.hero-visual');
  const codeCard = $('#codeCard');
  if (heroVisual && codeCard) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      codeCard.style.transform = `rotate(${-2 + x * 3}deg) translate(${x * 8}px, ${y * 8}px)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      codeCard.style.transform = '';
    });
  }
}

console.log('%c✨ Fairuz Azzahran Portfolio', 'color:#a78bfa;font-size:14px;font-weight:bold;');
console.log('%cTerima kasih sudah mampir! 🚀', 'color:#55d6be;font-size:12px;');