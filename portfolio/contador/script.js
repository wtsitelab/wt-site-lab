// Contabilidade Prime — painel fiscal de demonstração: prazos relativos à data de hoje
// e contagem regressiva até o próximo vencimento.
(function () {
  'use strict';
  const dias = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(23, 59, 0, 0); return d; };
  const PRAZOS = [
    { nome: 'DAS — Simples Nacional', det: 'Guia enviada no WhatsApp', data: dias(3), status: 'breve' },
    { nome: 'FGTS e INSS da folha', det: '4 colaboradores', data: dias(9), status: 'ok' },
    { nome: 'Pró-labore e DCTFWeb', det: 'Conferido pelo contador', data: dias(16), status: 'ok' },
    { nome: 'ISS municipal', det: 'Competência anterior', data: dias(-2), status: 'pago' },
  ];
  const ROTULO = { breve: 'Vence em breve', ok: 'No prazo', pago: 'Pago' };
  const mes = (d) => d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const lista = document.querySelector('[data-prazos]');
  lista.innerHTML = PRAZOS.map((p, i) => `
    <li style="animation-delay:${0.5 + i * 0.12}s">
      <span class="prazo-data"><b>${String(p.data.getDate()).padStart(2, '0')}</b><small>${mes(p.data)}</small></span>
      <span class="prazo-nome"><strong>${p.nome}</strong><span>${p.det}</span></span>
      <span class="tag tag-${p.status}">${ROTULO[p.status]}</span>
    </li>`).join('');

  const proximo = PRAZOS.filter(p => p.status !== 'pago').reduce((a, b) => (a.data < b.data ? a : b));
  const alvo = document.querySelector('[data-contagem]');
  function tick() {
    const diff = Math.max(0, proximo.data - new Date());
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
    alvo.textContent = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  }
  tick();
  setInterval(tick, 30000);
})();
