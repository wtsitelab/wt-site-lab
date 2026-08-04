// ===== Case Store =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// ===== Customizador =====
const WHATSAPP_NUMBER = '5541998033898'; // mesmo número do site principal (WT Site Lab)

const phoneMock = document.getElementById('phoneMock');
const phoneMockLg = document.getElementById('phoneMockLg');
const modelChips = document.querySelectorAll('#modelChips .chip');
const modeButtons = document.querySelectorAll('#modeRow .mode-btn');
const colorGroup = document.getElementById('colorGroup');
const photoGroup = document.getElementById('photoGroup');
const colorChips = document.querySelectorAll('#colorChips .color-dot');
const customPrice = document.getElementById('customPrice');
const previewCaption = document.getElementById('previewCaption');
const photoInput = document.getElementById('photoInput');
const photoUploadLabel = document.getElementById('photoUploadLabel');
const photoUploadText = document.getElementById('photoUploadText');
const photoThumbRow = document.getElementById('photoThumbRow');
const photoThumb = document.getElementById('photoThumb');
const photoRemove = document.getElementById('photoRemove');
const whatsappCTA = document.getElementById('whatsappCTA');

const precosPorModelo = { iPhone: 69.9, Samsung: 59.9, Motorola: 49.9, Xiaomi: 54.9 };
const nomesDasCores = {
  '#D4AF37': 'Dourado',
  '#0B0B0D': 'Preto Fosco',
  '#F5F0E6': 'Branco Pérola',
  '#7A1F2B': 'Bordô',
  '#C0C0C0': 'Prata',
};

const state = {
  modelo: 'iPhone',
  modo: 'color', // 'color' | 'photo'
  cor: '#D4AF37',
  fotoDataUrl: null,
};

function shade(hex, percent){
  const num = parseInt(hex.replace('#',''), 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00FF) + Math.round(2.55 * percent);
  let b = (num & 0x0000FF) + Math.round(2.55 * percent);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function renderPreview(){
  [phoneMock, phoneMockLg].forEach(el => {
    if (!el) return;
    if (state.modo === 'photo' && state.fotoDataUrl){
      el.style.backgroundImage = `url(${state.fotoDataUrl})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.classList.add('has-photo');
    } else {
      el.style.backgroundImage = 'none';
      el.classList.remove('has-photo');
      const hex = state.modo === 'photo' ? '#D4AF37' : state.cor;
      el.style.background = `linear-gradient(155deg, ${hex}, ${shade(hex, -35)})`;
    }
  });
  previewCaption.textContent = `Prévia · ${state.modelo}`;
  updateWhatsAppLink();
}

function updateWhatsAppLink(){
  const preco = customPrice.textContent;
  let detalhe;
  if (state.modo === 'photo' && state.fotoDataUrl){
    detalhe = 'personalizada com uma foto minha que já escolhi';
  } else if (state.modo === 'photo'){
    detalhe = 'personalizada com foto (ainda vou escolher a imagem)';
  } else {
    const nomeCor = nomesDasCores[state.cor] || 'personalizada';
    detalhe = `na cor ${nomeCor}`;
  }
  const texto = `Olá! Personalizei uma capinha para ${state.modelo} ${detalhe}. Preço estimado: ${preco}. Gostaria de fechar esse pedido!`;
  whatsappCTA.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

// Modelo
modelChips.forEach(chip => {
  chip.addEventListener('click', () => {
    modelChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.modelo = chip.dataset.model;
    const preco = precosPorModelo[state.modelo];
    customPrice.textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;
    renderPreview();
  });
});

// Modo: cor sólida vs foto
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.modo = btn.dataset.mode;
    colorGroup.hidden = state.modo !== 'color';
    photoGroup.hidden = state.modo !== 'photo';
    renderPreview();
  });
});

// Cor da capa
colorChips.forEach(dot => {
  dot.addEventListener('click', () => {
    colorChips.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    state.cor = dot.dataset.color;
    renderPreview();
  });
});

// Upload de foto
photoInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.fotoDataUrl = reader.result;
    photoThumb.src = state.fotoDataUrl;
    photoThumbRow.hidden = false;
    photoUploadText.innerHTML = 'Foto adicionada ✓ <br><strong>veja a prévia ao lado</strong>';
    renderPreview();
  };
  reader.readAsDataURL(file);
});

photoRemove.addEventListener('click', () => {
  state.fotoDataUrl = null;
  photoInput.value = '';
  photoThumbRow.hidden = true;
  photoUploadText.innerHTML = 'Clique para enviar uma foto <br><strong>e veja como fica na capinha</strong>';
  renderPreview();
});

// Estado inicial
renderPreview();

// ===== Produtos (mock — futuro: catálogo com banco de dados) =====
const produtos = [
  { nome: 'Capa Fosca Premium', modelo: 'iPhone', preco: 'R$ 69,90', emoji: '📱', cor: '#D4AF37' },
  { nome: 'Capa Transparente Anti-impacto', modelo: 'iPhone', preco: 'R$ 49,90', emoji: '📱', cor: '#C0C0C0' },
  { nome: 'Capa Personalizada com Foto', modelo: 'iPhone', preco: 'R$ 79,90', emoji: '🖼️', cor: '#7A1F2B' },
  { nome: 'Capa Aveludada Samsung', modelo: 'Samsung', preco: 'R$ 59,90', emoji: '📱', cor: '#0B0B0D' },
  { nome: 'Capa Carteira Samsung', modelo: 'Samsung', preco: 'R$ 64,90', emoji: '📱', cor: '#D4AF37' },
  { nome: 'Capa Anti-choque Motorola', modelo: 'Motorola', preco: 'R$ 44,90', emoji: '📱', cor: '#C0C0C0' },
  { nome: 'Capa Slim Motorola', modelo: 'Motorola', preco: 'R$ 39,90', emoji: '📱', cor: '#0B0B0D' },
  { nome: 'Capa Personalizada com Foto', modelo: 'Xiaomi', preco: 'R$ 49,90', emoji: '🖼️', cor: '#7A1F2B' },
];

const productGrid = document.getElementById('productGrid');
const filterStatus = document.getElementById('filterStatus');
const brandCards = document.querySelectorAll('.brand-card');

function renderProducts(filter){
  productGrid.innerHTML = '';
  const list = filter ? produtos.filter(p => p.modelo === filter) : produtos;
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-visual" style="background: linear-gradient(155deg, ${p.cor}, #0B0B0D)"><span>${p.emoji}</span></div>
      <span class="product-tag">${p.modelo}</span>
      <h4>${p.nome}</h4>
      <div class="product-foot">
        <span class="product-price">${p.preco}</span>
        <button class="add-btn" aria-label="Adicionar ao carrinho">+</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
  filterStatus.textContent = filter ? `Mostrando ${list.length} produtos para ${filter}` : 'Mostrando todos os modelos';
}
renderProducts(null);

brandCards.forEach(card => {
  card.addEventListener('click', () => {
    const already = card.classList.contains('active');
    brandCards.forEach(c => c.classList.remove('active'));
    if (already){
      renderProducts(null);
    } else {
      card.classList.add('active');
      renderProducts(card.dataset.filter);
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Avaliações (mock) =====
const avaliacoes = [
  { nome: 'Bruna T.', texto: 'Capinha chegou rapidinho e é ainda mais bonita pessoalmente. Já comprei outra!', estrelas: 5 },
  { nome: 'Diego M.', texto: 'Caiu meu celular de uma altura boa e não arranhou nada. Recomendo muito.', estrelas: 5 },
  { nome: 'Larissa F.', texto: 'Fiz uma com a foto do meu cachorro, ficou perfeita! Qualidade ótima.', estrelas: 5 },
];
const reviewsGrid = document.getElementById('reviewsGrid');
avaliacoes.forEach(r => {
  const card = document.createElement('article');
  card.className = 'review-card';
  card.innerHTML = `
    <div class="review-stars">${'★'.repeat(r.estrelas)}${'☆'.repeat(5 - r.estrelas)}</div>
    <p>"${r.texto}"</p>
    <span class="review-author">${r.nome}</span>
  `;
  reviewsGrid.appendChild(card);
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.product-card, .review-card, .brand-card, .promo-card');
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

// Contact form (demo — futuro: integração com backend/CRM)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Mensagem enviada! Nosso time responde em breve. (formulário de demonstração)';
  form.reset();
});
