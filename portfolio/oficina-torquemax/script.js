// TorqueMax — simulador de ganho por estágio (estimativa ilustrativa).
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const GANHO = { 1: { cv: 0.18, nm: 0.24 }, 2: { cv: 0.32, nm: 0.38 }, 3: { cv: 0.6, nm: 0.62 } };
  const MAX = 350 * 1.6;
  let stage = 1;
  const cv = $('[data-cv]');
  function render() {
    const base = Number(cv.value), g = GANHO[stage];
    const nmBase = Math.round(base * 1.55);
    const novo = Math.round(base * (1 + g.cv)), nmNovo = Math.round(nmBase * (1 + g.nm));
    $('[data-cv-valor]').textContent = base + ' cv';
    cv.style.setProperty('--p', ((base - 100) / 250 * 100) + '%');
    $('[data-b-cv-o]').style.width = (base / MAX * 100) + '%';
    $('[data-b-cv-n]').style.width = (novo / MAX * 100) + '%';
    $('[data-b-nm-o]').style.width = (nmBase / (MAX * 1.62) * 100) + '%';
    $('[data-b-nm-n]').style.width = (nmNovo / (MAX * 1.62) * 100) + '%';
    $('[data-t-cv]').innerHTML = `${base} → <b>${novo} cv</b>`;
    $('[data-t-nm]').innerHTML = `${nmBase} → <b>${nmNovo} Nm</b>`;
    const sel = $('[data-campo-stage]');
    if (sel) sel.value = 'Stage ' + stage;
  }
  document.querySelectorAll('[data-stages] button').forEach(b => b.addEventListener('click', () => {
    stage = Number(b.dataset.stage);
    document.querySelectorAll('[data-stages] button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    render();
  }));
  cv.addEventListener('input', render);
  render();

  // curva do dinamômetro desenha ao aparecer
  const graf = $('.grafico');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { graf.classList.add('desenhar'); o.disconnect(); } }), { threshold: 0.35 }).observe(graf);
  } else graf.classList.add('desenhar');
})();
