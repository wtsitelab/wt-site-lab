// ===== WT Site Lab =====
(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

  // ==========================================================================
  // Mobile menu
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mainNav.classList.remove('open'))
    );
  }

  // ==========================================================================
  // Barra de progresso de rolagem + header com efeito ao rolar
  // ==========================================================================
  try {
    const scrollProgress = document.getElementById('scrollProgress');
    const header = document.getElementById('header');
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      if (scrollProgress) scrollProgress.style.width = pct + '%';
      if (header) header.classList.toggle('is-scrolled', scrollTop > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  } catch (err) {
    console.error('[WT Site Lab] Erro na barra de progresso:', err);
  }

  // ==========================================================================
  // Glow que segue o cursor no hero
  // ==========================================================================
  try {
    const hero = document.querySelector('.hero');
    const cursorGlow = document.getElementById('cursorGlow');
    if (hero && cursorGlow) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        cursorGlow.style.setProperty('--gx', (e.clientX - rect.left) + 'px');
        cursorGlow.style.setProperty('--gy', (e.clientY - rect.top) + 'px');
      });
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no glow do cursor:', err);
  }

  // ==========================================================================
  // Fundo tecnológico animado do hero — rede de partículas conectadas
  // (nós à deriva, linhas entre pontos próximos, repelidos suavemente pelo
  // mouse). Roda em canvas 2D puro, sem dependências externas.
  // ==========================================================================
  try {
    const heroEl = document.querySelector('.hero');
    const canvas = document.getElementById('heroParticles');
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

    if (heroEl && ctx && !REDUCE_MOTION) {
      let width = 0, height = 0, dpr = 1;
      let particles = [];
      const mouse = { x: -9999, y: -9999 };
      let rafId = null;
      let running = false;

      function resize() {
        const rect = heroEl.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.max(28, Math.min(80, Math.round((width * height) / 16000)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: 1.2 + Math.random() * 1.6,
        }));
      }

      function step() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx += (dx / (dist || 1)) * force * 0.03;
            p.vy += (dy / (dist || 1)) * force * 0.03;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = width + 20; else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20; else if (p.y > height + 20) p.y = -20;
        });

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 130) {
              ctx.strokeStyle = `rgba(217,166,255,${((1 - dist / 130) * 0.22).toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        particles.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(217,166,255,.65)';
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });

        if (running) rafId = requestAnimationFrame(step);
      }

      function start() {
        if (running) return;
        running = true;
        rafId = requestAnimationFrame(step);
      }
      function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      }

      resize();

      // O canvas só deve animar quando as DUAS condições forem verdadeiras ao
      // mesmo tempo: o hero está visível na tela E a aba está em primeiro
      // plano. Cada condição é controlada por um observer independente, então
      // guardamos os dois estados e recalculamos "running" a partir dos dois
      // juntos — evitar isso faria o canvas poder ficar travado pausado se um
      // evento de visibilidade da aba disparasse sem uma nova mudança de
      // interseção (já que o IntersectionObserver só dispara em transições).
      let inViewport = true;
      function syncRunning() {
        if (inViewport && !document.hidden) start(); else stop();
      }
      syncRunning();

      let resizeTicking = false;
      window.addEventListener('resize', () => {
        if (!resizeTicking) {
          resizeTicking = true;
          requestAnimationFrame(() => { resize(); resizeTicking = false; });
        }
      }, { passive: true });

      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroEl.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

      if ('IntersectionObserver' in window) {
        const particlesObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => { inViewport = entry.isIntersecting; });
          syncRunning();
        }, { threshold: 0 });
        particlesObserver.observe(heroEl);
      }
      document.addEventListener('visibilitychange', syncRunning);
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no fundo de partículas do hero:', err);
  }

  // ==========================================================================
  // Cursor customizado (ponto + anel com atraso) — só em desktop com mouse
  // ==========================================================================
  try {
    if (HAS_FINE_POINTER && !REDUCE_MOTION) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      const ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);
      document.body.classList.add('has-custom-cursor');

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }, { passive: true });

      function ringLoop() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(ringLoop);
      }
      requestAnimationFrame(ringLoop);

      document.querySelectorAll('a, button, .magnet').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
      });
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no cursor customizado:', err);
  }

  // ==========================================================================
  // Botões magnéticos — seguem o mouse quando ele se aproxima
  // ==========================================================================
  try {
    if (HAS_FINE_POINTER && !REDUCE_MOTION) {
      const strength = 8;
      const padding = 50;
      document.querySelectorAll('.magnet').forEach(el => {
        function onMove(e) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const maxDist = Math.max(rect.width, rect.height) / 2 + padding;
          if (Math.hypot(dx, dy) < maxDist) {
            el.style.transition = 'transform .3s ease-out';
            el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
          }
        }
        function onLeave() {
          el.style.transition = 'transform .6s cubic-bezier(.16,.84,.24,1)';
          el.style.transform = 'translate3d(0,0,0)';
        }
        document.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave);
      });
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no efeito magnético dos botões:', err);
  }

  // ==========================================================================
  // Tilt 3D nos cards ao passar o mouse
  // ==========================================================================
  function attachTilt(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-rx', (px * 8).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-ry', (py * -8).toFixed(2) + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    });
  }
  try {
    document.querySelectorAll('.tilt-card').forEach(attachTilt);
  } catch (err) {
    console.error('[WT Site Lab] Erro no efeito de tilt:', err);
  }

  // ==========================================================================
  // Contador animado (hero-meta)
  // ==========================================================================
  try {
    function animarContador(el) {
      const texto = el.textContent.trim();
      const match = texto.match(/^(\d+)([.,]?\d*)(.*)$/);
      if (!match) return; // símbolos como "∞" não são animados
      const inteiro = parseInt(match[1], 10);
      const resto = match[3] || '';
      const duracao = 1200;
      const inicio = performance.now();
      function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const valorAtual = Math.round(inteiro * progresso);
        el.textContent = valorAtual + resto;
        if (progresso < 1) requestAnimationFrame(passo);
        else el.textContent = texto;
      }
      requestAnimationFrame(passo);
    }

    const contadores = document.querySelectorAll('.meta-item strong');
    if ('IntersectionObserver' in window) {
      const contadorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animarContador(entry.target);
            contadorObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      contadores.forEach(el => contadorObserver.observe(el));
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no contador animado:', err);
  }

  // ==========================================================================
  // Anel de progresso animado (estatística Sebrae)
  // ==========================================================================
  try {
    const ringFill = document.getElementById('statRingFill');
    const ringNumber = document.getElementById('statRingNumber');
    if (ringFill && ringNumber && 'IntersectionObserver' in window) {
      const target = parseFloat(ringFill.dataset.target || '0');
      const circumference = 2 * Math.PI * 50; // r=50, ver CSS/SVG
      const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          ringFill.style.strokeDashoffset = (circumference * (1 - target / 100)).toFixed(1);
          const duracao = 1400;
          const inicio = performance.now();
          function passo(agora) {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            const valor = (target * progresso).toFixed(1).replace('.', ',');
            ringNumber.textContent = valor + '%';
            if (progresso < 1) requestAnimationFrame(passo);
          }
          requestAnimationFrame(passo);
          ringObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      ringObserver.observe(ringFill);
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no anel de progresso:', err);
  }

  // ==========================================================================
  // Faixa dupla (marquee) reativa ao scroll — linhas em direções opostas
  // ==========================================================================
  try {
    const section = document.getElementById('marqueeSection');
    const track1 = document.getElementById('marqueeTrack1');
    const track2 = document.getElementById('marqueeTrack2');
    if (section && track1 && track2) {
      // Triplica o conteúdo de cada faixa para permitir loop contínuo e limitado
      [track1, track2].forEach(track => {
        const original = track.innerHTML;
        track.innerHTML = original + original + original;
      });

      if (REDUCE_MOTION) {
        // Mantém as faixas estáticas para quem prefere menos movimento
      } else {
        let ticking = false;
        function updateMarquee() {
          ticking = false;
          const raw = (window.scrollY - section.offsetTop + window.innerHeight) * 0.22;
          const w1 = track1.scrollWidth / 3 || 1;
          const w2 = track2.scrollWidth / 3 || 1;
          let m1 = raw % w1; if (m1 < 0) m1 += w1;
          let m2 = raw % w2; if (m2 < 0) m2 += w2;
          track1.style.transform = `translate3d(${-m1}px,0,0)`;
          track2.style.transform = `translate3d(${m2 - w2}px,0,0)`;
        }
        function onScrollMarquee() {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateMarquee);
          }
        }
        window.addEventListener('scroll', onScrollMarquee, { passive: true });
        window.addEventListener('resize', onScrollMarquee, { passive: true });
        updateMarquee();
      }
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro na faixa de segmentos (marquee):', err);
  }

  // ==========================================================================
  // Mockup animado do hero — troca de tema (cores + texto) a cada intervalo
  // ==========================================================================
  try {
    const heroBrowserBody = document.getElementById('heroBrowserBody');
    const heroBrowserUrl = document.getElementById('heroBrowserUrl');
    if (heroBrowserBody) {
      const temas = [
        { classe: 'theme-1', url: 'contabilidade.com.br' },
        { classe: 'theme-2', url: 'advocacia.adv.br' },
        { classe: 'theme-3', url: 'confeitaria.com.br' },
        { classe: 'theme-4', url: 'sualoja.store' },
      ];
      let temaAtual = 0;
      heroBrowserBody.classList.add(temas[0].classe);
      setInterval(() => {
        heroBrowserBody.classList.remove(temas[temaAtual].classe);
        temaAtual = (temaAtual + 1) % temas.length;
        heroBrowserBody.classList.add(temas[temaAtual].classe);
        if (heroBrowserUrl) heroBrowserUrl.textContent = temas[temaAtual].url;
      }, 3200);
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no mockup animado do hero:', err);
  }

  // ==========================================================================
  // Texto "Sobre" — revelação caractere a caractere conforme o scroll
  // ==========================================================================
  try {
    const reveals = document.querySelectorAll('.reveal-text');
    if (reveals.length && !REDUCE_MOTION) {
      const updaters = [];
      reveals.forEach(el => {
        const texto = el.textContent;
        el.textContent = '';
        const chars = [];
        for (const ch of texto) {
          if (ch === ' ') {
            el.appendChild(document.createTextNode(' '));
            continue;
          }
          const span = document.createElement('span');
          span.className = 'ch';
          span.textContent = ch;
          el.appendChild(span);
          chars.push(span);
        }
        updaters.push(function update() {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const start = vh * 0.88;
          const end = vh * 0.3;
          let progresso = (start - rect.top) / (start - end);
          progresso = Math.max(0, Math.min(1, progresso));
          const n = chars.length || 1;
          chars.forEach((span, i) => {
            const p = Math.max(0, Math.min(1, progresso * n - i));
            span.style.opacity = (0.2 + 0.8 * p).toFixed(2);
          });
        });
      });

      let ticking = false;
      function updateReveals() {
        ticking = false;
        updaters.forEach(fn => fn());
      }
      function onScrollReveal() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateReveals);
        }
      }
      window.addEventListener('scroll', onScrollReveal, { passive: true });
      window.addEventListener('resize', onScrollReveal, { passive: true });
      updateReveals();
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro na revelação de texto da seção Sobre:', err);
  }

  // ==========================================================================
  // FAQ — acordeão (altura calculada dinamicamente pelo conteúdo real)
  // ==========================================================================
  try {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;
      question.setAttribute('aria-expanded', 'false');
      question.addEventListener('click', () => {
        const jaAberto = item.classList.contains('is-open');
        faqItems.forEach(i => {
          i.classList.remove('is-open');
          const a = i.querySelector('.faq-answer');
          const q = i.querySelector('.faq-question');
          if (a) a.style.maxHeight = '0px';
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!jaAberto) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  } catch (err) {
    console.error('[WT Site Lab] Erro no FAQ:', err);
  }

  // ==========================================================================
  // Scroll reveal — pequenas animações ao rolar a página (com stagger --i)
  // ==========================================================================
  try {
    if ('IntersectionObserver' in window) {
      const grupos = [
        '.compare-col', '.stat-banner', '.price-callout',
        '.category-card', '.portfolio-card', '.faq-item'
      ];
      grupos.forEach(seletor => {
        document.querySelectorAll(seletor).forEach((el, i) => {
          if (!el.style.getPropertyValue('--i')) {
            el.style.setProperty('--i', Math.min(i, 6));
          }
        });
      });

      const revealTargets = document.querySelectorAll(
        '.benefit-card, .service-row, .portfolio-card, .highlight-card, .compare-col, .stat-banner, .faq-item, .price-callout, .category-card'
      );
      revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealTargets.forEach(el => observer.observe(el));
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro na animação de rolagem:', err);
  }

  // ==========================================================================
  // Formulário de contato — envio real de e-mail via EmailJS
  //
  // O EmailJS permite enviar e-mail direto do navegador, sem precisar de um
  // servidor/back-end — funciona em qualquer hospedagem (Netlify, Vercel,
  // cPanel, etc.). Plano gratuito: ~200 e-mails/mês.
  //
  // >>> PARA ATIVAR: preencha as 3 constantes abaixo com os dados da sua
  // conta gratuita em https://www.emailjs.com — veja o passo a passo
  // completo no arquivo EMAILJS-SETUP.md incluído neste pacote.
  // ==========================================================================
  const EMAILJS_PUBLIC_KEY = 'aJ-FWGgljhFMpopPn';
  const EMAILJS_SERVICE_ID = 'service_9o8dsfw';
  const EMAILJS_TEMPLATE_ID = 'template_5jlqaml';

  const EMAILJS_CONFIGURADO =
    !EMAILJS_PUBLIC_KEY.includes('SUA_PUBLIC_KEY') &&
    !EMAILJS_SERVICE_ID.includes('SEU_SERVICE_ID') &&
    !EMAILJS_TEMPLATE_ID.includes('SEU_TEMPLATE_ID');

  if (!EMAILJS_CONFIGURADO) {
    console.warn(
      '[WT Site Lab] EmailJS ainda não configurado — o formulário de contato não vai enviar ' +
      'e-mail de verdade até você preencher EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID e ' +
      'EMAILJS_TEMPLATE_ID no topo do script.js. Veja EMAILJS-SETUP.md.'
    );
  }

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (form && note) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!EMAILJS_CONFIGURADO || !window.emailjs) {
        note.textContent = 'Formulário ainda não configurado para enviar e-mail de verdade (veja EMAILJS-SETUP.md). Por enquanto, chame no WhatsApp — é mais rápido!';
        note.style.color = '#F1D374';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';
      }
      note.textContent = '';
      note.style.color = '';

      try {
        // Inicializa (ou reinicializa) o EmailJS bem aqui, na hora do envio —
        // evita depender da ordem/timing de carregamento dos scripts na página.
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, { publicKey: EMAILJS_PUBLIC_KEY });
        note.textContent = 'Mensagem enviada com sucesso! Retornamos em até 24h úteis.';
        note.style.color = '';
        form.reset();
      } catch (err) {
        console.error('[WT Site Lab] Erro ao enviar e-mail via EmailJS:', err);
        note.textContent = 'Não foi possível enviar agora. Tente novamente ou chame no WhatsApp.';
        note.style.color = '#E5484D';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar mensagem';
        }
      }
    });
  }

  // ==========================================================================
  // Portfólio — categorias e exemplos (orientado a dados)
  // ==========================================================================
  try {
    const categorias = [
      {
        id: 'juridico', icone: '⚖️', nome: 'Serviços Jurídicos',
        descricao: 'Escritórios de advocacia e advogados autônomos.',
        exemplos: [
          { href: 'portfolio/advogado/index.html', url: 'oliveiramartins.adv.br', gradiente: ['#0A1428', '#C9A227'], titulo: 'Oliveira & Martins', sub: 'Trabalhista · Previdenciário · Civil', cardTitulo: 'Escritório de Advocacia', cardDesc: 'Áreas de atuação, equipe e blog jurídico.' },
          { href: 'portfolio/advogado-empresarial/index.html', url: 'barrosribeiro.adv.br', gradiente: ['#0D1210', '#10B981'], titulo: 'Barros Ribeiro', sub: 'Empresarial · LGPD · Compliance', cardTitulo: 'Advocacia Empresarial', cardDesc: 'Identidade corporativa, com insights e equipe.' },
          { href: 'portfolio/advogado-solo/index.html', url: 'camilarezende.adv.br', gradiente: ['#C0603E', '#7A8C74'], titulo: 'Dra. Camila Rezende', sub: 'Família e Sucessões', cardTitulo: 'Advogada Autônoma', cardDesc: 'Site pessoal, tom humano, depoimentos e FAQ.' },
        ],
      },
      {
        id: 'contabilidade', icone: '📊', nome: 'Contabilidade e Finanças',
        descricao: 'Escritórios contábeis e consultoria financeira.',
        exemplos: [
          { href: 'portfolio/contador/index.html', url: 'contabilidadeprime.com.br', gradiente: ['#0B2A4A', '#1E6FD9'], titulo: 'Contabilidade Prime', sub: 'Imposto de Renda · MEI · Simples Nacional', cardTitulo: 'Escritório de Contabilidade', cardDesc: 'Institucional + painel de vencimentos fiscais.' },
        ],
      },
      {
        id: 'alimentacao', icone: '🍽️', nome: 'Alimentação',
        descricao: 'Confeitarias, padarias e restaurantes.',
        exemplos: [
          { href: 'portfolio/doces/index.html', url: 'doceencanto.com.br', gradiente: ['#F8E1E7', '#6B4226'], titulo: 'Doce Encanto', sub: 'Bolos · Tortas · Doces · Salgados', cardTitulo: 'Confeitaria / Venda de Doces', cardDesc: 'Cardápio interativo, galeria e encomendas.' },
          { href: 'portfolio/restaurante-cantina/index.html', url: 'cantinadanonna.com.br', gradiente: ['#A6423A', '#5C3A21'], titulo: 'Cantina da Nonna', sub: 'Cozinha italiana tradicional', cardTitulo: 'Restaurante Familiar', cardDesc: 'Cardápio por categorias, galeria e reservas.' },
          { href: 'portfolio/restaurante-bistro/index.html', url: 'ambarbistro.com.br', gradiente: ['#14100D', '#C9962C'], titulo: 'Âmbar Bistrô', sub: 'Cozinha contemporânea', cardTitulo: 'Restaurante Alta Gastronomia', cardDesc: 'Identidade sofisticada, menu degustação.' },
        ],
      },
      {
        id: 'saude', icone: '🩺', nome: 'Saúde',
        descricao: 'Médicos, psicólogos e clínicas odontológicas.',
        exemplos: [
          { href: 'portfolio/odonto-familia/index.html', url: 'sorrisopleno.com.br', gradiente: ['#3E9DC7', '#1F3A4D'], titulo: 'Sorriso Pleno', sub: 'Odontologia para toda a família', cardTitulo: 'Clínica Odontológica Familiar', cardDesc: 'Tom acolhedor, tratamentos e equipe.' },
          { href: 'portfolio/odonto-premium/index.html', url: 'ortodental.com.br', gradiente: ['#0F2A43', '#00B8A9'], titulo: 'OrtoDental Curitiba', sub: 'Ortodontia digital de precisão', cardTitulo: 'Clínica Odontológica Premium', cardDesc: 'Identidade tech, tratamentos em abas.' },
        ],
      },
      {
        id: 'arquitetura', icone: '📐', nome: 'Arquitetura & Design',
        descricao: 'Escritórios de arquitetura e design de interiores.',
        exemplos: [
          { href: 'portfolio/arquitetura-traco/index.html', url: 'traco.arq.br', gradiente: ['#141414', '#A85C32'], titulo: 'Traço Arquitetura', sub: 'Projetos residenciais e comerciais', cardTitulo: 'Estúdio Minimalista', cardDesc: 'Portfólio de projetos com filtro por categoria.' },
          { href: 'portfolio/arquitetura-urbana/index.html', url: 'urbana.arq.br', gradiente: ['#8A9A7E', '#B5563C'], titulo: 'Urbana Arquitetura', sub: 'Interiores e pequenas reformas', cardTitulo: 'Arquitetura & Interiores', cardDesc: 'Comparador "antes e depois" interativo.' },
        ],
      },
      {
        id: 'automotivo', icone: '🔧', nome: 'Automotivo',
        descricao: 'Funilarias, auto elétricas e oficinas mecânicas.',
        exemplos: [
          { href: 'portfolio/funilaria-impacto/index.html', url: 'impactozero.com.br', gradiente: ['#1A1A1A', '#FF6B35'], titulo: 'Impacto Zero', sub: 'Funilaria · atendimento a seguradoras', cardTitulo: 'Funilaria Moderna', cardDesc: 'Foco em sinistros, orçamento digital.' },
          { href: 'portfolio/funilaria-boavista/index.html', url: 'funilariaboavista.com.br', gradiente: ['#1E3A5F', '#3D6491'], titulo: 'Funilaria Boa Vista', sub: 'Tradição de bairro desde 2003', cardTitulo: 'Funilaria Tradicional', cardDesc: 'Identidade familiar, história de bairro.' },
          { href: 'portfolio/autoeletrica-volt/index.html', url: 'voltautoeletrica.com.br', gradiente: ['#0A0E1A', '#FFD60A'], titulo: 'Volt', sub: 'Diagnóstico eletrônico de precisão', cardTitulo: 'Auto Elétrica Tech', cardDesc: 'Identidade digital, diagnóstico computadorizado.' },
          { href: 'portfolio/autoeletrica-central/index.html', url: 'autoeletricacentral.com.br', gradiente: ['#1C1C1C', '#FFC107'], titulo: 'Auto Elétrica Central', sub: 'Atendimento rápido e direto', cardTitulo: 'Auto Elétrica Tradicional', cardDesc: 'Simples, direto ao ponto, emergências.' },
          { href: 'portfolio/oficina-rotacerta/index.html', url: 'rotacerta.com.br', gradiente: ['#2E7D32', '#1B2A38'], titulo: 'Rota Certa', sub: 'Revisão programada e confiança', cardTitulo: 'Oficina Mecânica Geral', cardDesc: 'Diagnóstico transparente, revisão programada.' },
          { href: 'portfolio/oficina-torquemax/index.html', url: 'torquemax.com.br', gradiente: ['#0D0D0D', '#E10600'], titulo: 'TorqueMax', sub: 'Preparação e performance', cardTitulo: 'Oficina de Performance', cardDesc: 'Identidade agressiva, pacotes de preparação.' },
        ],
      },
      {
        id: 'limpeza', icone: '🧹', nome: 'Limpeza & Serviços',
        descricao: 'Empresas de limpeza residencial e comercial.',
        exemplos: [
          { href: 'portfolio/limpeza-cleanpro/index.html', url: 'cleanpro.com.br', gradiente: ['#1565C0', '#0D3C6E'], titulo: 'CleanPro', sub: 'Limpeza comercial e predial', cardTitulo: 'Limpeza Corporativa', cardDesc: 'Institucional B2B, segmentos atendidos.' },
          { href: 'portfolio/limpeza-faxina/index.html', url: 'faxinafacil.com.br', gradiente: ['#FFC93C', '#2EC4B6'], titulo: 'Faxina Fácil', sub: 'Limpeza residencial sob demanda', cardTitulo: 'Limpeza Residencial', cardDesc: 'Planos, agendamento simples e descontraído.' },
        ],
      },
      {
        id: 'imoveis', icone: '🏠', nome: 'Imóveis',
        descricao: 'Imobiliárias de pequeno e médio porte.',
        exemplos: [
          { href: 'portfolio/imoveis-chave/index.html', url: 'chaveimoveis.com.br', gradiente: ['#16324F', '#C1440E'], titulo: 'Chave Imóveis', sub: 'Compra, venda e locação', cardTitulo: 'Imobiliária com Listagem', cardDesc: 'Catálogo de imóveis com filtro comprar/alugar.' },
          { href: 'portfolio/imoveis-lar/index.html', url: 'larimoveis.com.br', gradiente: ['#C98074', '#6B6660'], titulo: 'Lar Imóveis', sub: 'Beatriz Andrade, corretora', cardTitulo: 'Corretora Autônoma', cardDesc: 'Site pessoal, curadoria de imóveis, depoimentos.' },
        ],
      },
      {
        id: 'ecommerce', icone: '🛍️', nome: 'Loja Virtual',
        descricao: 'E-commerce e lojas virtuais personalizáveis.',
        exemplos: [
          { href: 'portfolio/capinhas/index.html', url: 'case.store', gradiente: ['#7C3AED', '#0E0E12'], titulo: 'Case Store', sub: 'iPhone · Samsung · Motorola · Xiaomi', cardTitulo: 'Loja de Capinhas para Celular', cardDesc: 'Loja virtual com customizador interativo.' },
        ],
      },
    ];

    const categoryGrid = document.getElementById('categoryGrid');
    const examplesWrap = document.getElementById('portfolioExamples');
    const examplesTitle = document.getElementById('examplesTitle');
    const examplesIcon = document.getElementById('examplesIcon');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const examplesClose = document.getElementById('examplesClose');

    if (categoryGrid && examplesWrap && portfolioGrid) {
      categorias.forEach(cat => {
        const temExemplos = cat.exemplos.length > 0;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'category-card';
        card.innerHTML = `
          <span class="category-icon">${cat.icone}</span>
          <h3>${cat.nome}</h3>
          <p>${cat.descricao}</p>
          <span class="category-count ${temExemplos ? 'has-examples' : 'is-soon'}">
            ${temExemplos ? `${cat.exemplos.length} exemplo${cat.exemplos.length > 1 ? 's' : ''}` : 'Em breve'}
          </span>
        `;
        card.addEventListener('click', () => abrirCategoriaComTransicao(cat, card));
        categoryGrid.appendChild(card);
      });

      function mostrarCategoria(cat, cardEl) {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('is-active'));
        if (cardEl) cardEl.classList.add('is-active');

        examplesIcon.textContent = cat.icone;
        examplesTitle.textContent = cat.nome;
        portfolioGrid.innerHTML = '';

        if (!cat.exemplos.length) {
          portfolioGrid.innerHTML = `<p class="examples-empty">Ainda estamos preparando exemplos para este segmento — volte em breve ou chame no WhatsApp que já te mostramos o que está em produção.</p>`;
        } else {
          cat.exemplos.forEach(ex => {
            const a = document.createElement('a');
            a.className = 'portfolio-card tilt-card';
            a.href = ex.href;
            a.target = '_blank';
            a.rel = 'noopener';
            a.innerHTML = `
              <div class="browser-mock">
                <div class="browser-bar"><span></span><span></span><span></span><span class="browser-url">${ex.url}</span></div>
                <div class="browser-preview" style="background:linear-gradient(160deg, ${ex.gradiente[0]}, ${ex.gradiente[1]})">
                  <span class="preview-title">${ex.titulo}</span>
                  <span class="preview-sub">${ex.sub}</span>
                </div>
              </div>
              <div class="portfolio-info">
                <h3>${ex.cardTitulo}</h3>
                <p>${ex.cardDesc}</p>
                <span class="portfolio-link">Abrir site completo ↗</span>
              </div>
            `;
            portfolioGrid.appendChild(a);
            attachTilt(a);
          });
        }

        examplesWrap.hidden = false;
        if (typeof examplesWrap.scrollIntoView === 'function') {
          examplesWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      // "Card-birth": o cartão clicado se expande visualmente até virar o
      // painel de exemplos, em vez de o painel simplesmente aparecer.
      function abrirCategoriaComTransicao(cat, cardEl) {
        try {
          if (REDUCE_MOTION || !cardEl || typeof cardEl.getBoundingClientRect !== 'function') {
            mostrarCategoria(cat, cardEl);
            return;
          }
          const startRect = cardEl.getBoundingClientRect();
          const gridRect = categoryGrid.getBoundingClientRect();
          const overlay = document.createElement('div');
          overlay.className = 'card-birth-overlay';
          overlay.style.top = startRect.top + 'px';
          overlay.style.left = startRect.left + 'px';
          overlay.style.width = startRect.width + 'px';
          overlay.style.height = startRect.height + 'px';
          document.body.appendChild(overlay);
          // força reflow para garantir que a transição parta do estado inicial
          void overlay.getBoundingClientRect();

          requestAnimationFrame(() => {
            overlay.style.top = (gridRect.bottom + 36) + 'px';
            overlay.style.left = gridRect.left + 'px';
            overlay.style.width = gridRect.width + 'px';
            overlay.style.height = Math.min(window.innerHeight * 0.62, 460) + 'px';
            overlay.style.borderRadius = '32px';
          });

          setTimeout(() => {
            mostrarCategoria(cat, cardEl);
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 400);
          }, 520);
        } catch (err) {
          console.error('[WT Site Lab] Erro na transição do portfólio:', err);
          mostrarCategoria(cat, cardEl);
        }
      }

      if (examplesClose) {
        examplesClose.addEventListener('click', () => {
          examplesWrap.hidden = true;
          document.querySelectorAll('.category-card').forEach(c => c.classList.remove('is-active'));
        });
      }
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no sistema de categorias do portfólio:', err);
  }
})();
