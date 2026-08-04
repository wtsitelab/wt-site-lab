// ===== Lar Imóveis =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Imóveis selecionados (mock)
const imoveis = [
  { nome: 'Casa Alto da Glória', preco: 'R$ 780.000', desc: '3 quartos, jardim amplo', emoji: '🏡', bg: 'linear-gradient(160deg, #C98074, #6B6660)' },
  { nome: 'Apartamento Juvevê', preco: 'R$ 540.000', desc: '2 quartos, 72m², reformado', emoji: '🏢', bg: 'linear-gradient(160deg, #E0A99E, #3A322D)' },
  { nome: 'Cobertura Água Verde', preco: 'R$ 1.100.000', desc: '3 suítes, terraço gourmet', emoji: '🏙️', bg: 'linear-gradient(160deg, #6B6660, #C98074)' },
];
const listingGrid = document.getElementById('listingGrid');
imoveis.forEach(im => {
  const card = document.createElement('article');
  card.className = 'listing-card';
  card.innerHTML = `
    <div class="listing-visual" style="background:${im.bg}"><span>${im.emoji}</span></div>
    <div class="listing-info">
      <h4>${im.nome}</h4>
      <p>${im.desc}</p>
      <span class="listing-price">${im.preco}</span>
    </div>
  `;
  listingGrid.appendChild(card);
});

// Depoimentos (mock)
const depoimentos = [
  { texto: 'A Beatriz foi super honesta sobre um apartamento que eu tinha me apaixonado, mas tinha um problema estrutural. Isso me poupou uma dor de cabeça enorme.', autor: 'Felipe M.' },
  { texto: 'Vendemos a casa da minha mãe com ela cuidando de tudo, inclusive da parte emocional do processo. Muito além do trabalho de corretora.', autor: 'Juliana K.' },
  { texto: 'Procurava um apê pra alugar há meses sozinho. Com ela, fechei em duas semanas, no bairro certo e no valor que eu podia pagar.', autor: 'Thiago A.' },
];
const testimonialGrid = document.getElementById('testimonialGrid');
depoimentos.forEach(d => {
  const card = document.createElement('article');
  card.className = 'testimonial-card';
  card.innerHTML = `<div class="testimonial-stars">★★★★★</div><p>"${d.texto}"</p><span class="testimonial-author">${d.autor}</span>`;
  testimonialGrid.appendChild(card);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.listing-card, .testimonial-card');
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// Contato (demo)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Mensagem recebida! Retorno pessoalmente em breve. (formulário de demonstração)';
  form.reset();
});
