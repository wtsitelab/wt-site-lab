/* ==========================================================================
   Kit Negócios — comportamentos compartilhados (WT Site Lab)
   Aviso de demonstração, cabeçalho ao rolar, menu mobile, animações de
   entrada, contadores, abas, filtros de grade, antes/depois, lightbox,
   formulários de demonstração e créditos das fotos (window.CREDITOS).
   ========================================================================== */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUZ = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // aviso de demonstração
  (function () {
    let fechado = false;
    try { fechado = sessionStorage.getItem('nb-demo') === '1'; } catch (e) {}
    if (fechado) return;
    const bar = document.createElement('div');
    bar.className = 'nb-demo';
    bar.innerHTML = '<p><strong>Site de demonstração.</strong> Empresa, pessoas, contatos e depoimentos são fictícios — modelo criado pela <a href="../../index.html#portfolio">WT Site Lab</a>.</p><button type="button" aria-label="Fechar aviso">×</button>';
    bar.querySelector('button').addEventListener('click', () => { bar.remove(); try { sessionStorage.setItem('nb-demo', '1'); } catch (e) {} });
    document.body.prepend(bar);
  })();

  // cabeçalho
  const header = $('.nb-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const btnMenu = $('.nb-menu-btn'), nav = $('.nb-nav');
  if (btnMenu && nav) {
    const fechar = () => { nav.classList.remove('is-open'); btnMenu.setAttribute('aria-expanded', 'false'); document.body.classList.remove('nb-travado'); };
    btnMenu.addEventListener('click', () => {
      const aberto = nav.classList.toggle('is-open');
      btnMenu.setAttribute('aria-expanded', String(aberto));
      document.body.classList.toggle('nb-travado', aberto);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', fechar));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });
  }
  $$('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // contadores [data-count="120" data-sufixo="+"]
  function contar(el) {
    const alvo = Number(el.dataset.count), suf = el.dataset.sufixo || '', pre = el.dataset.prefixo || '';
    const casas = Number(el.dataset.casas) || 0;
    const fmt = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
    if (REDUZ) { el.textContent = pre + fmt(alvo) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    (function passo(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(casas ? alvo * e : Math.round(alvo * e)) + suf;
      if (p < 1) requestAnimationFrame(passo);
    })(t0);
  }

  // entrada animada + contadores ao aparecer
  const reveals = $$('[data-reveal]');
  const contadores = $$('[data-count]');
  if ('IntersectionObserver' in window && !REDUZ) {
    $$('[data-reveal-grupo]').forEach(g => $$('[data-reveal]', g).forEach((el, i) => el.style.setProperty('--d', `${i * 90}ms`)));
    const io = new IntersectionObserver(ents => ents.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
    const ioc = new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting) { contar(en.target); ioc.unobserve(en.target); } }), { threshold: .6 });
    contadores.forEach(el => ioc.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
    contadores.forEach(contar);
  }

  // abas: [data-abas] com botões .aba[data-aba="x"] e painéis [data-painel="x"]
  $$('[data-abas]').forEach(box => {
    const botoes = $$('.aba', box);
    function ativar(nome) {
      botoes.forEach(b => b.setAttribute('aria-selected', String(b.dataset.aba === nome)));
      $$('[data-painel]', box).forEach(p => { p.hidden = p.dataset.painel !== nome; });
    }
    botoes.forEach(b => b.addEventListener('click', () => ativar(b.dataset.aba)));
    ativar((botoes.find(b => b.getAttribute('aria-selected') === 'true') || botoes[0]).dataset.aba);
  });

  // filtro de grade: [data-filtrar] com .filtro[data-f="x"] e itens [data-item="x y"]
  $$('[data-filtrar]').forEach(box => {
    const alvo = $(box.dataset.filtrar);
    $$('.filtro', box).forEach(b => b.addEventListener('click', () => {
      $$('.filtro', box).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $$('[data-item]', alvo).forEach(it => {
        const fora = b.dataset.f !== '*' && !it.dataset.item.split(' ').includes(b.dataset.f);
        it.classList.toggle('is-fora', fora);
        if (!fora && !REDUZ) { it.style.animation = 'none'; void it.offsetWidth; it.style.animation = 'nb-surgir .5s var(--ease)'; }
      });
    }));
  });

  // antes e depois: .ba com input[type=range]
  $$('.ba').forEach(ba => {
    const r = $('input[type=range]', ba);
    if (!r) return;
    const set = () => ba.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', set);
    set();
  });

  // lightbox: [data-lightbox] com <a href="foto.jpg" data-legenda="...">
  $$('[data-lightbox]').forEach(gal => {
    const links = $$('a', gal);
    links.forEach((a, i) => a.addEventListener('click', e => {
      e.preventDefault();
      let idx = i;
      const box = document.createElement('div');
      box.className = 'nb-lb';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML = '<button class="nb-lb-x" aria-label="Fechar">×</button><button class="nb-lb-ant" aria-label="Anterior">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="nb-lb-prox" aria-label="Próxima">›</button>';
      const img = $('img', box), cap = $('figcaption', box);
      const mostrar = () => { img.src = links[idx].href; img.alt = links[idx].dataset.legenda || ''; cap.textContent = links[idx].dataset.legenda || ''; };
      const fechar = () => { box.remove(); document.body.classList.remove('nb-travado'); document.removeEventListener('keydown', tecla); };
      const tecla = ev => { if (ev.key === 'Escape') fechar(); if (ev.key === 'ArrowRight') { idx = (idx + 1) % links.length; mostrar(); } if (ev.key === 'ArrowLeft') { idx = (idx - 1 + links.length) % links.length; mostrar(); } };
      $('.nb-lb-x', box).onclick = fechar;
      $('.nb-lb-ant', box).onclick = () => { idx = (idx - 1 + links.length) % links.length; mostrar(); };
      $('.nb-lb-prox', box).onclick = () => { idx = (idx + 1) % links.length; mostrar(); };
      box.addEventListener('click', ev => { if (ev.target === box) fechar(); });
      document.addEventListener('keydown', tecla);
      document.body.appendChild(box);
      document.body.classList.add('nb-travado');
      mostrar();
      $('.nb-lb-x', box).focus();
    }));
  });

  // formulários de demonstração
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-demo-form]');
    if (!f) return;
    e.preventDefault();
    const nota = $('[data-form-note]', f);
    if (nota) nota.textContent = f.dataset.msg || 'Formulário de demonstração — nenhum dado foi enviado. No site real, a mensagem chega direto à empresa.';
  });

  // créditos das fotos (licenças livres exigem atribuição)
  const cred = $('[data-creditos]');
  if (cred && window.CREDITOS && window.CREDITOS.length) {
    cred.innerHTML = 'Fotos via Wikimedia Commons: ' + window.CREDITOS.map(c => `${c.autor} (<a href="${c.fonte}" target="_blank" rel="noopener">${c.licenca}</a>)`).join(' · ') + '.';
  }
})();
