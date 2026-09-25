// Cantina da Nonna — prato do dia pela semana e cardápio por categoria.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // prato do dia (segunda: fechado)
  const SEMANA = [
    { dia: 'Domingo', nome: 'Lasanha à bolonhesa', desc: 'O almoço de domingo da família: camadas de massa fresca, ragu e bechamel.', img: 'lasanha' },
    null,
    { dia: 'Terça', nome: 'Spaghetti al pomodoro', desc: 'Molho de tomate italiano cozido por quatro horas, manjericão e parmesão.', img: 'aglio' },
    { dia: 'Quarta', nome: 'Polpettone e spaghetti', desc: 'Almôndegas da Nonna ao sugo sobre spaghetti feito na casa.', img: 'almondegas' },
    { dia: 'Quinta', nome: 'Tagliatelle ao ragu', desc: 'Massa fresca com ragu de carne cozido lentamente por seis horas.', img: 'tagliatelle' },
    { dia: 'Sexta', nome: 'Spaghetti alle vongole', desc: 'Vôngoles frescos, alho, vinho branco e salsinha.', img: 'vongole' },
    { dia: 'Sábado', nome: 'Margherita do forno a lenha', desc: 'Molho de tomate, mussarela de búfala e manjericão fresco.', img: 'margherita' },
  ];
  const ORDEM = [2, 3, 4, 5, 6, 0];
  let hoje = new Date().getDay();
  if (!SEMANA[hoje]) hoje = 2;
  function mostrarDia(i) {
    const p = SEMANA[i];
    $('[data-hoje-dia]').textContent = i === new Date().getDay() ? `Hoje · ${p.dia}` : p.dia;
    $('[data-hoje-nome]').textContent = p.nome;
    $('[data-hoje-desc]').textContent = p.desc;
    const img = $('[data-hoje-img]');
    img.src = `img/${p.img}.jpg`; img.alt = p.nome;
    img.parentElement.classList.remove('troca'); void img.offsetWidth; img.parentElement.classList.add('troca');
    $$('[data-dias] button').forEach(b => b.setAttribute('aria-selected', String(Number(b.dataset.d) === i)));
  }
  $('[data-dias]').innerHTML = ORDEM.map(i => `<button role="tab" data-d="${i}" aria-selected="false">${SEMANA[i].dia.slice(0, 3)}</button>`).join('') + '<span class="fechado">Seg · fechado</span>';
  $('[data-dias]').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) mostrarDia(Number(b.dataset.d)); });
  mostrarDia(hoje);

  const CARDAPIO = {
    entradas: [
      { nome: 'Bruschetta clássica', desc: 'Pão italiano tostado, tomate confit e manjericão', preco: 28 },
      { nome: 'Carpaccio da Nonna', desc: 'Finas fatias de alcatra, alcaparras e parmesão', preco: 42 },
      { nome: 'Burrata fresca', desc: 'Tomates assados e pesto de manjericão', preco: 48, tag: 'Para dividir' },
    ],
    massas: [
      { nome: 'Tagliatelle ao ragu', desc: 'Massa fresca com molho de carne cozido por seis horas', preco: 62, img: 'tagliatelle', tag: 'A mais pedida' },
      { nome: 'Spaghetti alle vongole', desc: 'Vôngoles frescos, alho e vinho branco', preco: 68, img: 'vongole' },
      { nome: 'Lasanha à bolonhesa', desc: 'Camadas de massa fresca, ragu e bechamel', preco: 64, img: 'lasanha' },
      { nome: 'Ravioli de ricota e espinafre', desc: 'Recheio artesanal, manteiga e sálvia', preco: 58 },
    ],
    pizzas: [
      { nome: 'Margherita', desc: 'Molho de tomate, mussarela de búfala e manjericão', preco: 54, img: 'margherita', tag: 'Clássica' },
      { nome: 'Quattro formaggi', desc: 'Mussarela, gorgonzola, parmesão e provolone', preco: 62 },
      { nome: 'Diavola', desc: 'Calabresa artesanal e pimenta calabresa', preco: 58 },
    ],
    doces: [
      { nome: 'Tiramisù da Nonna', desc: 'Receita original de família, feita todos os dias', preco: 26, img: 'tiramisu', tag: 'Receita original' },
      { nome: 'Panna cotta', desc: 'Com calda de frutas vermelhas', preco: 24 },
      { nome: 'Cannoli siciliano', desc: 'Ricota doce e gotas de chocolate', preco: 22 },
    ],
  };
  const box = $('[data-cardapio]');
  function render(cat) {
    $$('[data-cats] button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === cat)));
    const itens = CARDAPIO[cat];
    const comFoto = itens.filter(i => i.img), semFoto = itens.filter(i => !i.img);
    box.innerHTML =
      comFoto.map((i, k) => `<article class="prato" style="--i:${k}"><div class="foto"><img src="img/${i.img}.jpg" alt="${i.nome}" loading="lazy"></div><div class="prato-txt">${i.tag ? `<span class="prato-tag">${i.tag}</span>` : ''}<h3>${i.nome}</h3><p>${i.desc}</p><strong>R$ ${i.preco}</strong></div></article>`).join('') +
      (semFoto.length ? `<ul class="lista-simples">${semFoto.map((i, k) => `<li style="--i:${k + comFoto.length}"><div><h3>${i.nome}${i.tag ? ` <span class="prato-tag">${i.tag}</span>` : ''}</h3><p>${i.desc}</p></div><span class="pontos"></span><strong>R$ ${i.preco}</strong></li>`).join('')}</ul>` : '');
  }
  $$('[data-cats] button').forEach(b => b.addEventListener('click', () => render(b.dataset.cat)));
  render('massas');
})();
