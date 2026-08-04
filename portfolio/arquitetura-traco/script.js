// ===== Traço Arquitetura =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Projetos (mock — futuro: galeria real de fotos por projeto)
const projetos = [
  { nome: 'Casa Jacarandá', categoria: 'residencial', emoji: '🏡', bg: 'linear-gradient(160deg, #A85C32, #141414)' },
  { nome: 'Edifício Aurora', categoria: 'comercial', emoji: '🏢', bg: 'linear-gradient(160deg, #6B6560, #141414)' },
  { nome: 'Apartamento Batel', categoria: 'interiores', emoji: '🛋️', bg: 'linear-gradient(160deg, #C97F52, #141414)' },
  { nome: 'Casa Vento Sul', categoria: 'residencial', emoji: '🏠', bg: 'linear-gradient(160deg, #141414, #A85C32)' },
  { nome: 'Studio Criativo', categoria: 'comercial', emoji: '🏛️', bg: 'linear-gradient(160deg, #A85C32, #6B6560)' },
  { nome: 'Cobertura Água Verde', categoria: 'interiores', emoji: '🪑', bg: 'linear-gradient(160deg, #141414, #C97F52)' },
];

const projectGrid = document.getElementById('projectGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderProjetos(filtro){
  projectGrid.innerHTML = '';
  const lista = filtro === 'todos' ? projetos : projetos.filter(p => p.categoria === filtro);
  lista.forEach(p => {
    const item = document.createElement('div');
    item.className = 'project-item';
    item.innerHTML = `
      <div class="project-item-inner" style="background:${p.bg}">
        <span class="project-emoji">${p.emoji}</span>
        <span class="project-name">${p.nome}</span>
      </div>
      <span class="project-tag">${p.categoria}</span>
    `;
    projectGrid.appendChild(item);
  });
}
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjetos(btn.dataset.filter);
  });
});
renderProjetos('todos');

// Scroll reveal
const revealTargets = document.querySelectorAll('.project-item, .service-row, .stat');
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
  note.textContent = 'Mensagem recebida! Retornamos em até 2 dias úteis. (formulário de demonstração)';
  form.reset();
});
