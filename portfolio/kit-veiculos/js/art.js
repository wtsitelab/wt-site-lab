/* Ilustrações vetoriais dos carros (perfil lateral), geradas por tipo de
   carroceria e cor. No site real, este papel é das fotos enviadas pelo
   anunciante; aqui evitam fotos de terceiros e mantêm a vitrine coerente. */
(function () {
  'use strict';

  const CORES = {
    Branco: '#EDEDEB', Preto: '#1E2024', Prata: '#B9BFC7', Cinza: '#6B7280',
    Vermelho: '#B3261E', Azul: '#1F4E9E', Verde: '#2F5D46', Bege: '#CDBB9A', Amarelo: '#F2C230', Laranja: '#E8741E',
  };

  // front do carro à direita; chão em y=160
  const FORMAS = {
    hatch: {
      corpo: 'M48 150 L46 108 Q48 80 72 68 Q92 60 130 58 L196 58 Q230 59 260 88 L332 101 Q354 105 358 123 L358 150 Z',
      vidro: 'M66 96 Q70 78 88 70 Q104 64 132 64 L194 64 Q220 66 244 92 Z', coluna: [158], rodas: [104, 300], r: 27, farol: [338, 108], lanterna: [46, 104],
    },
    sedan: {
      corpo: 'M28 150 L28 126 Q30 112 52 108 L112 100 Q142 67 182 61 L246 61 Q276 63 302 90 L352 101 Q372 105 374 124 L374 150 Z',
      vidro: 'M124 99 Q148 72 182 67 L240 67 Q262 69 284 94 Z', coluna: [206], rodas: [98, 304], r: 27, farol: [354, 108], lanterna: [30, 118],
    },
    suv: {
      corpo: 'M34 152 L34 92 Q36 60 72 55 L218 53 Q248 55 272 84 L344 96 Q366 100 368 122 L368 152 Z',
      vidro: 'M52 90 Q54 66 78 63 L214 61 Q238 63 258 88 Z', coluna: [128, 196], rodas: [100, 302], r: 31, farol: [348, 104], lanterna: [36, 98],
    },
    picape: {
      corpo: 'M20 148 L20 104 L178 104 L184 64 Q186 54 200 54 L264 54 Q284 56 302 84 L356 96 Q376 100 378 120 L378 148 Z',
      vidro: 'M198 86 L200 64 Q202 60 210 60 L260 60 Q278 62 292 86 Z', coluna: [244], rodas: [88, 312], r: 31, farol: [360, 104], lanterna: [22, 110], cacamba: true,
    },
    esportivo: {
      corpo: 'M28 148 L28 130 Q32 116 60 112 L130 104 Q172 73 216 71 L262 73 Q298 79 324 101 L362 109 Q378 113 378 130 L378 148 Z',
      vidro: 'M148 102 Q178 80 216 77 L256 79 Q282 83 302 99 Z', coluna: [], rodas: [96, 306], r: 26, farol: [362, 114], lanterna: [30, 122],
    },
  };

  const CENAS = {
    estudio: { fundo: ['#F1F2F4', '#DADDE2'], chao: '#C9CDD3', luz: 'rgba(255,255,255,.7)' },
    dia: { fundo: ['#CFE3F5', '#EEF3F7'], chao: '#B8C0C8', luz: 'rgba(255,255,255,.55)' },
    tarde: { fundo: ['#F6C9A0', '#F3E4D4'], chao: '#C8B4A2', luz: 'rgba(255,240,220,.5)' },
    noite: { fundo: ['#141A2A', '#27324A'], chao: '#1A2030', luz: 'rgba(160,190,255,.25)' },
  };

  function ajustar(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(Math.min(255, Math.max(0, f > 0 ? v + (255 - v) * f : v * (1 + f)))));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }

  let uid = 0;
  function carroSVG(carroceria, cor, cena = 'estudio', classe = '') {
    const f = FORMAS[carroceria] || (carroceria === 'minivan' ? FORMAS.suv : FORMAS.sedan);
    const base = CORES[cor] || cor || '#888';
    const sc = CENAS[cena] || CENAS.estudio;
    const id = 'c' + (++uid);
    const escuro = cor === 'Preto';
    const roda = (x) => `
      <g>
        <circle cx="${x}" cy="${160 - f.r + 4}" r="${f.r + 5}" fill="#0E1014"/>
        <circle cx="${x}" cy="${160 - f.r + 4}" r="${f.r}" fill="#1A1C20"/>
        <circle cx="${x}" cy="${160 - f.r + 4}" r="${f.r * 0.62}" fill="url(#${id}ar)"/>
        ${[0, 72, 144, 216, 288].map(a => `<rect x="${x - 2}" y="${160 - f.r + 4 - f.r * 0.58}" width="4" height="${f.r * 0.5}" rx="2" fill="#5B616B" transform="rotate(${a} ${x} ${160 - f.r + 4})"/>`).join('')}
        <circle cx="${x}" cy="${160 - f.r + 4}" r="${f.r * 0.16}" fill="#2B2F36"/>
      </g>`;
    return `<svg class="car-art ${classe}" viewBox="0 0 400 200" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sc.fundo[0]}"/><stop offset="1" stop-color="${sc.fundo[1]}"/></linearGradient>
        <linearGradient id="${id}co" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${ajustar(base, escuro ? 0.28 : 0.35)}"/>
          <stop offset=".45" stop-color="${base}"/>
          <stop offset="1" stop-color="${ajustar(base, -0.35)}"/>
        </linearGradient>
        <linearGradient id="${id}vi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A3442"/><stop offset=".6" stop-color="#11161E"/><stop offset="1" stop-color="#3A4658"/></linearGradient>
        <clipPath id="${id}cv"><path d="${f.vidro}"/></clipPath>
        <radialGradient id="${id}ar"><stop offset="0" stop-color="#C9CED6"/><stop offset="1" stop-color="#7D848F"/></radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#${id}bg)"/>
      ${cena === 'noite' ? '<g fill="#FFD27A" opacity=".5"><circle cx="40" cy="40" r="1.6"/><circle cx="90" cy="28" r="1.2"/><circle cx="300" cy="34" r="1.4"/><circle cx="350" cy="52" r="1.1"/><circle cx="210" cy="22" r="1.3"/></g>' : ''}
      <rect x="0" y="160" width="400" height="40" fill="${sc.chao}" opacity=".6"/>
      <ellipse cx="200" cy="162" rx="176" ry="9" fill="#000" opacity=".22"/>
      <path d="${f.corpo}" fill="url(#${id}co)"/>
      ${f.cacamba ? '<path d="M24 108 L176 108" stroke="rgba(0,0,0,.25)" stroke-width="2"/><path d="M20 104 L178 104" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>' : ''}
      <path d="${f.vidro}" fill="url(#${id}vi)"/>
      <g clip-path="url(#${id}cv)">${f.coluna.map(x => `<rect x="${x - 3}" y="40" width="6" height="70" fill="url(#${id}co)"/>`).join('')}<path d="M0 40 L120 40 L60 120 L0 120Z" fill="rgba(255,255,255,.08)"/></g>
      <path d="${f.corpo}" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>
      <path d="M${f.rodas[0] + 40} ${f.cacamba ? 112 : 108} L${f.rodas[1] - 38} ${f.cacamba ? 112 : 108}" stroke="${sc.luz}" stroke-width="2" stroke-linecap="round"/>
      <path d="M${f.rodas[0] + 44} 132 L${f.rodas[1] - 44} 132" stroke="rgba(0,0,0,.14)" stroke-width="1.2"/>
      ${f.coluna.length ? `<path d="M${f.coluna[f.coluna.length - 1]} 100 L${f.coluna[f.coluna.length - 1] + 2} 146" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>` : ''}
      <rect x="${f.farol[0]}" y="${f.farol[1]}" width="16" height="7" rx="3.5" fill="#F5F7FA" stroke="rgba(0,0,0,.2)"/>
      <rect x="${f.lanterna[0]}" y="${f.lanterna[1]}" width="10" height="9" rx="3" fill="#C8102E"/>
      ${roda(f.rodas[0])}${roda(f.rodas[1])}
    </svg>`;
  }

  // ---------- motos (perfil lateral, frente à direita) ----------
  const MOTOS = {
    street: { rodas: [96, 300], r: 38, tanque: 'M170 92 Q200 72 246 78 L262 100 L190 104 Z', banco: 'M120 96 Q150 90 176 96 L172 104 L118 104 Z', carenagem: null },
    naked: { rodas: [96, 300], r: 38, tanque: 'M168 88 Q204 64 250 74 L266 100 L186 104 Z', banco: 'M112 92 Q144 84 172 92 L168 102 L110 100 Z', carenagem: null },
    esportiva: { rodas: [98, 300], r: 37, tanque: 'M162 82 Q200 60 240 66 L250 92 L180 98 Z', banco: 'M104 82 Q136 74 164 84 L160 94 L100 92 Z', carenagem: 'M236 64 Q290 60 318 96 L312 124 L262 130 L242 100 Z' },
    trail: { rodas: [92, 306], r: 42, tanque: 'M168 86 Q204 64 248 72 L262 98 L184 102 Z', banco: 'M112 84 Q146 76 176 86 L172 96 L108 94 Z', carenagem: 'M248 70 L284 56 L292 70 L262 90 Z', alta: true },
    bigtrail: { rodas: [92, 306], r: 42, tanque: 'M164 80 Q204 56 252 66 L268 100 L180 102 Z', banco: 'M106 80 Q144 70 174 82 L170 94 L102 92 Z', carenagem: 'M250 64 L290 40 L304 58 L270 92 Z', alta: true },
    custom: { rodas: [84, 316], r: 36, tanque: 'M176 98 Q210 80 250 90 L256 108 L190 110 Z', banco: 'M112 108 Q146 96 180 106 L176 116 L110 116 Z', carenagem: null, baixa: true },
    scooter: { rodas: [100, 296], r: 28, tanque: null, banco: 'M112 96 Q150 86 190 96 L186 106 L110 106 Z', carenagem: 'M92 130 Q96 100 124 104 L200 106 Q214 130 236 130 L250 70 L276 64 L284 78 L270 150 L110 150 Z' },
  };
  function motoSVG(categoria, cor, cena = 'estudio', classe = '') {
    const m = MOTOS[categoria] || MOTOS.street;
    const base = CORES[cor] || cor || '#888';
    const sc = CENAS[cena] || CENAS.estudio;
    const id = 'm' + (++uid);
    const cy = 162 - m.r;
    const roda = (x) => `<circle cx="${x}" cy="${cy}" r="${m.r}" fill="#15171B"/><circle cx="${x}" cy="${cy}" r="${m.r * 0.72}" fill="none" stroke="#4A4F58" stroke-width="3"/><circle cx="${x}" cy="${cy}" r="${m.r * 0.18}" fill="#9AA0A8"/>`;
    const [xT, xD] = m.rodas;
    const garfoTopo = m.alta ? 70 : (m.baixa ? 96 : 80);
    return `<svg class="car-art ${classe}" viewBox="0 0 400 200" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sc.fundo[0]}"/><stop offset="1" stop-color="${sc.fundo[1]}"/></linearGradient>
        <linearGradient id="${id}co" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ajustar(base, 0.35)}"/><stop offset="1" stop-color="${ajustar(base, -0.3)}"/></linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#${id}bg)"/>
      <rect x="0" y="160" width="400" height="40" fill="${sc.chao}" opacity=".6"/>
      <ellipse cx="200" cy="163" rx="150" ry="7" fill="#000" opacity=".22"/>
      ${roda(xT)}${roda(xD)}
      <path d="M${xT} ${cy} L150 ${cy - 30} L230 ${cy - 26} L${xD - 36} ${garfoTopo + 10}" fill="none" stroke="#2B2F36" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${xD} ${cy} L${xD - 34} ${garfoTopo}" stroke="#8A9099" stroke-width="6" stroke-linecap="round"/>
      <path d="M${xD - 40} ${garfoTopo - 4} l-14 -8" stroke="#1E2024" stroke-width="5" stroke-linecap="round"/>
      <rect x="170" y="${cy - 34}" width="44" height="30" rx="6" fill="#3A3F47"/>
      <path d="M150 ${cy + 6} L${xT + 10} ${cy + 12} L${xT - 26} ${cy + 4}" fill="none" stroke="#9AA0A8" stroke-width="6" stroke-linecap="round"/>
      ${m.carenagem ? `<path d="${m.carenagem}" fill="url(#${id}co)"/>` : ''}
      ${m.tanque ? `<path d="${m.tanque}" fill="url(#${id}co)"/>` : ''}
      <path d="${m.banco}" fill="#1B1D21"/>
      <circle cx="${xD - 28}" cy="${garfoTopo + 6}" r="7" fill="#F5F7FA" stroke="rgba(0,0,0,.25)"/>
      <rect x="${xT + 8}" y="${m.baixa ? 100 : 86}" width="10" height="6" rx="2" fill="#C8102E"/>
    </svg>`;
  }
  function veiculoSVG(tipo, categoria, cor, cena, classe) {
    return tipo === 'moto' ? motoSVG(categoria, cor, cena, classe) : carroSVG(categoria, cor, cena, classe);
  }

  window.CarArt = { carroSVG, motoSVG, veiculoSVG, CORES };
})();
