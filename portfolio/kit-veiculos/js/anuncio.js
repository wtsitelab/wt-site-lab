/* Kit Veículos — página do anúncio: foto (com crédito) ou ilustração,
   comparação com a referência de mercado, ficha técnica por tipo (carro ou
   moto), procedência, opcionais, simulador de financiamento (tabela Price),
   contato com o vendedor e veículos semelhantes. */
(function () {
  'use strict';
  const API = window.VeiculosAPI;
  const UI = window.VeiculosUI;
  const CONF = window.CONF;
  const { moeda, num, esc, ICONES } = UI;
  const alvo = document.querySelector('[data-anuncio]');
  const id = new URLSearchParams(location.search).get('id') || window.ESTOQUE.itens[0].id;

  const ICON = {
    ano: '<path d="M4 7h16v13H4zM4 11h16M8 3v4M16 3v4"/>',
    km: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/>',
    cambio: '<circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v8M12 8v8M18 8v4H6"/>',
    combustivel: '<path d="M5 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h14M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3M7 8h6"/>',
    motor: '<path d="M4 10h3l2-3h6l2 3h3v7h-3l-2 2H9l-2-2H4z"/>',
    cor: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    portas: '<path d="M5 3h10l4 5v13H5z"/><path d="M14 13h2"/>',
    placa: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h10"/>',
    freio: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
    partida: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
    categoria: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  };
  const ico = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

  function ficha(v) {
    const final = (v.id * 7) % 10;
    const itens = v.tipo === 'moto'
      ? [['ano', 'Ano', `${v.anoFab}/${v.ano}`], ['km', 'Quilometragem', `${num(v.km)} km`], ['motor', 'Cilindrada', `${v.cilindrada} cc`], ['categoria', 'Estilo', UI.nomeCat(v.categoria)],
         ['cambio', 'Câmbio', v.cambio], ['combustivel', 'Combustível', v.combustivel], ['freio', 'Freios', v.freio], ['cor', 'Cor', v.cor]]
      : [['ano', 'Ano', `${v.anoFab}/${v.ano}`], ['km', 'Quilometragem', `${num(v.km)} km`], ['cambio', 'Câmbio', v.cambio], ['combustivel', 'Combustível', v.combustivel],
         ['motor', 'Motor', v.motor], ['cor', 'Cor', v.cor], ['portas', 'Portas', v.portas], ['placa', 'Final da placa', final]];
    return itens.map(([k, r, val]) => `<div>${ico(k)}<dt>${r}</dt><dd>${esc(val)}</dd></div>`).join('');
  }

  async function iniciar() {
    const v = await API.obter(id);
    if (!v) {
      alvo.innerHTML = '<div class="vazio"><h2>Anúncio não encontrado</h2><p>Ele pode ter sido vendido ou removido.</p><a class="btn btn-escuro" href="index.html">Ver outros anúncios</a></div>';
      return;
    }
    document.title = `${v.marca} ${v.modelo} ${v.versao} ${v.ano} — ${CONF.nome}`;
    const dif = v.ref - v.preco;
    const pctRef = Math.max(-8, Math.min(8, (v.preco / v.ref - 1) * 100));
    const fav = API.favoritos.tem(v.id);
    const loja = v.lojaInfo;
    const foto = UI.fotoDe(v);
    const fin = CONF.financiamento;
    const procedencia = [['Único dono', v.unicoDono], ['Revisões em dia', v.revisado], ['Laudo cautelar aprovado', v.laudo], v.tipo === 'moto' ? ['Freio ABS', v.abs] : ['Blindado', v.blindado]];

    alvo.innerHTML = `
      <nav class="migalhas migalhas-claras" aria-label="Você está em"><a href="index.html">${CONF.tiposMultiplos ? 'Veículos' : (v.tipo === 'moto' ? 'Motos' : 'Carros')}</a><span>›</span><a href="index.html?marcas=${encodeURIComponent(v.marca)}">${esc(v.marca)}</a><span>›</span><span>${esc(v.modelo)}</span></nav>
      <div class="anuncio-topo">
        <div>
          <h1>${esc(v.marca)} <strong>${esc(v.modelo)}</strong></h1>
          <p class="anuncio-versao">${esc(v.versao)} · ${v.anoFab}/${v.ano}</p>
        </div>
        <div class="anuncio-acoes">
          <button type="button" class="btn btn-claro btn-sm" data-compartilhar><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg><span>Compartilhar</span></button>
          <button type="button" class="btn btn-claro btn-sm fav-grande ${fav ? 'is-on' : ''}" data-fav="${v.id}" aria-pressed="${fav}">${ICONES.coracao}<span>Favoritar</span></button>
        </div>
      </div>

      <div class="anuncio-grid">
        <div class="anuncio-main">
          <figure class="galeria galeria-foto">
            <button type="button" class="foto-zoom" data-zoom aria-label="Ampliar imagem">${UI.imagem(v, 'palco-img')}</button>
            <span class="gal-cont">${foto ? 'Foto ilustrativa do modelo' : 'Ilustração'}</span>
          </figure>
          ${foto ? `<p class="credito">Foto: ${esc(foto.autor)} · <a href="${foto.fonte}" target="_blank" rel="noopener">${esc(foto.licenca)}, via Wikimedia Commons</a>. No site real, as fotos são do próprio veículo, enviadas pelo anunciante.</p>` : ''}

          <section class="bloco"><h2>Ficha técnica</h2><dl class="ficha">${ficha(v)}</dl></section>
          <section class="bloco">
            <h2>Procedência</h2>
            <ul class="procedencia">${procedencia.map(([n, ok]) => `<li class="${ok ? 'is-ok' : ''}"><span>${ok ? ICONES.check : '—'}</span>${n}</li>`).join('')}</ul>
          </section>
          <section class="bloco">
            <h2>Opcionais <small>${v.opcionais.length} itens</small></h2>
            <ul class="opcionais">${v.opcionais.map(o => `<li>${ICONES.check}${esc(o)}</li>`).join('')}</ul>
          </section>

          <section class="bloco financiamento" id="financiamento">
            <div class="fin-head">
              <h2>Simule o financiamento</h2>
              <p>Taxas ilustrativas, apenas para demonstração. A aprovação depende da análise de crédito.</p>
            </div>
            <div class="fin-grid" data-fin>
              <div class="fin-controles">
                <label class="fin-campo">
                  <span>Entrada <strong data-fin-entrada-v></strong></span>
                  <input type="range" min="10" max="80" step="5" value="${fin.entradaPadrao}" data-fin-entrada aria-label="Percentual de entrada">
                  <small><span>10%</span><span data-fin-entrada-pct></span><span>80%</span></small>
                </label>
                <div class="fin-campo">
                  <span id="fin-prazo-rot">Prazo</span>
                  <div class="fin-prazos" role="radiogroup" aria-labelledby="fin-prazo-rot">
                    ${fin.prazos.map(p => `<label><input type="radio" name="prazo" value="${p}" ${p === fin.prazoPadrao ? 'checked' : ''}><span>${p}x</span></label>`).join('')}
                  </div>
                </div>
                <label class="fin-campo">
                  <span>Taxa de juros (ao mês)</span>
                  <select data-fin-taxa>${fin.taxas.map(([t, r], i) => `<option value="${t}" ${i === 1 ? 'selected' : ''}>${String(t).replace('.', ',')}% · ${r}</option>`).join('')}</select>
                </label>
              </div>
              <div class="fin-resultado" aria-live="polite">
                <p class="fin-rot">Parcelas estimadas</p>
                <p class="fin-parcela"><span data-fin-n></span> <strong data-fin-parcela></strong></p>
                <div class="fin-barra"><span data-fin-barra-e></span><span data-fin-barra-f></span></div>
                <dl class="fin-dl">
                  <div><dt><i class="dot dot-e"></i>Entrada</dt><dd data-fin-e></dd></div>
                  <div><dt><i class="dot dot-f"></i>Valor financiado</dt><dd data-fin-f></dd></div>
                  <div><dt>Total pago</dt><dd data-fin-t></dd></div>
                </dl>
                <button type="button" class="btn btn-claro btn-block" data-interesse>Quero essa condição</button>
              </div>
            </div>
          </section>
        </div>

        <aside class="lateral">
          <div class="preco-card">
            <p class="preco-rot">Preço à vista</p>
            <p class="preco-valor">${moeda(v.preco)}</p>
            <div class="ref ${dif > 0 ? 'ref-abaixo' : 'ref-acima'}">
              <div class="ref-trilho"><span class="ref-marca" style="--p:${50 + pctRef * 5}%"></span></div>
              <p>${dif > 0 ? `<strong>${moeda(dif)} abaixo</strong> da referência de mercado` : `${moeda(-dif)} acima da referência de mercado`}</p>
              <small>Referência ilustrativa: ${moeda(v.ref)}</small>
            </div>
            <p class="preco-parcela">ou a partir de <strong data-parcela-min></strong> em ${Math.max(...fin.prazos)}x</p>
            <button type="button" class="btn btn-acento btn-block" data-interesse>Tenho interesse</button>
            <a class="btn btn-claro btn-block" href="#financiamento">Simular financiamento</a>
          </div>
          <div class="vendedor">
            <div class="vend-avatar" aria-hidden="true">${loja.tipo === 'Loja' ? 'LP' : 'VP'}</div>
            <div>
              <p class="vend-nome">${esc(loja.nome)}</p>
              <p class="vend-info">${loja.tipo}${loja.nota ? ` · ★ ${String(loja.nota).replace('.', ',')}` : ''} · ${esc(v.bairro)}, ${esc(v.cidade)}</p>
            </div>
          </div>
          <p class="anunciado">Anunciado há ${v.dias} ${v.dias === 1 ? 'dia' : 'dias'} · código ${String(v.id).padStart(6, '0')}</p>
          <label class="comp-lateral"><input type="checkbox" data-comp="${v.id}" ${UI.Compare.tem(v.id) ? 'checked' : ''}><span>Adicionar à comparação</span></label>
        </aside>
      </div>`;
    alvo.setAttribute('aria-busy', 'false');

    document.querySelector('[data-zoom]').addEventListener('click', () => {
      const conteudo = foto ? `<img src="${foto.src}" alt="${esc(v.marca)} ${esc(v.modelo)}">` : `<div class="modal-ilustra">${UI.imagem(v)}</div>`;
      document.body.insertAdjacentHTML('beforeend', `<div class="modal modal-foto" role="dialog" aria-modal="true" aria-label="Imagem ampliada"><button type="button" class="modal-x" data-fechar-modal aria-label="Fechar">×</button>${conteudo}</div>`);
      document.body.style.overflow = 'hidden';
      document.querySelector('.modal-foto .modal-x').focus();
    });
    financiamento(v);
    document.querySelector('[data-compartilhar]').addEventListener('click', () => {
      const url = location.href;
      if (navigator.share) navigator.share({ title: document.title, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => UI.toast('Link copiado'), () => UI.toast('Copie o link na barra de endereço'));
    });
    document.querySelectorAll('[data-interesse]').forEach(b => b.addEventListener('click', () => abrirInteresse(v)));

    const sims = await API.similares(v, 4);
    document.querySelector('[data-similares]').innerHTML = sims.map(s => UI.cartao(s)).join('');
    document.querySelector('[data-similares-sec]').hidden = false;
  }

  const pmt = (pv, i, n) => pv * i / (1 - Math.pow(1 + i, -n));
  function financiamento(v) {
    const box = document.querySelector('[data-fin]');
    const rEnt = box.querySelector('[data-fin-entrada]');
    const sTaxa = box.querySelector('[data-fin-taxa]');
    function calc() {
      const pct = Number(rEnt.value) / 100;
      const n = Number(box.querySelector('input[name=prazo]:checked').value);
      const i = Number(sTaxa.value) / 100;
      const entrada = v.preco * pct, finan = v.preco - entrada, parc = pmt(finan, i, n), total = entrada + parc * n;
      const set = (s, t) => { box.querySelector(s).textContent = t; };
      set('[data-fin-entrada-v]', moeda(entrada)); set('[data-fin-entrada-pct]', `${Math.round(pct * 100)}%`);
      set('[data-fin-n]', `${n}x`); set('[data-fin-parcela]', moeda(parc));
      set('[data-fin-e]', moeda(entrada)); set('[data-fin-f]', moeda(finan)); set('[data-fin-t]', moeda(total));
      box.querySelector('[data-fin-barra-e]').style.width = `${entrada / total * 100}%`;
      box.querySelector('[data-fin-barra-f]').style.width = `${parc * n / total * 100}%`;
    }
    box.addEventListener('input', calc);
    box.addEventListener('change', calc);
    calc();
    const menorTaxa = Math.min(...CONF.financiamento.taxas.map(t => t[0])) / 100;
    document.querySelector('[data-parcela-min]').textContent = moeda(pmt(v.preco * 0.7, menorTaxa, Math.max(...CONF.financiamento.prazos)));
  }

  function abrirInteresse(v) {
    document.body.insertAdjacentHTML('beforeend', `<div class="modal" role="dialog" aria-modal="true" aria-label="Contato com o vendedor">
      <div class="modal-box modal-contato">
        <button type="button" class="modal-x" data-fechar-modal aria-label="Fechar">×</button>
        <div class="contato-carro">${UI.imagem(v)}<div><strong>${esc(v.marca)} ${esc(v.modelo)}</strong><span>${esc(v.versao)} · ${moeda(v.preco)}</span></div></div>
        <h2>Fale com o vendedor</h2>
        <form class="form-contato" data-demo-form>
          <label><span>Nome</span><input required autocomplete="name"></label>
          <label><span>WhatsApp</span><input type="tel" required autocomplete="tel" placeholder="(00) 00000-0000"></label>
          <label><span>E-mail</span><input type="email" autocomplete="email"></label>
          <label><span>Mensagem</span><textarea rows="3">Olá! Tenho interesse ${v.tipo === 'moto' ? 'na' : 'no'} ${esc(v.marca)} ${esc(v.modelo)} ${v.ano}. Ainda está disponível?</textarea></label>
          <label class="fcheck"><input type="checkbox" checked> Quero receber uma simulação de financiamento</label>
          <button class="btn btn-acento btn-block" type="submit">Enviar mensagem</button>
          <p class="form-nota" data-form-note role="status"></p>
        </form>
      </div></div>`);
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-contato input').focus();
  }

  iniciar();
})();
