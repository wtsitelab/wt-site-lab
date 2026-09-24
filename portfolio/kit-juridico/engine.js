/* ==========================================================================
   Kit Jurídico — motor compartilhado dos sites de demonstração de advocacia
   (WT Site Lab). Cada site define window.SITE em content.js e marca a página
   com <body data-page="home|blog|artigo">. Este arquivo cuida de:
   • aviso de "site de demonstração" no topo;
   • header ao rolar, menu mobile, animações de entrada, ano no rodapé;
   • cartões de artigos (home), listagem com busca e filtro (blog);
   • leitor de artigo com índice, barra de progresso, compartilhar e relacionados;
   • capas geradas em SVG (cada site tem seu estilo de arte);
   • formulários de demonstração (não enviam nada).
   ========================================================================== */
(function () {
  'use strict';

  const SITE = window.SITE;
  if (!SITE) return;
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const page = document.body.dataset.page || 'home';

  const artigos = [...SITE.artigos].sort((a, b) => b.data.localeCompare(a.data));

  // ---------- utilidades ----------
  function formatarData(iso) {
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
  function minutosLeitura(html) {
    const palavras = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
    return Math.max(2, Math.round(palavras / 200));
  }
  function autorDe(id) {
    return SITE.equipe.find(p => p.id === id) || SITE.equipe[0];
  }
  function iniciais(nome) {
    return nome.replace(/^(Dra?\.)\s*/, '').split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }
  function seed(str) {
    let h = 2166136261;
    for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  function linkArtigo(slug) { return `artigo.html?a=${encodeURIComponent(slug)}`; }

  // ---------- capas em SVG (arte abstrata, um estilo por site) ----------
  const ESTILOS = {
    // Criminal: faixas de luz diagonais sobre preto, com granulação
    noir(r, [c1, c2, c3]) {
      let s = `<rect width="800" height="450" fill="${c1}"/>`;
      for (let i = 0; i < 7; i++) {
        const x = r() * 900 - 100, w = 20 + r() * 120;
        s += `<polygon points="${x},0 ${x + w},0 ${x + w - 260},450 ${x - 260},450" fill="${i % 3 === 0 ? c3 : c2}" opacity="${(0.05 + r() * 0.18).toFixed(2)}"/>`;
      }
      s += `<circle cx="${560 + r() * 160}" cy="${120 + r() * 160}" r="${60 + r() * 50}" fill="none" stroke="${c3}" stroke-width="1.2" opacity=".6"/>`;
      s += `<rect width="800" height="450" filter="url(#grao)" opacity=".35"/>`;
      return s;
    },
    // Trabalhista: blocos geométricos ousados em grade
    blocos(r, [c1, c2, c3]) {
      let s = `<rect width="800" height="450" fill="${c1}"/>`;
      const cols = 8, rows = 4, w = 100, h = 112.5;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const v = r();
        if (v < 0.22) s += `<rect x="${x * w}" y="${y * h}" width="${w}" height="${h}" fill="${c2}"/>`;
        else if (v < 0.32) s += `<circle cx="${x * w + 50}" cy="${y * h + 56}" r="38" fill="${c3}"/>`;
        else if (v < 0.42) s += `<path d="M${x * w} ${y * h + h} L${x * w + w} ${y * h} L${x * w + w} ${y * h + h}Z" fill="${c3}" opacity=".85"/>`;
      }
      return s;
    },
    // Família: formas orgânicas suaves sobrepostas
    organico(r, [c1, c2, c3]) {
      let s = `<rect width="800" height="450" fill="${c1}"/>`;
      for (let i = 0; i < 4; i++) {
        const cx = r() * 800, cy = r() * 450, rx = 140 + r() * 180, ry = 110 + r() * 140;
        s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${i % 2 ? c2 : c3}" opacity="${(0.35 + r() * 0.35).toFixed(2)}" transform="rotate(${Math.round(r() * 60 - 30)} ${cx} ${cy})"/>`;
      }
      s += `<path d="M0 ${320 + r() * 60} C 200 ${260 + r() * 80}, 420 ${400 + r() * 40}, 800 ${300 + r() * 60} L800 450 L0 450Z" fill="${c2}" opacity=".5"/>`;
      return s;
    },
    // Empresarial: linhas finas tipo gráfico/arquitetura
    linhas(r, [c1, c2, c3]) {
      let s = `<rect width="800" height="450" fill="${c1}"/>`;
      for (let i = 0; i <= 16; i++) s += `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="450" stroke="${c2}" stroke-width=".6" opacity=".35"/>`;
      for (let i = 0; i <= 9; i++) s += `<line x1="0" y1="${i * 50}" x2="800" y2="${i * 50}" stroke="${c2}" stroke-width=".6" opacity=".35"/>`;
      let d = `M0 ${300 + r() * 80}`;
      for (let x = 50; x <= 800; x += 50) d += ` L${x} ${Math.max(40, 380 - x * 0.32 - r() * 90)}`;
      s += `<path d="${d}" fill="none" stroke="${c3}" stroke-width="3"/>`;
      s += `<path d="${d} L800 450 L0 450Z" fill="${c3}" opacity=".08"/>`;
      for (let i = 0; i < 5; i++) { const x = 80 + i * 140, h = 60 + r() * 180; s += `<rect x="${x}" y="${450 - h}" width="34" height="${h}" fill="${c2}" opacity=".18"/>`; }
      return s;
    },
    // Previdenciário: sol/horizonte em faixas suaves (acolhedor, alto contraste)
    horizonte(r, [c1, c2, c3]) {
      let s = `<rect width="800" height="450" fill="${c1}"/>`;
      const cx = 200 + r() * 400;
      s += `<circle cx="${cx}" cy="300" r="${130 + r() * 40}" fill="${c3}"/>`;
      for (let i = 0; i < 5; i++) {
        const y = 300 + i * 34;
        s += `<rect x="0" y="${y}" width="800" height="${18 + i * 4}" fill="${c2}" opacity="${(0.55 + i * 0.1).toFixed(2)}"/>`;
      }
      return s;
    },
  };
  function capaSVG(artigo, extraClass = '') {
    const r = seed(artigo.slug);
    const gerar = ESTILOS[SITE.capa.estilo] || ESTILOS.linhas;
    const paleta = SITE.capa.paletas[Math.floor(r() * SITE.capa.paletas.length)];
    return `<svg class="capa ${extraClass}" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${artigo.categoria}">
      <defs><filter id="grao"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>
      ${gerar(r, paleta)}
    </svg>`;
  }
  window.JK = { capaSVG, formatarData, minutosLeitura, autorDe, iniciais };

  // ---------- aviso de site de demonstração ----------
  (function avisoDemo() {
    let fechado = false;
    try { fechado = sessionStorage.getItem('jk-demo-fechado') === '1'; } catch (e) {}
    if (fechado) return;
    const bar = document.createElement('div');
    bar.className = 'jk-demo';
    bar.innerHTML = `<p><strong>Site de demonstração.</strong> Escritório, pessoas e contatos são fictícios — modelo criado pela
      <a href="../../index.html#portfolio">WT Site Lab</a>.</p><button type="button" aria-label="Fechar aviso">×</button>`;
    bar.querySelector('button').addEventListener('click', () => {
      bar.remove();
      try { sessionStorage.setItem('jk-demo-fechado', '1'); } catch (e) {}
    });
    document.body.prepend(bar);
  })();

  // ---------- header, menu, ano ----------
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const aberto = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(aberto));
      document.body.classList.toggle('menu-aberto', aberto);
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-aberto');
    }));
  }
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // ---------- cartões de artigo ----------
  function cardArtigo(a, variante = '') {
    const autor = autorDe(a.autor);
    return `<article class="post-card ${variante}">
      <a class="post-card-link" href="${linkArtigo(a.slug)}">
        <div class="post-card-capa">${capaSVG(a)}</div>
        <div class="post-card-body">
          <p class="post-card-meta"><span class="post-cat">${a.categoria}</span><span>${minutosLeitura(a.corpo)} min de leitura</span></p>
          <h3 class="post-card-title">${a.titulo}</h3>
          <p class="post-card-resumo">${a.resumo}</p>
          <p class="post-card-autor"><span class="avatar avatar-sm" aria-hidden="true">${iniciais(autor.nome)}</span>${autor.nome} · ${formatarData(a.data)}</p>
        </div>
      </a>
    </article>`;
  }
  $$('[data-articles]').forEach(el => {
    const n = Number(el.dataset.articles) || 3;
    el.innerHTML = artigos.slice(0, n).map((a, i) => cardArtigo(a, i === 0 && el.hasAttribute('data-featured') ? 'post-card-destaque' : '')).join('');
  });

  // ---------- página de blog: busca + filtro por categoria ----------
  if (page === 'blog') {
    const grid = $('[data-blog-grid]');
    const chips = $('[data-blog-chips]');
    const busca = $('[data-blog-search]');
    const vazio = $('[data-blog-empty]');
    const categorias = ['Todos', ...new Set(artigos.map(a => a.categoria))];
    let cat = 'Todos';
    const params = new URLSearchParams(location.search);
    if (params.get('cat') && categorias.includes(params.get('cat'))) cat = params.get('cat');

    function render() {
      const termo = (busca && busca.value || '').trim().toLowerCase();
      const lista = artigos.filter(a =>
        (cat === 'Todos' || a.categoria === cat) &&
        (!termo || (a.titulo + ' ' + a.resumo + ' ' + a.corpo.replace(/<[^>]+>/g, ' ')).toLowerCase().includes(termo)));
      grid.innerHTML = lista.map(a => cardArtigo(a)).join('');
      if (vazio) vazio.hidden = lista.length > 0;
      chips.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    }
    chips.innerHTML = categorias.map(c => `<button type="button" class="chip" data-cat="${c}">${c}</button>`).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      cat = b.dataset.cat;
      render();
    });
    if (busca) busca.addEventListener('input', render);
    render();
  }

  // ---------- página de artigo ----------
  if (page === 'artigo') {
    const slug = new URLSearchParams(location.search).get('a');
    const a = artigos.find(x => x.slug === slug) || artigos[0];
    const autor = autorDe(a.autor);
    document.title = `${a.titulo} — ${SITE.nome}`;
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', a.resumo);

    const alvo = $('[data-article]');
    alvo.innerHTML = `
      <header class="art-head">
        <nav class="art-crumbs" aria-label="Você está em"><a href="index.html">Início</a><span>/</span><a href="blog.html">Artigos</a><span>/</span><a href="blog.html?cat=${encodeURIComponent(a.categoria)}">${a.categoria}</a></nav>
        <p class="art-cat">${a.categoria}</p>
        <h1 class="art-title">${a.titulo}</h1>
        <p class="art-dek">${a.resumo}</p>
        <div class="art-byline">
          <span class="avatar" aria-hidden="true">${iniciais(autor.nome)}</span>
          <div><strong>${autor.nome}</strong><span>${autor.cargo}</span></div>
          <div class="art-byline-meta"><span>${formatarData(a.data)}</span><span>${minutosLeitura(a.corpo)} min de leitura</span></div>
        </div>
      </header>
      <figure class="art-capa">${capaSVG(a, 'capa-grande')}</figure>
      <div class="art-layout">
        <aside class="art-aside">
          <div class="art-toc"><p class="art-toc-title">Neste artigo</p><ol data-toc></ol></div>
          <div class="art-share">
            <p class="art-toc-title">Compartilhar</p>
            <button type="button" class="share-btn" data-share="copiar">Copiar link</button>
            <a class="share-btn" data-share="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
            <a class="share-btn" data-share="linkedin" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </aside>
        <div class="art-body prose">${a.corpo}
          <div class="art-aviso"><strong>Conteúdo informativo.</strong> Este texto tem caráter educativo e não substitui a análise individual do seu caso por um advogado. Última revisão: ${formatarData(a.revisao || a.data)}.</div>
          <div class="art-autor">
            <span class="avatar avatar-lg" aria-hidden="true">${iniciais(autor.nome)}</span>
            <div><p class="art-autor-nome">${autor.nome}</p><p class="art-autor-cargo">${autor.cargo} · ${autor.oab}</p><p class="art-autor-bio">${autor.bio}</p></div>
          </div>
        </div>
      </div>`;

    // índice automático a partir dos h2
    const toc = $('[data-toc]', alvo);
    $$('.art-body h2', alvo).forEach((h, i) => {
      h.id = h.id || `secao-${i + 1}`;
      toc.insertAdjacentHTML('beforeend', `<li><a href="#${h.id}">${h.textContent}</a></li>`);
    });
    const linksToc = $$('a', toc);
    if ('IntersectionObserver' in window && linksToc.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) linksToc.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      $$('.art-body h2', alvo).forEach(h => io.observe(h));
    }

    // compartilhar
    const url = location.href;
    $('[data-share="whatsapp"]', alvo).href = `https://wa.me/?text=${encodeURIComponent(a.titulo + ' — ' + url)}`;
    $('[data-share="linkedin"]', alvo).href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    $('[data-share="copiar"]', alvo).addEventListener('click', e => {
      const btn = e.currentTarget;
      const ok = () => { btn.textContent = 'Link copiado ✓'; setTimeout(() => { btn.textContent = 'Copiar link'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, ok); else ok();
    });

    // relacionados
    const rel = $('[data-related]');
    if (rel) {
      const outros = artigos.filter(x => x.slug !== a.slug);
      outros.sort((x, y) => (y.categoria === a.categoria) - (x.categoria === a.categoria));
      rel.innerHTML = outros.slice(0, 3).map(x => cardArtigo(x)).join('');
    }

    // barra de progresso de leitura
    const barra = $('[data-progress]');
    if (barra) {
      const corpo = $('.art-body', alvo);
      const onScroll = () => {
        const r = corpo.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
        barra.style.transform = `scaleX(${p})`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  // ---------- equipe (cartões com monograma) ----------
  $$('[data-team]').forEach(el => {
    el.innerHTML = SITE.equipe.map(p => `
      <article class="team-card" data-reveal>
        <div class="team-foto" aria-hidden="true"><span>${iniciais(p.nome)}</span></div>
        <div class="team-body">
          <h3>${p.nome}</h3>
          <p class="team-cargo">${p.cargo}</p>
          <p class="team-oab">${p.oab}</p>
          <p class="team-bio">${p.bio}</p>
          ${p.formacao ? `<ul class="team-formacao">${p.formacao.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
        </div>
      </article>`).join('');
  });

  // ---------- formulários de demonstração ----------
  $$('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nota = $('[data-form-note]', form);
      if (nota) nota.textContent = 'Este é um formulário de demonstração — nenhum dado foi enviado. No site real, a mensagem chega direto ao escritório.';
      form.classList.add('is-sent');
    });
  });

  // ---------- animações de entrada ----------
  const reveals = $$('[data-reveal]');
  if (!REDUCE && 'IntersectionObserver' in window) {
    reveals.forEach((el, i) => {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${(i % 4) * 80}ms`);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }
})();
