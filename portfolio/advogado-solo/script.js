// ===== Dra. Camila Rezende =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Depoimentos (mock)
const depoimentos = [
  { texto: 'Passei por um divórcio difícil e a Dra. Camila me explicou cada etapa com muita paciência. Me senti amparada o tempo todo.', autor: 'Fernanda A.' },
  { texto: 'Resolvemos a guarda compartilhada por acordo, sem precisar brigar no tribunal. Rápido e muito mais tranquilo do que eu imaginava.', autor: 'Rodrigo M.' },
  { texto: 'O inventário do meu pai parecia complicado demais, mas ela conduziu tudo com clareza e sempre respondia minhas dúvidas rapidinho.', autor: 'Beatriz S.' },
];
const testimonialGrid = document.getElementById('testimonialGrid');
depoimentos.forEach(d => {
  const card = document.createElement('article');
  card.className = 'testimonial-card';
  card.innerHTML = `
    <div class="testimonial-stars">★★★★★</div>
    <p>"${d.texto}"</p>
    <span class="testimonial-author">${d.autor}</span>
  `;
  testimonialGrid.appendChild(card);
});

// FAQ — acordeão
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const jaAberto = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
    if (!jaAberto) item.classList.add('is-open');
  });
});

// Scroll reveal
const revealTargets = document.querySelectorAll('.help-card, .testimonial-card, .faq-item');
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

// Contact form (demo — futuro: integração com e-mail/CRM)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Mensagem recebida! Retorno o mais rápido possível. (formulário de demonstração)';
  form.reset();
});
