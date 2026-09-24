/* Conteúdo do site de demonstração — Kessler Almeida Advogados.
   Escritório, pessoas e contatos fictícios (modelo WT Site Lab). */
window.SITE = {
  nome: 'Kessler Almeida Advogados',
  capa: {
    estilo: 'linhas',
    paletas: [
      ['#0E1A24', '#8FA3B0', '#3FBF9A'],
      ['#F4F1EA', '#9AA39A', '#1F6F5C'],
      ['#12303A', '#6F8F94', '#E3C987'],
    ],
  },
  equipe: [
    {
      id: 'ricardo',
      nome: 'Dr. Ricardo Kessler',
      cargo: 'Sócio · Tributário',
      oab: 'OAB/RS 000.000',
      bio: 'Lidera a prática tributária, com atuação em planejamento, contencioso administrativo e judicial e na adaptação de empresas à reforma tributária.',
      formacao: ['Doutor em Direito Tributário', 'LL.M. em Tributação Internacional'],
    },
    {
      id: 'camila',
      nome: 'Dra. Camila Almeida',
      cargo: 'Sócia · Societário e M&A',
      oab: 'OAB/RS 000.001',
      bio: 'Assessora fusões, aquisições, acordos de sócios e governança corporativa, com foco em empresas familiares e de médio porte.',
      formacao: ['Mestre em Direito Empresarial', 'Conselheira certificada em governança'],
    },
    {
      id: 'eduardo',
      nome: 'Dr. Eduardo Faria Lins',
      cargo: 'Sócio · Reestruturação',
      oab: 'OAB/RS 000.002',
      bio: 'Atua em recuperações judiciais e extrajudiciais, negociação com credores e reorganização de passivos.',
      formacao: ['Especialista em Direito Falimentar e Recuperacional'],
    },
  ],
  artigos: [
    {
      slug: 'reforma-tributaria-2026-2033',
      titulo: 'Reforma tributária: o que muda para sua empresa entre 2026 e 2033',
      resumo: 'CBS, IBS e Imposto Seletivo substituem cinco tributos em uma transição de oito anos. Um roteiro do que acontece em cada fase.',
      categoria: 'Tributário',
      data: '2026-09-18',
      autor: 'ricardo',
      corpo: `
<p>A Emenda Constitucional nº 132/2023 e a Lei Complementar nº 214/2025 colocaram em marcha a maior mudança na tributação do consumo desde a Constituição de 1988. Cinco tributos — PIS, Cofins, IPI, ICMS e ISS — darão lugar a um modelo de <strong>IVA dual</strong>, somado a um imposto seletivo. A transição é longa, e é justamente por isso que exige planejamento desde já.</p>

<h2>Os novos tributos</h2>
<table>
  <thead><tr><th>Novo tributo</th><th>Competência</th><th>Substitui</th></tr></thead>
  <tbody>
    <tr><td><strong>CBS</strong> — Contribuição sobre Bens e Serviços</td><td>União</td><td>PIS e Cofins</td></tr>
    <tr><td><strong>IBS</strong> — Imposto sobre Bens e Serviços</td><td>Estados e municípios</td><td>ICMS e ISS</td></tr>
    <tr><td><strong>IS</strong> — Imposto Seletivo</td><td>União</td><td>Incide sobre bens e serviços prejudiciais à saúde ou ao meio ambiente</td></tr>
  </tbody>
</table>

<h2>O cronograma da transição</h2>
<ul>
  <li><strong>2026 — ano de teste:</strong> CBS à alíquota de 0,9% e IBS à alíquota de 0,1%, com possibilidade de compensação e dispensa de recolhimento para quem cumprir as obrigações acessórias. O foco é calibrar sistemas e documentos fiscais.</li>
  <li><strong>2027 — a CBS entra em vigor:</strong> PIS e Cofins são extintos, o IPI tem alíquotas reduzidas a zero (com exceções ligadas à Zona Franca de Manaus) e começa a cobrança do Imposto Seletivo. O IBS segue em teste.</li>
  <li><strong>2029 a 2032 — substituição gradual:</strong> as alíquotas de ICMS e ISS caem 10% ao ano (para 90%, 80%, 70% e 60% das atuais), enquanto o IBS cresce na mesma proporção.</li>
  <li><strong>2033 — modelo completo:</strong> ICMS e ISS deixam de existir.</li>
</ul>
<blockquote>Durante anos, as empresas conviverão com dois sistemas ao mesmo tempo. A complexidade da transição é o maior risco — e também a maior oportunidade de quem se prepara.</blockquote>

<h2>O que muda na lógica do imposto</h2>
<ul>
  <li><strong>Não cumulatividade ampla:</strong> em regra, tudo o que é adquirido para a atividade gera crédito, e não apenas insumos em sentido estrito.</li>
  <li><strong>Tributação no destino:</strong> o IBS pertence ao local de consumo, o que reduz a guerra fiscal e altera a lógica de incentivos regionais.</li>
  <li><strong>Split payment:</strong> o recolhimento pode ocorrer no momento do pagamento, com impacto direto no fluxo de caixa.</li>
  <li><strong>Regimes diferenciados:</strong> setores como saúde, educação e alimentos da cesta básica têm reduções específicas.</li>
</ul>

<h2>E o Simples Nacional?</h2>
<p>O Simples Nacional continua existindo. As empresas optantes, porém, poderão escolher recolher IBS e CBS fora do regime unificado — o que permite transferir créditos integrais aos clientes. Para quem vende a outras empresas, essa escolha pode ser decisiva para a competitividade.</p>

<h2>Por onde começar</h2>
<div class="destaque">
  <p class="destaque-titulo">Checklist para 2026</p>
  <p>1) Mapear o impacto na carga tributária por produto e serviço. 2) Revisar contratos de longo prazo e cláusulas de reajuste de preços. 3) Adequar sistemas e emissão de documentos fiscais. 4) Reavaliar benefícios fiscais de ICMS que perderão efeito. 5) Simular o efeito do split payment no capital de giro.</p>
</div>
`,
    },
    {
      slug: 'holding-familiar',
      titulo: 'Holding familiar: planejamento patrimonial e sucessório com segurança',
      resumo: 'Quando a holding faz sentido, quais são as vantagens reais, os custos envolvidos e os cuidados com ITBI e ITCMD.',
      categoria: 'Societário',
      data: '2026-08-30',
      autor: 'camila',
      corpo: `
<p>A holding familiar se tornou uma das estruturas mais procuradas por famílias empresárias e por quem tem patrimônio relevante em imóveis ou participações. Bem estruturada, organiza a gestão e facilita a sucessão. Mal estruturada, pode gerar custos, conflitos e questionamentos fiscais.</p>

<h2>O que é uma holding familiar</h2>
<p>É uma sociedade — em geral limitada ou anônima — cujo objeto é deter bens e participações da família. Em vez de os imóveis e as quotas de empresas ficarem em nome das pessoas físicas, eles passam a pertencer à holding, e os familiares passam a ser sócios dela.</p>

<h2>As vantagens reais</h2>
<ul>
  <li><strong>Sucessão planejada:</strong> as quotas podem ser doadas em vida aos herdeiros, com reserva de usufruto, mantendo o controle com os fundadores.</li>
  <li><strong>Regras de convivência:</strong> o contrato social e o acordo de sócios definem quem administra, como se decide e como um sócio pode sair.</li>
  <li><strong>Proteção por cláusulas:</strong> doações podem ser feitas com cláusulas de incomunicabilidade e inalienabilidade, preservando o patrimônio familiar.</li>
  <li><strong>Menos burocracia na sucessão:</strong> com as quotas já transferidas, evita-se o condomínio de imóveis entre herdeiros e parte relevante do inventário.</li>
</ul>
<blockquote>A holding é um instrumento de organização, não de ocultação. Estruturas feitas apenas para "pagar menos imposto" costumam ser as primeiras a ser questionadas.</blockquote>

<h2>Os pontos de atenção tributários</h2>
<p><strong>ITBI na integralização:</strong> a Constituição prevê imunidade do ITBI na incorporação de imóveis ao capital social (art. 156, §2º, I), mas ela não se aplica quando a atividade preponderante da empresa for a compra, venda ou locação de imóveis. Além disso, o Supremo Tribunal Federal decidiu (Tema 796) que a imunidade não alcança o valor dos imóveis que exceder o capital social integralizado.</p>
<p><strong>ITCMD nas doações de quotas:</strong> o imposto é estadual, e a reforma tributária tornou obrigatória a sua progressividade conforme o valor transmitido. A base de cálculo das quotas também tem sido objeto de atenção dos fiscos estaduais.</p>
<p><strong>Tributação da renda:</strong> aluguéis e ganhos de capital passam a ser tributados na pessoa jurídica, o que pode ser mais ou menos vantajoso conforme o regime e o perfil dos bens. A conta precisa ser feita caso a caso.</p>

<h2>Quando faz sentido</h2>
<table>
  <thead><tr><th>Costuma fazer sentido</th><th>Costuma não compensar</th></tr></thead>
  <tbody>
    <tr><td>Patrimônio imobiliário relevante e diversificado</td><td>Poucos bens, de baixo valor</td></tr>
    <tr><td>Participação em empresas operacionais</td><td>Família sem interesse em regras de governança</td></tr>
    <tr><td>Vários herdeiros e desejo de evitar condomínio</td><td>Necessidade de liquidez imediata dos bens</td></tr>
  </tbody>
</table>

<div class="destaque">
  <p class="destaque-titulo">O documento mais importante</p>
  <p>Mais do que abrir a empresa, o valor da holding está no acordo de sócios: regras de entrada e saída, sucessão na administração, distribuição de lucros e solução de conflitos.</p>
</div>
`,
    },
    {
      slug: 'recuperacao-judicial',
      titulo: 'Recuperação judicial: quando é o caminho e como funciona',
      resumo: 'Requisitos, stay period, plano de recuperação e alternativas como a mediação e a recuperação extrajudicial.',
      categoria: 'Reestruturação',
      data: '2026-08-12',
      autor: 'eduardo',
      corpo: `
<p>A recuperação judicial existe para preservar empresas viáveis que atravessam uma crise financeira. Regulada pela Lei nº 11.101/2005 — profundamente reformada pela Lei nº 14.112/2020 —, ela permite reorganizar dívidas sob supervisão judicial, protegendo a atividade, os empregos e o valor do negócio.</p>

<h2>Quem pode pedir</h2>
<p>O artigo 48 da lei exige que o devedor, no momento do pedido:</p>
<ul>
  <li>exerça regularmente suas atividades há <strong>mais de 2 anos</strong>;</li>
  <li>não seja falido (ou, se foi, que as responsabilidades estejam extintas);</li>
  <li>não tenha obtido recuperação judicial há menos de <strong>5 anos</strong>;</li>
  <li>não tenha sido condenado, nem tenha como administrador ou sócio controlador pessoa condenada, por crime falimentar.</li>
</ul>

<h2>O stay period</h2>
<p>Deferido o processamento, as execuções contra a empresa ficam suspensas por <strong>180 dias</strong>, prorrogáveis uma vez por igual período, em caráter excepcional (art. 6º, §4º). É o fôlego necessário para negociar com os credores sem ter o caixa bloqueado.</p>
<blockquote>A recuperação judicial funciona melhor quando é pedida cedo — antes que a crise de liquidez destrua o valor que se pretende preservar.</blockquote>

<h2>O plano de recuperação</h2>
<p>A empresa tem <strong>60 dias</strong>, contados da decisão que defere o processamento, para apresentar o plano (art. 53), com a descrição dos meios de recuperação e a demonstração de sua viabilidade. Entre os meios mais usados estão:</p>
<ul>
  <li>alongamento de prazos e concessão de descontos;</li>
  <li>venda de ativos ou de unidades produtivas isoladas;</li>
  <li>conversão de dívida em participação societária;</li>
  <li>novos financiamentos (DIP), com prioridade de pagamento.</li>
</ul>
<p>Havendo objeção de credores, o plano é votado em assembleia-geral por classes: trabalhistas, com garantia real, quirografários e microempresas e empresas de pequeno porte.</p>

<h2>As alternativas</h2>
<table>
  <thead><tr><th>Instrumento</th><th>Quando considerar</th></tr></thead>
  <tbody>
    <tr><td>Mediação e conciliação antecedentes</td><td>Negociação com credores específicos, com possibilidade de proteção cautelar (art. 20-B).</td></tr>
    <tr><td>Recuperação extrajudicial</td><td>Acordo já negociado com credores relevantes, levado à homologação judicial.</td></tr>
    <tr><td>Recuperação judicial</td><td>Crise ampla, com necessidade de suspensão das execuções e negociação coletiva.</td></tr>
  </tbody>
</table>

<div class="destaque">
  <p class="destaque-titulo">Sinais de alerta</p>
  <p>Uso recorrente de capital de giro caro, atrasos com fornecedores estratégicos, bloqueios judiciais e dificuldade em renovar linhas de crédito indicam que é hora de avaliar alternativas — com tempo para escolher a melhor.</p>
</div>
`,
    },
  ],
};
