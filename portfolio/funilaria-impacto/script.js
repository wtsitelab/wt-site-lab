// Impacto Zero — consulta de andamento do reparo (dados de demonstração).
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const ETAPAS = ['Recebido', 'Funilaria', 'Preparação', 'Pintura', 'Polimento', 'Pronto para retirada'];
  const REPAROS = {
    'IZ-7421': { carro: 'Sedã prata', atual: 3, prev: 'Previsão de entrega: amanhã, às 17h.' },
    'IZ-3310': { carro: 'Hatch vermelho', atual: 5, prev: 'Pronto! Pode retirar a partir das 8h.' },
  };
  const form = $('[data-rastreio]'), input = form.querySelector('input'), lista = $('[data-etapas]');
  function mostrar(cod) {
    const r = REPAROS[cod.trim().toUpperCase()];
    if (!r) {
      lista.innerHTML = '<li class="nao-achou">Código não encontrado. Confira o código enviado no WhatsApp.</li>';
      $('[data-st-cod]').textContent = cod || '—'; $('[data-st-carro]').textContent = '—'; $('[data-st-prev]').textContent = '';
      return;
    }
    $('[data-st-cod]').textContent = cod.trim().toUpperCase();
    $('[data-st-carro]').textContent = r.carro;
    $('[data-st-prev]').textContent = r.prev;
    lista.innerHTML = ETAPAS.map((e, i) => {
      const cls = i < r.atual ? 'feita' : i === r.atual ? 'atual' : '';
      return `<li class="${cls}" style="--i:${i}"><span></span><div><strong>${e}</strong>${i < r.atual ? 'Concluído' : i === r.atual ? 'Em andamento' : 'Aguardando'}</div></li>`;
    }).join('');
  }
  form.addEventListener('submit', e => { e.preventDefault(); mostrar(input.value); });
  document.querySelectorAll('[data-cod]').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.cod; mostrar(b.dataset.cod); }));
  mostrar(input.value);
})();
