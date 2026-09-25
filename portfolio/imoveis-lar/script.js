// Lar Imóveis — simulador de financiamento (SAC e Price, valores ilustrativos).
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const campos = { valor: $('[data-s-valor]'), entrada: $('[data-s-entrada]'), prazo: $('[data-s-prazo]'), taxa: $('[data-s-taxa]') };
  function pinta(el) { el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%'); }
  function calcular() {
    const valor = Number(campos.valor.value), ent = Number(campos.entrada.value) / 100;
    const n = Number(campos.prazo.value) * 12, aa = Number(campos.taxa.value) / 100;
    const i = Math.pow(1 + aa, 1 / 12) - 1;
    const fin = valor * (1 - ent);
    const sac = fin / n + fin * i;
    const price = fin * i / (1 - Math.pow(1 + i, -n));
    $('[data-o-valor]').textContent = brl(valor);
    $('[data-o-entrada]').textContent = `${Math.round(ent * 100)}% · ${brl(valor * ent)}`;
    $('[data-o-prazo]').textContent = `${n / 12} anos`;
    $('[data-o-taxa]').textContent = `${String(Number(campos.taxa.value).toFixed(2)).replace(/0$/, '').replace('.', ',')}%`;
    $('[data-r-sac]').textContent = brl(sac);
    $('[data-r-price]').textContent = brl(price);
    $('[data-r-fin]').textContent = brl(fin);
    Object.values(campos).forEach(pinta);
  }
  Object.values(campos).forEach(c => c.addEventListener('input', calcular));
  document.querySelectorAll('[data-simular]').forEach(b => b.addEventListener('click', () => {
    campos.valor.value = b.dataset.simular;
    calcular();
    const r = document.querySelector('.sim-resultado');
    r.classList.remove('pisca'); void r.offsetWidth; r.classList.add('pisca');
    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
  }));
  calcular();
})();
