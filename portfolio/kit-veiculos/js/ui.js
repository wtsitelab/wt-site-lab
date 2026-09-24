/* Kit Veículos — interface compartilhada: formatação, cartão de anúncio,
   favoritos, bandeja/modal de comparação, toast e aviso de demonstração.
   Cada site define window.CONF (nome, categorias, textos) e os dados. */
(function () {
  'use strict';
  const API = window.VeiculosAPI;
  const CONF = window.CONF;
  const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const num = (v) => v.toLocaleString('pt-BR');
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nomeCat = (k) => (CONF.categorias[k] || {}).nome || k;

  const ICONES = {
    coracao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/></svg>',
    pino: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"/></svg>',
  };

  // foto real quando existir; senão, ilustração vetorial do tipo de veículo
  function fotoDe(v) { return (window.FOTOS || {})[v.id] || null; }
  function imagem(v, classe = '') {
    const f = fotoDe(v);
    return f
      ? `<img class="car-foto ${classe}" src="${f.src}" alt="${esc(v.marca)} ${esc(v.modelo)} ${esc(String(v.cor).toLowerCase())}" loading="lazy" decoding="async">`
      : CarArt.veiculoSVG(v.tipo, v.categoria, v.cor, 'estudio', classe);
  }

  function selos(v) {
    const s = [];
    if (v.preco < v.ref) s.push('<span class="selo selo-verde">Abaixo da referência</span>');
    if (v.km <= (v.tipo === 'moto' ? 10000 : 20000)) s.push('<span class="selo">Baixa km</span>');
    if (v.unicoDono) s.push('<span class="selo">Único dono</span>');
    if (v.blindado) s.push('<span class="selo selo-escuro">Blindado</span>');
    return s.slice(0, 2).join('');
  }
  function specsCurtas(v) {
    return v.tipo === 'moto'
      ? [`${v.anoFab}/${v.ano}`, `${num(v.km)} km`, `${v.cilindrada} cc`]
      : [`${v.anoFab}/${v.ano}`, `${num(v.km)} km`, v.cambio.startsWith('Auto') ? 'Automático' : 'Manual'];
  }

  function cartao(v, opts = {}) {
    const fav = API.favoritos.tem(v.id);
    const comp = Compare.tem(v.id);
    return `<article class="card" data-id="${v.id}">
      <a class="card-link" href="anuncio.html?id=${v.id}" aria-label="${esc(v.marca)} ${esc(v.modelo)} ${esc(v.versao)}, ${moeda(v.preco)}">
        <div class="card-img">${imagem(v)}<div class="card-selos">${selos(v)}</div>${CONF.tiposMultiplos ? `<span class="card-tipo">${v.tipo === 'moto' ? 'Moto' : 'Carro'}</span>` : ''}</div>
        <div class="card-body">
          <h3 class="card-titulo"><span>${esc(v.marca)}</span> ${esc(v.modelo)}</h3>
          <p class="card-versao">${esc(v.versao)}</p>
          <p class="card-preco">${v.preco ? moeda(v.preco) : 'R$ —'}</p>
          <ul class="card-specs">${specsCurtas(v).map(s => `<li>${s}</li>`).join('')}</ul>
          <p class="card-local">${ICONES.pino}${esc(v.bairro)} · ${esc(v.cidade)}</p>
        </div>
      </a>
      ${opts.semFavorito ? '' : `<button type="button" class="card-fav ${fav ? 'is-on' : ''}" data-fav="${v.id}" aria-pressed="${fav}" aria-label="Favoritar">${ICONES.coracao}</button>`}
      ${opts.semComparar ? '' : `<label class="card-comp"><input type="checkbox" data-comp="${v.id}" ${comp ? 'checked' : ''}><span>Comparar</span></label>`}
    </article>`;
  }

  function esqueleto(n) {
    return Array.from({ length: n }, () => '<div class="card card-sk" aria-hidden="true"><div class="sk sk-img"></div><div class="card-body"><div class="sk sk-l1"></div><div class="sk sk-l2"></div><div class="sk sk-l3"></div></div></div>').join('');
  }

  // ---------- favoritos ----------
  function atualizarContadorFav() {
    const n = API.favoritos.listar().length;
    document.querySelectorAll('[data-fav-count]').forEach(el => { el.textContent = n; el.hidden = n === 0; });
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    const on = API.favoritos.alternar(Number(b.dataset.fav));
    document.querySelectorAll(`[data-fav="${b.dataset.fav}"]`).forEach(x => { x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    atualizarContadorFav();
    toast(on ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
  });

  // ---------- comparação (até 3) ----------
  const chaveComp = (CONF.chave || 'veiculos') + '-comp';
  const Compare = {
    ids() { try { return JSON.parse(sessionStorage.getItem(chaveComp)) || []; } catch (e) { return []; } },
    salvar(v) { try { sessionStorage.setItem(chaveComp, JSON.stringify(v)); } catch (e) {} },
    tem(id) { return this.ids().includes(id); },
  };
  document.addEventListener('change', e => {
    const cb = e.target.closest('[data-comp]');
    if (!cb) return;
    let ids = Compare.ids();
    const id = Number(cb.dataset.comp);
    if (cb.checked) {
      if (ids.length >= 3) { cb.checked = false; toast('Compare até 3 veículos por vez'); return; }
      ids.push(id);
    } else ids = ids.filter(x => x !== id);
    Compare.salvar(ids);
    document.querySelectorAll(`[data-comp="${id}"]`).forEach(x => { x.checked = cb.checked; });
    renderBandeja();
  });

  const doEstoque = () => window.ESTOQUE.itens.filter(v => Compare.ids().includes(v.id));
  function renderBandeja() {
    const el = document.querySelector('[data-bandeja]');
    if (!el) return;
    const ids = Compare.ids();
    el.classList.toggle('is-on', ids.length > 0);
    if (!ids.length) { el.innerHTML = ''; return; }
    el.innerHTML = `<div class="band-inner">
      <p class="band-tit">Comparar <strong>${ids.length}/3</strong></p>
      <ul class="band-lista">${doEstoque().map(v => `<li>${imagem(v)}<span>${esc(v.modelo)}</span><button type="button" data-tirar="${v.id}" aria-label="Remover ${esc(v.modelo)}">×</button></li>`).join('')}</ul>
      <button type="button" class="btn btn-acento" data-abrir-comp ${ids.length < 2 ? 'disabled' : ''}>${ids.length < 2 ? 'Escolha mais 1' : 'Comparar agora'}</button>
    </div>`;
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tirar]');
    if (t) {
      const id = Number(t.dataset.tirar);
      Compare.salvar(Compare.ids().filter(x => x !== id));
      document.querySelectorAll(`[data-comp="${id}"]`).forEach(cb => { cb.checked = false; });
      renderBandeja();
    }
    if (e.target.closest('[data-abrir-comp]')) abrirComparacao();
    if (e.target.closest('[data-fechar-modal]') || e.target.classList.contains('modal')) fecharModal();
  });

  function abrirComparacao() {
    const vs = doEstoque();
    const temMoto = vs.some(v => v.tipo === 'moto'), temCarro = vs.some(v => v.tipo !== 'moto');
    const linhas = [
      ['Preço', v => moeda(v.preco), 'min', v => v.preco],
      ['Ano', v => `${v.anoFab}/${v.ano}`, 'max', v => v.ano],
      ['Quilometragem', v => `${num(v.km)} km`, 'min', v => v.km],
      ['Motor', v => v.motor],
      temMoto ? ['Cilindrada', v => v.cilindrada ? `${v.cilindrada} cc` : '—'] : null,
      ['Câmbio', v => v.cambio], ['Combustível', v => v.combustivel],
      ['Categoria', v => nomeCat(v.categoria)], ['Cor', v => v.cor],
      temMoto ? ['Freio ABS', v => v.tipo === 'moto' ? (v.abs ? 'Sim' : 'Não') : '—'] : null,
      ['Único dono', v => v.unicoDono ? 'Sim' : 'Não'], ['Laudo cautelar', v => v.laudo ? 'Aprovado' : '—'],
      ['Opcionais', v => v.opcionais.length + ' itens', 'max', v => v.opcionais.length],
    ].filter(Boolean);
    void temCarro;
    const melhor = (l) => { if (!l[2]) return null; const vals = vs.map(l[3]); return l[2] === 'min' ? Math.min(...vals) : Math.max(...vals); };
    document.body.insertAdjacentHTML('beforeend', `<div class="modal" role="dialog" aria-modal="true" aria-label="Comparação">
      <div class="modal-box modal-comp">
        <button type="button" class="modal-x" data-fechar-modal aria-label="Fechar">×</button>
        <h2>Comparação lado a lado</h2>
        <div class="comp-rolagem"><div class="comp-tabela" style="--n:${vs.length}">
          <div class="comp-h"></div>
          ${vs.map(v => `<div class="comp-h">${imagem(v)}<strong>${esc(v.marca)} ${esc(v.modelo)}</strong><span>${esc(v.versao)}</span></div>`).join('')}
          ${linhas.map(l => { const m = melhor(l); return `<div class="comp-rot">${l[0]}</div>${vs.map(v => `<div class="comp-val ${m !== null && l[3](v) === m ? 'is-melhor' : ''}">${l[1](v)}</div>`).join('')}`; }).join('')}
          <div class="comp-rot"></div>
          ${vs.map(v => `<div class="comp-val"><a class="btn btn-escuro btn-sm" href="anuncio.html?id=${v.id}">Ver anúncio</a></div>`).join('')}
        </div></div>
      </div></div>`);
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-x').focus();
  }
  function fecharModal() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

  // ---------- toast ----------
  let tTimer;
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(tTimer);
    tTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
  }

  // ---------- aviso de demonstração, ano e formulários de demonstração ----------
  (function aviso() {
    const k = (CONF.chave || 'veiculos') + '-demo';
    let fechado = false;
    try { fechado = sessionStorage.getItem(k) === '1'; } catch (e) {}
    if (fechado) return;
    const bar = document.createElement('div');
    bar.className = 'demo';
    bar.innerHTML = '<p><strong>Site de demonstração.</strong> Anúncios, lojas e valores são ilustrativos — modelo criado pela <a href="../../index.html#portfolio">WT Site Lab</a>.</p><button type="button" aria-label="Fechar aviso">×</button>';
    bar.querySelector('button').addEventListener('click', () => { bar.remove(); try { sessionStorage.setItem(k, '1'); } catch (e) {} });
    document.body.prepend(bar);
  })();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-demo-form]');
    if (!f) return;
    e.preventDefault();
    const nota = f.querySelector('[data-form-note]');
    if (nota) nota.textContent = 'Formulário de demonstração — nenhum dado foi enviado. No site real, a mensagem chega ao vendedor.';
  });

  atualizarContadorFav();
  renderBandeja();
  window.VeiculosUI = { moeda, num, esc, cartao, imagem, fotoDe, esqueleto, toast, ICONES, nomeCat, atualizarContadorFav, renderBandeja, Compare };
})();
