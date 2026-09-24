/* Conteúdo do site de demonstração — Rocha Moraes Direito Previdenciário.
   Escritório, pessoas e contatos fictícios (modelo WT Site Lab). */
window.SITE = {
  nome: 'Rocha Moraes Direito Previdenciário',
  capa: {
    estilo: 'horizonte',
    paletas: [
      ['#DCEBF2', '#12355B', '#F4B942'],
      ['#E4F2F1', '#1B8A8F', '#F4B942'],
      ['#FFF4DC', '#12355B', '#F08A4B'],
    ],
  },
  equipe: [
    {
      id: 'sergio',
      nome: 'Dr. Sérgio Rocha',
      cargo: 'Sócio fundador',
      oab: 'OAB/PR 00.000',
      bio: 'Há vinte anos dedicado ao Direito Previdenciário, com atuação em aposentadorias, revisões e ações contra o INSS na Justiça Federal.',
      formacao: ['Especialista em Direito Previdenciário', 'Especialista em Cálculos Previdenciários'],
    },
    {
      id: 'luciana',
      nome: 'Dra. Luciana Moraes',
      cargo: 'Sócia',
      oab: 'OAB/PR 00.001',
      bio: 'Responsável pelo planejamento previdenciário: análise do CNIS, simulação de regras e escolha do melhor momento para pedir o benefício.',
      formacao: ['Mestre em Direito da Seguridade Social'],
    },
    {
      id: 'paulo',
      nome: 'Dr. Paulo Henrique Dias',
      cargo: 'Advogado associado',
      oab: 'OAB/PR 00.002',
      bio: 'Atua em benefícios por incapacidade, BPC/LOAS e pensão por morte, acompanhando perícias médicas e sociais.',
      formacao: ['Especialista em Direito Previdenciário e Assistencial'],
    },
  ],
  artigos: [
    {
      slug: 'regras-de-transicao-aposentadoria',
      titulo: 'Regras de transição da aposentadoria: qual vale para você em 2026',
      resumo: 'Quem já contribuía antes da Reforma da Previdência pode se aposentar por regras de transição. Veja como funciona cada uma e os números deste ano.',
      categoria: 'Aposentadoria',
      data: '2026-09-16',
      autor: 'luciana',
      corpo: `
<p>A Reforma da Previdência (Emenda Constitucional nº 103/2019) entrou em vigor em <strong>13 de novembro de 2019</strong> e mudou as regras da aposentadoria. Para não prejudicar quem já estava contribuindo, ela criou <strong>regras de transição</strong>. Quem se filiou ao INSS antes dessa data pode escolher a regra mais vantajosa.</p>

<h2>A regra para quem começou depois da Reforma</h2>
<p>Quem começou a contribuir depois de 13/11/2019 segue a regra permanente: <strong>62 anos de idade</strong> (mulheres) ou <strong>65 anos</strong> (homens), com, no mínimo, <strong>15 anos</strong> de contribuição para mulheres e <strong>20 anos</strong> para homens.</p>

<h2>As regras de transição</h2>
<h3>1. Regra dos pontos</h3>
<p>Soma-se a idade com o tempo de contribuição. É preciso ter, no mínimo, <strong>30 anos de contribuição (mulheres)</strong> ou <strong>35 anos (homens)</strong> e atingir a pontuação do ano. A pontuação sobe 1 ponto por ano, até 100 (mulheres) e 105 (homens).</p>
<table>
  <thead><tr><th>Ano</th><th>Mulheres</th><th>Homens</th></tr></thead>
  <tbody>
    <tr><td>2025</td><td>92 pontos</td><td>102 pontos</td></tr>
    <tr><td><strong>2026</strong></td><td><strong>93 pontos</strong></td><td><strong>103 pontos</strong></td></tr>
    <tr><td>2027</td><td>94 pontos</td><td>104 pontos</td></tr>
    <tr><td>2028</td><td>95 pontos</td><td>105 pontos (limite)</td></tr>
  </tbody>
</table>

<h3>2. Idade mínima progressiva</h3>
<p>Exige 30 anos de contribuição (mulheres) ou 35 (homens) e uma idade mínima que sobe 6 meses por ano. Em <strong>2026</strong>, a idade mínima é de <strong>59 anos e 6 meses</strong> para mulheres e <strong>64 anos e 6 meses</strong> para homens. Os limites finais são 62 anos (mulheres, em 2031) e 65 anos (homens, em 2027).</p>

<h3>3. Transição por idade</h3>
<p>Para quem já contribuía antes da Reforma: <strong>62 anos</strong> (mulheres) ou <strong>65 anos</strong> (homens), com <strong>15 anos de contribuição</strong> para ambos.</p>

<h3>4. Pedágio de 50%</h3>
<p>Vale apenas para quem, em 13/11/2019, estava a <strong>no máximo 2 anos</strong> de completar 30 (mulheres) ou 35 (homens) anos de contribuição. É preciso cumprir o tempo que faltava mais 50% desse período, sem idade mínima. Nesta regra, aplica-se o fator previdenciário.</p>

<h3>5. Pedágio de 100%</h3>
<p>Exige idade mínima de <strong>57 anos</strong> (mulheres) ou <strong>60 anos</strong> (homens), o tempo de contribuição de 30/35 anos e um "pedágio" igual ao tempo que faltava em 13/11/2019. A vantagem: o benefício corresponde a <strong>100% da média</strong> dos salários.</p>

<h2>Como é calculado o valor</h2>
<p>Na maioria das regras, o benefício corresponde a <strong>60% da média</strong> de todos os salários desde julho de 1994, mais <strong>2% por ano</strong> de contribuição que exceder 15 anos (mulheres) ou 20 anos (homens). Por isso, a regra que permite se aposentar primeiro nem sempre é a que paga mais.</p>
<blockquote>Escolher a regra certa pode representar uma diferença significativa no valor do benefício por toda a vida.</blockquote>
<div class="destaque">
  <p class="destaque-titulo">Faça uma simulação</p>
  <p>Na página inicial deste site há um simulador que indica, a partir da sua idade e do seu tempo de contribuição, quando cada regra pode ser cumprida.</p>
</div>
`,
    },
    {
      slug: 'bpc-loas-quem-tem-direito',
      titulo: 'BPC/LOAS: quem tem direito ao benefício de um salário mínimo',
      resumo: 'O Benefício de Prestação Continuada garante um salário mínimo a idosos e pessoas com deficiência de baixa renda — mesmo sem nunca ter contribuído ao INSS.',
      categoria: 'Assistencial',
      data: '2026-08-27',
      autor: 'paulo',
      corpo: `
<p>O Benefício de Prestação Continuada (BPC), previsto na Lei Orgânica da Assistência Social (Lei nº 8.742/1993), garante <strong>um salário mínimo por mês</strong> a quem não tem meios de se sustentar nem de ser sustentado pela família. Uma diferença importante: <strong>não é preciso ter contribuído</strong> para o INSS.</p>

<h2>Quem pode receber</h2>
<p>O artigo 20 da lei prevê o benefício para dois grupos:</p>
<ul>
  <li><strong>Pessoas idosas</strong> com <strong>65 anos ou mais</strong>;</li>
  <li><strong>Pessoas com deficiência</strong> de qualquer idade — impedimento de longo prazo, de natureza física, mental, intelectual ou sensorial, que dificulte a participação plena na sociedade.</li>
</ul>

<h2>O critério de renda</h2>
<p>A regra geral exige que a renda mensal da família, dividida pelo número de pessoas, seja <strong>igual ou inferior a 1/4 do salário mínimo</strong> (art. 20, §3º). A lei também admite que esse limite seja ampliado para até meio salário mínimo em situações específicas, considerando, por exemplo, o grau da deficiência e gastos com saúde (art. 20-B).</p>
<div class="destaque">
  <p class="destaque-titulo">O Cadastro Único é obrigatório</p>
  <p>Para pedir o BPC, a família precisa estar inscrita e com os dados atualizados no CadÚnico, feito no CRAS do município.</p>
</div>

<h2>BPC não é aposentadoria</h2>
<table>
  <thead><tr><th></th><th>BPC/LOAS</th><th>Aposentadoria</th></tr></thead>
  <tbody>
    <tr><td>Exige contribuição</td><td>Não</td><td>Sim</td></tr>
    <tr><td>13º salário</td><td>Não</td><td>Sim</td></tr>
    <tr><td>Gera pensão por morte</td><td>Não</td><td>Sim</td></tr>
    <tr><td>Revisão periódica</td><td>A cada 2 anos</td><td>Não, em regra</td></tr>
  </tbody>
</table>
<p>Por isso, quem tem algum tempo de contribuição deve verificar, antes, se não tem direito a uma aposentadoria — que costuma ser mais vantajosa a longo prazo.</p>

<h2>Quando o pedido é negado</h2>
<p>As negativas mais comuns envolvem o cálculo da renda familiar e a avaliação da deficiência. Em ambos os casos, é possível recorrer administrativamente ou ingressar com ação na Justiça Federal, onde há nova perícia médica e, frequentemente, uma avaliação social feita na casa da família.</p>
<blockquote>Uma renda per capita um pouco acima do limite não encerra a discussão: a situação concreta de vulnerabilidade da família também é considerada.</blockquote>
`,
    },
    {
      slug: 'beneficio-negado-inss',
      titulo: 'Benefício negado pelo INSS: o que fazer',
      resumo: 'Recurso administrativo ou ação judicial? Entenda os prazos, os documentos e por que a carta de indeferimento é o ponto de partida.',
      categoria: 'Direitos do segurado',
      data: '2026-08-04',
      autor: 'sergio',
      corpo: `
<p>Receber uma negativa do INSS é frustrante, mas está longe de ser o fim do caminho. Muitos benefícios negados são concedidos depois, seja em recurso administrativo, seja na Justiça. O importante é entender o motivo da negativa e agir dentro dos prazos.</p>

<h2>Primeiro passo: a carta de indeferimento</h2>
<p>A decisão do INSS fica disponível no aplicativo e no site <strong>Meu INSS</strong>. Nela consta o motivo da negativa — por exemplo, falta de tempo de contribuição, perícia desfavorável ou renda acima do limite. Esse documento orienta toda a estratégia seguinte.</p>

<h2>Caminho 1: recurso administrativo</h2>
<p>O segurado pode recorrer ao Conselho de Recursos da Previdência Social (CRPS) no prazo de <strong>30 dias</strong> a partir da ciência da decisão. O recurso é feito pelo próprio Meu INSS e permite juntar novos documentos.</p>

<h2>Caminho 2: ação judicial</h2>
<p>Não é obrigatório esgotar o recurso administrativo para ir à Justiça — basta ter feito o pedido e ele ter sido negado. As ações de até <strong>60 salários mínimos</strong> tramitam nos Juizados Especiais Federais (Lei nº 10.259/2001), em regra mais rápidos.</p>
<table>
  <thead><tr><th></th><th>Recurso ao CRPS</th><th>Ação judicial</th></tr></thead>
  <tbody>
    <tr><td>Prazo para começar</td><td>30 dias</td><td>Enquanto não prescrito o direito</td></tr>
    <tr><td>Nova perícia</td><td>Pode ocorrer</td><td>Sim, com perito do juízo</td></tr>
    <tr><td>Quem decide</td><td>Órgão do próprio sistema previdenciário</td><td>Juiz federal</td></tr>
  </tbody>
</table>

<h2>E os valores atrasados?</h2>
<p>Se o benefício for reconhecido, ele é devido, em regra, desde a data do pedido feito ao INSS. Atenção: as parcelas mais antigas que <strong>5 anos</strong> prescrevem (art. 103, parágrafo único, da Lei nº 8.213/1991). Por isso, não é recomendável esperar demais para agir.</p>

<h2>Documentos que fazem diferença</h2>
<ul>
  <li><strong>CNIS</strong> — o extrato de contribuições, disponível no Meu INSS;</li>
  <li>carteiras de trabalho, inclusive as antigas;</li>
  <li>carnês e guias de contribuição individual;</li>
  <li><strong>PPP</strong> e laudos técnicos, para quem trabalhou exposto a agentes nocivos;</li>
  <li>laudos, exames e receitas médicas atualizados, nos benefícios por incapacidade.</li>
</ul>
<blockquote>Grande parte das negativas nasce de vínculos que não aparecem no CNIS. Revisar o extrato é, muitas vezes, o que muda o resultado.</blockquote>
`,
    },
  ],
};
