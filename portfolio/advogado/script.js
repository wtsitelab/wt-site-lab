// ===== Oliveira & Martins Advocacia =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Artigos do blog (mock — futuro: CMS / blog dinâmico)
const artigos = [
  {
    tag: 'Direito Trabalhista',
    title: 'Fui demitido sem justa causa: quais verbas tenho direito?',
    body: 'Ao ser demitido sem justa causa, o trabalhador tem direito a aviso prévio, saldo de salário, 13º proporcional, férias vencidas e proporcionais com um terço, além de saque do FGTS e multa de 40%. É importante conferir se todos os valores foram calculados corretamente antes de assinar a rescisão.'
  },
  {
    tag: 'Direito Previdenciário',
    title: 'Como funciona a revisão da vida toda do INSS?',
    body: 'A revisão da vida toda permite recalcular o benefício considerando todas as contribuições da vida laboral, inclusive as anteriores a julho de 1994, quando isso resultar em valor mais vantajoso. Cada caso exige uma simulação individual para saber se compensa solicitar a revisão.'
  },
  {
    tag: 'Direito Civil',
    title: 'Inventário extrajudicial: quando é possível fazer em cartório?',
    body: 'O inventário extrajudicial pode ser feito em cartório quando todos os herdeiros são maiores, capazes e estão de acordo com a partilha, e não há testamento. O processo costuma ser mais rápido e econômico que a via judicial, exigindo apenas a presença de um advogado.'
  }
];

const grid = document.getElementById('blogGrid');
const modal = document.getElementById('articleModal');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const articleClose = document.getElementById('articleClose');

artigos.forEach((artigo, i) => {
  const card = document.createElement('article');
  card.className = 'blog-card';
  card.innerHTML = `
    <span class="blog-number">0${i + 1}</span>
    <div class="blog-card-body">
      <span class="blog-tag">${artigo.tag}</span>
      <h3>${artigo.title}</h3>
      <span class="blog-read">Ler artigo →</span>
    </div>
  `;
  card.addEventListener('click', () => openArticle(artigo));
  grid.appendChild(card);
});

function openArticle(artigo){
  modalTag.textContent = artigo.tag;
  modalTitle.textContent = artigo.title;
  modalBody.textContent = artigo.body;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeArticle(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
articleClose.addEventListener('click', closeArticle);
modal.addEventListener('click', (e) => { if (e.target === modal) closeArticle(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeArticle(); });

// Scroll reveal
const revealTargets = document.querySelectorAll('.area-card, .team-card, .blog-card');
revealTargets.forEach(el => el.setAttribute('data-reveal',''));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// Contact form (demo — futuro: integração com CRM/e-mail)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Solicitação recebida. Entraremos em contato em até 1 dia útil. (formulário de demonstração)';
  form.reset();
});
