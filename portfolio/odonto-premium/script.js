// ===== OrtoDental Curitiba =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Tratamentos (tabs)
const tratamentos = {
  alinhadores: {
    titulo: 'Alinhadores Invisíveis',
    desc: 'Placas transparentes, praticamente imperceptíveis, trocadas a cada 1-2 semanas conforme o plano digital.',
    itens: ['Removível para comer e higienizar', 'Sem os desconfortos do aparelho fixo', 'Simulação do resultado antes de começar', 'Ideal para quem precisa de discrição no trabalho'],
  },
  fixo: {
    titulo: 'Aparelho Fixo',
    desc: 'Bráquetes metálicos ou estéticos, com planejamento guiado por escaneamento 3D.',
    itens: ['Indicado para casos mais complexos', 'Acompanhamento mensal com ajustes precisos', 'Opção estética (bráquetes discretos)', 'Manutenção mais acessível'],
  },
  infantil: {
    titulo: 'Ortodontia Infantil',
    desc: 'Acompanhamento do crescimento e intervenção no momento certo, evitando problemas maiores no futuro.',
    itens: ['Avaliação recomendada a partir dos 7 anos', 'Aparelhos expansores quando necessário', 'Consultório preparado para o público infantil', 'Acompanhamento até a fase adulta, se preciso'],
  },
};
const tabs = document.querySelectorAll('.ttab-btn');
const panel = document.getElementById('treatmentPanel');
function renderTreatment(key){
  const t = tratamentos[key];
  panel.innerHTML = `
    <h3>${t.titulo}</h3>
    <p>${t.desc}</p>
    <ul>${t.itens.map(i => `<li>${i}</li>`).join('')}</ul>
  `;
}
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderTreatment(tab.dataset.tab);
  });
});
renderTreatment('alinhadores');

// Scroll reveal
const revealTargets = document.querySelectorAll('.tech-card, .journey-step');
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// Agendamento (demo)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Avaliação solicitada! Nossa equipe confirma o horário. (formulário de demonstração)';
  form.reset();
});
