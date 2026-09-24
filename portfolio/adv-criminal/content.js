/* Conteúdo do site de demonstração — Valadares Toledo Advocacia Criminal.
   Escritório, pessoas e contatos fictícios (modelo WT Site Lab). */
window.SITE = {
  nome: 'Valadares Toledo Advocacia Criminal',
  capa: {
    estilo: 'noir',
    paletas: [
      ['#0E0C0B', '#ECE6DC', '#B3282E'],
      ['#141110', '#C9BFAF', '#8E1B1B'],
      ['#0B0B0D', '#E8E1D5', '#D0473F'],
    ],
  },
  equipe: [
    {
      id: 'henrique',
      nome: 'Dr. Henrique Valadares',
      cargo: 'Sócio fundador',
      oab: 'OAB/SP 000.000',
      bio: 'Atua há mais de quinze anos na defesa em crimes econômicos e no Tribunal do Júri. Coordena a estratégia de defesa desde a fase de investigação.',
      formacao: ['Mestre em Direito Processual Penal', 'Especialista em Direito Penal Econômico'],
    },
    {
      id: 'livia',
      nome: 'Dra. Lívia Toledo',
      cargo: 'Sócia',
      oab: 'OAB/SP 000.001',
      bio: 'Responsável pela atuação em habeas corpus e recursos nos tribunais superiores. Escreve sobre garantias processuais e jurisprudência do STJ e do STF.',
      formacao: ['Mestre em Direito Constitucional', 'Especialista em Ciências Criminais'],
    },
    {
      id: 'rafael',
      nome: 'Dr. Rafael Sá Menezes',
      cargo: 'Advogado associado',
      oab: 'OAB/SP 000.002',
      bio: 'Integra a equipe de plantão e atua em audiências de custódia, acordos de não persecução penal e execução penal.',
      formacao: ['Especialista em Execução Penal'],
    },
  ],
  artigos: [
    {
      slug: 'prisao-em-flagrante-primeiras-24-horas',
      titulo: 'Prisão em flagrante: o que acontece nas primeiras 24 horas',
      resumo: 'Da delegacia à audiência de custódia: os direitos de quem é preso e as decisões que o juiz pode tomar em até um dia.',
      categoria: 'Garantias do preso',
      data: '2026-09-10',
      autor: 'rafael',
      corpo: `
<p>As primeiras horas depois de uma prisão em flagrante costumam ser as mais confusas para a família — e também as mais importantes para a defesa. É nesse intervalo que se formam os primeiros registros do caso, que se decide sobre fiança e que o juiz avalia, na audiência de custódia, se a pessoa responderá ao processo presa ou em liberdade.</p>

<h2>Os direitos garantidos desde o primeiro minuto</h2>
<p>A Constituição Federal, no artigo 5º, estabelece garantias que valem a partir do momento da prisão:</p>
<ul>
  <li><strong>Direito ao silêncio</strong> e à assistência da família e de advogado (inciso LXIII). Ninguém é obrigado a produzir prova contra si.</li>
  <li><strong>Comunicação imediata</strong> da prisão e do local onde a pessoa se encontra ao juiz competente e à família ou a quem ela indicar (inciso LXII).</li>
  <li><strong>Identificação dos responsáveis</strong> pela prisão e pelo interrogatório policial (inciso LXIV).</li>
</ul>
<p>Na prática, isso significa que a pessoa presa pode — e, em regra, deve — aguardar a presença do advogado antes de prestar qualquer declaração formal.</p>

<h2>O que acontece na delegacia</h2>
<p>Após a apresentação do preso, a autoridade policial lavra o <strong>auto de prisão em flagrante</strong>, ouvindo o condutor, as testemunhas e, por fim, o próprio conduzido. Em até 24 horas, o preso deve receber a <strong>nota de culpa</strong>, com o motivo da prisão e os nomes do condutor e das testemunhas (art. 306, §2º, do Código de Processo Penal). No mesmo prazo, o auto é encaminhado ao juiz — e, se a pessoa não indicar advogado, também à Defensoria Pública.</p>
<div class="destaque">
  <p class="destaque-titulo">Fiança ainda na delegacia</p>
  <p>Quando o crime tem pena máxima de até 4 anos, o próprio delegado pode conceder fiança (art. 322 do CPP). Nos demais casos, o pedido é feito ao juiz.</p>
</div>

<h2>A audiência de custódia</h2>
<p>Desde a Lei nº 13.964/2019, o artigo 310 do CPP determina que, em até 24 horas após a prisão, o preso seja apresentado ao juiz em audiência de custódia, com a presença do Ministério Público e da defesa. O objetivo não é discutir se a pessoa é culpada, e sim verificar a <strong>legalidade da prisão</strong>, as condições em que ela ocorreu e a necessidade de mantê-la.</p>
<p>Ao final, o juiz deve tomar uma de três decisões:</p>
<ol>
  <li><strong>Relaxar a prisão</strong>, quando ela for ilegal — por exemplo, se não havia situação de flagrante.</li>
  <li><strong>Converter o flagrante em prisão preventiva</strong>, apenas se presentes os requisitos do artigo 312 do CPP e se as medidas cautelares alternativas forem insuficientes.</li>
  <li><strong>Conceder liberdade provisória</strong>, com ou sem fiança, podendo impor medidas cautelares como comparecimento periódico em juízo ou proibição de contato com determinadas pessoas.</li>
</ol>
<blockquote>A audiência de custódia é o primeiro momento em que a defesa técnica pode mudar o rumo do caso — e ela acontece em horas, não em semanas.</blockquote>

<h2>Como a família pode ajudar</h2>
<p>Enquanto o advogado atua, a família pode reunir informações que costumam pesar na decisão sobre a liberdade:</p>
<ul>
  <li>comprovante de residência fixa;</li>
  <li>comprovantes de trabalho ou de estudo;</li>
  <li>documentos que demonstrem vínculos familiares e dependentes;</li>
  <li>receitas e laudos, se houver problema de saúde que exija cuidado.</li>
</ul>
<p>Esses documentos ajudam a demonstrar que a pessoa não oferece risco ao processo e que pode responder em liberdade.</p>

<h2>Um cuidado importante</h2>
<p>Evite conversar sobre os fatos por telefone, mensagens ou redes sociais, e oriente os demais familiares a fazer o mesmo. Qualquer informação sobre o caso deve ser tratada diretamente com a defesa, que tem o dever de sigilo profissional.</p>
`,
    },
    {
      slug: 'acordo-de-nao-persecucao-penal',
      titulo: 'Acordo de Não Persecução Penal: quem pode fazer e quais são as condições',
      resumo: 'O ANPP permite encerrar a investigação sem processo criminal. Entenda os requisitos, as vedações e os efeitos do acordo.',
      categoria: 'Processo penal',
      data: '2026-08-21',
      autor: 'henrique',
      corpo: `
<p>O Acordo de Não Persecução Penal (ANPP) foi incluído no Código de Processo Penal pela Lei nº 13.964/2019, no artigo 28-A. Ele permite que o Ministério Público deixe de oferecer a denúncia — ou seja, que não haja processo criminal — desde que a pessoa investigada cumpra determinadas condições. Bem utilizado, é uma ferramenta que evita anos de processo e seus efeitos.</p>

<h2>Requisitos para o acordo</h2>
<p>O ANPP pode ser proposto quando, ao mesmo tempo:</p>
<ul>
  <li>não for caso de arquivamento da investigação;</li>
  <li>a infração tiver sido praticada <strong>sem violência ou grave ameaça</strong>;</li>
  <li>a <strong>pena mínima</strong> prevista for <strong>inferior a 4 anos</strong> (consideradas as causas de aumento e de diminuição aplicáveis ao caso);</li>
  <li>o investigado <strong>confessar formal e circunstanciadamente</strong> a prática da infração;</li>
  <li>o acordo for necessário e suficiente para a reprovação e a prevenção do crime.</li>
</ul>

<h2>Quando o acordo não é possível</h2>
<p>O §2º do artigo 28-A traz as hipóteses em que o ANPP é vedado:</p>
<ul>
  <li>quando for cabível a transação penal dos Juizados Especiais Criminais;</li>
  <li>se o investigado for reincidente, ou houver elementos que indiquem conduta criminal habitual, reiterada ou profissional (salvo infrações penais insignificantes);</li>
  <li>se o investigado tiver sido beneficiado, nos 5 anos anteriores, por outro ANPP, transação penal ou suspensão condicional do processo;</li>
  <li>nos crimes praticados no âmbito de violência doméstica ou familiar, ou contra a mulher por razões da condição de sexo feminino.</li>
</ul>

<h2>As condições que podem ser ajustadas</h2>
<p>As condições são negociadas entre o Ministério Público e a defesa e podem incluir, de forma cumulativa ou alternativa:</p>
<table>
  <thead><tr><th>Condição</th><th>Como funciona</th></tr></thead>
  <tbody>
    <tr><td>Reparação do dano</td><td>Restituir a coisa ou reparar o prejuízo à vítima, salvo impossibilidade.</td></tr>
    <tr><td>Renúncia a bens</td><td>Renunciar voluntariamente a bens indicados como instrumentos, produto ou proveito do crime.</td></tr>
    <tr><td>Prestação de serviços</td><td>Serviços à comunidade por período correspondente à pena mínima diminuída de um a dois terços.</td></tr>
    <tr><td>Prestação pecuniária</td><td>Pagamento a entidade pública ou de interesse social.</td></tr>
    <tr><td>Outra condição</td><td>Condição proporcional e compatível com a infração, por prazo determinado.</td></tr>
  </tbody>
</table>

<h2>Homologação e efeitos</h2>
<p>O acordo é formalizado por escrito e submetido ao juiz, que realiza audiência para verificar se ele foi feito de forma voluntária, ouvindo o investigado na presença do defensor (§4º). Cumpridas as condições, o juiz declara a <strong>extinção da punibilidade</strong> (§13).</p>
<div class="destaque">
  <p class="destaque-titulo">O ANPP gera antecedentes?</p>
  <p>Não. O acordo não constará da certidão de antecedentes criminais — o registro serve apenas para impedir um novo benefício no prazo de 5 anos (§12).</p>
</div>

<h2>O papel da defesa na negociação</h2>
<p>A confissão exigida pelo acordo tem consequências e precisa ser avaliada com cuidado. Antes de aceitar, a defesa analisa se não há hipótese de arquivamento, se as condições propostas são proporcionais e se a qualificação jurídica do fato está correta — já que uma classificação mais grave pode, inclusive, afastar o cabimento do acordo.</p>
`,
    },
    {
      slug: 'habeas-corpus-quando-cabe',
      titulo: 'Habeas corpus: quando cabe e como funciona',
      resumo: 'A garantia constitucional que protege a liberdade de locomoção contra ilegalidade ou abuso de poder — preventiva ou liberatória.',
      categoria: 'Tribunais superiores',
      data: '2026-07-30',
      autor: 'livia',
      corpo: `
<p>O habeas corpus é uma das garantias mais antigas do direito e está previsto no artigo 5º, inciso LXVIII, da Constituição: ele será concedido sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua <strong>liberdade de locomoção</strong>, por ilegalidade ou abuso de poder.</p>

<h2>Preventivo ou liberatório</h2>
<p>O habeas corpus pode ter duas finalidades:</p>
<ul>
  <li><strong>Liberatório (ou repressivo):</strong> quando a pessoa já está presa ilegalmente e o objetivo é fazer cessar essa prisão.</li>
  <li><strong>Preventivo:</strong> quando há ameaça concreta à liberdade — por exemplo, um mandado de prisão ilegal prestes a ser cumprido. Nesse caso, pede-se um salvo-conduto.</li>
</ul>

<h2>Quando a coação é considerada ilegal</h2>
<p>O artigo 648 do Código de Processo Penal lista situações em que a coação é ilegal, entre elas:</p>
<ol>
  <li>quando não houver justa causa;</li>
  <li>quando alguém estiver preso por mais tempo do que determina a lei;</li>
  <li>quando quem ordenar a coação não tiver competência para fazê-lo;</li>
  <li>quando houver cessado o motivo que autorizou a coação;</li>
  <li>quando não for alguém admitido a prestar fiança, nos casos em que a lei a autoriza;</li>
  <li>quando o processo for manifestamente nulo;</li>
  <li>quando extinta a punibilidade.</li>
</ol>
<blockquote>O habeas corpus não serve para rediscutir provas em profundidade — sua força está em apontar ilegalidades evidentes, que possam ser demonstradas desde logo.</blockquote>

<h2>Quem pode impetrar</h2>
<p>Qualquer pessoa pode impetrar habeas corpus, em seu favor ou de outra pessoa, e o Ministério Público também pode fazê-lo (art. 654 do CPP). A ação é gratuita (art. 5º, LXXVII, da Constituição). Ainda assim, a atuação técnica faz diferença: a petição precisa demonstrar a ilegalidade com clareza e estar acompanhada dos documentos que a comprovem.</p>

<h2>Para qual tribunal</h2>
<p>A competência depende de quem é a autoridade apontada como coatora. Contra ato de delegado, em regra, o pedido vai ao juiz de primeiro grau; contra decisão de juiz, ao Tribunal de Justiça ou ao Tribunal Regional Federal; e contra decisões de tribunais, ao Superior Tribunal de Justiça e, em determinadas hipóteses, ao Supremo Tribunal Federal.</p>
<div class="destaque">
  <p class="destaque-titulo">Pedido de liminar</p>
  <p>Em situações urgentes, é possível pedir uma decisão liminar, analisada antes do julgamento definitivo. Por isso, a rapidez na impetração costuma ser decisiva.</p>
</div>

<h2>Habeas corpus e recursos</h2>
<p>Os tribunais superiores têm entendimento restritivo quanto ao uso do habeas corpus como substituto de recurso próprio. Mesmo assim, admitem a concessão da ordem de ofício quando constatada ilegalidade flagrante. Definir a via adequada — recurso, habeas corpus ou ambos — é uma decisão estratégica da defesa.</p>
`,
    },
  ],
};
