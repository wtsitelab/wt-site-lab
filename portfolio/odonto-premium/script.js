// OrtoDental — arcada ilustrativa: os dentes saem de posições desalinhadas e
// se organizam conforme o controle deslizante avança.
(function () {
  'use strict';
  const svg = document.querySelector('[data-arcada]');
  const NS = 'http://www.w3.org/2000/svg';
  // 10 dentes ao longo de uma curva; desvio inicial (dx, dy, rotação)
  const DENTES = [
    { w: 30, dx: 0, dy: 4, r: -8 }, { w: 32, dx: 3, dy: -6, r: 10 }, { w: 34, dx: -4, dy: 8, r: -14 },
    { w: 30, dx: 6, dy: -10, r: 18 }, { w: 38, dx: -3, dy: 12, r: -6 }, { w: 38, dx: 4, dy: -12, r: 12 },
    { w: 30, dx: -6, dy: 9, r: -16 }, { w: 34, dx: 3, dy: -7, r: 8 }, { w: 32, dx: -2, dy: 6, r: -10 }, { w: 30, dx: 0, dy: -4, r: 6 },
  ];
  const total = DENTES.reduce((s, d) => s + d.w + 4, 0) - 4;
  let x = 210 - total / 2;
  const els = DENTES.map(d => {
    const cx = x + d.w / 2; x += d.w + 4;
    const t = (cx - 210) / 210;                 // −1..1
    const cy = 78 + t * t * 70;                 // curva da arcada
    const ang = t * 38;                          // inclinação acompanhando a curva
    const g = document.createElementNS(NS, 'g');
    const p = document.createElementNS(NS, 'path');
    const h = 52 - Math.abs(t) * 10;
    p.setAttribute('d', `M${-d.w / 2} 0 Q${-d.w / 2} ${h} 0 ${h + 4} Q${d.w / 2} ${h} ${d.w / 2} 0 Q${d.w / 2} -6 0 -6 Q${-d.w / 2} -6 ${-d.w / 2} 0Z`);
    p.setAttribute('class', 'dente');
    g.appendChild(p);
    svg.appendChild(g);
    return { g, d, cx, cy, ang };
  });
  svg.appendChild(svg.querySelector('.gengiva')); // gengiva por cima da raiz dos dentes
  const input = document.querySelector('[data-etapa]');
  const txt = document.querySelector('[data-etapa-txt]');
  function render() {
    const k = 1 - Number(input.value) / 100;
    const e = k * k * (3 - 2 * k); // suavização
    els.forEach(({ g, d, cx, cy, ang }) => {
      g.setAttribute('transform', `translate(${cx + d.dx * e * 1.6} ${cy + d.dy * e * 1.4}) rotate(${ang + d.r * e})`);
    });
    const v = Number(input.value);
    txt.textContent = v === 0 ? 'Início' : v === 100 ? 'Final previsto' : `Etapa ${Math.max(1, Math.round(v / 100 * 24))} de 24`;
    input.style.setProperty('--p', v + '%');
    svg.classList.toggle('pronto', v === 100);
  }
  input.addEventListener('input', render);
  render();

  // demonstração automática ao aparecer (uma vez)
  let tocou = false;
  input.addEventListener('pointerdown', () => { tocou = true; });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver((es, o) => es.forEach(en => {
      if (!en.isIntersecting) return;
      o.disconnect();
      let v = 0;
      const passo = () => { if (tocou || v >= 100) return; v = Math.min(100, v + 1.2); input.value = v; render(); requestAnimationFrame(passo); };
      setTimeout(passo, 400);
    }), { threshold: 0.5 }).observe(svg);
  }
})();
