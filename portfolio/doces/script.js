// Doce Encanto — cardápio por categoria com "sacola" de encomenda que
// preenche o formulário.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CARDAPIO = {
    bolos: [
      { nome: 'Ninho com morango', desc: 'Massa fofinha, creme de leite Ninho e morangos frescos', preco: 'R$ 95/kg', tag: 'Mais pedido' },
      { nome: 'Red velvet', desc: 'Clássico americano com creme de cream cheese', preco: 'R$ 110/kg' },
      { nome: 'Chocolate belga', desc: 'Ganache de chocolate 70% cacau', preco: 'R$ 105/kg' },
      { nome: 'Naked cake de frutas', desc: 'Frutas da estação e chantili leve', preco: 'R$ 120/kg' },
      { nome: 'Floresta negra', desc: 'Chocolate, cerejas e chantili', preco: 'R$ 108/kg' },
    ],
    tortas: [
      { nome: 'Torta de limão', desc: 'Base crocante com creme de limão-siciliano', preco: 'R$ 85/kg' },
      { nome: 'Torta holandesa', desc: 'Camadas de creme, biscoito e chocolate', preco: 'R$ 90/kg', tag: 'Clássica' },
      { nome: 'Torta de chocolate com morangos', desc: 'Ganache cremosa e morangos cobertos', preco: 'R$ 98/kg' },
    ],
    doces: [
      { nome: 'Brigadeiro gourmet', desc: 'Chocolate belga · caixa com 12', preco: 'R$ 42', tag: 'Favorito' },
      { nome: 'Beijinho de coco', desc: 'Coco fresco ralado na hora · caixa com 12', preco: 'R$ 38' },
      { nome: 'Bem-casado', desc: 'Doce de leite, embalado para lembrancinha', preco: 'R$ 5,50 un.' },
      { nome: 'Mesa de doces finos', desc: 'Sortimento para 30 pessoas', preco: 'R$ 320' },
    ],
    cupcakes: [
      { nome: 'Cupcake red velvet', desc: 'Cobertura de cream cheese', preco: 'R$ 12 un.' },
      { nome: 'Cupcake de Nutella', desc: 'Massa de chocolate com recheio', preco: 'R$ 13 un.' },
      { nome: 'Caixa presente', desc: '6 cupcakes sortidos com laço', preco: 'R$ 72', tag: 'Para presentear' },
    ],
    bebidas: [
      { nome: 'Café coado especial', desc: 'Grãos do Sul de Minas · 300 ml', preco: 'R$ 9' },
      { nome: 'Chá gelado de frutas vermelhas', desc: 'Feito na hora, sem açúcar refinado', preco: 'R$ 13' },
      { nome: 'Limonada rosa', desc: 'Com toque de hibisco', preco: 'R$ 12' },
    ],
  };
  const sacola = new Map();
  const menu = $('[data-menu]');
  let atual = 'bolos';

  function render() {
    menu.innerHTML = CARDAPIO[atual].map((it, i) => {
      const qtd = sacola.get(it.nome) || 0;
      return `<li class="menu-item" style="--i:${i}">
        <div class="menu-txt"><h3>${it.nome}${it.tag ? ` <span class="menu-tag">${it.tag}</span>` : ''}</h3><p>${it.desc}</p></div>
        <span class="menu-pontos" aria-hidden="true"></span>
        <strong class="menu-preco">${it.preco}</strong>
        <button type="button" class="menu-add${qtd ? ' tem' : ''}" data-add="${it.nome}" aria-label="Adicionar ${it.nome} à encomenda">${qtd ? qtd : '+'}</button>
      </li>`;
    }).join('');
  }
  function atualizarSacola() {
    const itens = [...sacola.entries()];
    const box = $('[data-sacola]');
    box.hidden = itens.length === 0;
    const total = itens.reduce((s, [, q]) => s + q, 0);
    $('[data-sacola-resumo]').textContent = `${total} ${total === 1 ? 'item' : 'itens'} · ${itens.map(([n]) => n).slice(0, 2).join(', ')}${itens.length > 2 ? '…' : ''}`;
    $('[data-itens-encomenda]').value = itens.map(([n, q]) => `${q}x ${n}`).join('\n');
  }
  function escolher(cat) {
    atual = cat;
    $$('[data-cats] button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === cat)));
    render();
  }
  $$('[data-cats] button').forEach(b => b.addEventListener('click', () => escolher(b.dataset.cat)));
  $$('[data-ir-cat]').forEach(a => a.addEventListener('click', () => escolher(a.dataset.irCat)));
  menu.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    sacola.set(b.dataset.add, (sacola.get(b.dataset.add) || 0) + 1);
    render(); atualizarSacola();
  });
  render();
})();
