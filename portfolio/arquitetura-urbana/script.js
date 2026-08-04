// ===== Urbana Arquitetura & Interiores =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Antes & Depois (mock)
const transformacoes = [
  { nome: 'Sala Vila Izabel', antesEmoji: '📦', depoisEmoji: '🛋️', bgAntes: 'linear-gradient(160deg, #C4B294, #7A7166)', bgDepois: 'linear-gradient(160deg, #8A9A7E, #4F5A46)' },
  { nome: 'Cozinha Batel', antesEmoji: '🧱', depoisEmoji: '🍳', bgAntes: 'linear-gradient(160deg, #7A7166, #362E26)', bgDepois: 'linear-gradient(160deg, #B5563C, #6E3423)' },
  { nome: 'Escritório Compartilhado', antesEmoji: '🪑', depoisEmoji: '💼', bgAntes: 'linear-gradient(160deg, #D9CBB5, #A8987C)', bgDepois: 'linear-gradient(160deg, #362E26, #7A7166)' },
];
const transformGrid = document.getElementById('transformGrid');
transformacoes.forEach(t => {
  const card = document.createElement('div');
  card.className = 'transform-card';
  card.innerHTML = `
    <div class="transform-before" style="background:${t.bgAntes}">
      <span class="transform-label">Antes</span>
      <span class="transform-emoji">${t.antesEmoji}</span>
      <span class="transform-name">${t.nome}</span>
    </div>
    <div class="transform-after" style="background:${t.bgDepois}">
      <span class="transform-label">Depois</span>
      <span class="transform-emoji">${t.depoisEmoji}</span>
      <span class="transform-name">${t.nome}</span>
    </div>
  `;
  transformGrid.appendChild(card);
});

// Depoimentos (mock)
const depoimentos = [
  { texto: 'A equipe entendeu exatamente o clima que a gente queria pra sala. Ficou muito melhor do que eu imaginei.', autor: 'Camila R.' },
  { texto: 'Reformamos a cozinha em 3 semanas, sem virar a casa de cabeça pra baixo. Organização impecável.', autor: 'Eduardo P.' },
  { texto: 'Contratei só a consultoria de decoração e já resolveu meu problema de espaço no escritório.', autor: 'Marina T.' },
];
const testimonialGrid = document.getElementById('testimonialGrid');
depoimentos.forEach(d => {
  const card = document.createElement('article');
  card.className = 'testimonial-card';
  card.innerHTML = `<p>"${d.texto}"</p><span class="testimonial-author">${d.autor}</span>`;
  testimonialGrid.appendChild(card);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.transform-card, .service-card, .testimonial-card');
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));

// Contato (demo)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Mensagem recebida! Retornamos em breve. (formulário de demonstração)';
  form.reset();
});
