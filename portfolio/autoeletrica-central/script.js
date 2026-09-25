// Auto Elétrica Central — status aberto/fechado, medidor de tensão animado
// e guia de sintomas que preenche o formulário.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);

  // aberto agora? (seg–sex 8h–19h, sáb 8h–13h)
  const agora = new Date(), dia = agora.getDay(), h = agora.getHours() + agora.getMinutes() / 60;
  const fecha = dia >= 1 && dia <= 5 ? 19 : dia === 6 ? 13 : 0;
  const aberto = fecha && h >= 8 && h < fecha;
  const st = $('[data-status]');
  st.classList.toggle('fechado', !aberto);
  st.querySelector('span').textContent = aberto ? `Aberto agora · até ${fecha}h` : 'Fechado agora · deixe sua mensagem';

  // medidor de tensão: oscila como um multímetro de verdade
  const volts = $('[data-volts]'), barra = $('[data-volts-barra]');
  let v = 12.6;
  setInterval(() => {
    v = Math.min(12.8, Math.max(12.4, v + (Math.random() - 0.5) * 0.08));
    volts.textContent = v.toFixed(1).replace('.', ',');
    barra.style.width = ((v - 11.8) / 1.2 * 100).toFixed(0) + '%';
  }, 1200);

  const SINTOMAS = [
    { id: 'naoliga', nome: 'Carro não dá partida', causa: 'Bateria descarregada ou no fim da vida útil', outras: 'Motor de arranque, terminais oxidados ou relé de partida.', servico: 'Teste de bateria (gratuito) e do sistema de partida', urg: 'alta' },
    { id: 'luz', nome: 'Luz da bateria acesa no painel', causa: 'Alternador sem carregar a bateria', outras: 'Correia do alternador frouxa ou regulador de tensão com defeito.', servico: 'Teste do sistema de carga', urg: 'alta' },
    { id: 'fraca', nome: 'Faróis fracos ou piscando', causa: 'Tensão irregular vinda do alternador', outras: 'Mau contato no aterramento ou lâmpadas no fim da vida útil.', servico: 'Medição de carga e revisão da iluminação', urg: 'media' },
    { id: 'descarrega', nome: 'Bateria descarrega parado', causa: 'Fuga de corrente com o carro desligado', outras: 'Acessórios mal instalados (som, alarme) ou módulo que não “dorme”.', servico: 'Rastreamento de fuga de corrente', urg: 'media' },
    { id: 'alarme', nome: 'Alarme dispara sozinho', causa: 'Sensor de porta ou capô com mau contato', outras: 'Bateria do controle fraca ou central de alarme com defeito.', servico: 'Revisão do alarme e dos sensores', urg: 'baixa' },
  ];
  const URG = { alta: 'Resolver hoje', media: 'Agendar esta semana', baixa: 'Pode agendar' };
  const lista = $('[data-sintomas]'), diag = $('[data-diagnostico]');
  lista.innerHTML = SINTOMAS.map((s, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-s="${s.id}">${s.nome}</button>`).join('');
  function mostrar(id) {
    const s = SINTOMAS.find(x => x.id === id);
    lista.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.s === id)));
    diag.innerHTML = `
      <span class="urg urg-${s.urg}">${URG[s.urg]}</span>
      <p class="diag-rot">Causa mais comum</p>
      <h3>${s.causa}</h3>
      <p class="diag-rot">Também pode ser</p>
      <p>${s.outras}</p>
      <div class="diag-servico"><span>Serviço indicado</span><strong>${s.servico}</strong></div>
      <a class="btn btn-acc" href="#contato" data-usar="${s.id}">Pedir atendimento para isso</a>`;
    diag.classList.remove('entra'); void diag.offsetWidth; diag.classList.add('entra');
  }
  lista.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) mostrar(b.dataset.s); });
  diag.addEventListener('click', e => {
    const a = e.target.closest('[data-usar]');
    if (a) $('[data-msg-sintoma]').value = 'Sintoma: ' + SINTOMAS.find(x => x.id === a.dataset.usar).nome + '. ';
  });
  mostrar(SINTOMAS[0].id);
})();
