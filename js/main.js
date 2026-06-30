// Mobile navigation toggle
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const scrollTopBtn = document.getElementById('scroll-top');
const parallaxItems = document.querySelectorAll('[data-parallax]');

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !isHidden);
    menu.classList.toggle('flex', isHidden);
    menu.classList.toggle('flex-col', isHidden);
    menuBtn.setAttribute('aria-expanded', String(isHidden));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        menu.classList.add('hidden');
        menu.classList.remove('flex', 'flex-col');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Scroll-to-top button visibility
if (scrollTopBtn) {
  const toggleScrollTop = () => {
    scrollTopBtn.classList.toggle('hidden', window.scrollY < 360);
  };

  toggleScrollTop();
  window.addEventListener('scroll', toggleScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Light parallax effect for hero image and orbs
const updateParallax = () => {
  const offset = window.scrollY * 0.08;

  parallaxItems.forEach((item, index) => {
    const speed = 0.04 + index * 0.02;
    item.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
  });
};

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('load', updateParallax);

// Hero typewriter loop animation
const professions = [
  'Web Developer',
  'UI/UX Designer',
  'Backend Dev'
];
const typingText = document.getElementById('typing-text');

if (typingText) {
  let professionIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const currentProfession = professions[professionIndex];

    if (!isDeleting) {
      typingText.textContent = currentProfession.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === currentProfession.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typingText.textContent = currentProfession.slice(0, charIndex - 1);
      charIndex -= 1;

      if (charIndex === 0) {
        isDeleting = false;
        professionIndex = (professionIndex + 1) % professions.length;
        setTimeout(typeLoop, 500);
        return;
      }
    }

    const speed = isDeleting ? 60 : 110;
    setTimeout(typeLoop, speed);
  };

  window.addEventListener('load', () => {
    typingText.textContent = '';
    typeLoop();
  });
}

// Experience timeline reveal on scroll
const timelineTitle = document.querySelector('[data-timeline-title]');
const timelineLine = document.querySelector('[data-timeline-line]');
const timelineItems = Array.from(document.querySelectorAll('[data-timeline-item]'));
const timelineDots = Array.from(document.querySelectorAll('[data-timeline-dot]'));

if (timelineTitle && timelineLine && timelineItems.length) {
  const revealOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px'
  };

  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = entry.target;
      const delay = Number(target.dataset.timelineItemIndex || target.dataset.timelineDotIndex || 0) * 180 + 120;

      target.style.setProperty('--reveal-delay', `${delay}ms`);
      target.classList.add('is-visible');
      observer.unobserve(target);
    });
  }, revealOptions);

  [timelineTitle, timelineLine, ...timelineDots, ...timelineItems].forEach((element) => {
    timelineObserver.observe(element);
  });
}
