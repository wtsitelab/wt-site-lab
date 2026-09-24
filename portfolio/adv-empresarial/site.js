// Linha do tempo interativa da reforma tributária (EC nº 132/2023 e
// LC nº 214/2025) e painel do hero com o ano corrente da transição.
(function () {
  'use strict';

  // v = participação relativa no modelo daquele ano (0 a 100), só para visualização
  const ANOS = {
    2026: { titulo: 'Ano de teste', texto: 'CBS a 0,9% e IBS a 0,1%, compensáveis com PIS e Cofins, com dispensa de recolhimento para quem cumprir as obrigações acessórias. Momento de ajustar sistemas e documentos fiscais.',
      t: { 'PIS/Cofins': [100, 'vigente'], IPI: [100, 'vigente'], ICMS: [100, 'vigente'], ISS: [100, 'vigente'], CBS: [6, 'teste 0,9%'], IBS: [3, 'teste 0,1%'], IS: [0, 'ainda não'] } },
    2027: { titulo: 'A CBS entra em vigor', texto: 'PIS e Cofins são extintos e a CBS passa a ser cobrada integralmente. O IPI tem alíquotas reduzidas a zero, salvo exceções ligadas à Zona Franca de Manaus, e começa o Imposto Seletivo.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [100, 'vigente'], ISS: [100, 'vigente'], CBS: [100, 'integral'], IBS: [3, 'teste 0,1%'], IS: [100, 'vigente'] } },
    2028: { titulo: 'Consolidação da CBS', texto: 'Mesmo desenho de 2027: CBS integral, IBS ainda em alíquota de teste e ICMS e ISS sem alteração. Ano de calibrar a alíquota de referência.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [100, 'vigente'], ISS: [100, 'vigente'], CBS: [100, 'integral'], IBS: [3, 'teste 0,1%'], IS: [100, 'vigente'] } },
    2029: { titulo: 'Começa a substituição do ICMS e do ISS', texto: 'As alíquotas de ICMS e ISS são reduzidas a 90% das atuais, e o IBS cresce na mesma proporção.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [90, '90%'], ISS: [90, '90%'], CBS: [100, 'integral'], IBS: [10, '10%'], IS: [100, 'vigente'] } },
    2030: { titulo: 'Transição a 80%', texto: 'ICMS e ISS a 80% das alíquotas atuais; IBS corresponde a 20% da carga do novo modelo.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [80, '80%'], ISS: [80, '80%'], CBS: [100, 'integral'], IBS: [20, '20%'], IS: [100, 'vigente'] } },
    2031: { titulo: 'Transição a 70%', texto: 'ICMS e ISS a 70% das alíquotas atuais. Benefícios fiscais de ICMS perdem efeito na mesma medida.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [70, '70%'], ISS: [70, '70%'], CBS: [100, 'integral'], IBS: [30, '30%'], IS: [100, 'vigente'] } },
    2032: { titulo: 'Último ano do modelo antigo', texto: 'ICMS e ISS a 60% das alíquotas atuais; o IBS já responde por 40%. Hora de concluir a migração de sistemas e contratos.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [60, '60%'], ISS: [60, '60%'], CBS: [100, 'integral'], IBS: [40, '40%'], IS: [100, 'vigente'] } },
    2033: { titulo: 'Modelo completo', texto: 'ICMS e ISS são extintos. O consumo passa a ser tributado pelo IVA dual — CBS e IBS — e pelo Imposto Seletivo.',
      t: { 'PIS/Cofins': [0, 'extinto'], IPI: [4, 'zerado*'], ICMS: [0, 'extinto'], ISS: [0, 'extinto'], CBS: [100, 'integral'], IBS: [100, 'integral'], IS: [100, 'vigente'] } },
  };
  const NOVOS = ['CBS', 'IBS', 'IS'];

  const tl = document.querySelector('[data-timeline]');
  if (tl) {
    const range = tl.querySelector('[data-tl-range]');
    const botoes = [...tl.querySelectorAll('[data-ano]')];
    const barras = tl.querySelector('[data-tl-barras]');
    const elAno = tl.querySelector('[data-tl-ano]');
    const elTit = tl.querySelector('[data-tl-titulo]');
    const elTxt = tl.querySelector('[data-tl-texto]');

    barras.innerHTML = Object.keys(ANOS[2026].t).map(nome => `
      <div class="tl-row ${NOVOS.includes(nome) ? 'is-novo' : 'is-antigo'}" data-tributo="${nome}">
        <span class="tl-nome">${nome}</span>
        <span class="tl-trilho"><span class="tl-fill"></span></span>
        <span class="tl-status"></span>
      </div>`).join('');

    function mostrar(ano) {
      const d = ANOS[ano];
      range.value = ano;
      botoes.forEach(b => b.setAttribute('aria-selected', String(Number(b.dataset.ano) === ano)));
      elAno.textContent = ano;
      elTit.textContent = d.titulo;
      elTxt.textContent = d.texto;
      Object.entries(d.t).forEach(([nome, [v, st]]) => {
        const row = barras.querySelector(`[data-tributo="${nome}"]`);
        row.querySelector('.tl-fill').style.transform = `scaleX(${v / 100})`;
        row.querySelector('.tl-status').textContent = st;
        row.classList.toggle('is-zero', v === 0);
      });
      range.style.setProperty('--p', ((ano - 2026) / 7 * 100) + '%');
    }
    range.addEventListener('input', () => mostrar(Number(range.value)));
    botoes.forEach(b => b.addEventListener('click', () => mostrar(Number(b.dataset.ano))));
    mostrar(2026);
  }

  // Painel do hero: ano corrente dentro da janela 2026–2033
  const anoAtual = Math.min(2033, Math.max(2026, new Date().getFullYear()));
  const elHeroAno = document.querySelector('[data-hero-ano]');
  const elHeroBarra = document.querySelector('[data-hero-barra]');
  const elHeroFase = document.querySelector('[data-hero-fase]');
  if (elHeroAno) {
    elHeroAno.textContent = anoAtual;
    elHeroFase.textContent = ANOS[anoAtual].titulo.toLowerCase();
    requestAnimationFrame(() => { elHeroBarra.style.transform = `scaleX(${(anoAtual - 2025) / 8})`; });
  }
})();
