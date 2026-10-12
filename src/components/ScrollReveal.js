/**
 * NEST Scroll Reveal Observer
 * Uses IntersectionObserver to smoothly reveal elements when scrolling into viewport.
 * Works seamlessly with both standard window scrolling and snap-scroll containers.
 * Respects prefers-reduced-motion preferences and keeps elements visible if unsupported.
 */

export function initScrollReveal(container = document) {
  // If user prefers reduced motion, reveal everything immediately
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
    const hiddenElements = container.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-fade');
    hiddenElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  // Find scroll root if snap container is present, else default viewport
  const scrollWrapper = container.classList?.contains('snap-scroll-wrapper')
    ? container
    : container.querySelector?.('.snap-scroll-wrapper') || null;

  const observerOptions = {
    root: scrollWrapper,
    rootMargin: '0px 0px -40px 0px',
    threshold: [0, 0.1, 0.2]
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = container.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-fade'
  );

  targets.forEach(el => observer.observe(el));

  // Safeguard: Ensure content never remains permanently hidden if observer stalls or viewport is complex
  setTimeout(() => {
    targets.forEach(el => {
      if (!el.classList.contains('is-revealed')) {
        const rect = el.getBoundingClientRect();
        // If element is inside or near viewport, reveal immediately
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
          el.classList.add('is-revealed');
        }
      }
    });
  }, 1200);
}
