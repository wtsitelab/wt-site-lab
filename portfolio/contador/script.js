// ===== Contabilidade Prime =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Deadline panel (mock data — future: fetch from API/DB)
const deadlines = [
  { label: 'DAS — MEI', date: addDays(6), status: 'soon' },
  { label: 'Simples Nacional (PGDAS)', date: addDays(14), status: 'ok' },
  { label: 'IRPF — 3ª parcela', date: addDays(22), status: 'ok' },
];
function addDays(n){ const d = new Date(); d.setDate(d.getDate() + n); return d; }

const list = document.getElementById('deadlineList');
deadlines.forEach(item => {
  const li = document.createElement('li');
  const tagClass = item.status === 'soon' ? 'tag-soon' : 'tag-ok';
  const tagText = item.status === 'soon' ? 'Vence em breve' : 'No prazo';
  li.innerHTML = `<span>${item.label}</span><span class="tag ${tagClass}">${tagText}</span>`;
  list.appendChild(li);
});

// Countdown to nearest deadline
const nearest = deadlines.reduce((a,b) => a.date < b.date ? a : b);
const countdownEl = document.getElementById('countdown');
function tick(){
  const now = new Date();
  let diff = nearest.date - now;
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  countdownEl.textContent = `${d}d ${h}h ${m}m`;
}
tick();
setInterval(tick, 60000);

// Scroll reveal
const revealTargets = document.querySelectorAll('.service-card, .team-card, .stat, .compare-col');
revealTargets.forEach(el => el.setAttribute('data-reveal',''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// Contact form (static demo — future: POST to backend/Supabase)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Recebemos sua solicitação! Em breve nosso time entra em contato. (formulário de demonstração)';
  form.reset();
});
