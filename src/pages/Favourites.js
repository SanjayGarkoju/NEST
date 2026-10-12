import { designs } from '../data.js';
import { getFavourites, navigate } from '../state.js';
import { renderDesignCard } from '../components/DesignCard.js';
import { initScrollReveal } from '../components/ScrollReveal.js';

export function renderFavourites() {
  const el = document.createElement('div');
  el.className = 'page-fade-in';

  const header = document.createElement('div');
  header.className = 'page-header reveal-up';
  header.innerHTML = `
    <div class="container">
      <p class="section-eyebrow">My Collection</p>
      <h1 class="section-title" style="font-size:clamp(2rem,4vw,2.75rem);letter-spacing:-0.01em;">Saved Designs</h1>
      <p class="section-subtitle" id="fav-subtitle" style="margin-top:var(--space-sm);"></p>
    </div>
  `;
  el.appendChild(header);

  const main = document.createElement('main');
  main.className = 'section';
  main.innerHTML = `<div class="container" id="fav-content"></div>`;
  el.appendChild(main);

  const favs = getFavourites();
  const subtitle = header.querySelector('#fav-subtitle');
  const content = main.querySelector('#fav-content');

  if (!favs.length) {
    subtitle.textContent = 'You haven\'t saved any designs yet.';
    content.innerHTML = `
      <div class="empty-state reveal-up delay-100">
        <div class="empty-state-icon" aria-hidden="true">🤍</div>
        <h2 class="empty-state-title">Your collection is empty</h2>
        <p class="empty-state-desc">Browse our curated designs and save the ones that inspire you. They'll all appear here for easy comparison.</p>
        <button class="btn btn-primary" id="fav-browse-btn">Start Browsing Designs</button>
      </div>
    `;
    content.querySelector('#fav-browse-btn').addEventListener('click', () => navigate('browse'));
  } else {
    const savedDesigns = designs.filter(d => favs.includes(d.id));
    subtitle.textContent = `${savedDesigns.length} saved design${savedDesigns.length !== 1 ? 's' : ''}`;

    const grid = document.createElement('div');
    grid.className = 'designs-grid';
    grid.setAttribute('role', 'list');

    savedDesigns.forEach((d, idx) => {
      const card = renderDesignCard(d);
      const delayClass = `delay-${Math.min(((idx % 6) + 1) * 100, 600)}`;
      card.classList.add('reveal-up', delayClass);
      card.setAttribute('role', 'listitem');
      grid.appendChild(card);
    });

    content.appendChild(grid);

    // Add clear all button
    const clearWrap = document.createElement('div');
    clearWrap.style.cssText = 'text-align:center;margin-top:var(--space-2xl);';
    clearWrap.innerHTML = `
      <button class="btn btn-secondary" id="fav-clear">Clear All Saved Designs</button>
    `;
    clearWrap.querySelector('#fav-clear').addEventListener('click', () => {
      localStorage.removeItem('nest_favourites');
      navigate('favourites');
    });
    content.appendChild(clearWrap);
  }

  setTimeout(() => initScrollReveal(el), 30);

  return el;
}
