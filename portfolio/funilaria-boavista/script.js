// Boa Vista — carro clicável: marca as partes com dano e leva a lista para o formulário.
(function () {
  'use strict';
  const partes = new Set();
  const lista = document.querySelector('[data-partes-lista]');
  const msg = document.querySelector('[data-msg-partes]');
  function atualizar() {
    lista.innerHTML = partes.size
      ? [...partes].map(p => `<li><span>${p}</span><button type="button" data-tirar="${p}" aria-label="Remover ${p}">×</button></li>`).join('')
      : '<li class="vazio">Nenhuma parte marcada ainda.</li>';
    document.querySelectorAll('.parte').forEach(el => {
      const on = partes.has(el.dataset.parte);
      el.classList.toggle('marcada', on);
      el.setAttribute('aria-pressed', String(on));
    });
    msg.value = partes.size ? 'Partes com dano: ' + [...partes].join(', ') + '.' : '';
  }
  function alternar(p) { partes.has(p) ? partes.delete(p) : partes.add(p); atualizar(); }
  document.querySelectorAll('.parte').forEach(el => {
    el.insertAdjacentHTML('afterbegin', `<title>${el.dataset.parte}</title>`);
    el.addEventListener('click', () => alternar(el.dataset.parte));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(el.dataset.parte); } });
  });
  lista.addEventListener('click', e => { const b = e.target.closest('[data-tirar]'); if (b) { partes.delete(b.dataset.tirar); atualizar(); } });
  atualizar();
})();
