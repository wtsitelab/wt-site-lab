// ===== TorqueMax Performance =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Builds (mock)
const builds = [
  { nome: 'Civic Turbo Stage 2', emoji: '🏎️', bg: 'linear-gradient(160deg, #E10600, #0D0D0D)' },
  { nome: 'Golf GTI Stage 3', emoji: '🚗', bg: 'linear-gradient(160deg, #1A1A1A, #E10600)' },
  { nome: 'HB20 Turbo Stage 1', emoji: '🚙', bg: 'linear-gradient(160deg, #A80400, #1A1A1A)' },
];
const buildGrid = document.getElementById('buildGrid');
builds.forEach(b => {
  const item = document.createElement('div');
  item.className = 'build-item';
  item.style.background = b.bg;
  item.innerHTML = `<span class="build-emoji">${b.emoji}</span><span class="build-name">${b.nome}</span>`;
  buildGrid.appendChild(item);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.service-card, .stage-card, .build-item');
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// Orçamento (demo)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Recebemos sua solicitação! Vamos te chamar para falar de potência. (formulário de demonstração)';
  form.reset();
});
