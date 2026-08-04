// ===== WT Site Lab =====
(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

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
  // Tilt 3D nos cards ao passar o mouse
  // ==========================================================================
  try {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
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
    });
  } catch (err) {
    console.error('[WT Site Lab] Erro no efeito de tilt:', err);
  }

  // ==========================================================================
  // Contador animado (hero-meta e estatística do comparativo)
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

    const contadores = document.querySelectorAll('.meta-item strong, .stat-banner-number');
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
  // FAQ — acordeão
  // ==========================================================================
  try {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;
      question.addEventListener('click', () => {
        const jaAberto = item.classList.contains('is-open');
        faqItems.forEach(i => i.classList.remove('is-open'));
        if (!jaAberto) item.classList.add('is-open');
      });
    });
  } catch (err) {
    console.error('[WT Site Lab] Erro no FAQ:', err);
  }

  // ==========================================================================
  // Scroll reveal — pequenas animações ao rolar a página
  // ==========================================================================
  try {
    if ('IntersectionObserver' in window) {
      const revealTargets = document.querySelectorAll(
        '.benefit-card, .service-step, .portfolio-card, .highlight-card, .compare-col, .stat-banner, .faq-item, .price-callout'
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
        card.addEventListener('click', () => mostrarCategoria(cat, card));
        categoryGrid.appendChild(card);
      });

      function mostrarCategoria(cat, cardEl) {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('is-active'));
        cardEl.classList.add('is-active');

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

      if (examplesClose) {
        examplesClose.addEventListener('click', () => {
          examplesWrap.hidden = true;
          document.querySelectorAll('.category-card').forEach(c => c.classList.remove('is-active'));
        });
      }
    }

    // Aplica o mesmo efeito de tilt 3D usado nos outros cards (função definida
    // mais abaixo neste arquivo é reaproveitada via referência global abaixo)
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
  } catch (err) {
    console.error('[WT Site Lab] Erro no sistema de categorias do portfólio:', err);
  }
})();
