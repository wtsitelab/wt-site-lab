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
  // Fundo tecnológico animado do hero — canvas 2D puro, sem dependências:
  //  • rede de nós à deriva, com linhas entre pontos próximos;
  //  • o cursor vira um "nó" extra: liga-se aos pontos vizinhos e os atrai
  //    de leve, dando a sensação de que a rede reage a você;
  //  • pulsos de dados viajando pelas conexões, com rastro, pulando de nó
  //    em nó como um circuito;
  //  • clique no fundo solta uma onda de choque que empurra os nós;
  //  • holofote da grade azul (#gridLit) segue o mouse ou passeia sozinho.
  // ==========================================================================
  try {
    const heroEl = document.querySelector('.hero');
    const canvas = document.getElementById('heroParticles');
    const gridLit = document.getElementById('gridLit');
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

    if (heroEl && ctx && !REDUCE_MOTION) {
      let width = 0, height = 0, dpr = 1;
      let particles = [];
      let pulses = [];
      let waves = [];
      let lastFrameTime = performance.now();
      let lastMouseMove = 0;
      let pulseCooldown = 0;
      const mouse = { x: -9999, y: -9999, inside: false };
      const spot = { x: 0, y: 0 };
      let rafId = null;
      let running = false;

      // Tons de azul do logo (azul elétrico, azul médio, ciano)
      const PALETTE = ['11,99,246', '30,134,255', '19,181,234'];
      const LINK_DIST = 150;
      const MOUSE_DIST = 200;

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

        const count = Math.max(40, Math.min(120, Math.round((width * height) / 10000)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 1.3 + Math.random() * 1.9,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          twinkle: Math.random() * Math.PI * 2,
        }));
        pulses = [];
        waves = [];
        spot.x = width * 0.7;
        spot.y = height * 0.4;
      }

      function nearestNeighbor(from, exclude) {
        let target = null, bestDist = LINK_DIST;
        particles.forEach(c => {
          if (c === from || c === exclude) return;
          const d = Math.hypot(from.x - c.x, from.y - c.y);
          if (d < bestDist && d > 40) { bestDist = d; target = c; }
        });
        return target;
      }

      function step(now) {
        const dt = Math.min(now - lastFrameTime, 48);
        lastFrameTime = now;
        ctx.clearRect(0, 0, width, height);

        // Holofote da grade: segue o mouse; parado há 2s ou fora do hero,
        // passeia numa curva suave (Lissajous), mais pelo lado direito.
        const idle = !mouse.inside || now - lastMouseMove > 2000;
        const tx = idle ? width * (0.66 + 0.24 * Math.sin(now / 5200)) : mouse.x;
        const ty = idle ? height * (0.45 + 0.32 * Math.sin(now / 3700 + 1)) : mouse.y;
        spot.x += (tx - spot.x) * (idle ? 0.02 : 0.12);
        spot.y += (ty - spot.y) * (idle ? 0.02 : 0.12);
        if (gridLit) {
          gridLit.style.setProperty('--lx', spot.x.toFixed(1) + 'px');
          gridLit.style.setProperty('--ly', spot.y.toFixed(1) + 'px');
        }

        // Ondas de choque (clique no fundo)
        waves = waves.filter(w => {
          w.r += dt * 0.55;
          const life = 1 - w.r / w.max;
          if (life <= 0) return false;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(11,99,246,${(life * 0.35).toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
          ctx.stroke();
          particles.forEach(p => {
            const d = Math.hypot(p.x - w.x, p.y - w.y);
            if (Math.abs(d - w.r) < 24) {
              p.vx += ((p.x - w.x) / (d || 1)) * 0.5 * life;
              p.vy += ((p.y - w.y) / (d || 1)) * 0.5 * life;
            }
          });
          return true;
        });

        // Movimento: deriva + leve atração ao cursor (sem colar nele)
        particles.forEach(p => {
          if (mouse.inside) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < MOUSE_DIST && dist > 60) {
              const force = (MOUSE_DIST - dist) / MOUSE_DIST;
              p.vx += (dx / dist) * force * 0.012;
              p.vy += (dy / dist) * force * 0.012;
            } else if (dist <= 60) {
              p.vx -= (dx / (dist || 1)) * 0.03;
              p.vy -= (dy / (dist || 1)) * 0.03;
            }
          }
          // velocidade mínima para a rede nunca "parar"
          const sp = Math.hypot(p.vx, p.vy);
          if (sp < 0.12) {
            p.vx = sp < 0.01 ? (Math.random() - 0.5) * 0.2 : p.vx * 1.04;
            p.vy = sp < 0.01 ? (Math.random() - 0.5) * 0.2 : p.vy * 1.04;
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = width + 20; else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20; else if (p.y > height + 20) p.y = -20;
        });

        // Conexões entre nós
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < LINK_DIST) {
              ctx.strokeStyle = `rgba(${a.color},${((1 - dist / LINK_DIST) * 0.3).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        // Conexões do cursor com os nós vizinhos
        if (mouse.inside) {
          particles.forEach(p => {
            const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (dist < MOUSE_DIST) {
              ctx.strokeStyle = `rgba(11,99,246,${((1 - dist / MOUSE_DIST) * 0.5).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          });
        }

        // Nós, com halo suave nos maiores
        particles.forEach(p => {
          p.twinkle += dt * 0.003;
          const glow = 0.5 + Math.sin(p.twinkle) * 0.25;
          if (p.r > 2.6) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${p.color},${(glow * 0.18).toFixed(3)})`;
            ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.color},${glow.toFixed(2)})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Pulsos de dados viajando pelas conexões, com rastro
        pulseCooldown -= dt;
        if (pulseCooldown <= 0 && pulses.length < 10 && particles.length > 4) {
          const a = particles[Math.floor(Math.random() * particles.length)];
          const target = nearestNeighbor(a, null);
          if (target) pulses.push({ a, b: target, t: 0, duration: 600 + Math.random() * 500, hops: 2 + Math.floor(Math.random() * 3) });
          pulseCooldown = 140 + Math.random() * 220;
        }
        const next = [];
        pulses.forEach(p => {
          p.t += dt;
          const k = Math.min(p.t / p.duration, 1);
          const x = p.a.x + (p.b.x - p.a.x) * k;
          const y = p.a.y + (p.b.y - p.a.y) * k;
          const kt = Math.max(0, k - 0.25);
          const tx0 = p.a.x + (p.b.x - p.a.x) * kt;
          const ty0 = p.a.y + (p.b.y - p.a.y) * kt;
          const trail = ctx.createLinearGradient(tx0, ty0, x, y);
          trail.addColorStop(0, 'rgba(19,181,234,0)');
          trail.addColorStop(1, 'rgba(19,181,234,.85)');
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx0, ty0);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.fillStyle = 'rgba(19,181,234,.25)';
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = 'rgba(11,99,246,.95)';
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          if (k < 1) { next.push(p); return; }
          // chegou: o pulso segue para o próximo vizinho (efeito de circuito)
          if (p.hops > 0) {
            const target = nearestNeighbor(p.b, p.a);
            if (target) next.push({ a: p.b, b: target, t: 0, duration: p.duration, hops: p.hops - 1 });
          }
        });
        pulses = next;

        if (running) rafId = requestAnimationFrame(step);
      }

      function start() {
        if (running) return;
        running = true;
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(step);
      }
      function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      }

      resize();

      // O canvas só anima quando o hero está visível E a aba está em
      // primeiro plano; os dois estados são combinados em syncRunning().
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
        mouse.inside = true;
        lastMouseMove = performance.now();
      });
      heroEl.addEventListener('mouseleave', () => { mouse.inside = false; mouse.x = -9999; mouse.y = -9999; });
      heroEl.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const rect = heroEl.getBoundingClientRect();
        waves.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0, max: 420 });
      });

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
  // Cursor customizado — ponto preciso + anel com leve atraso (só desktop).
  // Cresce sobre links/botões, encolhe ao clicar, some sobre campos de texto
  // (volta o cursor nativo de digitação) e ao sair da janela.
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

      let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
      let ringRunning = false;

      const INTERACTIVE = 'a, button, select, summary, label, [role="button"], .magnet, .category-card';
      const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea';

      function ringLoop() {
        ringX += (mouseX - ringX) * 0.2;
        ringY += (mouseY - ringY) * 0.2;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
          requestAnimationFrame(ringLoop);
        } else {
          ringRunning = false;
        }
      }

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!document.body.classList.contains('cursor-visible')) {
          ringX = mouseX; ringY = mouseY;
          document.body.classList.add('cursor-visible');
        }
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        if (!ringRunning) { ringRunning = true; requestAnimationFrame(ringLoop); }

        const t = e.target instanceof Element ? e.target : null;
        const isText = !!(t && t.closest(TEXT_FIELD));
        const isInteractive = !isText && !!(t && t.closest(INTERACTIVE));
        document.body.classList.toggle('cursor-text', isText);
        ring.classList.toggle('is-active', isInteractive);
        dot.classList.toggle('is-active', isInteractive);
      }, { passive: true });

      document.addEventListener('mousedown', () => ring.classList.add('is-pressed'));
      document.addEventListener('mouseup', () => ring.classList.remove('is-pressed'));
      document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cursor-visible'));
    }
  } catch (err) {
    console.error('[WT Site Lab] Erro no cursor customizado:', err);
  }

  // ==========================================================================
  // Botões magnéticos — seguem o mouse quando ele se aproxima
  // ==========================================================================
  try {
    if (HAS_FINE_POINTER && !REDUCE_MOTION) {
      const strength = 12;
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
        note.style.color = '#B45309';
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
        note.style.color = '#DC2626';
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
        descricao: 'Criminal, trabalhista, família, empresarial e previdenciário.',
        // Sites de advocacia vêm com o pré-sistema de gestão incluso (sem
        // mensalidade). Só as 3 integrações opcionais cobram taxa única.
        bonus: {
          selo: 'Pré-sistema de gestão incluso',
          titulo: 'Todo site de advocacia vem com um pré-sistema de gestão',
          texto: 'Além do site, você recebe um sistema pronto para organizar o dia a dia do escritório — clientes, processos, prazos e financeiro num só lugar. Sem mensalidade.',
          itens: [
            'Cadastro de clientes e processos',
            'Prazos em Kanban com IA',
            'Financeiro do escritório',
            'Portal do cliente',
            'WhatsApp integrado',
            'App Android',
            'Login com verificação em duas etapas',
          ],
          nota: 'Opcionais, com taxa única de implantação (nunca mensalidade): assinatura eletrônica, rastreamento processual em tempo real e Google Calendar.',
          whatsapp: 'Olá! Tenho interesse no site de advocacia com o pré-sistema de gestão incluso.',
          // Telas reais do sistema, capturadas com dados fictícios de demonstração.
          galeria: {
            advogado: [
              { src: 'assets/sistema/adv-dashboard.jpg', legenda: 'Visão geral do escritório: clientes, processos ativos, recebimentos e audiências.' },
              { src: 'assets/sistema/adv-processos-kanban.jpg', legenda: 'Processos em quadro Kanban, organizados por status.' },
              { src: 'assets/sistema/adv-prazos-kanban.jpg', legenda: 'Prazos e desembargos em Kanban, com apoio de IA.' },
              { src: 'assets/sistema/adv-financeiro.jpg', legenda: 'Financeiro: contas a receber, despesas e resultado.' },
              { src: 'assets/sistema/adv-clientes.jpg', legenda: 'Cadastro de clientes pessoa física e jurídica, com acesso ao portal.' },
            ],
            cliente: [
              { src: 'assets/sistema/cli-inicio.jpg', legenda: 'Início do portal: o cliente vê o andamento do caso sem precisar ligar.' },
              { src: 'assets/sistema/cli-processos.jpg', legenda: 'Meus processos: o cliente acompanha o status de cada processo.' },
              { src: 'assets/sistema/cli-documentos.jpg', legenda: 'Documentos: o cliente envia e baixa arquivos direto pelo portal.' },
            ],
          },
        },
        exemplos: [
          { href: 'portfolio/adv-criminal/index.html', url: 'valadarestoledo.adv.br', gradiente: ['#0E0C0B', '#8E1B1B'], titulo: 'Valadares Toledo', sub: 'Advocacia Criminal · Plantão 24h', cardTitulo: 'Advocacia Criminal', cardDesc: 'Guia de emergência interativo, fases do processo penal e artigos.' },
          { href: 'portfolio/adv-trabalhista/index.html', url: 'pradonogueira.adv.br', gradiente: ['#0F3D2E', '#1F6B4F'], titulo: 'Prado Nogueira', sub: 'Trabalhista · empregados e empresas', cardTitulo: 'Advocacia Trabalhista', cardDesc: 'Calculadora de prazo, verificador de direitos e artigos.' },
          { href: 'portfolio/adv-familia/index.html', url: 'limacastro.adv.br', gradiente: ['#C97A57', '#7C8C74'], titulo: 'Lima Castro', sub: 'Família & Sucessões', cardTitulo: 'Família e Sucessões', cardDesc: 'Ferramenta "qual caminho para o inventário?" e artigos.' },
          { href: 'portfolio/adv-empresarial/index.html', url: 'kessleralmeida.adv.br', gradiente: ['#0E1A24', '#1F6F5C'], titulo: 'Kessler Almeida', sub: 'Empresarial & Tributário', cardTitulo: 'Empresarial e Tributário', cardDesc: 'Linha do tempo interativa da reforma tributária e insights.' },
          { href: 'portfolio/adv-previdenciario/index.html', url: 'rochamoraes.adv.br', gradiente: ['#12355B', '#1B8A8F'], titulo: 'Rocha Moraes', sub: 'Direito Previdenciário', cardTitulo: 'Direito Previdenciário', cardDesc: 'Simulador de aposentadoria, acessibilidade e artigos.' },
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

    const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
    const ICONES = {
      juridico: svg('<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0L6 7Zm12 0-3 7a3 3 0 0 0 6 0l-3-7Z"/>'),
      contabilidade: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
      alimentacao: svg('<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M17 21V3c-2 0-3 2-3 5v5h3"/>'),
      saude: svg('<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>'),
      arquitetura: svg('<path d="M3 21 12 3l9 18M7.5 13h9"/>'),
      automotivo: svg('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z"/>'),
      limpeza: svg('<path d="M12 3v7M8 10h8l1 11H7l1-11ZM4 14l2-1M20 14l-2-1"/>'),
      imoveis: svg('<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6"/>'),
      ecommerce: svg('<path d="M6 7h12l-1 13H7L6 7ZM9 7a3 3 0 0 1 6 0"/>'),
    };

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
          <span class="category-icon">${ICONES[cat.id] || cat.icone}</span>
          <h3>${cat.nome}</h3>
          <p>${cat.descricao}</p>
          ${cat.bonus ? `<span class="category-bonus">${cat.bonus.selo}</span>` : ''}
          <span class="category-count ${temExemplos ? 'has-examples' : 'is-soon'}">
            ${temExemplos ? `${cat.exemplos.length} exemplo${cat.exemplos.length > 1 ? 's' : ''}` : 'Em breve'}
          </span>
        `;
        card.addEventListener('click', () => abrirCategoriaComTransicao(cat, card));
        categoryGrid.appendChild(card);
      });

      // Galeria do sistema: abas advogado/cliente, tela principal em moldura
      // de navegador, miniaturas e ampliação em tela cheia (Esc/setas).
      function montarGaleria(painel, galeria) {
        const stageImg = painel.querySelector('.sys-shot img');
        const caption = painel.querySelector('.sys-caption');
        const thumbs = painel.querySelector('.sys-thumbs');
        const url = painel.querySelector('.sys-frame-url');
        let lado = 'advogado';
        let indice = 0;

        function render() {
          const itens = galeria[lado];
          const item = itens[indice];
          stageImg.classList.remove('is-in');
          void stageImg.offsetWidth;
          stageImg.src = item.src;
          stageImg.alt = item.legenda;
          stageImg.classList.add('is-in');
          caption.textContent = item.legenda;
          url.textContent = lado === 'advogado' ? 'sistema.seuescritorio.com.br' : 'portal.seuescritorio.com.br';
          thumbs.innerHTML = itens.map((it, i) => `
            <button type="button" class="sys-thumb${i === indice ? ' is-active' : ''}" data-i="${i}" aria-label="${it.legenda}">
              <img src="${it.src}" alt="" loading="lazy">
            </button>`).join('');
        }

        painel.querySelectorAll('.sys-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            lado = tab.dataset.lado;
            indice = 0;
            painel.querySelectorAll('.sys-tab').forEach(t => {
              const ativo = t === tab;
              t.classList.toggle('is-active', ativo);
              t.setAttribute('aria-selected', String(ativo));
            });
            render();
          });
        });
        thumbs.addEventListener('click', (e) => {
          const btn = e.target.closest('.sys-thumb');
          if (!btn) return;
          indice = Number(btn.dataset.i);
          render();
        });
        painel.querySelector('.sys-shot').addEventListener('click', () => abrirLightbox(galeria[lado], indice));
        render();
      }

      function abrirLightbox(itens, inicio) {
        let i = inicio;
        const box = document.createElement('div');
        box.className = 'sys-lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.innerHTML = `
          <button type="button" class="sys-lb-close" aria-label="Fechar">×</button>
          <button type="button" class="sys-lb-nav sys-lb-prev" aria-label="Anterior">‹</button>
          <figure><img alt=""><figcaption></figcaption></figure>
          <button type="button" class="sys-lb-nav sys-lb-next" aria-label="Próxima">›</button>`;
        const img = box.querySelector('img');
        const cap = box.querySelector('figcaption');
        function show() { img.src = itens[i].src; img.alt = itens[i].legenda; cap.textContent = itens[i].legenda; }
        function fechar() { box.remove(); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; }
        function onKey(e) {
          if (e.key === 'Escape') fechar();
          if (e.key === 'ArrowRight') { i = (i + 1) % itens.length; show(); }
          if (e.key === 'ArrowLeft') { i = (i - 1 + itens.length) % itens.length; show(); }
        }
        box.addEventListener('click', (e) => { if (e.target === box) fechar(); });
        box.querySelector('.sys-lb-close').addEventListener('click', fechar);
        box.querySelector('.sys-lb-prev').addEventListener('click', () => { i = (i - 1 + itens.length) % itens.length; show(); });
        box.querySelector('.sys-lb-next').addEventListener('click', () => { i = (i + 1) % itens.length; show(); });
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        document.body.appendChild(box);
        show();
        box.querySelector('.sys-lb-close').focus();
      }

      function mostrarCategoria(cat, cardEl) {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('is-active'));
        if (cardEl) cardEl.classList.add('is-active');

        examplesIcon.innerHTML = ICONES[cat.id] || cat.icone;
        examplesTitle.textContent = cat.nome;
        portfolioGrid.innerHTML = '';

        const bonusAntigo = examplesWrap.querySelector('.bonus-panel');
        if (bonusAntigo) bonusAntigo.remove();
        if (cat.bonus) {
          const b = cat.bonus;
          const painel = document.createElement('div');
          painel.className = 'bonus-panel';
          painel.innerHTML = `
            <div class="bonus-panel-head">
              <span class="bonus-panel-tag">Bônus incluso</span>
              <h4>${b.titulo}</h4>
              <p>${b.texto}</p>
            </div>
            <ul class="bonus-panel-list">
              ${b.itens.map(i => `<li>${i}</li>`).join('')}
            </ul>
            ${b.galeria ? `
            <div class="sys-gallery">
              <div class="sys-gallery-head">
                <p class="sys-gallery-title">Veja o sistema por dentro</p>
                <div class="sys-tabs" role="tablist" aria-label="Lado do sistema">
                  <button type="button" role="tab" class="sys-tab is-active" data-lado="advogado" aria-selected="true">Painel do advogado</button>
                  <button type="button" role="tab" class="sys-tab" data-lado="cliente" aria-selected="false">Portal do cliente</button>
                </div>
              </div>
              <figure class="sys-stage">
                <div class="sys-frame">
                  <div class="sys-frame-bar"><span></span><span></span><span></span><em class="sys-frame-url">sistema.seuescritorio.com.br</em></div>
                  <button type="button" class="sys-shot" aria-label="Ampliar tela"><img alt="" loading="lazy"></button>
                </div>
                <figcaption class="sys-caption"></figcaption>
              </figure>
              <div class="sys-thumbs"></div>
              <p class="sys-note">Telas reais do sistema, com dados fictícios de demonstração.</p>
            </div>` : ''}
            <div class="bonus-panel-foot">
              <p class="bonus-panel-note">${b.nota}</p>
              <a class="btn btn-primary" target="_blank" rel="noopener"
                 href="https://wa.me/5541988363816?text=${encodeURIComponent(b.whatsapp)}">Quero conhecer o sistema</a>
            </div>
          `;
          examplesWrap.insertBefore(painel, portfolioGrid);
          if (b.galeria) montarGaleria(painel, b.galeria);
        }

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
