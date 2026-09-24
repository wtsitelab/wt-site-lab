/* Kit Veículos — página de busca: filtros sincronizados com a URL (links
   compartilháveis), contagens por opção, seletor Carros/Motos (sites mistos),
   esqueleto de carregamento, paginação e chips de filtros ativos. */
(function () {
  'use strict';
  const API = window.VeiculosAPI;
  const UI = window.VeiculosUI;
  const CONF = window.CONF;
  const LIM = API.limites();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const LISTAS = ['tipos', 'marcas', 'categorias', 'combustiveis', 'cambios', 'cores', 'cidades', 'opcionais', 'cilindradas'];
  const NUMEROS = ['precoMin', 'precoMax', 'anoMin', 'anoMax', 'kmMax', 'pagina'];
  const BOOLS = ['unicoDono', 'revisado', 'laudo', 'blindado', 'abs', 'abaixoRef'];
  const ROTULOS_BOOL = { unicoDono: 'Único dono', revisado: 'Revisado', laudo: 'Laudo aprovado', blindado: 'Blindado', abs: 'Freio ABS', abaixoRef: 'Abaixo da referência' };
  const temCarros = LIM.tipos.includes('carro');
  const KM_MAX = CONF.kmMax || 120000;

  function lerURL() {
    const p = new URLSearchParams(location.search);
    const s = { q: p.get('q') || '', ordem: p.get('ordem') || 'relevancia', fav: p.get('fav') === '1' };
    LISTAS.forEach(k => { s[k] = p.get(k) ? p.get(k).split(',') : []; });
    NUMEROS.forEach(k => { s[k] = p.get(k) ? Number(p.get(k)) : null; });
    BOOLS.forEach(k => { s[k] = p.get(k) === '1'; });
    return s;
  }
  function gravarURL() {
    const p = new URLSearchParams();
    if (estado.q) p.set('q', estado.q);
    if (estado.fav) p.set('fav', '1');
    LISTAS.forEach(k => { if (estado[k].length) p.set(k, estado[k].join(',')); });
    NUMEROS.forEach(k => { if (estado[k]) p.set(k, estado[k]); });
    BOOLS.forEach(k => { if (estado[k]) p.set(k, '1'); });
    if (estado.ordem !== 'relevancia') p.set('ordem', estado.ordem);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }
  let estado = lerURL();

  // ---------- painel de filtros ----------
  const corpo = $('[data-filtros-corpo]');
  const anos = []; for (let a = LIM.anoMax; a >= LIM.anoMin; a--) anos.push(a);
  const CORES_HEX = window.CarArt.CORES;
  const chipsDe = (lista, valores) => `<div class="fchips" data-lista="${lista}">${valores.map(v => `<label class="fchip"><input type="checkbox" value="${UI.esc(v)}"><span>${UI.esc(v)} <em data-cont></em></span></label>`).join('')}</div>`;
  const checksDe = (lista, valores, rot = (v) => v) => `<div class="flista" data-lista="${lista}">${valores.map(v => `<label class="fcheck" data-nome="${UI.esc(String(rot(v)).toLowerCase())}"><input type="checkbox" value="${UI.esc(v)}"><span>${UI.esc(rot(v))}</span><em data-cont></em></label>`).join('')}</div>`;
  const switches = ['unicoDono', 'revisado', 'laudo'].concat(temCarros ? ['blindado'] : []).concat(LIM.temMotos ? ['abs'] : []);

  corpo.innerHTML = `
    <details class="fgrupo" open>
      <summary>Preço</summary>
      <div class="fpreco">
        <label><span>Mínimo</span><input type="text" inputmode="numeric" placeholder="R$ 0" data-num="precoMin"></label>
        <label><span>Máximo</span><input type="text" inputmode="numeric" placeholder="Sem limite" data-num="precoMax"></label>
      </div>
      <div class="fchips">${CONF.faixasPreco.map(([a, b, r]) => `<button type="button" class="fchip" data-faixa="${a || ''}-${b || ''}">${r}</button>`).join('')}</div>
      <label class="fcheck fcheck-destaque"><input type="checkbox" data-bool="abaixoRef"><span>Só abaixo da referência de mercado</span></label>
    </details>
    ${LIM.temMotos ? `<details class="fgrupo" open data-so-moto>
      <summary>Cilindrada</summary>
      <div class="fchips" data-lista="cilindradas">${CONF.faixasCilindrada.map(([r]) => `<label class="fchip"><input type="checkbox" value="${r}"><span>${r} <em data-cont></em></span></label>`).join('')}</div>
    </details>` : ''}
    <details class="fgrupo" open>
      <summary>Ano</summary>
      <div class="fpreco">
        <label><span>De</span><select data-num="anoMin"><option value="">Qualquer</option>${anos.map(a => `<option>${a}</option>`).join('')}</select></label>
        <label><span>Até</span><select data-num="anoMax"><option value="">Qualquer</option>${anos.map(a => `<option>${a}</option>`).join('')}</select></label>
      </div>
    </details>
    <details class="fgrupo" open>
      <summary>Quilometragem</summary>
      <div class="fkm">
        <input type="range" min="${CONF.kmStep * 2}" max="${KM_MAX}" step="${CONF.kmStep}" value="${KM_MAX}" data-km aria-label="Quilometragem máxima">
        <p><span data-km-label>Qualquer quilometragem</span></p>
      </div>
    </details>
    <details class="fgrupo" open>
      <summary>Marca</summary>
      <input type="search" class="fbusca" placeholder="Filtrar marcas" data-filtra-marca aria-label="Filtrar marcas">
      ${checksDe('marcas', LIM.marcas)}
    </details>
    <details class="fgrupo" open><summary>Câmbio</summary>${chipsDe('cambios', LIM.cambios)}</details>
    <details class="fgrupo" open><summary>Combustível</summary>${chipsDe('combustiveis', LIM.combustiveis)}</details>
    <details class="fgrupo" open>
      <summary>Cor</summary>
      <div class="fcores" data-lista="cores">${LIM.cores.map(c => `<label class="fcor" title="${c}"><input type="checkbox" value="${c}"><span style="--c:${CORES_HEX[c] || '#999'}"></span><small>${c}</small></label>`).join('')}</div>
    </details>
    <details class="fgrupo"><summary>Opcionais</summary>${checksDe('opcionais', LIM.opcionais)}</details>
    ${LIM.cidades.length > 1 ? `<details class="fgrupo"><summary>Cidade</summary>${checksDe('cidades', LIM.cidades)}</details>` : ''}
    <details class="fgrupo" open>
      <summary>Procedência</summary>
      <div class="fswitches">${switches.map(k => `<label class="fswitch"><input type="checkbox" role="switch" data-bool="${k}"><span class="sw" aria-hidden="true"></span>${ROTULOS_BOOL[k]}</label>`).join('')}</div>
    </details>`;

  // seletor de tipo (só em sites com carros e motos)
  const seg = $('[data-tipo-seg]');
  if (seg && CONF.tiposMultiplos) {
    seg.innerHTML = `<button type="button" data-seg="">Todos</button><button type="button" data-seg="carro">Carros</button><button type="button" data-seg="moto">Motos</button><span class="seg-pill" aria-hidden="true"></span>`;
    $$('[data-seg]', seg).forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.seg;
      // ao trocar de tipo, limpa categorias e cilindrada que não fazem sentido
      mudar({ tipos: t ? [t] : [], categorias: estado.categorias.filter(c => !t || CONF.categorias[c].tipo === t), cilindradas: t === 'carro' ? [] : estado.cilindradas });
    }));
  }

  // atalhos de categoria com ilustração
  const tiposBox = $('[data-tipos]');
  const presentes = new Set(window.ESTOQUE.itens.map(v => v.categoria));
  tiposBox.innerHTML = Object.entries(CONF.categorias).filter(([k]) => presentes.has(k)).map(([k, c]) =>
    `<label class="tipo" data-cat-tipo="${c.tipo}"><input type="checkbox" value="${k}" data-tipo><span>${window.CarArt.veiculoSVG(c.tipo, k, c.corIcone || 'Branco', 'estudio')}<b>${c.nome}</b><em data-cont-tipo="${k}"></em></span></label>`).join('');

  // ---------- estado → controles ----------
  const fmtNum = (v) => v ? UI.moeda(v) : '';
  function aplicarEstadoNosControles() {
    $('[data-q]').value = estado.q;
    $('[data-ordem]').value = estado.ordem;
    $$('[data-num]').forEach(el => { const v = estado[el.dataset.num]; el.value = el.tagName === 'SELECT' ? (v || '') : fmtNum(v); });
    $$('[data-bool]').forEach(el => { el.checked = !!estado[el.dataset.bool]; });
    $$('[data-lista]').forEach(box => { const k = box.dataset.lista; $$('input', box).forEach(i => { i.checked = estado[k].includes(i.value); }); });
    $$('[data-tipo]').forEach(i => { i.checked = estado.categorias.includes(i.value); });
    const km = $('[data-km]');
    km.value = estado.kmMax || KM_MAX;
    $('[data-km-label]').textContent = estado.kmMax ? `Até ${UI.num(estado.kmMax)} km` : 'Qualquer quilometragem';
    $$('[data-faixa]').forEach(b => {
      const [a, z] = b.dataset.faixa.split('-').map(v => v ? Number(v) : null);
      b.classList.toggle('is-on', (estado.precoMin || null) === a && (estado.precoMax || null) === z);
    });
    const tipoSel = estado.tipos.length === 1 ? estado.tipos[0] : '';
    if (seg) {
      $$('[data-seg]', seg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.seg === tipoSel)));
      const ativo = $(`[data-seg="${tipoSel}"]`, seg);
      const pill = $('.seg-pill', seg);
      if (ativo && pill) { pill.style.width = ativo.offsetWidth + 'px'; pill.style.transform = `translateX(${ativo.offsetLeft - 4}px)`; }
    }
    $$('[data-cat-tipo]').forEach(l => { l.hidden = !!tipoSel && l.dataset.catTipo !== tipoSel; });
    $$('[data-so-moto]').forEach(el => { el.hidden = tipoSel === 'carro'; });
  }

  function mudar(parcial, { resetPagina = true } = {}) {
    Object.assign(estado, parcial);
    if (resetPagina) estado.pagina = null;
    gravarURL();
    aplicarEstadoNosControles();
    carregar();
  }

  // ---------- eventos ----------
  let tq;
  $('[data-q]').addEventListener('input', e => { clearTimeout(tq); tq = setTimeout(() => mudar({ q: e.target.value.trim() }), 300); });
  $('[data-ordem]').addEventListener('change', e => mudar({ ordem: e.target.value }));
  $$('[data-num]').forEach(el => el.addEventListener('change', () => mudar({ [el.dataset.num]: Number(String(el.value).replace(/\D/g, '')) || null })));
  $$('[data-bool]').forEach(el => el.addEventListener('change', () => mudar({ [el.dataset.bool]: el.checked })));
  $$('[data-lista]').forEach(box => box.addEventListener('change', () => mudar({ [box.dataset.lista]: $$('input:checked', box).map(i => i.value) })));
  tiposBox.addEventListener('change', () => mudar({ categorias: $$('[data-tipo]:checked').map(i => i.value) }));
  const km = $('[data-km]');
  km.addEventListener('input', () => { $('[data-km-label]').textContent = Number(km.value) >= KM_MAX ? 'Qualquer quilometragem' : `Até ${UI.num(Number(km.value))} km`; });
  km.addEventListener('change', () => mudar({ kmMax: Number(km.value) >= KM_MAX ? null : Number(km.value) }));
  $$('[data-faixa]').forEach(b => b.addEventListener('click', () => {
    const [a, z] = b.dataset.faixa.split('-').map(v => v ? Number(v) : null);
    mudar(b.classList.contains('is-on') ? { precoMin: null, precoMax: null } : { precoMin: a, precoMax: z });
  }));
  $('[data-filtra-marca]').addEventListener('input', e => {
    const t = e.target.value.toLowerCase();
    $$('[data-lista="marcas"] .fcheck').forEach(l => { l.hidden = !l.dataset.nome.includes(t); });
  });
  $$('[data-limpar]').forEach(b => b.addEventListener('click', () => {
    const vazio = { q: '', fav: false, ordem: estado.ordem };
    LISTAS.forEach(k => { vazio[k] = []; });
    NUMEROS.forEach(k => { vazio[k] = null; });
    BOOLS.forEach(k => { vazio[k] = false; });
    estado = vazio;
    mudar({});
  }));

  const painel = $('[data-filtros]');
  $('[data-abrir-filtros]').addEventListener('click', () => { painel.classList.add('is-open'); document.body.classList.add('travado'); });
  $$('[data-fechar-filtros]').forEach(b => b.addEventListener('click', () => { painel.classList.remove('is-open'); document.body.classList.remove('travado'); }));
  window.addEventListener('resize', () => aplicarEstadoNosControles());

  function chipsAtivos() {
    const c = [];
    if (estado.fav) c.push(['Favoritos', { fav: false }]);
    if (estado.q) c.push([`“${estado.q}”`, { q: '' }]);
    LISTAS.forEach(k => estado[k].forEach(v => {
      const rot = k === 'categorias' ? UI.nomeCat(v) : k === 'tipos' ? (v === 'moto' ? 'Motos' : 'Carros') : v;
      c.push([rot, { [k]: estado[k].filter(x => x !== v) }]);
    }));
    if (estado.precoMin || estado.precoMax) c.push([`${estado.precoMin ? UI.moeda(estado.precoMin) : 'R$ 0'} – ${estado.precoMax ? UI.moeda(estado.precoMax) : 'sem limite'}`, { precoMin: null, precoMax: null }]);
    if (estado.anoMin || estado.anoMax) c.push([`Ano ${estado.anoMin || '…'}–${estado.anoMax || '…'}`, { anoMin: null, anoMax: null }]);
    if (estado.kmMax) c.push([`Até ${UI.num(estado.kmMax)} km`, { kmMax: null }]);
    BOOLS.forEach(k => { if (estado[k]) c.push([ROTULOS_BOOL[k], { [k]: false }]); });
    const box = $('[data-ativos]');
    box.innerHTML = c.map((x, i) => `<button type="button" class="ativo" data-i="${i}">${UI.esc(x[0])}<span aria-hidden="true">×</span><span class="sr-only">Remover filtro</span></button>`).join('');
    $$('.ativo', box).forEach(b => b.addEventListener('click', () => mudar(c[Number(b.dataset.i)][1])));
    $('[data-n-filtros]').textContent = c.length;
    $('[data-n-filtros]').hidden = c.length === 0;
  }

  // ---------- carregamento ----------
  const grade = $('[data-grade]');
  let seq = 0;
  async function carregar() {
    const minha = ++seq;
    grade.setAttribute('aria-busy', 'true');
    grade.innerHTML = UI.esqueleto(6);
    chipsAtivos();
    const r = await API.buscar({ ...estado, ids: estado.fav ? API.favoritos.listar() : undefined });
    if (minha !== seq) return;

    $('[data-total]').textContent = UI.num(r.total);
    $('[data-total-label]').textContent = r.total === 1 ? 'oferta encontrada' : 'ofertas encontradas';
    $('[data-total-btn]').textContent = r.total;
    $('[data-vazio]').hidden = r.total > 0;
    grade.innerHTML = r.itens.map(v => UI.cartao(v)).join('');
    grade.setAttribute('aria-busy', 'false');
    $$('.card', grade).forEach((el, i) => el.style.setProperty('--i', i));

    const pares = { marcas: 'marca', cambios: 'cambio', combustiveis: 'combustivel', cidades: 'cidade', cores: 'cor', cilindradas: 'cilindrada' };
    Object.entries(pares).forEach(([lista, campo]) => {
      $$(`[data-lista="${lista}"] label`).forEach(l => {
        const i = $('input', l);
        const n = (r.facetas[campo] || {})[i.value] || 0;
        const cont = $('[data-cont]', l);
        if (cont) cont.textContent = n;
        l.classList.toggle('is-zero', n === 0 && !i.checked);
      });
    });
    $$('[data-cont-tipo]').forEach(el => {
      const n = r.facetas.categoria[el.dataset.contTipo] || 0;
      el.textContent = n;
      el.closest('.tipo').classList.toggle('is-zero', n === 0);
    });
    if (seg) {
      const ft = r.facetas.tipo;
      $$('[data-seg]', seg).forEach(b => {
        const n = b.dataset.seg ? (ft[b.dataset.seg] || 0) : Object.values(ft).reduce((a, x) => a + x, 0);
        b.dataset.n = n;
      });
    }
    $('[data-titulo]').innerHTML = CONF.titulo(estado, UI);

    const pag = $('[data-paginacao]');
    if (r.paginas <= 1) { pag.innerHTML = ''; return; }
    let h = `<button type="button" data-pg="${r.pagina - 1}" ${r.pagina === 1 ? 'disabled' : ''} aria-label="Página anterior">‹</button>`;
    for (let p = 1; p <= r.paginas; p++) h += `<button type="button" data-pg="${p}" ${p === r.pagina ? 'aria-current="page"' : ''}>${p}</button>`;
    h += `<button type="button" data-pg="${r.pagina + 1}" ${r.pagina === r.paginas ? 'disabled' : ''} aria-label="Próxima página">›</button>`;
    pag.innerHTML = h;
    $$('[data-pg]', pag).forEach(b => b.addEventListener('click', () => {
      mudar({ pagina: Number(b.dataset.pg) }, { resetPagina: false });
      $('#resultados').scrollIntoView({ behavior: 'smooth' });
    }));
  }

  aplicarEstadoNosControles();
  requestAnimationFrame(aplicarEstadoNosControles);
  carregar();
})();
