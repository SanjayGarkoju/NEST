import { designs } from '../data.js';
import { navigate, isFavourite, toggleFavourite } from '../state.js';
import { renderDesignCard, showToast, updateNavFavCount } from '../components/DesignCard.js';
import { initScrollReveal } from '../components/ScrollReveal.js';

export function renderDetail(params) {
  const design = designs.find(d => d.id === parseInt(params.id));

  if (!design) {
    const el = document.createElement('div');
    el.style.cssText = 'padding-top:var(--nav-height);text-align:center;padding:calc(var(--nav-height)+60px) var(--space-xl) var(--space-3xl);';
    el.innerHTML = `
      <p style="font-size:0.875rem;color:var(--stone);margin-bottom:var(--space-md);">Design not found</p>
      <button class="btn btn-primary" id="back-btn">Back to Browse</button>
    `;
    el.querySelector('#back-btn').addEventListener('click', () => navigate('browse'));
    return el;
  }

  const related = designs.filter(d => d.id !== design.id && (d.category === design.category || d.style === design.style)).slice(0, 3);
  let fav = isFavourite(design.id);

  const el = document.createElement('div');
  el.className = 'detail-view page-fade-in';

  const heroSection = document.createElement('div');
  heroSection.className = 'detail-hero';
  heroSection.innerHTML = `
    <div class="detail-hero-image reveal-left">
      <img
        src="${design.image}"
        alt="${design.title} — ${design.style} ${design.category}"
        fetchpriority="high"
        onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'"
      />
    </div>
    <div class="detail-hero-info reveal-right">
      <button class="detail-back" id="detail-back" aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Browse
      </button>

      <div>
        <p class="detail-category">${design.category} · ${design.style}</p>
        <h1 class="detail-title">${design.title}</h1>
      </div>

      <div class="detail-style-badge">${design.style}</div>

      <p class="detail-desc">${design.description}</p>

      <hr class="detail-divider" />

      <div class="detail-info-grid">
        <div class="detail-info-item">
          <p class="detail-info-label">Room</p>
          <p class="detail-info-value">${design.category}</p>
        </div>
        <div class="detail-info-item">
          <p class="detail-info-label">Style</p>
          <p class="detail-info-value">${design.style}</p>
        </div>
        <div class="detail-info-item" style="grid-column:1/-1;">
          <p class="detail-info-label">Budget Range</p>
          <p class="detail-info-value">${design.budget}</p>
        </div>
      </div>

      <hr class="detail-divider" />

      <div>
        <p class="detail-info-label" style="margin-bottom:var(--space-sm);">Design Details</p>
        <div class="detail-tags">
          ${design.tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}
        </div>
      </div>

      <hr class="detail-divider" />

      <div class="detail-actions">
        <button class="btn btn-primary" id="detail-personalize">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Personalize This Design
        </button>
        <button class="btn btn-secondary" id="detail-fav" aria-label="${fav ? 'Remove from favourites' : 'Save to favourites'}">
          <span class="detail-fav-icon">
            ${fav ? heartFilledSVG() : heartSVG()}
          </span>
          <span class="detail-fav-label">${fav ? 'Saved' : 'Save Design'}</span>
        </button>
      </div>
    </div>
  `;

  heroSection.querySelector('#detail-back').addEventListener('click', () => navigate('browse'));
  heroSection.querySelector('#detail-personalize').addEventListener('click', () => navigate('personalize', { designId: design.id }));

  const favBtn = heroSection.querySelector('#detail-fav');
  favBtn.addEventListener('click', () => {
    const newFavs = toggleFavourite(design.id);
    fav = newFavs.includes(design.id);
    favBtn.querySelector('.detail-fav-icon').innerHTML = fav ? heartFilledSVG() : heartSVG();
    favBtn.querySelector('.detail-fav-label').textContent = fav ? 'Saved' : 'Save Design';
    favBtn.setAttribute('aria-label', fav ? 'Remove from favourites' : 'Save to favourites');
    updateNavFavCount();
    showToast(fav ? 'Saved to favourites' : 'Removed from favourites');
  });

  el.appendChild(heroSection);

  // Related designs
  if (related.length) {
    const relatedSection = document.createElement('section');
    relatedSection.className = 'detail-related';
    relatedSection.setAttribute('aria-labelledby', 'related-heading');
    relatedSection.innerHTML = `
      <div class="container">
        <div class="section-header reveal-up">
          <div class="section-header-left">
            <p class="section-eyebrow">You Might Also Like</p>
            <h2 class="section-title" id="related-heading">Related Designs</h2>
          </div>
        </div>
        <div class="designs-grid" role="list" id="related-grid"></div>
      </div>
    `;

    const relatedGrid = relatedSection.querySelector('#related-grid');
    related.forEach((d, idx) => {
      const card = renderDesignCard(d);
      const delayClass = `delay-${Math.min((idx + 1) * 100, 600)}`;
      card.classList.add('reveal-up', delayClass);
      card.setAttribute('role', 'listitem');
      relatedGrid.appendChild(card);
    });

    el.appendChild(relatedSection);
  }

  setTimeout(() => initScrollReveal(el), 30);

  return el;
}

function heartSVG() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
}

function heartFilledSVG() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
}
