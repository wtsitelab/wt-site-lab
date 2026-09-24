/* Kit Veículos — Anunciar: assistente em 3 passos com prévia ao vivo do
   cartão. Os campos se adaptam ao tipo (carro ou moto). Nesta demonstração
   nada é enviado; no site real, o envio grava o anúncio no banco (status
   "em análise") e as fotos no armazenamento de arquivos. */
(function () {
  'use strict';
  const UI = window.VeiculosUI;
  const CONF = window.CONF;
  const form = document.querySelector('[data-wizard]');
  const previa = document.querySelector('[data-previa]');
  const $ = (s) => form.querySelector(s);
  const tiposSite = CONF.tiposMultiplos ? ['carro', 'moto'] : [CONF.tipoUnico];
  let passo = 1;
  let fotoURL = null;

  // escolha de tipo (só em sites mistos)
  const boxTipo = $('[data-escolha-tipo]');
  if (boxTipo) {
    if (tiposSite.length > 1) {
      boxTipo.innerHTML = `<p class="rotulo">O que você vai anunciar?</p><div class="seg seg-claro">${tiposSite.map((t, i) => `<label><input type="radio" name="tipo" value="${t}" ${i === 0 ? 'checked' : ''}><span>${t === 'moto' ? 'Moto' : 'Carro'}</span></label>`).join('')}</div>`;
    } else boxTipo.innerHTML = `<input type="hidden" name="tipo" value="${tiposSite[0]}">`;
  }
  const tipoAtual = () => (form.querySelector('[name=tipo]:checked') || form.querySelector('[name=tipo]')).value;

  function montarOpcoes() {
    const t = tipoAtual();
    const cats = Object.entries(CONF.categorias).filter(([, c]) => c.tipo === t);
    const selCat = form.querySelector('[name=categoria]:checked');
    const catVal = selCat && CONF.categorias[selCat.value] && CONF.categorias[selCat.value].tipo === t ? selCat.value : cats[0][0];
    $('[data-opcoes-tipo]').innerHTML = cats.map(([k, c]) => `<label class="tipo tipo-claro"><input type="radio" name="categoria" value="${k}" ${k === catVal ? 'checked' : ''}><span>${CarArt.veiculoSVG(t, k, 'Prata', 'estudio')}<b>${c.nome}</b></span></label>`).join('');
    $('[name=marca]').innerHTML = '<option value="">Selecione</option>' + CONF.marcasVender[t].map(m => `<option>${m}</option>`).join('') + '<option>Outra</option>';
    $('[name=cambio]').innerHTML = (t === 'moto' ? ['Manual', 'Automático (CVT)', 'Semiautomático'] : ['Automático', 'Manual']).map(o => `<option>${o}</option>`).join('');
    $('[name=combustivel]').innerHTML = (t === 'moto' ? ['Gasolina', 'Flex', 'Elétrica'] : ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido']).map(o => `<option>${o}</option>`).join('');
    form.querySelectorAll('[data-so]').forEach(el => { el.hidden = el.dataset.so !== t; el.querySelectorAll('input').forEach(i => { i.disabled = el.hidden; }); });
    $('[data-opcionais]').innerHTML = CONF.opcionaisVender[t].map(o => `<label class="fchip"><input type="checkbox" name="opcionais" value="${o}"><span>${o}</span></label>`).join('');
  }
  document.querySelector('[data-opcoes-cor]').innerHTML = Object.entries(CarArt.CORES).map(([n, hex], i) =>
    `<label class="fcor"><input type="radio" name="cor" value="${n}" ${i === 2 ? 'checked' : ''}><span style="--c:${hex}"></span><small>${n}</small></label>`).join('');

  function dados() {
    const f = new FormData(form);
    const preco = Number(String(f.get('preco') || '').replace(/\D/g, '')) || 0;
    const ano = Number(f.get('ano')) || new Date().getFullYear();
    const t = tipoAtual();
    return {
      id: 0, tipo: t, marca: f.get('marca') || 'Marca', modelo: f.get('modelo') || 'Modelo', versao: f.get('versao') || 'Versão',
      ano, anoFab: ano, km: Number(f.get('km')) || 0, preco, ref: preco, cambio: f.get('cambio') || 'Manual', cilindrada: Number(f.get('cilindrada')) || 0,
      combustivel: f.get('combustivel'), categoria: f.get('categoria'), cor: f.get('cor') || 'Prata',
      unicoDono: !!f.get('unicoDono'), blindado: false, bairro: 'Seu bairro', cidade: f.get('cidade') || CONF.cidade, opcionais: f.getAll('opcionais'),
    };
  }
  function renderPrevia() {
    const v = dados();
    let html = UI.cartao(v, { semComparar: true, semFavorito: true });
    if (fotoURL) html = html.replace(/<svg class="car-art[\s\S]*?<\/svg>/, `<img class="car-foto" src="${fotoURL}" alt="Foto enviada">`);
    previa.innerHTML = html.replace('href="anuncio.html?id=0"', 'href="#" tabindex="-1" aria-disabled="true"');
  }
  form.addEventListener('change', e => { if (e.target.name === 'tipo') montarOpcoes(); renderPrevia(); });
  form.addEventListener('input', renderPrevia);
  $('[data-preco]').addEventListener('input', e => { const v = Number(e.target.value.replace(/\D/g, '')); e.target.value = v ? UI.moeda(v) : ''; });
  $('[data-foto]').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    if (fotoURL) URL.revokeObjectURL(fotoURL);
    fotoURL = URL.createObjectURL(f);
    renderPrevia();
  });

  const btnAv = form.querySelector('[data-avancar]');
  const btnVolta = form.querySelector('[data-voltar]');
  function ir(n) {
    passo = n;
    form.querySelectorAll('[data-passo]').forEach(p => { const atual = Number(p.dataset.passo) === n; p.hidden = !atual; p.classList.toggle('is-atual', atual); });
    form.querySelectorAll('[data-passo-ind]').forEach(li => { const k = Number(li.dataset.passoInd); li.classList.toggle('is-atual', k === n); li.classList.toggle('is-feito', k < n); });
    btnVolta.hidden = n === 1;
    btnAv.textContent = n === 3 ? 'Publicar anúncio' : 'Continuar';
    form.querySelector('.passos-w').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function valido() {
    const invalido = [...form.querySelectorAll(`[data-passo="${passo}"] [required]`)].find(c => !c.disabled && !c.checkValidity());
    if (invalido) { invalido.reportValidity(); return false; }
    return true;
  }
  btnAv.addEventListener('click', () => {
    if (!valido()) return;
    if (passo < 3) { ir(passo + 1); return; }
    form.querySelector('[data-form-note]').textContent = 'Anúncio de demonstração criado! No site real, ele seria gravado no banco de dados e ficaria "em análise" até a aprovação.';
    UI.toast('Anúncio publicado (demonstração)');
    btnAv.disabled = true;
  });
  btnVolta.addEventListener('click', () => ir(passo - 1));

  montarOpcoes();
  renderPrevia();
})();
