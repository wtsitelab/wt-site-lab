/* Configuração do site Guidão sobre o Kit Veículos (WT Site Lab). */
window.CONF = {
 "chave": "guidao",
 "nome": "Guidão",
 "cidade": "Curitiba",
 "tiposMultiplos": false,
 "tipoUnico": "moto",
 "categorias": {
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
   15000,
   "Até 15 mil"
  ],
  [
   null,
   30000,
   "Até 30 mil"
  ],
  [
   30000,
   60000,
   "30 a 60 mil"
  ],
  [
   60000,
   null,
   "Acima de 60 mil"
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
 "kmMax": 60000,
 "kmStep": 2500,
 "financiamento": {
  "taxas": [
   [
    1.89,
    "perfil excelente"
   ],
   [
    2.19,
    "perfil bom"
   ],
   [
    2.59,
    "perfil regular"
   ]
  ],
  "prazos": [
   12,
   24,
   36,
   48
  ],
  "prazoPadrao": 36,
  "entradaPadrao": 20
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
  return "Motos seminovas em <em>Curitiba</em>";
};
