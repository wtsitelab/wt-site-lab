// ===== Chave Imóveis =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Imóveis (mock — futuro: integração com banco de dados)
const imoveis = [
  { nome: 'Apartamento Água Verde', tipo: 'comprar', emoji: '🏢', preco: 'R$ 620.000', desc: '2 quartos, 68m², 1 vaga', bg: 'linear-gradient(160deg, #16324F, #0D2038)' },
  { nome: 'Casa Santa Felicidade', tipo: 'comprar', emoji: '🏡', preco: 'R$ 890.000', desc: '3 quartos, 180m², quintal', bg: 'linear-gradient(160deg, #C1440E, #7A2A08)' },
  { nome: 'Studio Batel', tipo: 'alugar', emoji: '🏙️', preco: 'R$ 2.400/mês', desc: '1 quarto, 42m², mobiliado', bg: 'linear-gradient(160deg, #E06B34, #16324F)' },
  { nome: 'Cobertura Cabral', tipo: 'comprar', emoji: '🏘️', preco: 'R$ 1.450.000', desc: '4 quartos, 220m², vista panorâmica', bg: 'linear-gradient(160deg, #16324F, #C1440E)' },
  { nome: 'Apartamento Bigorrilho', tipo: 'alugar', emoji: '🏬', preco: 'R$ 3.100/mês', desc: '3 quartos, 95m², 2 vagas', bg: 'linear-gradient(160deg, #0D2038, #E06B34)' },
  { nome: 'Casa Boa Vista', tipo: 'alugar', emoji: '🏠', preco: 'R$ 2.800/mês', desc: '2 quartos, 110m², garagem', bg: 'linear-gradient(160deg, #7A2A08, #16324F)' },
];

const listingGrid = document.getElementById('listingGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderImoveis(filtro){
  listingGrid.innerHTML = '';
  const lista = filtro === 'todos' ? imoveis : imoveis.filter(i => i.tipo === filtro);
  lista.forEach(im => {
    const card = document.createElement('article');
    card.className = 'listing-card';
    card.innerHTML = `
      <div class="listing-visual" style="background:${im.bg}">
        <span>${im.emoji}</span>
        <span class="listing-tag">${im.tipo === 'comprar' ? 'À venda' : 'Aluguel'}</span>
      </div>
      <div class="listing-info">
        <h4>${im.nome}</h4>
        <p>${im.desc}</p>
        <span class="listing-price">${im.preco}</span>
      </div>
    `;
    listingGrid.appendChild(card);
  });
}
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderImoveis(btn.dataset.filter);
  });
});
renderImoveis('todos');

// Scroll reveal
const revealTargets = document.querySelectorAll('.listing-card, .step-item, .stat');
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
