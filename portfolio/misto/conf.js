/* Configuração do site Roda Livre sobre o Kit Veículos (WT Site Lab). */
window.CONF = {
 "chave": "rodalivre",
 "nome": "Roda Livre",
 "cidade": "Londrina",
 "tiposMultiplos": true,
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
  },
  "minivan": {
   "nome": "Minivan",
   "plural": "Minivans",
   "tipo": "carro"
  },
  "street": {
   "nome": "Street",
   "plural": "Motos street",
   "tipo": "moto",
   "corIcone": "Vermelho"
  },
  "naked": {
   "nome": "Naked",
   "plural": "Nakeds",
   "tipo": "moto",
   "corIcone": "Preto"
  },
  "esportiva": {
   "nome": "Esportiva",
   "plural": "Esportivas",
   "tipo": "moto",
   "corIcone": "Azul"
  },
  "trail": {
   "nome": "Trail",
   "plural": "Trails",
   "tipo": "moto",
   "corIcone": "Laranja"
  },
  "bigtrail": {
   "nome": "Big trail",
   "plural": "Big trails",
   "tipo": "moto",
   "corIcone": "Cinza"
  },
  "custom": {
   "nome": "Custom",
   "plural": "Customs",
   "tipo": "moto",
   "corIcone": "Preto"
  },
  "scooter": {
   "nome": "Scooter",
   "plural": "Scooters",
   "tipo": "moto",
   "corIcone": "Prata"
  }
 },
 "faixasPreco": [
  [
   null,
   20000,
   "Até 20 mil"
  ],
  [
   null,
   60000,
   "Até 60 mil"
  ],
  [
   60000,
   120000,
   "60 a 120 mil"
  ],
  [
   120000,
   null,
   "Acima de 120 mil"
  ]
 ],
 "faixasCilindrada": [
  [
   "Até 160 cc",
   0,
   160
  ],
  [
   "161 a 300 cc",
   161,
   300
  ],
  [
   "301 a 600 cc",
   301,
   600
  ],
  [
   "601 a 1000 cc",
   601,
   1000
  ],
  [
   "Acima de 1000 cc",
   1001,
   99999
  ]
 ],
 "kmMax": 150000,
 "kmStep": 5000,
 "financiamento": {
  "taxas": [
   [
    1.59,
    "perfil excelente"
   ],
   [
    1.89,
    "perfil bom"
   ],
   [
    2.29,
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
  const cidade = '<em>Londrina</em>';
  if (e.fav) return 'Seus <em>favoritos</em>';
  if (e.categorias.length === 1) {
    const c = window.CONF.categorias[e.categorias[0]];
    return c.plural + (c.tipo === 'moto' && !/^Motos/.test(c.plural) ? ' seminovas' : c.tipo === 'moto' ? ' seminovas' : ' seminovos') + ' em ' + cidade;
  }
  if (e.tipos.length === 1) return (e.tipos[0] === 'moto' ? 'Motos seminovas' : 'Carros seminovos') + ' em ' + cidade;
  if (e.marcas.length === 1) return UI.esc(e.marcas[0]) + ' em ' + cidade;
  return "Carros e motos em <em>Londrina</em>";
};
