// Faxina Fácil — montagem da limpeza com preço na hora e checagem de bairro.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const BASE = { 1: 150, 2: 180, 3: 220, 4: 270 };
  const HORAS = { 1: 4, 2: 5, 3: 6, 4: 8 };
  const DESC = { avulso: 0, quinzenal: 0.15, semanal: 0.2 };
  const NOME_FREQ = { avulso: 'avulsa', quinzenal: 'quinzenal', semanal: 'semanal' };
  const est = { tam: '2', freq: 'quinzenal' };
  let resumoTexto = '';

  $$('[data-grupo]').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    est[g.dataset.grupo] = b.dataset.v;
    calc();
  }));
  $('[data-extras]').addEventListener('change', calc);

  function calc() {
    const base = BASE[est.tam], desc = DESC[est.freq];
    const extras = $$('[data-extras] input:checked').map(i => ({ nome: i.parentElement.querySelector('span').firstChild.textContent.trim(), preco: Number(i.dataset.preco) }));
    const somaExtras = extras.reduce((s, x) => s + x.preco, 0);
    const desconto = Math.round(base * desc);
    const total = base - desconto + somaExtras;
    const tam = est.tam === '4' ? '4+ quartos' : `${est.tam} quarto${est.tam === '1' ? '' : 's'}`;
    $('[data-r-desc]').textContent = `Limpeza ${NOME_FREQ[est.freq]} · ${tam}`;
    $('[data-r-linhas]').innerHTML =
      `<li><span>Limpeza completa</span><b>${brl(base)}</b></li>` +
      (desconto ? `<li class="desc"><span>Desconto ${NOME_FREQ[est.freq]}</span><b>−${brl(desconto)}</b></li>` : '') +
      extras.map(x => `<li><span>${x.nome}</span><b>+${brl(x.preco)}</b></li>`).join('');
    const tot = $('[data-r-total]');
    tot.textContent = brl(total);
    tot.classList.remove('pula'); void tot.offsetWidth; tot.classList.add('pula');
    const h = HORAS[est.tam] + (extras.length ? 1 : 0);
    $('[data-r-tempo]').textContent = `⏱ Cerca de ${h} horas · 1 profissional`;
    resumoTexto = `Limpeza ${NOME_FREQ[est.freq]}, ${tam}${extras.length ? ', extras: ' + extras.map(x => x.nome.toLowerCase()).join(', ') : ''}. Total estimado: ${brl(total)} por visita.`;
  }
  $('[data-r-agendar]').addEventListener('click', () => { $('[data-a-resumo]').value = resumoTexto; });
  calc();

  // bairros atendidos
  const BAIRROS = ['Água Verde', 'Batel', 'Bigorrilho', 'Boa Vista', 'Cabral', 'Centro', 'Cristo Rei', 'Ecoville', 'Juvevê', 'Mercês', 'Portão', 'Rebouças', 'Santa Felicidade', 'Seminário', 'Alto da XV', 'Jardim Botânico'];
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  $('[data-bairros]').innerHTML = BAIRROS.map(b => `<li>${b}</li>`).join('');
  $('#lista-bairros').innerHTML = BAIRROS.map(b => `<option value="${b}">`).join('');
  $('[data-checa]').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#b-bairro').value, resp = $('[data-checa-resp]');
    if (!v.trim()) { resp.textContent = ''; return; }
    const achou = BAIRROS.find(b => norm(b) === norm(v));
    resp.className = 'checa-resp ' + (achou ? 'sim' : 'nao');
    resp.textContent = achou ? `Sim! Atendemos ${achou}. 🎉` : `Ainda não chegamos em “${v}”, mas deixe seu contato: estamos expandindo.`;
    $$('[data-bairros] li').forEach(li => li.classList.toggle('achou', achou && li.textContent === achou));
    if (achou) $('[data-a-bairro]').value = achou;
  });
})();
