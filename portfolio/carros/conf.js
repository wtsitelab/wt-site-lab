/* Configuração do site Rodante sobre o Kit Veículos (WT Site Lab). */
window.CONF = {
 "chave": "rodante",
 "nome": "Rodante",
 "cidade": "Curitiba",
 "tiposMultiplos": false,
 "tipoUnico": "carro",
 "categorias": {
  "hatch": {
   "nome": "Hatch",
   "plural": "Hatchs",
   "tipo": "carro"
  },
  "sedan": {
   "nome": "Sedã",
   "plural": "Sedãs",
   "tipo": "carro"
  },
  "suv": {
   "nome": "SUV",
   "plural": "SUVs",
   "tipo": "carro"
  },
  "picape": {
   "nome": "Picape",
   "plural": "Picapes",
   "tipo": "carro"
  },
  "esportivo": {
   "nome": "Esportivo",
   "plural": "Esportivos",
   "tipo": "carro",
   "corIcone": "Vermelho"
  }
 },
 "faixasPreco": [
  [
   null,
   60000,
   "Até 60 mil"
  ],
  [
   null,
   100000,
   "Até 100 mil"
  ],
  [
   100000,
   150000,
   "100 a 150 mil"
  ],
  [
   200000,
   null,
   "Acima de 200 mil"
  ]
 ],
 "faixasCilindrada": [],
 "kmMax": 120000,
 "kmStep": 5000,
 "financiamento": {
  "taxas": [
   [
    1.49,
    "perfil excelente"
   ],
   [
    1.79,
    "perfil bom"
   ],
   [
    2.19,
    "perfil regular"
   ]
  ],
  "prazos": [
   12,
   24,
   36,
   48,
   60
  ],
  "prazoPadrao": 48,
  "entradaPadrao": 30
 },
 "marcasVender": {
  "carro": [
   "BMW",
   "BYD",
   "Chevrolet",
   "Citroën",
   "Fiat",
   "Ford",
   "Honda",
   "Hyundai",
   "Jeep",
   "Kia",
   "Mitsubishi",
   "Nissan",
   "Peugeot",
   "Renault",
   "Toyota",
   "Volkswagen"
  ],
  "moto": [
   "BMW",
   "Ducati",
   "Harley-Davidson",
   "Honda",
   "Kawasaki",
   "KTM",
   "Royal Enfield",
   "Suzuki",
   "Triumph",
   "Yamaha"
  ]
 },
 "opcionaisVender": {
  "carro": [
   "Ar-condicionado",
   "Bancos de couro",
   "Câmera de ré",
   "Central multimídia",
   "Piloto automático",
   "Rodas de liga leve",
   "Sensor de estacionamento",
   "Teto solar"
  ],
  "moto": [
   "ABS",
   "Baú",
   "Bolha alta",
   "Controle de tração",
   "Farol full LED",
   "Keyless",
   "Painel digital",
   "Protetor de motor",
   "Quick shifter",
   "Tomada USB"
  ]
 }
};
// título dinâmico da busca
window.CONF.titulo = function (e, UI) {
  const cidade = '<em>Curitiba</em>';
  if (e.fav) return 'Seus <em>favoritos</em>';
  if (e.categorias.length === 1) {
    const c = window.CONF.categorias[e.categorias[0]];
    return c.plural + (c.tipo === 'moto' && !/^Motos/.test(c.plural) ? ' seminovas' : c.tipo === 'moto' ? ' seminovas' : ' seminovos') + ' em ' + cidade;
  }
  if (e.tipos.length === 1) return (e.tipos[0] === 'moto' ? 'Motos seminovas' : 'Carros seminovos') + ' em ' + cidade;
  if (e.marcas.length === 1) return UI.esc(e.marcas[0]) + ' em ' + cidade;
  return "Carros seminovos em <em>Curitiba</em>";
};
