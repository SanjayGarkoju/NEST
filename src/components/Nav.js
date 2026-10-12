import { navigate, onRouteChange } from '../state.js';
import { getFavourites } from '../state.js';
import { updateNavFavCount } from './DesignCard.js';

export function renderNav() {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  nav.innerHTML = `
    <div class="nav-inner">
      <div class="nav-logo" id="nav-logo" role="button" tabindex="0" aria-label="NEST Home">
        <div class="nav-logo-mark">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 9v13h6v-7h8v7h6V9L12 2z" fill="white"/>
          </svg>
        </div>
        NEST
      </div>

      <ul class="nav-links" role="list">
        <li><span class="nav-link" data-page="home" tabindex="0">Discover</span></li>
        <li><span class="nav-link" data-page="browse" tabindex="0">Browse</span></li>
        <li><span class="nav-link" data-page="personalize" tabindex="0">Personalize</span></li>
      </ul>

      <div class="nav-actions">
        <button class="nav-icon-btn" id="nav-search-btn" aria-label="Search designs" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button class="nav-icon-btn" id="nav-fav-btn" aria-label="My favourites" title="Saved designs">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span class="nav-fav-count" aria-label="Saved designs count">0</span>
        </button>
        <button class="btn-nav-cta" id="nav-personalize-btn">Personalize Your Space</button>
        <button class="nav-mobile-toggle" id="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;

  // Mobile nav
  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.setAttribute('role', 'navigation');
  mobileNav.setAttribute('aria-label', 'Mobile navigation');
  mobileNav.innerHTML = `
    <span class="mobile-nav-link" data-page="home" tabindex="0">Discover</span>
    <span class="mobile-nav-link" data-page="browse" tabindex="0">Browse Designs</span>
    <span class="mobile-nav-link" data-page="personalize" tabindex="0">Personalize Your Space</span>
    <span class="mobile-nav-link" data-page="favourites" tabindex="0">Saved Designs</span>
  `;

  // Scroll behaviour
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 20);
    lastScroll = scrollY;
  }, { passive: true });

  // Logo click
  nav.querySelector('#nav-logo').addEventListener('click', () => navigate('home'));
  nav.querySelector('#nav-logo').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigate('home');
  });

  // Desktop nav links
  nav.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', () => navigate(link.dataset.page));
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') navigate(link.dataset.page);
    });
  });

  // Mobile nav links
  mobileNav.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      navigate(link.dataset.page);
      mobileNav.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Mobile toggle
  const mobileToggle = nav.querySelector('#mobile-toggle');
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fav button
  nav.querySelector('#nav-fav-btn').addEventListener('click', () => navigate('favourites'));

  // CTA
  nav.querySelector('#nav-personalize-btn').addEventListener('click', () => navigate('personalize'));

  // Search button
  nav.querySelector('#nav-search-btn').addEventListener('click', () => {
    const overlay = document.querySelector('.search-overlay');
    if (overlay) {
      overlay.classList.add('open');
      setTimeout(() => overlay.querySelector('.search-input')?.focus(), 50);
    }
  });

  // Active route
  onRouteChange(({ page }) => {
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
    mobileNav.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  });

  return [nav, mobileNav];
}
