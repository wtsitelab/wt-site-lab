// ===== Barros Ribeiro Advocacia =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Insights (mock — futuro: blog dinâmico via CMS)
const insights = [
  { tag: 'LGPD', titulo: 'Sua empresa já tem um mapeamento de dados atualizado?', resumo: 'O primeiro passo para adequação à LGPD é saber quais dados você coleta e onde eles ficam armazenados.' },
  { tag: 'Societário', titulo: 'Acordo de sócios: o contrato que ninguém quer usar, mas todo mundo precisa', resumo: 'Um bom acordo de sócios evita que divergências pessoais virem disputas judiciais caras.' },
  { tag: 'Compliance', titulo: 'Due diligence: o que revisar antes de fechar uma parceria', resumo: 'Pequenas empresas também podem (e devem) fazer due diligence antes de grandes contratos.' },
];
const insightsGrid = document.getElementById('insightsGrid');
insights.forEach(item => {
  const card = document.createElement('article');
  card.className = 'insight-card';
  card.innerHTML = `
    <span class="insight-tag">${item.tag}</span>
    <h4>${item.titulo}</h4>
    <p>${item.resumo}</p>
  `;
  insightsGrid.appendChild(card);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.area-card, .team-card, .insight-card, .highlight-row');
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

// Contact form (demo — futuro: integração com e-mail/CRM)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Solicitação recebida! Retornamos em até 24h úteis. (formulário de demonstração)';
  form.reset();
});
