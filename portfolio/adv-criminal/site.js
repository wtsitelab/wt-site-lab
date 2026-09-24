// Interações próprias do site criminal: guia de emergência em etapas e
// linha do tempo das fases do processo penal.
(function () {
  'use strict';

  // ---------- Guia "Alguém foi preso" ----------
  const guia = document.querySelector('[data-guia]');
  if (guia) {
    const tabs = [...guia.querySelectorAll('[data-step]')];
    const steps = [...guia.querySelectorAll('.guia-step')];
    const bar = guia.querySelector('[data-guia-bar]');
    const next = guia.querySelector('[data-guia-next]');
    const prev = guia.querySelector('[data-guia-prev]');
    let atual = 0;

    function ir(i) {
      atual = Math.max(0, Math.min(steps.length - 1, i));
      tabs.forEach((t, k) => {
        t.setAttribute('aria-selected', String(k === atual));
        t.classList.toggle('is-done', k < atual);
      });
      steps.forEach((s, k) => s.classList.toggle('is-active', k === atual));
      bar.style.transform = `scaleX(${(atual + 1) / steps.length})`;
      prev.disabled = atual === 0;
      next.textContent = atual === steps.length - 1 ? 'Falar com o plantão →' : 'Próxima etapa →';
    }
    tabs.forEach(t => t.addEventListener('click', () => ir(Number(t.dataset.step))));
    prev.addEventListener('click', () => ir(atual - 1));
    next.addEventListener('click', () => {
      if (atual === steps.length - 1) { document.getElementById('contato').scrollIntoView({ behavior: 'smooth' }); return; }
      ir(atual + 1);
    });
    ir(0);
  }

  // ---------- Fases do processo penal ----------
  const FASES = [
    { nome: 'Investigação', texto: 'Inquérito policial ou procedimento do Ministério Público. A defesa acompanha depoimentos, requer diligências, analisa provas digitais e avalia acordos como o ANPP antes mesmo de haver processo.', base: 'CPP, arts. 4º a 23 e 28-A' },
    { nome: 'Denúncia', texto: 'O Ministério Público oferece a acusação formal. A defesa examina se há justa causa e se a descrição dos fatos permite o exercício pleno do contraditório.', base: 'CPP, arts. 41 e 395' },
    { nome: 'Resposta à acusação', texto: 'Primeira manifestação escrita da defesa no processo: preliminares, documentos, rol de testemunhas e, quando cabível, pedido de absolvição sumária.', base: 'CPP, arts. 396-A e 397' },
    { nome: 'Instrução', texto: 'Audiência em que são ouvidas vítima, testemunhas e, por último, o acusado. Momento de produzir prova, contraditar depoimentos e preparar as alegações finais.', base: 'CPP, arts. 400 a 405' },
    { nome: 'Sentença', texto: 'O juiz absolve ou condena. Em caso de condenação, a defesa verifica a dosimetria da pena, o regime inicial e a possibilidade de substituição por penas alternativas.', base: 'CPP, arts. 381 a 392' },
    { nome: 'Recursos', texto: 'Apelação ao tribunal e, conforme o caso, recursos especial e extraordinário. Habeas corpus pode ser impetrado paralelamente diante de ilegalidade evidente.', base: 'CPP, arts. 593 e seguintes' },
    { nome: 'Execução', texto: 'Cumprimento da pena: progressão de regime, livramento condicional, remição pelo trabalho ou estudo e demais direitos previstos na Lei de Execução Penal.', base: 'Lei nº 7.210/1984' },
  ];
  const fases = document.querySelector('[data-fases]');
  const detalhe = document.querySelector('[data-fase-detalhe]');
  if (fases && detalhe) {
    const botoes = [...fases.querySelectorAll('[data-fase]')];
    const bar = fases.querySelector('[data-fases-bar]');
    function mostrar(i) {
      botoes.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.classList.toggle('is-past', k < i); });
      bar.style.transform = `scaleX(${i / (botoes.length - 1)})`;
      const f = FASES[i];
      detalhe.innerHTML = `<p class="fase-idx">Fase ${String(i + 1).padStart(2, '0')} de 07</p><h3>${f.nome}</h3><p>${f.texto}</p><p class="fase-base">${f.base}</p>`;
      detalhe.classList.remove('is-anim'); void detalhe.offsetWidth; detalhe.classList.add('is-anim');
    }
    botoes.forEach((b, i) => {
      b.addEventListener('click', () => mostrar(i));
      b.addEventListener('mouseenter', () => mostrar(i));
      b.addEventListener('focus', () => mostrar(i));
    });
    mostrar(0);
  }

  // ---------- Feixe de luz do hero segue o mouse (sutil) ----------
  const hero = document.querySelector('.hero');
  const luz = document.querySelector('.hero-luz');
  if (hero && luz && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      luz.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      luz.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }
})();
