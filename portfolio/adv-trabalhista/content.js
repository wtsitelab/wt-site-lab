/* Conteúdo do site de demonstração — Prado Nogueira Advocacia Trabalhista.
   Escritório, pessoas e contatos fictícios (modelo WT Site Lab). */
window.SITE = {
  nome: 'Prado Nogueira Advocacia Trabalhista',
  capa: {
    estilo: 'blocos',
    paletas: [
      ['#0F3D2E', '#F2C230', '#F5F2EA'],
      ['#F5F2EA', '#0F3D2E', '#F2C230'],
      ['#123B2C', '#1F6B4F', '#F2C230'],
    ],
  },
  equipe: [
    {
      id: 'marina',
      nome: 'Dra. Marina Prado',
      cargo: 'Sócia fundadora',
      oab: 'OAB/PR 00.000',
      bio: 'Atua há quinze anos em reclamações trabalhistas de empregados, com foco em verbas rescisórias, horas extras e assédio moral.',
      formacao: ['Especialista em Direito do Trabalho', 'Especialista em Processo do Trabalho'],
    },
    {
      id: 'andre',
      nome: 'Dr. André Nogueira',
      cargo: 'Sócio',
      oab: 'OAB/PR 00.001',
      bio: 'Coordena a área consultiva para empresas: auditoria trabalhista, políticas internas, negociação coletiva e defesa em reclamações.',
      formacao: ['Mestre em Direito Empresarial', 'MBA em Gestão de Pessoas'],
    },
    {
      id: 'julia',
      nome: 'Dra. Júlia Ramos',
      cargo: 'Advogada associada',
      oab: 'OAB/PR 00.002',
      bio: 'Atua em acidentes de trabalho, doenças ocupacionais e estabilidades provisórias, com apoio de assistência técnica em perícias.',
      formacao: ['Especialista em Direito do Trabalho e Previdenciário'],
    },
  ],
  artigos: [
    {
      slug: 'rescisao-indireta',
      titulo: 'Rescisão indireta: quando o empregado pode encerrar o contrato por falta do empregador',
      resumo: 'Atrasos salariais, FGTS não depositado e ofensas estão entre as faltas graves que permitem a "justa causa do patrão". Veja como funciona.',
      categoria: 'Rescisão',
      data: '2026-09-15',
      autor: 'marina',
      corpo: `
<p>Todo mundo conhece a demissão por justa causa aplicada pela empresa. Menos conhecido é o caminho inverso: quando é o <strong>empregador</strong> quem comete uma falta grave, o empregado pode considerar o contrato encerrado e receber as mesmas verbas de uma dispensa sem justa causa. É a chamada <strong>rescisão indireta</strong>, prevista no artigo 483 da CLT.</p>

<h2>As faltas graves do empregador</h2>
<p>O artigo 483 lista as situações que autorizam a rescisão indireta. O empregado pode considerar rescindido o contrato quando:</p>
<ul>
  <li>forem exigidos serviços superiores às suas forças, proibidos por lei, contrários aos bons costumes ou alheios ao contrato (alínea "a");</li>
  <li>for tratado pelo empregador ou por superiores com rigor excessivo (alínea "b");</li>
  <li>correr perigo manifesto de mal considerável (alínea "c");</li>
  <li>o empregador não cumprir as obrigações do contrato (alínea "d");</li>
  <li>o empregador ou seus prepostos praticarem ato lesivo da honra e boa fama do empregado ou de sua família (alínea "e");</li>
  <li>for ofendido fisicamente, salvo em legítima defesa (alínea "f");</li>
  <li>o empregador reduzir o trabalho, sendo este por peça ou tarefa, de forma a afetar sensivelmente o salário (alínea "g").</li>
</ul>

<h2>Os casos mais comuns na prática</h2>
<p>A alínea "d" — descumprimento das obrigações do contrato — é a que mais aparece nos tribunais. Entre as situações frequentemente reconhecidas estão:</p>
<ul>
  <li><strong>atrasos reiterados de salário</strong>;</li>
  <li><strong>ausência de depósitos do FGTS</strong>, que a jurisprudência do Tribunal Superior do Trabalho considera falta grave suficiente;</li>
  <li>não pagamento de horas extras de forma habitual;</li>
  <li>alteração unilateral e prejudicial das condições de trabalho.</li>
</ul>
<blockquote>A rescisão indireta não é um pedido de demissão: é o reconhecimento de que quem rompeu o contrato foi a empresa.</blockquote>

<h2>O que o empregado recebe</h2>
<p>Reconhecida a rescisão indireta, as verbas são as mesmas da dispensa sem justa causa:</p>
<table>
  <thead><tr><th>Verba</th><th>Observação</th></tr></thead>
  <tbody>
    <tr><td>Saldo de salário</td><td>Dias trabalhados no mês da saída.</td></tr>
    <tr><td>Aviso prévio</td><td>Proporcional ao tempo de serviço.</td></tr>
    <tr><td>13º salário proporcional</td><td>Calculado até a data da saída, com a projeção do aviso.</td></tr>
    <tr><td>Férias vencidas e proporcionais + 1/3</td><td>Incluindo o terço constitucional.</td></tr>
    <tr><td>FGTS + multa de 40%</td><td>Com liberação para saque.</td></tr>
    <tr><td>Seguro-desemprego</td><td>Se preenchidos os requisitos legais.</td></tr>
  </tbody>
</table>

<h2>Sair ou continuar trabalhando?</h2>
<p>Nas hipóteses das alíneas "d" e "g", a lei permite que o empregado <strong>continue trabalhando</strong> enquanto aguarda a decisão judicial (art. 483, §3º). Nas demais, em regra, ele se afasta do serviço. A escolha tem consequências: se a rescisão indireta não for reconhecida, o afastamento pode ser interpretado como pedido de demissão. Por isso, a estratégia deve ser definida com orientação antes de qualquer atitude.</p>

<div class="destaque">
  <p class="destaque-titulo">Guarde as provas</p>
  <p>Extratos do FGTS (disponíveis no aplicativo oficial), comprovantes de pagamento com as datas, mensagens e testemunhas são fundamentais para demonstrar a falta do empregador.</p>
</div>
`,
    },
    {
      slug: 'horas-extras-direitos',
      titulo: 'Horas extras: limites, adicional e banco de horas',
      resumo: 'Jornada máxima, adicional mínimo de 50%, intervalo para almoço e regras do banco de horas depois da Reforma Trabalhista.',
      categoria: 'Jornada',
      data: '2026-08-28',
      autor: 'julia',
      corpo: `
<p>A jornada de trabalho é um dos temas que mais geram dúvidas — e reclamações — na Justiça do Trabalho. A Constituição e a CLT estabelecem limites claros, e conhecê-los é o primeiro passo para saber se as horas trabalhadas estão sendo pagas corretamente.</p>

<h2>Os limites da jornada</h2>
<p>A regra geral está no artigo 7º, inciso XIII, da Constituição: a duração normal do trabalho não pode ultrapassar <strong>8 horas diárias e 44 horas semanais</strong>. O que passar disso é hora extra. A CLT permite, em regra, até <strong>2 horas extras por dia</strong> (art. 59).</p>

<h2>Quanto vale a hora extra</h2>
<p>O adicional mínimo é de <strong>50% sobre o valor da hora normal</strong> (art. 7º, XVI, da Constituição). Convenções e acordos coletivos podem prever percentuais maiores — e muitas categorias têm adicionais de 60%, 75% ou 100%, especialmente para domingos e feriados.</p>
<div class="destaque">
  <p class="destaque-titulo">Os reflexos</p>
  <p>Horas extras habituais refletem em outras verbas: descanso semanal remunerado, férias com 1/3, 13º salário, aviso prévio e FGTS. Na prática, o valor devido costuma ser bem maior que a soma das horas.</p>
</div>

<h2>Banco de horas</h2>
<p>Em vez de pagar, a empresa pode compensar as horas extras com folgas, desde que respeite as regras do artigo 59 da CLT:</p>
<ul>
  <li><strong>por acordo individual escrito</strong>, com compensação em até <strong>6 meses</strong> (§5º);</li>
  <li><strong>por acordo ou convenção coletiva</strong>, com compensação em até <strong>1 ano</strong> (§2º);</li>
  <li>por acordo individual, tácito ou escrito, quando a compensação ocorre no mesmo mês (§6º).</li>
</ul>
<p>Se o contrato terminar sem que as horas tenham sido compensadas, o saldo deve ser pago como hora extra.</p>

<h2>Intervalo para refeição</h2>
<p>Em jornadas acima de 6 horas, o intervalo mínimo é de <strong>1 hora</strong> (art. 71). Desde a Reforma Trabalhista de 2017, a supressão total ou parcial do intervalo gera o pagamento apenas do <strong>período suprimido, com acréscimo de 50%</strong>, com natureza indenizatória (art. 71, §4º).</p>

<h2>Como provar as horas extras</h2>
<p>Estabelecimentos com mais de 20 trabalhadores são obrigados a manter controle de ponto (art. 74, §2º). Quando os registros não refletem a realidade — os chamados "cartões britânicos", com horários sempre idênticos — outras provas ganham força:</p>
<ul>
  <li>mensagens e e-mails enviados fora do horário;</li>
  <li>registros de acesso a sistemas e ao prédio;</li>
  <li>testemunhas que trabalharam no mesmo período;</li>
  <li>anotações pessoais feitas na época.</li>
</ul>
<blockquote>O ponto que não registra a hora extra não apaga a hora trabalhada — apenas muda a forma de prová-la.</blockquote>
`,
    },
    {
      slug: 'prazo-acao-trabalhista',
      titulo: 'Qual é o prazo para entrar com uma ação trabalhista?',
      resumo: 'Dois anos para ajuizar, cinco anos de direitos cobráveis: entenda a prescrição trabalhista e por que o tempo corre contra o trabalhador.',
      categoria: 'Prazos',
      data: '2026-08-05',
      autor: 'andre',
      corpo: `
<p>Muita gente deixa para "resolver depois" as pendências do antigo emprego — e acaba perdendo direitos pelo simples passar do tempo. Na Justiça do Trabalho existem dois prazos que funcionam juntos, e entendê-los evita surpresas.</p>

<h2>A regra dos 2 e 5 anos</h2>
<p>O artigo 7º, inciso XXIX, da Constituição (repetido no artigo 11 da CLT) estabelece:</p>
<ul>
  <li><strong>2 anos após o fim do contrato</strong> para entrar com a ação. Passado esse prazo, perde-se o direito de cobrar judicialmente.</li>
  <li><strong>5 anos para trás</strong>, contados da data em que a ação é ajuizada: só podem ser cobrados os direitos desse período.</li>
</ul>
<blockquote>Cada mês de espera é um mês a menos de direitos que podem ser cobrados.</blockquote>

<h2>Um exemplo prático</h2>
<p>Imagine alguém que trabalhou de março de 2018 a março de 2026 fazendo horas extras sem receber:</p>
<table>
  <thead><tr><th>Ajuizou a ação em</th><th>Pode cobrar desde</th><th>Situação</th></tr></thead>
  <tbody>
    <tr><td>abril de 2026</td><td>abril de 2021</td><td>Dentro do prazo — 5 anos cobráveis.</td></tr>
    <tr><td>março de 2027</td><td>março de 2022</td><td>Dentro do prazo — mas perdeu 1 ano de direitos.</td></tr>
    <tr><td>abril de 2028</td><td>—</td><td>Prazo de 2 anos encerrado.</td></tr>
  </tbody>
</table>

<h2>E o FGTS?</h2>
<p>Até 2014, a cobrança de depósitos de FGTS não realizados seguia um prazo de 30 anos. O Supremo Tribunal Federal, no julgamento do ARE 709.212, passou a aplicar também ao FGTS o prazo de 5 anos, com regras de transição para os casos em que a prescrição já estava em curso. Hoje, a regra geral é a mesma das demais verbas.</p>

<h2>Situações especiais</h2>
<ul>
  <li><strong>Menores de 18 anos:</strong> contra eles não corre prescrição (art. 440 da CLT).</li>
  <li><strong>Ações declaratórias</strong>, como o reconhecimento de vínculo para fins previdenciários, não se sujeitam à prescrição (art. 11, §1º, da CLT).</li>
  <li><strong>Prescrição intercorrente:</strong> iniciada a execução, se o trabalhador deixar de cumprir determinação judicial, pode correr prazo de 2 anos dentro do próprio processo (art. 11-A).</li>
</ul>

<div class="destaque">
  <p class="destaque-titulo">Calcule o seu prazo</p>
  <p>Na página inicial deste site há uma calculadora que mostra, a partir da data de saída, até quando é possível ajuizar e desde quando os direitos podem ser cobrados.</p>
</div>
`,
    },
  ],
};
