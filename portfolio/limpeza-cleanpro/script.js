// CleanPro — dimensionamento de equipe (estimativa por produtividade em m²/hora).
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const PROD = { escritorio: 220, clinica: 140, loja: 200, industria: 300 }; // m² por hora por profissional
  const NOMES = { escritorio: 'escritório', clinica: 'clínica', loja: 'loja', industria: 'indústria' };
  const FREQ = { 5: 'diária', 3: '3x por semana', 1: 'semanal' };
  const form = $('[data-dim]'), area = $('[data-area]');
  let atual = {};
  function calc() {
    const tipo = form.tipo.value, freq = Number(form.freq.value), m2 = Number(area.value);
    const horasTotais = m2 / PROD[tipo];
    const pessoas = Math.max(1, Math.ceil(horasTotais / 6));
    const horas = Math.max(2, Math.ceil(horasTotais / pessoas * 2) / 2);
    const mes = Math.round(pessoas * horas * freq * 4.3);
    atual = { tipo, freq, m2, pessoas, horas };
    $('[data-d-area]').textContent = m2.toLocaleString('pt-BR') + ' m²';
    area.style.setProperty('--p', ((m2 - 100) / 4900 * 100) + '%');
    $('[data-d-equipe]').textContent = `${pessoas} profissiona${pessoas > 1 ? 'is' : 'l'}`;
    $('[data-d-horas]').textContent = `${String(horas).replace('.', ',')} h`;
    $('[data-d-mes]').textContent = `${mes} h`;
    const bon = $('[data-bonecos]');
    const vis = Math.min(pessoas, 12);
    bon.innerHTML = Array.from({ length: vis }, (_, i) => `<i style="--i:${i}"></i>`).join('') + (pessoas > 12 ? `<b>+${pessoas - 12}</b>` : '');
  }
  form.addEventListener('input', calc);
  $('[data-d-usar]').addEventListener('click', () => {
    $('[data-c-msg]').value = `Ambiente: ${NOMES[atual.tipo]}, cerca de ${atual.m2.toLocaleString('pt-BR')} m², limpeza ${FREQ[atual.freq]}. Equipe sugerida no site: ${atual.pessoas} profissional(is).`;
  });
  calc();
})();
