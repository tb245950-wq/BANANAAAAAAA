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

// ===== SMOOTH ENTRANCE for hero text =====
window.addEventListener('load', () => {
  document.querySelector('.hero-content').style.opacity = '1';
});
