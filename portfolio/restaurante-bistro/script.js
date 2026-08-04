// ===== Âmbar Bistrô =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Menu degustação (mock)
const tempos = [
  { titulo: 'Boas-vindas', desc: 'Aperitivo da casa e pão de fermentação natural' },
  { titulo: 'Do mar', desc: 'Ceviche de peixe branco, leite de tigre e milho torrado' },
  { titulo: 'Da horta', desc: 'Vegetais da estação, beurre blanc de ervas' },
  { titulo: 'Intermezzo', desc: 'Sorbet cítrico para limpar o paladar' },
  { titulo: 'Principal', desc: 'Short rib 48h, purê de mandioquinha e jus' },
  { titulo: 'Pré-sobremesa', desc: 'Queijos selecionados e mel de flor silvestre' },
  { titulo: 'Doce final', desc: 'Chocolate 70%, café e flor de sal' },
];
const tastingList = document.getElementById('tastingList');
tempos.forEach((t, i) => {
  const el = document.createElement('div');
  el.className = 'tasting-item';
  el.innerHTML = `
    <span class="tasting-num">0${i + 1}</span>
    <div class="tasting-info"><h4>${t.titulo}</h4><p>${t.desc}</p></div>
  `;
  tastingList.appendChild(el);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.tasting-item, .feature-row');
revealTargets.forEach(el => el.setAttribute('data-reveal',''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// Reservas (demo)
const form = document.getElementById('reservaForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Reserva solicitada! Nossa equipe confirma por telefone. (formulário de demonstração)';
  form.reset();
});
