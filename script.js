// ===== FLOATING HEARTS =====
(function spawnHearts() {
  const container = document.getElementById('heartsBg');
  const emojis = ['❤️', '💕', '💖', '💗', '💓', '🌹', '✨'];

  function createHeart() {
    const el = document.createElement('span');
    el.classList.add('heart-particle');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const dur = 6 + Math.random() * 8;
    const delay = Math.random() * 5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = delay + 's';
    el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay) * 1000);
  }

  // Initial burst
  for (let i = 0; i < 15; i++) createHeart();
  setInterval(createHeart, 700);
})();

// ===== MODAL =====
function showMessage() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== ENVELOPE / LETTER =====
function openEnvelope() {
  const env = document.getElementById('envelope');
  const letter = document.getElementById('letterContent');

  if (!env.classList.contains('open')) {
    env.classList.add('open');
    setTimeout(() => {
      letter.classList.add('show');
      letter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500);
  } else {
    letter.classList.toggle('show');
  }
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.15 });

// Observe cards
document.querySelectorAll('.card').forEach(card => observer.observe(card));

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));

// ===== HEART CLICK SPARKLE =====
const bigHeart = document.getElementById('heartBig');
bigHeart.addEventListener('click', function () {
  // Burst of hearts on click
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('span');
    spark.textContent = '❤️';
    spark.style.cssText = `
      position: fixed;
      font-size: ${0.8 + Math.random()}rem;
      pointer-events: none;
      z-index: 999;
      left: ${bigHeart.getBoundingClientRect().left + 30}px;
      top: ${bigHeart.getBoundingClientRect().top + 30}px;
      transition: all 0.8s ease-out;
      opacity: 1;
    `;
    document.body.appendChild(spark);

    // Animate outward
    requestAnimationFrame(() => {
      const angle = (i / 8) * 2 * Math.PI;
      const dist = 60 + Math.random() * 60;
      spark.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 900);
  }
});

// ===== SMOOTH ENTRANCE for hero text =====
window.addEventListener('load', () => {
  document.querySelector('.hero-content').style.opacity = '1';
});
