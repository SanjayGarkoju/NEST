import { designs } from '../data.js';
import { navigate } from '../state.js';
import { renderDesignCard } from './DesignCard.js';

export function renderSearch() {
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Search designs');
  overlay.setAttribute('aria-modal', 'true');

  overlay.innerHTML = `
    <div class="search-box" role="search">
      <div class="search-input-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="Search by room, style, or design name…"
          aria-label="Search designs"
          id="search-input"
          autocomplete="off"
        />
        <button class="search-close" aria-label="Close search" id="search-close">✕</button>
      </div>
      <div class="search-results" id="search-results">
        <div class="search-empty">Start typing to discover designs…</div>
      </div>
    </div>
  `;

  const input = overlay.querySelector('.search-input');
  const resultsEl = overlay.querySelector('#search-results');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      resultsEl.innerHTML = '<div class="search-empty">Start typing to discover designs…</div>';
      return;
    }
    const matches = designs.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.style.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
    if (!matches.length) {
      resultsEl.innerHTML = '<div class="search-empty">No designs found. Try another search.</div>';
      return;
    }
    resultsEl.innerHTML = matches.slice(0, 6).map(d => `
      <div class="search-result-item" role="button" tabindex="0" data-id="${d.id}">
        <img class="search-result-img" src="${d.image}" alt="${d.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=60'" />
        <div class="search-result-info">
          <h4>${d.title}</h4>
          <div class="search-result-meta">${d.category} · ${d.style}</div>
        </div>
      </div>
    `).join('');

    resultsEl.querySelectorAll('.search-result-item').forEach(item => {
      const openDetail = () => {
        overlay.classList.remove('open');
        navigate('detail', { id: parseInt(item.dataset.id) });
      };
      item.addEventListener('click', openDetail);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openDetail();
      });
    });
  });

  const closeSearch = () => {
    overlay.classList.remove('open');
    input.value = '';
    resultsEl.innerHTML = '<div class="search-empty">Start typing to discover designs…</div>';
  };

  overlay.querySelector('#search-close').addEventListener('click', closeSearch);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.add('open');
      setTimeout(() => input.focus(), 50);
    }
  });

  return overlay;
}
