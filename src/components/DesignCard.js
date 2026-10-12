import { getFavourites, isFavourite, toggleFavourite } from '../state.js';
import { navigate } from '../state.js';

export function renderDesignCard(design, opts = {}) {
  const fav = isFavourite(design.id);
  const card = document.createElement('article');
  card.className = 'design-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View ${design.title}`);

  card.innerHTML = `
    <div class="design-card-image">
      <img
        src="${design.image}"
        alt="${design.title}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'"
      />
      <div class="design-card-actions">
        <button
          class="card-action-btn fav-btn ${fav ? 'fav-active' : ''}"
          aria-label="${fav ? 'Remove from favourites' : 'Add to favourites'}"
          title="${fav ? 'Remove from favourites' : 'Save to favourites'}"
          data-id="${design.id}"
        >
          ${fav ? heartFilledSVG() : heartSVG()}
        </button>
      </div>
      ${design.trending ? `<span class="design-card-badge trending">Trending</span>` : ''}
      ${design.featured && !design.trending ? `<span class="design-card-badge">Featured</span>` : ''}
    </div>
    <div class="design-card-body">
      <div class="design-card-meta">
        <span class="design-card-category">${design.category}</span>
        <span class="design-card-dot"></span>
        <span class="design-card-style">${design.style}</span>
      </div>
      <h3 class="design-card-title">${design.title}</h3>
      <p class="design-card-budget">${design.budget}</p>
    </div>
  `;

  // Navigate to detail on click
  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-action-btn')) return;
    navigate('detail', { id: design.id });
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('detail', { id: design.id });
    }
  });

  // Favourite toggle
  const favBtn = card.querySelector('.fav-btn');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newFavs = toggleFavourite(design.id);
    const isFav = newFavs.includes(design.id);
    favBtn.classList.toggle('fav-active', isFav);
    favBtn.innerHTML = isFav ? heartFilledSVG() : heartSVG();
    favBtn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Add to favourites');

    // Update all fav badges globally
    document.querySelectorAll(`.fav-btn[data-id="${design.id}"]`).forEach(btn => {
      btn.classList.toggle('fav-active', isFav);
      btn.innerHTML = isFav ? heartFilledSVG() : heartSVG();
    });

    // Update nav counter
    updateNavFavCount();

    showToast(isFav ? `Saved to favourites` : `Removed from favourites`);
  });

  return card;
}

function heartSVG() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
}

function heartFilledSVG() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
}

export function updateNavFavCount() {
  const favs = getFavourites();
  const counter = document.querySelector('.nav-fav-count');
  if (counter) {
    counter.textContent = favs.length;
    counter.classList.toggle('visible', favs.length > 0);
  }
}

export function showToast(message, type = 'default') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    ${message}
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 250);
  }, 2500);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.className = 'toast-container';
  document.body.appendChild(el);
  return el;
}
