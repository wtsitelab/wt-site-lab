// ===== Doce Encanto =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Cardápio (mock data — futuro: cadastro de produtos via painel admin)
const cardapio = {
  bolos: [
    { nome: 'Bolo de Ninho com Morango', desc: 'Massa fofinha, recheio de leite ninho e morangos frescos', preco: 'R$ 95 (kg)' },
    { nome: 'Bolo Red Velvet', desc: 'Clássico americano com cream cheese', preco: 'R$ 110 (kg)' },
    { nome: 'Bolo de Chocolate Belga', desc: 'Ganache de chocolate 70% cacau', preco: 'R$ 105 (kg)' },
    { nome: 'Bolo Naked Cake de Frutas', desc: 'Frutas da estação e chantininho', preco: 'R$ 120 (kg)' },
  ],
  tortas: [
    { nome: 'Torta de Limão', desc: 'Base crocante com creme de limão siciliano', preco: 'R$ 85 (kg)' },
    { nome: 'Torta Holandesa', desc: 'Camadas de chocolate, biscoito e creme', preco: 'R$ 90 (kg)' },
    { nome: 'Torta Salgada de Frango', desc: 'Massa amanteigada com recheio cremoso', preco: 'R$ 70 (kg)' },
  ],
  doces: [
    { nome: 'Brigadeiro Gourmet', desc: 'Chocolate belga, caixa com 12 unidades', preco: 'R$ 42' },
    { nome: 'Beijinho de Coco', desc: 'Coco fresco ralado na hora, 12 unidades', preco: 'R$ 38' },
    { nome: 'Mesa de Doces Finos', desc: 'Sortimento para 30 pessoas', preco: 'R$ 320' },
  ],
  salgados: [
    { nome: 'Coxinha de Frango', desc: 'Massa crocante, recheio cremoso', preco: 'R$ 4,50 un.' },
    { nome: 'Quiche de Alho-Poró', desc: 'Individual, ideal para eventos', preco: 'R$ 9 un.' },
    { nome: 'Mini Empadão', desc: 'Frango ou palmito', preco: 'R$ 6 un.' },
  ],
  bebidas: [
    { nome: 'Suco Detox', desc: 'Couve, limão e gengibre — 500ml', preco: 'R$ 14' },
    { nome: 'Chá Gelado de Frutas Vermelhas', desc: 'Feito na hora, sem açúcar refinado', preco: 'R$ 13' },
    { nome: 'Limonada Rosa', desc: 'Com toque de hibisco', preco: 'R$ 12' },
  ],
};

const tabs = document.querySelectorAll('.tab-btn');
const menuList = document.getElementById('menuList');

function renderMenu(cat){
  menuList.innerHTML = '';
  cardapio[cat].forEach(item => {
    const el = document.createElement('div');
    el.className = 'menu-item';
    el.innerHTML = `
      <div>
        <h4>${item.nome}</h4>
        <p>${item.desc}</p>
      </div>
      <span class="menu-price">${item.preco}</span>
    `;
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
renderMenu('bolos');

// Galeria (ilustrativa — futuro: fotos reais via CMS)
const galeria = [
  { emoji: '🎂', bg: 'linear-gradient(160deg,#F8E1E7,#D4A574)' },
  { emoji: '🧁', bg: 'linear-gradient(160deg,#F3C9D4,#8A6047)' },
  { emoji: '🍓', bg: 'linear-gradient(160deg,#D4A574,#F8E1E7)' },
  { emoji: '🥧', bg: 'linear-gradient(160deg,#8A6047,#F3C9D4)' },
  { emoji: '🍮', bg: 'linear-gradient(160deg,#F8E1E7,#6B4226)' },
  { emoji: '🍰', bg: 'linear-gradient(160deg,#D4A574,#6B4226)' },
  { emoji: '🍪', bg: 'linear-gradient(160deg,#F3C9D4,#D4A574)' },
  { emoji: '🧇', bg: 'linear-gradient(160deg,#6B4226,#F8E1E7)' },
];
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

galeria.forEach(item => {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.style.background = item.bg;
  div.innerHTML = `<span>${item.emoji}</span>`;
  div.addEventListener('click', () => {
    lightboxContent.style.background = item.bg;
    lightboxContent.innerHTML = `<span>${item.emoji}</span>`;
    lightbox.classList.add('open');
  });
  galleryGrid.appendChild(div);
});
lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

// Scroll reveal
const revealTargets = document.querySelectorAll('.category-card, .gallery-item, .menu-item');
revealTargets.forEach(el => el.setAttribute('data-reveal',''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));

// Contact form (demo — futuro: integração com WhatsApp API/backend)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Pedido recebido! Em breve enviamos opções de sabor e orçamento. (formulário de demonstração)';
  form.reset();
});
