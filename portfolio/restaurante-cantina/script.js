// ===== Cantina da Nonna =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Cardápio (mock)
const cardapio = {
  entradas: [
    { nome: 'Bruschetta Clássica', desc: 'Pão italiano tostado, tomate confit e manjericão', preco: 'R$ 28' },
    { nome: 'Carpaccio da Nonna', desc: 'Finas fatias de alcatra, alcaparras e parmesão', preco: 'R$ 42' },
    { nome: 'Burrata Fresca', desc: 'Com tomates assados e pesto de manjericão', preco: 'R$ 48' },
  ],
  massas: [
    { nome: 'Tagliatelle ao Ragu', desc: 'Massa fresca com molho de carne cozido por 6 horas', preco: 'R$ 62' },
    { nome: 'Ravioli de Ricota e Espinafre', desc: 'Recheio artesanal, manteiga e sálvia', preco: 'R$ 58' },
    { nome: 'Spaghetti alle Vongole', desc: 'Vôngoles frescas, alho e vinho branco', preco: 'R$ 68' },
  ],
  pizzas: [
    { nome: 'Margherita', desc: 'Molho de tomate, mussarela de búfala e manjericão', preco: 'R$ 54' },
    { nome: 'Quattro Formaggi', desc: 'Mussarela, gorgonzola, parmesão e provolone', preco: 'R$ 62' },
    { nome: 'Diavola', desc: 'Calabresa artesanal e pimenta calabresa', preco: 'R$ 58' },
  ],
  sobremesas: [
    { nome: 'Tiramisù da Nonna', desc: 'Receita original de família, feita todos os dias', preco: 'R$ 26' },
    { nome: 'Panna Cotta', desc: 'Com calda de frutas vermelhas', preco: 'R$ 24' },
    { nome: 'Cannoli Siciliano', desc: 'Recheio de ricota doce e gotas de chocolate', preco: 'R$ 22' },
  ],
};
const tabs = document.querySelectorAll('.tab-btn');
const menuList = document.getElementById('menuList');
function renderMenu(cat){
  menuList.innerHTML = '';
  cardapio[cat].forEach(item => {
    const el = document.createElement('div');
    el.className = 'menu-item';
    el.innerHTML = `<div><h4>${item.nome}</h4><p>${item.desc}</p></div><span class="menu-price">${item.preco}</span>`;
    menuList.appendChild(el);
  });
}
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderMenu(tab.dataset.tab);
  });
});
renderMenu('entradas');

// Galeria (ilustrativa)
const galeria = [
  { emoji:'🍝', bg:'linear-gradient(160deg,#F3E9D8,#A6423A)' },
  { emoji:'🍕', bg:'linear-gradient(160deg,#E8C468,#7E2F29)' },
  { emoji:'🍷', bg:'linear-gradient(160deg,#A6423A,#5C3A21)' },
  { emoji:'🧀', bg:'linear-gradient(160deg,#F3E9D8,#6B7A4E)' },
  { emoji:'🥖', bg:'linear-gradient(160deg,#E8C468,#5C3A21)' },
  { emoji:'🍰', bg:'linear-gradient(160deg,#F3E9D8,#7E2F29)' },
  { emoji:'🫒', bg:'linear-gradient(160deg,#6B7A4E,#5C3A21)' },
  { emoji:'🍅', bg:'linear-gradient(160deg,#A6423A,#E8C468)' },
];
const galleryGrid = document.getElementById('galleryGrid');
galeria.forEach(item => {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.style.background = item.bg;
  div.innerHTML = `<span>${item.emoji}</span>`;
  galleryGrid.appendChild(div);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.menu-item, .gallery-item');
revealTargets.forEach(el => el.setAttribute('data-reveal',''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));

// Reservas (demo)
const form = document.getElementById('reservaForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Reserva solicitada! Confirmamos por telefone em breve. (formulário de demonstração)';
  form.reset();
});
