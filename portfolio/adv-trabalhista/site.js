// Interações próprias do site trabalhista: calculadora de prazo prescricional,
// abas empregado/empresa e verificador de direitos.
(function () {
  'use strict';
  const fmt = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const somaAnos = (d, n) => { const x = new Date(d); x.setFullYear(x.getFullYear() + n); return x; };
  const DIA = 24 * 60 * 60 * 1000;

  // ---------- Calculadora de prazo (CF, art. 7º, XXIX) ----------
  const calc = document.querySelector('[data-calc]');
  if (calc) {
    const input = calc.querySelector('[data-calc-input]');
    const ring = calc.querySelector('[data-calc-ring]');
    const elDias = calc.querySelector('[data-calc-dias]');
    const elDiasLabel = calc.querySelector('[data-calc-dias-label]');
    const elLimite = calc.querySelector('[data-calc-limite]');
    const elDesde = calc.querySelector('[data-calc-desde]');
    const elStatus = calc.querySelector('[data-calc-status]');
    const CIRC = 2 * Math.PI * 52;
    ring.style.strokeDasharray = CIRC;
    ring.style.strokeDashoffset = CIRC;

    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    input.max = fmtISO(hoje);
    function fmtISO(d) { return d.toISOString().slice(0, 10); }

    // valor de exemplo: saída há 8 meses, para a calculadora já nascer "viva"
    const exemplo = new Date(hoje); exemplo.setMonth(exemplo.getMonth() - 8);
    input.value = fmtISO(exemplo);

    function atualizar() {
      if (!input.value) return;
      const [a, m, d] = input.value.split('-').map(Number);
      const saida = new Date(a, m - 1, d);
      const limite = somaAnos(saida, 2);
      const desde = somaAnos(hoje, -5);
      const restantes = Math.ceil((limite - hoje) / DIA);
      const total = (limite - saida) / DIA;
      const usado = Math.min(1, Math.max(0, (hoje - saida) / DIA / total));

      elLimite.textContent = fmt(limite);
      elDesde.textContent = fmt(desde);
      calc.classList.remove('is-ok', 'is-alerta', 'is-encerrado');

      if (saida > hoje) {
        elDias.textContent = '—';
        elDiasLabel.textContent = 'data futura';
        elStatus.textContent = 'Essa data ainda não chegou. O prazo de 2 anos começa a contar a partir da saída.';
        ring.style.strokeDashoffset = CIRC;
        return;
      }
      if (restantes <= 0) {
        calc.classList.add('is-encerrado');
        elDias.textContent = '0';
        elDiasLabel.textContent = 'prazo encerrado';
        elStatus.textContent = `O prazo de 2 anos terminou em ${fmt(limite)}. Algumas situações especiais podem alterar essa conta — vale conversar com um advogado.`;
      } else if (restantes <= 180) {
        calc.classList.add('is-alerta');
        elDias.textContent = restantes;
        elDiasLabel.textContent = restantes === 1 ? 'dia restante' : 'dias restantes';
        elStatus.textContent = 'Atenção: o prazo está perto do fim. Quanto antes a ação for ajuizada, mais direitos podem ser cobrados.';
      } else {
        calc.classList.add('is-ok');
        elDias.textContent = restantes;
        elDiasLabel.textContent = 'dias restantes';
        elStatus.textContent = 'Você ainda está dentro do prazo. Cada mês de espera, porém, reduz o período que pode ser cobrado.';
      }
      ring.style.strokeDashoffset = CIRC * (1 - usado);
    }
    input.addEventListener('input', atualizar);
    input.addEventListener('change', atualizar);
    atualizar();
  }

  // ---------- Abas empregado x empresa ----------
  const publico = document.querySelector('[data-publico]');
  if (publico) {
    const tabs = [...publico.querySelectorAll('[data-publico-tab]')];
    const pill = publico.querySelector('.publico-pill');
    function posicionar(tab) {
      pill.style.width = tab.offsetWidth + 'px';
      pill.style.transform = `translateX(${tab.offsetLeft - 4}px)`;
    }
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      publico.querySelectorAll('[data-publico-painel]').forEach(p => {
        const ativo = p.dataset.publicoPainel === tab.dataset.publicoTab;
        p.hidden = !ativo;
        p.classList.toggle('is-active', ativo);
      });
      posicionar(tab);
    }));
    requestAnimationFrame(() => posicionar(tabs[0]));
    window.addEventListener('resize', () => posicionar(tabs.find(t => t.getAttribute('aria-selected') === 'true')));
  }

  // ---------- Verificador de direitos ----------
  const DIREITOS = {
    he: { titulo: 'Horas extras com adicional', texto: 'Pagamento das horas além de 8h diárias ou 44h semanais, com adicional mínimo de 50% e reflexos em férias, 13º, DSR e FGTS.', base: 'CF, art. 7º, XIII e XVI · CLT, art. 59' },
    intervalo: { titulo: 'Intervalo suprimido', texto: 'O tempo de intervalo não concedido deve ser pago com acréscimo de 50% sobre o valor da hora normal.', base: 'CLT, art. 71, §4º' },
    fgts: { titulo: 'FGTS e rescisão indireta', texto: 'Depósitos em atraso podem ser cobrados e, segundo a jurisprudência do TST, a falta de recolhimento pode justificar a rescisão indireta.', base: 'Lei nº 8.036/1990, art. 15 · CLT, art. 483, "d"' },
    salario: { titulo: 'Salário em dia', texto: 'O salário mensal deve ser pago até o 5º dia útil do mês seguinte. Atrasos reiterados são falta grave do empregador.', base: 'CLT, arts. 459, §1º, e 483, "d"' },
    carteira: { titulo: 'Reconhecimento de vínculo', texto: 'Presentes pessoalidade, habitualidade, subordinação e salário, há vínculo de emprego — com carteira, FGTS, férias e 13º do período.', base: 'CLT, arts. 2º, 3º e 29' },
    assedio: { titulo: 'Indenização por dano moral', texto: 'Humilhações, perseguições e assédio geram direito a indenização e podem fundamentar a rescisão indireta.', base: 'CF, art. 5º, X · CLT, arts. 223-A e seguintes' },
    acidente: { titulo: 'Estabilidade e indenização', texto: 'Após o retorno do auxílio por acidente de trabalho, há estabilidade de 12 meses; conforme o caso, cabe indenização.', base: 'Lei nº 8.213/1991, art. 118' },
    gestante: { titulo: 'Estabilidade da gestante', texto: 'A empregada gestante não pode ser dispensada sem justa causa desde a confirmação da gravidez até 5 meses após o parto.', base: 'ADCT, art. 10, II, "b"' },
  };
  const verif = document.querySelector('[data-verif]');
  const res = document.querySelector('[data-verif-result]');
  if (verif && res) {
    function render() {
      const marcados = [...verif.querySelectorAll('input:checked')].map(i => i.value);
      if (!marcados.length) {
        res.innerHTML = '<p class="verif-vazio">Selecione ao menos uma situação.</p>';
        return;
      }
      res.innerHTML = `<p class="verif-count"><strong>${marcados.length}</strong> ${marcados.length === 1 ? 'direito pode estar envolvido' : 'direitos podem estar envolvidos'}</p>` +
        marcados.map((k, i) => `<article class="verif-card" style="--i:${i}"><h3>${DIREITOS[k].titulo}</h3><p>${DIREITOS[k].texto}</p><span>${DIREITOS[k].base}</span></article>`).join('') +
        '<a class="btn btn-amarelo" href="#contato">Quero uma análise do meu caso</a><p class="verif-nota">Orientação geral e informativa. Cada caso depende de provas e da análise individual.</p>';
    }
    verif.addEventListener('change', render);
    // começa com duas situações marcadas, para mostrar o funcionamento
    verif.querySelector('[value="he"]').checked = true;
    verif.querySelector('[value="fgts"]').checked = true;
    render();
  }
})();
