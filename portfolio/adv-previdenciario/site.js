// Site previdenciário: controles de acessibilidade (tamanho da letra e alto
// contraste), simulador das regras de transição da EC nº 103/2019 e lista de
// documentos com progresso.
(function () {
  'use strict';

  // ---------- Acessibilidade ----------
  const root = document.documentElement;
  const ESCALAS = [1, 1.12, 1.25, 1.4];
  let nivel = Math.max(0, ESCALAS.indexOf(Number(getComputedStyle(root).getPropertyValue('--escala')) || 1));
  function salvar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  document.querySelectorAll('[data-fonte]').forEach(btn => btn.addEventListener('click', () => {
    const d = Number(btn.dataset.fonte);
    nivel = d === 0 ? 0 : Math.min(ESCALAS.length - 1, Math.max(0, nivel + d));
    root.style.setProperty('--escala', ESCALAS[nivel]);
    salvar('rm-fonte', ESCALAS[nivel]);
  }));
  const btnContraste = document.querySelector('[data-contraste]');
  if (btnContraste) {
    btnContraste.setAttribute('aria-pressed', String(root.classList.contains('alto-contraste')));
    btnContraste.addEventListener('click', () => {
      const on = root.classList.toggle('alto-contraste');
      btnContraste.setAttribute('aria-pressed', String(on));
      salvar('rm-contraste', on ? '1' : '0');
    });
  }

  // ---------- Simulador ----------
  const form = document.querySelector('[data-sim]');
  const res = document.querySelector('[data-sim-res]');
  if (form && res) {
    const ANO_MS = 365.2425 * 24 * 60 * 60 * 1000;
    const REFORMA = new Date(2019, 10, 13);
    const mesAno = d => { const s = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); };
    const anosMeses = x => { const a = Math.floor(x + 1e-9); const m = Math.floor((x - a) * 12 + 1e-6); return m ? `${a} anos e ${m} ${m === 1 ? 'mês' : 'meses'}` : `${a} anos`; };

    function calcular() {
      const f = new FormData(form);
      const sexo = f.get('sexo');
      const antes = f.get('antes') === 'sim';
      const nascStr = f.get('nasc');
      if (!nascStr) return;
      const [na, nm, nd] = nascStr.split('-').map(Number);
      const nasc = new Date(na, nm - 1, nd);
      const c0 = (Number(f.get('anos')) || 0) + (Math.min(11, Number(f.get('meses')) || 0)) / 12;
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
      const F = sexo === 'F';
      const req = F ? 30 : 35;
      const base = F ? 15 : 20;
      const cReforma = Math.max(0, c0 - (hoje - REFORMA) / ANO_MS);
      const faltava = req - cReforma;

      const regras = [];
      if (antes) {
        regras.push({ id: 'pontos', nome: 'Regra dos pontos', desc: F ? '30 anos de contribuição + pontos do ano (93 em 2026, até 100)' : '35 anos de contribuição + pontos do ano (103 em 2026, até 105)',
          ok: (i, c, y) => c >= req && i + c >= (F ? Math.min(100, 86 + (y - 2019)) : Math.min(105, 96 + (y - 2019))), coef: c => Math.min(100, 60 + 2 * Math.max(0, Math.floor(c - base))) });
        regras.push({ id: 'idade', nome: 'Idade mínima progressiva', desc: F ? '30 anos de contribuição + idade mínima (59,5 em 2026, até 62)' : '35 anos de contribuição + idade mínima (64,5 em 2026, até 65)',
          ok: (i, c, y) => c >= req && i >= (F ? Math.min(62, 56 + 0.5 * (y - 2019)) : Math.min(65, 61 + 0.5 * (y - 2019))), coef: c => Math.min(100, 60 + 2 * Math.max(0, Math.floor(c - base))) });
        regras.push({ id: 'transidade', nome: 'Transição por idade', desc: F ? '62 anos de idade + 15 anos de contribuição' : '65 anos de idade + 15 anos de contribuição',
          ok: (i, c, y) => c >= 15 && i >= (F ? Math.min(62, 60 + 0.5 * (y - 2019)) : 65), coef: c => Math.min(100, 60 + 2 * Math.max(0, Math.floor(c - base))) });
        if (faltava > 0 && faltava <= 2) {
          regras.push({ id: 'p50', nome: 'Pedágio de 50%', desc: `Faltavam ${anosMeses(faltava)} em 13/11/2019: cumprir esse tempo + 50%`,
            ok: (i, c) => c >= req + faltava * 0.5, coefTxt: 'média × fator previdenciário' });
        } else {
          regras.push({ id: 'p50', nome: 'Pedágio de 50%', desc: 'Só para quem estava a até 2 anos do tempo mínimo em 13/11/2019', naoAplica: true });
        }
        if (faltava > 0) {
          regras.push({ id: 'p100', nome: 'Pedágio de 100%', desc: `${F ? '57' : '60'} anos de idade + ${req} anos de contribuição + ${anosMeses(faltava)} de pedágio`,
            ok: (i, c) => i >= (F ? 57 : 60) && c >= req + faltava, coef: () => 100 });
        }
      } else {
        regras.push({ id: 'perm', nome: 'Regra permanente', desc: F ? '62 anos de idade + 15 anos de contribuição' : '65 anos de idade + 20 anos de contribuição',
          ok: (i, c) => i >= (F ? 62 : 65) && c >= base, coef: c => Math.min(100, 60 + 2 * Math.max(0, Math.floor(c - base))) });
      }

      // projeta mês a mês, assumindo contribuição contínua a partir de hoje
      regras.forEach(r => {
        if (r.naoAplica) return;
        for (let k = 0; k <= 600; k++) {
          const d = new Date(hoje.getFullYear(), hoje.getMonth() + k, 1);
          const idade = (d - nasc) / ANO_MS;
          const c = c0 + k / 12;
          if (r.ok(idade, c, d.getFullYear())) { r.k = k; r.data = d; r.idade = idade; r.c = c; break; }
        }
      });

      const validas = regras.filter(r => r.data);
      const primeira = validas.reduce((m, r) => (!m || r.k < m.k ? r : m), null);
      const adquirido = antes && faltava <= 0;

      res.innerHTML = `
        <div class="sim-topo">
          ${primeira ? `<p class="sim-kicker">${primeira.k === 0 ? 'Você já pode se aposentar' : 'Primeira regra que você cumpre'}</p>
          <p class="sim-data">${primeira.k === 0 ? 'Hoje' : mesAno(primeira.data)}</p>
          <p class="sim-regra">${primeira.nome}${primeira.k > 0 ? ` · aos ${anosMeses(primeira.idade)}` : ''}</p>` : '<p class="sim-kicker">Nenhuma regra cumprida no período simulado</p>'}
        </div>
        ${adquirido ? '<p class="sim-alerta">Pelos dados informados, você já tinha o tempo mínimo em 13/11/2019 e pode ter <strong>direito adquirido</strong> às regras anteriores à Reforma.</p>' : ''}
        <ul class="sim-regras">
          ${regras.map(r => {
            if (r.naoAplica) return `<li class="is-na"><div><h3>${r.nome}</h3><p>${r.desc}</p></div><span class="sim-status">Não se aplica</span></li>`;
            if (!r.data) return `<li class="is-na"><div><h3>${r.nome}</h3><p>${r.desc}</p></div><span class="sim-status">Fora do período</span></li>`;
            const coef = r.coefTxt || `${r.coef(r.c)}% da média`;
            return `<li class="${r === primeira ? 'is-primeira' : ''} ${r.k === 0 ? 'is-ja' : ''}"><div><h3>${r.nome}</h3><p>${r.desc}</p><p class="sim-coef">Valor: ${coef}</p></div><span class="sim-status">${r.k === 0 ? 'Já cumpre' : mesAno(r.data)}</span></li>`;
          }).join('')}
        </ul>
        <p class="sim-rodape">Resultado aproximado e informativo. Uma análise completa do CNIS pode antecipar datas e aumentar o valor do benefício.</p>
        <a class="btn btn-sol" href="#contato">Quero uma análise completa</a>`;
    }
    form.addEventListener('input', calcular);
    form.addEventListener('change', calcular);
    calcular();
  }

  // ---------- Lista de documentos ----------
  const docs = document.querySelector('[data-docs]');
  if (docs) {
    const barra = document.querySelector('[data-docs-barra]');
    const txt = document.querySelector('[data-docs-txt]');
    const boxes = [...docs.querySelectorAll('input')];
    function atualizar() {
      const n = boxes.filter(b => b.checked).length;
      barra.style.transform = `scaleX(${n / boxes.length})`;
      txt.textContent = n === boxes.length ? 'Tudo pronto! Agora é só agendar a conversa.' : `${n} de ${boxes.length} documentos separados`;
    }
    docs.addEventListener('change', atualizar);
    atualizar();
  }
})();
