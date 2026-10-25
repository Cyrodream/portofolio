const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Tahun otomatis
$('#year').textContent = new Date().getFullYear();

// Navigasi mobile
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Mode gelap/terang, tersimpan selama browser mendukung localStorage
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('fairuz-portfolio-theme');
if (savedTheme === 'light') document.body.classList.add('light-theme');
function updateThemeIcon() {
  themeToggle.textContent = document.body.classList.contains('light-theme') ? '☾' : '☼';
}
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  localStorage.setItem('fairuz-portfolio-theme', theme);
  updateThemeIcon();
});

// Efek mengetik di hero
const typingText = $('#typingText');
const roles = ['Web Developer', 'IT Enthusiast', 'Creative Coder'];
let roleIndex = 0, charIndex = 0, deleting = false;
function typeRole() {
  const role = roles[roleIndex];
  typingText.textContent = role.slice(0, charIndex);
  let delay = deleting ? 48 : 90;
  if (!deleting && charIndex === role.length) { deleting = true; delay = 1300; }
  else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
  else charIndex += deleting ? -1 : 1;
  setTimeout(typeRole, delay);
}
typeRole();

// Animasi elemen ketika masuk layar
const revealObserver = new IntersectionObserver(entries => {
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

// Filter kartu proyek
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
    card.hidden = !match;
    if (match) shown++;
  });
  projectEmpty.hidden = shown > 0;
}));

// Modal detail proyek
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
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$$('.project-open').forEach(button => button.addEventListener('click', () => {
  const data = projectDetails[button.dataset.project];
  $('#modalTitle').textContent = data.title;
  $('#modalDescription').textContent = data.description;
  $('#modalTags').replaceChildren(...data.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#modalClose').focus();
}));
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

// Progress bar, tombol kembali ke atas, dan nav aktif
const backToTop = $('#backToTop');
const scrollProgress = $('#scrollProgress');
function handleScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  backToTop.classList.toggle('visible', window.scrollY > 450);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const sections = $$('main section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));
