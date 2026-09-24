// Ferramenta "Qual caminho para o inventário?" — indica, a partir de três
// respostas, se o inventário pode ser feito em cartório (CPC, art. 610, e
// Resolução CNJ nº 35/2007, com as alterações da Resolução nº 571/2024).
(function () {
  'use strict';
  const form = document.querySelector('[data-inv]');
  const saida = document.querySelector('[data-inv-resultado]');
  if (!form || !saida) return;

  const PASSOS_CARTORIO = ['Reunião de documentos', 'Cálculo e pagamento do ITCMD', 'Minuta da partilha', 'Escritura no tabelionato', 'Registro e transferência dos bens'];
  const PASSOS_JUDICIAL = ['Petição de abertura', 'Nomeação do inventariante', 'Primeiras declarações e citações', 'Avaliação e ITCMD', 'Partilha e sentença', 'Formal de partilha e registro'];

  function resultado(r) {
    if (r.consenso === 'nao') {
      return { tipo: 'judicial', titulo: 'Inventário judicial', texto: 'Sem consenso entre os herdeiros, o inventário precisa ser feito na Justiça. Mesmo assim, é possível buscar acordos ao longo do processo — inclusive por mediação.', base: 'CPC, arts. 610 e seguintes', passos: PASSOS_JUDICIAL };
    }
    if (r.menor === 'sim' && r.testamento === 'sim') {
      return { tipo: 'condicional', titulo: 'Cartório possível, com condições', texto: 'Com herdeiro menor e testamento, o cartório só é possível se forem cumpridas as duas condições: partilha do quinhão do menor em partes ideais de cada bem, com manifestação favorável do Ministério Público, e autorização judicial no procedimento de cumprimento do testamento.', base: 'Resolução CNJ nº 35/2007, com redação da Res. nº 571/2024', passos: PASSOS_CARTORIO };
    }
    if (r.menor === 'sim') {
      return { tipo: 'condicional', titulo: 'Cartório possível, com condições', texto: 'Desde 2024, o inventário em cartório com herdeiro menor ou incapaz é admitido se o quinhão dele for pago em parte ideal de cada um dos bens e houver manifestação favorável do Ministério Público. Caso contrário, o caminho é o judicial.', base: 'Resolução CNJ nº 35/2007, com redação da Res. nº 571/2024', passos: PASSOS_CARTORIO };
    }
    if (r.testamento === 'sim') {
      return { tipo: 'condicional', titulo: 'Cartório possível, após autorização', texto: 'Havendo testamento, o inventário pode ser feito em cartório depois que o juiz autorizar, no procedimento de abertura e cumprimento do testamento.', base: 'Resolução CNJ nº 35/2007, com redação da Res. nº 571/2024', passos: PASSOS_CARTORIO };
    }
    return { tipo: 'cartorio', titulo: 'Inventário em cartório', texto: 'Com todos os herdeiros capazes e de acordo, o inventário pode ser feito por escritura pública, em qualquer tabelionato de notas — em geral, bem mais rápido que o judicial.', base: 'CPC, art. 610, §§1º e 2º', passos: PASSOS_CARTORIO };
  }

  function render() {
    const dados = Object.fromEntries(new FormData(wrapForm()));
    const r = resultado(dados);
    saida.dataset.tipo = r.tipo;
    saida.innerHTML = `
      <p class="inv-label">Caminho indicado</p>
      <h3>${r.titulo}</h3>
      <p class="inv-texto">${r.texto}</p>
      <ol class="inv-passos">${r.passos.map((p, i) => `<li style="--i:${i}"><span>${i + 1}</span>${p}</li>`).join('')}</ol>
      <p class="inv-base">${r.base}</p>
      <p class="inv-prazo"><strong>Prazo:</strong> o inventário deve ser aberto em até 2 meses do falecimento (CPC, art. 611).</p>
      <a class="btn btn-terra" href="#contato">Conversar sobre o meu caso</a>`;
  }
  // os radios estão em fieldsets fora de <form>; FormData precisa de um form
  function wrapForm() {
    const f = document.createElement('form');
    form.querySelectorAll('input:checked').forEach(i => { const c = document.createElement('input'); c.name = i.name; c.value = i.value; f.appendChild(c); });
    return f;
  }
  form.addEventListener('change', render);
  render();
})();
