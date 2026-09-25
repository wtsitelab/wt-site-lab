// Volt — simulação de leitura do scanner e seleção de dia/horário.
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const MODULOS = [
    { nome: 'Injeção eletrônica', falha: { cod: 'P0301', txt: 'Falha de ignição no cilindro 1', dica: 'Verificar vela, cabo e bobina do cilindro 1.' } },
    { nome: 'ABS / freios' },
    { nome: 'Airbag' },
    { nome: 'Carroceria (BCM)', falha: { cod: 'B1325', txt: 'Tensão baixa com o carro desligado', dica: 'Testar a bateria e a fuga de corrente.' } },
    { nome: 'Painel de instrumentos' },
    { nome: 'Ar-condicionado' },
  ];
  const lista = $('[data-modulos]'), barra = $('[data-progresso]'), res = $('[data-resultado]'), btn = $('[data-escanear]'), luz = $('[data-luz]');
  const desenhar = () => { lista.innerHTML = MODULOS.map(m => `<li><span>${m.nome}</span><em>aguardando</em></li>`).join(''); };
  desenhar();
  let rodando = false;
  btn.addEventListener('click', () => {
    if (rodando) return;
    rodando = true; res.hidden = true; desenhar();
    btn.textContent = 'Lendo módulos…'; btn.disabled = true; luz.className = 'scanner-luz lendo';
    const itens = $$('li', lista);
    MODULOS.forEach((m, i) => {
      setTimeout(() => {
        itens[i].classList.add('lendo'); itens[i].querySelector('em').textContent = 'lendo…';
      }, i * 520);
      setTimeout(() => {
        itens[i].classList.remove('lendo');
        itens[i].classList.add(m.falha ? 'falha' : 'ok');
        itens[i].querySelector('em').textContent = m.falha ? m.falha.cod : 'sem falhas';
        barra.style.width = ((i + 1) / MODULOS.length * 100) + '%';
        if (i === MODULOS.length - 1) {
          const falhas = MODULOS.filter(x => x.falha);
          res.innerHTML = `<strong>${falhas.length} falhas encontradas</strong>` + falhas.map(f => `<p><span class="mono">${f.falha.cod}</span> ${f.falha.txt}<small>${f.falha.dica}</small></p>`).join('');
          res.hidden = false; luz.className = 'scanner-luz alerta';
          btn.textContent = 'Ler novamente'; btn.disabled = false; rodando = false;
        }
      }, i * 520 + 420);
    });
    barra.style.width = '0%';
  });

  // dias úteis e horários de agendamento
  const dias = $('[data-dias]'), horas = $('[data-horas]');
  const lista5 = [];
  for (let d = new Date(), n = 0; lista5.length < 5 && n < 14; n++) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) lista5.push(new Date(d));
  }
  dias.innerHTML = lista5.map((d, i) => `<button type="button" aria-pressed="${i === 0}"><small>${d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small>${d.getDate()}</button>`).join('');
  const HORAS = ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00'];
  const ocupadas = (i) => new Set([(i * 2) % 6, (i * 3 + 1) % 6]);
  function renderHoras(i) {
    const oc = ocupadas(i);
    horas.innerHTML = HORAS.map((h, k) => `<button type="button" ${oc.has(k) ? 'disabled title="Horário ocupado"' : ''} aria-pressed="false">${h}</button>`).join('');
  }
  renderHoras(0);
  dias.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', dias).forEach((x, i) => { x.setAttribute('aria-pressed', String(x === b)); if (x === b) renderHoras(i); });
  });
  horas.addEventListener('click', e => {
    const b = e.target.closest('button:not([disabled])'); if (!b) return;
    $$('button', horas).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  });
})();
