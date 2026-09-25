// Case Store — personalizador, catálogo com filtros e carrinho de demonstração
// (o pedido é montado como mensagem de WhatsApp).
(function () {
  'use strict';
  const WHATSAPP = '5541988363816'; // mesmo número do site principal (WT Site Lab)
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const FRETE_GRATIS = 99;

  // ---------- catálogo ----------
  const PRODUTOS = [
    { id: 1, nome: 'Silicone Soft Touch', tipo: 'silicone', marcas: ['iPhone', 'Samsung', 'Motorola', 'Xiaomi'], preco: 49.9, de: null, classe: 'c-rosa', nota: 4.9, av: 612, selo: 'Mais vendida' },
    { id: 2, nome: 'Anti-impacto Military', tipo: 'anti-impacto', marcas: ['iPhone', 'Samsung', 'Motorola'], preco: 79.9, de: 99.9, classe: 'c-grafite c-robusta', nota: 4.9, av: 488, selo: '-20%' },
    { id: 3, nome: 'Transparente Crystal', tipo: 'transparente', marcas: ['iPhone', 'Samsung', 'Motorola', 'Xiaomi'], preco: 39.9, de: 59.9, classe: 'c-transp', nota: 4.7, av: 530, selo: 'Leve 2, pague 1' },
    { id: 4, nome: 'MagSafe Clear', tipo: 'magsafe', marcas: ['iPhone'], preco: 89.9, de: null, classe: 'c-transp c-mag', nota: 4.8, av: 204, selo: 'Novo' },
    { id: 5, nome: 'Couro Premium', tipo: 'couro', marcas: ['iPhone', 'Samsung'], preco: 119.9, de: null, classe: 'c-couro', nota: 4.8, av: 141, selo: null },
    { id: 6, nome: 'Silicone Lima', tipo: 'silicone', marcas: ['iPhone', 'Xiaomi'], preco: 49.9, de: null, classe: 'c-lima', nota: 4.8, av: 97, selo: null },
    { id: 7, nome: 'Anti-impacto Azul-céu', tipo: 'anti-impacto', marcas: ['Samsung', 'Motorola', 'Xiaomi'], preco: 69.9, de: 79.9, classe: 'c-ceu c-robusta', nota: 4.7, av: 176, selo: null },
    { id: 8, nome: 'Estampa Ondas', tipo: 'silicone', marcas: ['iPhone', 'Samsung', 'Motorola'], preco: 59.9, de: null, classe: 'c-ondas', nota: 4.9, av: 233, selo: 'Edição limitada' },
    { id: 9, nome: 'MagSafe Grafite', tipo: 'magsafe', marcas: ['iPhone', 'Samsung'], preco: 99.9, de: null, classe: 'c-grafite c-mag', nota: 4.8, av: 88, selo: null },
    { id: 10, nome: 'Couro Caramelo', tipo: 'couro', marcas: ['iPhone'], preco: 129.9, de: 149.9, classe: 'c-caramelo', nota: 4.9, av: 64, selo: null },
    { id: 11, nome: 'Transparente Glitter', tipo: 'transparente', marcas: ['Samsung', 'Motorola', 'Xiaomi'], preco: 44.9, de: null, classe: 'c-transp c-glitter', nota: 4.6, av: 142, selo: null },
    { id: 12, nome: 'Estampa Terrazzo', tipo: 'silicone', marcas: ['iPhone', 'Xiaomi'], preco: 59.9, de: null, classe: 'c-terrazzo', nota: 4.8, av: 71, selo: null },
  ];
  const filtro = { marca: '*', tipo: '*', ordem: 'rel' };
  const grade = $('[data-produtos]');

  function estrelas(n) { return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n)); }
  function render() {
    let lista = PRODUTOS.filter(p => (filtro.marca === '*' || p.marcas.includes(filtro.marca)) && (filtro.tipo === '*' || p.tipo === filtro.tipo));
    if (filtro.ordem === 'menor') lista.sort((a, b) => a.preco - b.preco);
    if (filtro.ordem === 'maior') lista.sort((a, b) => b.preco - a.preco);
    if (filtro.ordem === 'nota') lista.sort((a, b) => b.nota - a.nota || b.av - a.av);
    $('[data-contagem]').textContent = `${lista.length} ${lista.length === 1 ? 'produto' : 'produtos'}${filtro.marca !== '*' ? ' para ' + filtro.marca : ''}`;
    grade.innerHTML = lista.map((p, i) => `
      <article class="produto" style="--i:${i}">
        <div class="produto-vitrine">
          ${p.selo ? `<span class="produto-selo">${p.selo}</span>` : ''}
          <div class="case ${p.classe}"><i class="cam"></i></div>
          <button type="button" class="produto-add" data-add="${p.id}" aria-label="Adicionar ${p.nome} ao carrinho">+ Adicionar</button>
        </div>
        <div class="produto-info">
          <p class="produto-marcas">${p.marcas.join(' · ')}</p>
          <h3>${p.nome}</h3>
          <p class="produto-nota"><span class="estrelas">${estrelas(p.nota)}</span> ${String(p.nota).replace('.', ',')} (${p.av})</p>
          <p class="produto-preco">${p.de ? `<s>${moeda(p.de)}</s>` : ''}<strong>${moeda(p.preco)}</strong></p>
        </div>
      </article>`).join('');
  }
  function ligarChips(sel, chave, attr) {
    $$(`${sel} button`).forEach(b => b.addEventListener('click', () => {
      $$(`${sel} button`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      filtro[chave] = b.dataset[attr];
      render();
    }));
  }
  ligarChips('[data-filtro-marca]', 'marca', 'marca');
  ligarChips('[data-filtro-tipo]', 'tipo', 'tipo');
  $('[data-ordenar]').addEventListener('change', e => { filtro.ordem = e.target.value; render(); });
  $$('[data-ir-tipo]').forEach(b => b.addEventListener('click', () => {
    const alvo = $(`[data-filtro-tipo] [data-tipo="${b.dataset.irTipo}"]`);
    if (alvo) alvo.click();
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
  }));
  render();

  // ---------- personalizador ----------
  const PRECO_MODELO = { iPhone: 69.9, Samsung: 59.9, Motorola: 49.9, Xiaomi: 54.9 };
  const estado = { modelo: 'iPhone', modo: 'cor', cor: '#FF4F8B', nomeCor: 'Rosa', foto: null };
  const previa = $('[data-previa]');
  function mudarTom(hex, p) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v + 2.55 * p))));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function renderPrevia() {
    if (estado.modo === 'foto' && estado.foto) {
      previa.style.background = `url(${estado.foto}) center/cover`;
    } else {
      previa.style.background = `linear-gradient(155deg, ${mudarTom(estado.cor, 12)}, ${mudarTom(estado.cor, -28)})`;
    }
    previa.classList.toggle('previa-clara', ['#C8F25A', '#F2E6D0'].includes(estado.cor) && estado.modo === 'cor');
    const desc = estado.modo === 'foto' ? (estado.foto ? 'com sua foto' : 'foto (a escolher)') : estado.nomeCor;
    $('[data-previa-legenda]').textContent = `Prévia · ${estado.modelo} · ${desc}`;
    $('[data-preco-monte]').textContent = moeda(PRECO_MODELO[estado.modelo] + (estado.modo === 'foto' ? 10 : 0));
    const texto = `Olá! Montei uma capinha para ${estado.modelo} ${estado.modo === 'foto' ? 'personalizada com foto' : 'na cor ' + estado.nomeCor}. Preço: ${$('[data-preco-monte]').textContent}.`;
    $('[data-wa-personalizada]').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
    previa.classList.remove('gira'); void previa.offsetWidth; previa.classList.add('gira');
  }
  $$('[data-modelos] button').forEach(b => b.addEventListener('click', () => {
    $$('[data-modelos] button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    estado.modelo = b.dataset.modelo; renderPrevia();
  }));
  $$('[data-modos] button').forEach(b => b.addEventListener('click', () => {
    $$('[data-modos] button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    estado.modo = b.dataset.modo;
    $('[data-grupo-cor]').hidden = estado.modo !== 'cor';
    $('[data-grupo-foto]').hidden = estado.modo !== 'foto';
    renderPrevia();
  }));
  $$('[data-cores] .cor').forEach(b => b.addEventListener('click', () => {
    $$('[data-cores] .cor').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    estado.cor = b.dataset.cor; estado.nomeCor = b.dataset.nome; renderPrevia();
  }));
  $('[data-foto]').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    const leitor = new FileReader();
    leitor.onload = () => { estado.foto = leitor.result; $('[data-remover-foto]').hidden = false; renderPrevia(); };
    leitor.readAsDataURL(f);
  });
  $('[data-remover-foto]').addEventListener('click', () => { estado.foto = null; $('[data-foto]').value = ''; $('[data-remover-foto]').hidden = true; renderPrevia(); });
  renderPrevia();

  // ---------- carrinho ----------
  let carrinho = [];
  try { carrinho = JSON.parse(localStorage.getItem('case-carrinho')) || []; } catch (e) {}
  const salvar = () => { try { localStorage.setItem('case-carrinho', JSON.stringify(carrinho)); } catch (e) {} };
  const gaveta = $('[data-gaveta]');

  function adicionar(item) {
    const existente = carrinho.find(x => x.chave === item.chave);
    if (existente) existente.qtd++; else carrinho.push({ ...item, qtd: 1 });
    salvar(); renderCarrinho(); abrir();
  }
  function renderCarrinho() {
    const qtd = carrinho.reduce((s, x) => s + x.qtd, 0);
    const sub = carrinho.reduce((s, x) => s + x.qtd * x.preco, 0);
    const badge = $('[data-qtd]');
    badge.textContent = qtd; badge.hidden = qtd === 0;
    $('[data-subtotal]').textContent = moeda(sub);
    const falta = FRETE_GRATIS - sub;
    $('[data-frete]').innerHTML = falta > 0
      ? `Faltam <b>${moeda(falta)}</b> para o frete grátis<i style="--p:${Math.min(100, sub / FRETE_GRATIS * 100)}%"></i>`
      : '<b>Você ganhou frete grátis!</b><i style="--p:100%"></i>';
    $('[data-itens]').innerHTML = carrinho.length ? carrinho.map((x, i) => `
      <li class="item">
        <div class="item-mini"><div class="case ${x.classe || ''}" style="${x.fundo ? `background:${x.fundo}` : ''}"><i class="cam"></i></div></div>
        <div class="item-info"><strong>${x.nome}</strong><span>${x.detalhe}</span>
          <div class="qtd"><button type="button" data-menos="${i}" aria-label="Diminuir">−</button><span>${x.qtd}</span><button type="button" data-mais="${i}" aria-label="Aumentar">+</button></div>
        </div>
        <strong class="item-preco">${moeda(x.preco * x.qtd)}</strong>
      </li>`).join('') : '<li class="vazio">Seu carrinho está vazio. Que tal a <b>Silicone Soft Touch</b>, a mais vendida?</li>';
    const linhas = carrinho.map(x => `• ${x.qtd}x ${x.nome} (${x.detalhe}) — ${moeda(x.preco * x.qtd)}`).join('\n');
    $('[data-finalizar]').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero finalizar meu pedido na Case Store:\n${linhas}\nSubtotal: ${moeda(sub)}`)}`;
    $('[data-finalizar]').toggleAttribute('aria-disabled', carrinho.length === 0);
  }
  function abrir() { gaveta.hidden = false; requestAnimationFrame(() => gaveta.classList.add('is-open')); document.body.classList.add('nb-travado'); $('[data-fechar-carrinho]').focus(); }
  function fechar() { gaveta.classList.remove('is-open'); document.body.classList.remove('nb-travado'); setTimeout(() => { gaveta.hidden = true; }, 350); }

  grade.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const p = PRODUTOS.find(x => x.id === Number(b.dataset.add));
    const marca = filtro.marca !== '*' && p.marcas.includes(filtro.marca) ? filtro.marca : p.marcas[0];
    adicionar({ chave: `p${p.id}-${marca}`, nome: p.nome, detalhe: marca, preco: p.preco, classe: p.classe });
  });
  $('[data-add-personalizada]').addEventListener('click', () => {
    const preco = PRECO_MODELO[estado.modelo] + (estado.modo === 'foto' ? 10 : 0);
    const detalhe = `${estado.modelo} · ${estado.modo === 'foto' ? 'com foto' : estado.nomeCor}`;
    adicionar({ chave: `m-${detalhe}`, nome: 'Capinha personalizada', detalhe, preco, fundo: estado.modo === 'foto' && estado.foto ? null : `linear-gradient(155deg, ${mudarTom(estado.cor, 12)}, ${mudarTom(estado.cor, -28)})` });
  });
  $('[data-itens]').addEventListener('click', e => {
    const mais = e.target.closest('[data-mais]'), menos = e.target.closest('[data-menos]');
    if (mais) carrinho[Number(mais.dataset.mais)].qtd++;
    if (menos) { const i = Number(menos.dataset.menos); carrinho[i].qtd--; if (carrinho[i].qtd <= 0) carrinho.splice(i, 1); }
    if (mais || menos) { salvar(); renderCarrinho(); }
  });
  $('[data-abrir-carrinho]').addEventListener('click', abrir);
  $('[data-fechar-carrinho]').addEventListener('click', fechar);
  gaveta.addEventListener('click', e => { if (e.target === gaveta) fechar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !gaveta.hidden) fechar(); });
  renderCarrinho();
})();
