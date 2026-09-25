// Rota Certa — plano de revisão por quilometragem (referência genérica).
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const km = (n) => n.toLocaleString('pt-BR') + ' km';
  const BASE = ['Troca de óleo do motor', 'Filtro de óleo', 'Checagem de 40 itens de segurança'];
  function plano(prox) {
    const n = prox / 10000;
    if (n % 6 === 0) return { tipo: 'Completa + correia', itens: [...BASE, 'Filtro de ar e de combustível', 'Velas de ignição', 'Correia dentada (conforme manual)', 'Fluido de arrefecimento', 'Alinhamento e balanceamento'] };
    if (n % 4 === 0) return { tipo: 'Completa', itens: [...BASE, 'Filtro de ar e de combustível', 'Velas de ignição', 'Fluido de freio', 'Suspensão e alinhamento'] };
    if (n % 2 === 0) return { tipo: 'Intermediária', itens: [...BASE, 'Filtro de ar', 'Fluido de freio', 'Pastilhas e discos (inspeção)'] };
    return { tipo: 'Básica', itens: BASE };
  }
  const input = $('[data-km]');
  let atual = null;
  function render() {
    const v = Number(input.value);
    const prox = Math.max(10000, Math.floor(v / 10000) * 10000 + 10000);
    const p = plano(prox);
    atual = { v, prox, p };
    $('[data-km-valor]').textContent = km(v);
    $('[data-prox]').textContent = km(prox);
    $('[data-tipo]').textContent = p.tipo;
    $('[data-faltam]').textContent = 'faltam ' + km(prox - v);
    $('[data-faltam-barra]').style.width = ((10000 - (prox - v)) / 10000 * 100) + '%';
    input.style.setProperty('--p', (v / 1000) + '%');
    $('[data-itens]').innerHTML = p.itens.map((t, i) => `<li style="--i:${i}">${t}</li>`).join('');
  }
  input.addEventListener('input', render);
  $('[data-usar-plano]').addEventListener('click', () => {
    $('[data-campo-km]').value = km(atual.v);
    $('[data-campo-serv]').value = 'Revisão programada';
    const msg = $('#g-msg');
    msg.value = `Revisão de ${km(atual.prox)} (${atual.p.tipo.toLowerCase()}).`;
  });
  render();
})();
