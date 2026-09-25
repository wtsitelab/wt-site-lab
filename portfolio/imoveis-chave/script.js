// Chave Imóveis — lista com busca, filtros, ordenação, favoritos e ficha do imóvel.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const IMOVEIS = [
    { id: 1, nome: 'Apartamento com sacada', bairro: 'Água Verde', modo: 'comprar', tipo: 'apartamento', preco: 620000, q: 2, b: 2, v: 1, area: 68, img: 'agua-verde', novo: true, desc: 'Sacada em todos os andares, prédio com portaria 24h e a duas quadras do parque.' },
    { id: 2, nome: 'Casa contemporânea', bairro: 'Santa Felicidade', modo: 'comprar', tipo: 'casa', preco: 1290000, q: 4, b: 3, v: 3, area: 280, img: 'santa-felicidade', desc: 'Varandas curvas, pé-direito duplo e jardim com vista para o vale.' },
    { id: 3, nome: 'Sobrado geminado', bairro: 'Boa Vista', modo: 'alugar', tipo: 'casa', preco: 3900, q: 3, b: 2, v: 2, area: 150, img: 'sobrado', desc: 'Fachada em madeira, três quartos e quintal nos fundos.' },
    { id: 4, nome: 'Studio mobiliado', bairro: 'Batel', modo: 'alugar', tipo: 'apartamento', preco: 2400, q: 1, b: 1, v: 1, area: 42, img: 'studio', novo: true, desc: 'Totalmente mobiliado, janelas amplas e condomínio com academia.' },
    { id: 5, nome: 'Apartamento reformado', bairro: 'Bigorrilho', modo: 'alugar', tipo: 'apartamento', preco: 3100, q: 3, b: 2, v: 2, area: 95, img: 'bigorrilho', desc: 'Reforma recente, sala integrada e dois banheiros.' },
    { id: 6, nome: 'Casa térrea com jardim', bairro: 'São Braz', modo: 'comprar', tipo: 'casa', preco: 890000, q: 3, b: 2, v: 2, area: 180, img: 'boa-vista', desc: 'Terreno arborizado, garagem coberta e espaço para ampliar.' },
    { id: 7, nome: 'Cobertura duplex', bairro: 'Cabral', modo: 'comprar', tipo: 'apartamento', preco: 1450000, q: 4, b: 4, v: 3, area: 220, img: 'cobertura', desc: 'Terraço gourmet, vista panorâmica e acabamento de alto padrão.' },
    { id: 8, nome: 'Casa comercial', bairro: 'São Francisco', modo: 'alugar', tipo: 'comercial', preco: 6500, q: 0, b: 2, v: 0, area: 210, img: 'centro', desc: 'Casarão restaurado no centro histórico, ideal para escritório, café ou loja.' },
    { id: 9, nome: 'Apartamento clássico', bairro: 'Juvevê', modo: 'comprar', tipo: 'apartamento', preco: 540000, q: 2, b: 1, v: 1, area: 72, img: 'juveve', desc: 'Piso de madeira original, pé-direito alto e muita luz natural.' },
  ];
  let favs = new Set();
  try { favs = new Set(JSON.parse(localStorage.getItem('chave-favs')) || []); } catch (e) {}
  const salvar = () => { try { localStorage.setItem('chave-favs', JSON.stringify([...favs])); } catch (e) {} };
  const f = { modo: '*', tipo: '*', quartos: 0, ordem: 'rec' };
  const lista = $('[data-lista]');
  const preco = (i) => i.modo === 'alugar' ? `${brl(i.preco)}<small>/mês</small>` : brl(i.preco);

  function render() {
    let itens = IMOVEIS.filter(i => (f.modo === '*' || (f.modo === 'fav' ? favs.has(i.id) : i.modo === f.modo)) && (f.tipo === '*' || i.tipo === f.tipo) && i.q >= f.quartos);
    if (f.ordem === 'menor') itens.sort((a, b) => a.preco - b.preco);
    if (f.ordem === 'maior') itens.sort((a, b) => b.preco - a.preco);
    if (f.ordem === 'area') itens.sort((a, b) => b.area - a.area);
    $('[data-contagem]').textContent = `${itens.length} ${itens.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
    lista.innerHTML = itens.length ? itens.map((i, k) => `
      <article class="imovel" style="--i:${k}">
        <button type="button" class="imovel-foto" data-abrir="${i.id}" aria-label="Ver detalhes: ${i.nome}">
          <img src="img/${i.img}.jpg" alt="" loading="lazy">
          <span class="selo ${i.modo}">${i.modo === 'comprar' ? 'Venda' : 'Aluguel'}</span>${i.novo ? '<span class="selo novo">Novo</span>' : ''}
        </button>
        <button type="button" class="fav${favs.has(i.id) ? ' on' : ''}" data-fav="${i.id}" aria-pressed="${favs.has(i.id)}" aria-label="Favoritar ${i.nome}">♥</button>
        <div class="imovel-info">
          <p class="preco">${preco(i)}</p>
          <h3>${i.nome}</h3>
          <p class="bairro">${i.bairro}, Curitiba</p>
          <ul class="specs">${i.q ? `<li>${i.q} quarto${i.q > 1 ? 's' : ''}</li>` : ''}<li>${i.area} m²</li>${i.v ? `<li>${i.v} vaga${i.v > 1 ? 's' : ''}</li>` : ''}</ul>
        </div>
      </article>`).join('') : `<p class="vazio">${f.modo === 'fav' ? 'Você ainda não favoritou nenhum imóvel. Toque no ♥ para guardar.' : 'Nenhum imóvel com esses filtros. Tente ampliar a busca.'}</p>`;
    $('[data-fav-qtd]').textContent = favs.size;
  }
  function modo(v) {
    f.modo = v;
    $$('[data-f-modo] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    render();
  }
  $$('[data-f-modo] button').forEach(b => b.addEventListener('click', () => modo(b.dataset.v)));
  $('[data-ordem]').addEventListener('change', e => { f.ordem = e.target.value; render(); });

  // busca do topo
  let buscaModo = 'comprar';
  $$('[data-modo]').forEach(b => b.addEventListener('click', () => {
    buscaModo = b.dataset.modo;
    $$('[data-modo]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
  }));
  $('[data-busca]').addEventListener('submit', e => {
    e.preventDefault();
    f.tipo = $('[data-b-tipo]').value; f.quartos = Number($('[data-b-quartos]').value);
    modo(buscaModo);
    $('#imoveis').scrollIntoView({ behavior: 'smooth' });
  });
  $('[data-ver-favs]').addEventListener('click', () => { f.tipo = '*'; f.quartos = 0; modo('fav'); });

  // favoritos + ficha
  const ficha = $('[data-ficha]');
  let aberto = null;
  lista.addEventListener('click', e => {
    const fb = e.target.closest('[data-fav]');
    if (fb) { const id = Number(fb.dataset.fav); favs.has(id) ? favs.delete(id) : favs.add(id); salvar(); render(); return; }
    const ab = e.target.closest('[data-abrir]');
    if (!ab) return;
    const i = IMOVEIS.find(x => x.id === Number(ab.dataset.abrir));
    aberto = i;
    $('[data-f-img]').src = `img/${i.img}.jpg`; $('[data-f-img]').alt = i.nome;
    $('[data-f-tag]').textContent = i.modo === 'comprar' ? 'À venda' : 'Para alugar';
    $('[data-f-nome]').textContent = i.nome;
    $('[data-f-bairro]').textContent = `${i.bairro}, Curitiba · código CH-${String(i.id).padStart(4, '0')}`;
    $('[data-f-specs]').innerHTML = [i.q ? `<li><b>${i.q}</b>quartos</li>` : '', `<li><b>${i.b}</b>banheiros</li>`, `<li><b>${i.v}</b>vagas</li>`, `<li><b>${i.area}</b>m²</li>`].join('');
    $('[data-f-desc]').textContent = i.desc;
    $('[data-f-rot]').textContent = i.modo === 'comprar' ? 'Valor de venda' : 'Aluguel mensal';
    $('[data-f-preco]').innerHTML = preco(i);
    ficha.showModal();
  });
  $('[data-fechar]').addEventListener('click', () => ficha.close());
  ficha.addEventListener('click', e => { if (e.target === ficha) ficha.close(); });
  $('[data-f-visita]').addEventListener('click', () => {
    $('[data-k-quero]').value = aberto.modo === 'comprar' ? 'Comprar um imóvel' : 'Alugar um imóvel';
    $('[data-k-msg]').value = `Quero agendar uma visita: ${aberto.nome} (${aberto.bairro}), código CH-${String(aberto.id).padStart(4, '0')}.`;
    ficha.close();
  });
  $('[data-anunciar]').addEventListener('click', () => { $('[data-k-quero]').value = 'Anunciar meu imóvel'; });
  render();
})();
