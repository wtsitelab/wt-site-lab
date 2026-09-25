// Âmbar — menu de sete tempos (com harmonização opcional) e reserva.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const TEMPOS = [
    { t: 'Boas-vindas', d: 'Aperitivos da casa e pão de fermentação natural com manteiga de garrafa', img: 'boas-vindas', v: 'Espumante nacional, método tradicional' },
    { t: 'Do mar', d: 'Ceviche de peixe branco, leite de tigre e milho torrado', img: 'do-mar', v: 'Sauvignon blanc da Serra Gaúcha' },
    { t: 'Da horta', d: 'Carpaccio de beterraba, folhas da estação e queijo curado', img: 'horta', v: 'Rosé de Pinot Noir' },
    { t: 'Intermezzo', d: 'Sorbet cítrico de limão-cravo para limpar o paladar', v: '—' },
    { t: 'Principal', d: 'Costela 48 horas, purê de mandioquinha e jus reduzido', img: 'principal', v: 'Cabernet franc da Campanha' },
    { t: 'Queijos', d: 'Queijos artesanais da Serra da Canastra e mel de flor silvestre', v: 'Vinho do Porto tawny' },
    { t: 'Doce final', d: 'Chocolate 70%, café e flor de sal', img: 'doce', v: 'Moscatel de colheita tardia' },
  ];
  const lista = $('[data-tempos]'), chk = $('[data-harmoniza]');
  function render() {
    const h = chk.checked;
    lista.classList.toggle('com-vinho', h);
    lista.innerHTML = TEMPOS.map((x, i) => `
      <li class="tempo" style="--i:${i}">
        <span class="tempo-n">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i]}</span>
        <div class="tempo-txt"><h3>${x.t}</h3><p>${x.d}</p>${h && x.v !== '—' ? `<p class="vinho">🍷 ${x.v}</p>` : ''}</div>
        ${x.img ? `<div class="tempo-foto"><img src="img/${x.img}.jpg" alt="${x.t}: ${x.d}" loading="lazy"></div>` : '<div class="tempo-foto vazio" aria-hidden="true">✦</div>'}
      </li>`).join('');
    $('[data-preco]').textContent = h ? 'R$ 565' : 'R$ 385';
    atualizarResumo();
  }
  chk.addEventListener('change', render);

  // reserva: próximas quartas a sábados
  const noites = $('[data-noites]');
  const datas = [];
  for (let d = new Date(), n = 0; datas.length < 6 && n < 21; n++) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() >= 3 && d.getDay() <= 6) datas.push(new Date(d));
  }
  const lotada = 2;
  noites.innerHTML = datas.map((d, i) => `<button type="button" aria-pressed="${i === 0}" ${i === lotada ? 'disabled title="Sem mesas disponíveis"' : ''}><small>${d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</small>${i === lotada ? '<em>lotada</em>' : ''}</button>`).join('');
  let pessoas = 2;
  function atualizarResumo() {
    const iNoite = $$('button', noites).findIndex(b => b.getAttribute('aria-pressed') === 'true');
    const hora = $('[data-horas] [aria-pressed="true"]').textContent;
    const d = datas[iNoite];
    const valor = (chk.checked ? 565 : 385) * pessoas;
    $('[data-resumo]').innerHTML = `${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}, às ${hora} · ${pessoas} ${pessoas > 1 ? 'pessoas' : 'pessoa'} · menu ${chk.checked ? 'com harmonização' : 'degustação'} <b>≈ ${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</b>`;
  }
  noites.addEventListener('click', e => {
    const b = e.target.closest('button:not([disabled])'); if (!b) return;
    $$('button', noites).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    atualizarResumo();
  });
  $('[data-horas]').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('[data-horas] button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    atualizarResumo();
  });
  const out = $('[data-pessoas]');
  $('[data-menos]').addEventListener('click', () => { pessoas = Math.max(1, pessoas - 1); out.textContent = pessoas; atualizarResumo(); });
  $('[data-mais]').addEventListener('click', () => { pessoas = Math.min(8, pessoas + 1); out.textContent = pessoas; atualizarResumo(); });
  render();
})();
