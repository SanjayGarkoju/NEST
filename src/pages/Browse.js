import { designs, categories, styles as styleData, budgetRanges, colours as colourData } from '../data.js';
import { navigate, getFilters, setFilter, resetFilters } from '../state.js';
import { renderDesignCard } from '../components/DesignCard.js';
import { initScrollReveal } from '../components/ScrollReveal.js';

export function renderBrowse() {
  const el = document.createElement('div');
  el.className = 'page-fade-in';

  // Page Header
  const header = document.createElement('div');
  header.className = 'page-header reveal-up';
  header.innerHTML = `
    <div class="container">
      <p class="section-eyebrow">Design Discovery</p>
      <h1 class="section-title" style="font-size:clamp(2rem,4vw,2.75rem);letter-spacing:-0.01em;">Browse Designs</h1>
      <p class="section-subtitle" style="margin-top:var(--space-sm);">Explore our curated collection of ${designs.length} exceptional interior designs.</p>
    </div>
  `;
  el.appendChild(header);

  // Main Content
  const main = document.createElement('main');
  main.className = 'section';
  main.innerHTML = `<div class="container"></div>`;
  const container = main.querySelector('.container');

  // Filters Bar
  const filtersBar = document.createElement('div');
  filtersBar.className = 'filters-bar reveal-up delay-100';
  filtersBar.setAttribute('role', 'search');
  filtersBar.setAttribute('aria-label', 'Filter designs');
  filtersBar.innerHTML = `
    <div class="filter-search">
      <svg class="filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        class="filter-search-input"
        id="filter-search"
        placeholder="Search designs, styles, rooms…"
        aria-label="Search designs"
        autocomplete="off"
      />
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-category">Room</label>
      <select class="filter-select" id="filter-category" aria-label="Filter by room">
        <option value="all">All Rooms</option>
        ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-style">Style</label>
      <select class="filter-select" id="filter-style" aria-label="Filter by style">
        <option value="all">All Styles</option>
        ${styleData.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-colour">Colour</label>
      <select class="filter-select" id="filter-colour" aria-label="Filter by colour">
        <option value="all">All Colours</option>
        ${colourData.map(cl => `<option value="${cl.id}">${cl.name}</option>`).join('')}
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-budget">Budget</label>
      <select class="filter-select" id="filter-budget" aria-label="Filter by budget">
        <option value="all">All Budgets</option>
        ${budgetRanges.map(b => `<option value="${b.id}">${b.label}</option>`).join('')}
      </select>
    </div>

    <button class="filter-reset" id="filter-reset" aria-label="Reset all filters">Reset filters</button>
  `;

  // Designs Grid
  const designsGrid = document.createElement('div');
  designsGrid.className = 'designs-grid';
  designsGrid.setAttribute('role', 'list');
  designsGrid.id = 'designs-grid';

  // Results count
  const resultsCount = document.createElement('p');
  resultsCount.style.cssText = 'font-size:0.875rem;color:var(--stone);margin-bottom:var(--space-lg);';
  resultsCount.setAttribute('aria-live', 'polite');
  resultsCount.id = 'results-count';

  container.appendChild(filtersBar);
  container.appendChild(resultsCount);
  container.appendChild(designsGrid);

  el.appendChild(main);

  // Restore filter state
  const filters = getFilters();
  const searchInput = filtersBar.querySelector('#filter-search');
  const categorySelect = filtersBar.querySelector('#filter-category');
  const styleSelect = filtersBar.querySelector('#filter-style');
  const colourSelect = filtersBar.querySelector('#filter-colour');
  const budgetSelect = filtersBar.querySelector('#filter-budget');

  searchInput.value = filters.search;
  if (filters.category !== 'all') categorySelect.value = filters.category;
  if (filters.style !== 'all') styleSelect.value = filters.style;
  if (filters.colour && filters.colour !== 'all') colourSelect.value = filters.colour;
  if (filters.budget !== 'all') budgetSelect.value = filters.budget;

  function applyFilters() {
    const f = getFilters();
    const q = f.search.toLowerCase();

    const catMap = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'kitchen': 'Kitchen',
      'dining-room': 'Dining Room',
      'bathroom': 'Bathroom',
      'full-home': 'Full Home'
    };

    const styleMap = {
      'modern': 'Modern',
      'minimalist': 'Minimalist',
      'scandinavian': 'Scandinavian',
      'contemporary': 'Contemporary',
      'industrial': 'Industrial',
      'traditional': 'Traditional',
      'luxury': 'Luxury'
    };

    const budgetKeywords = {
      'budget': ['₹3.5L', '₹4L', '₹5L', '₹6.5L', '₹8.5L – ₹17L'],
      'mid': ['₹8.5L – ₹17L', '₹10L', '₹12.5L', '₹15L'],
      'premium': ['₹17L', '₹20L', '₹25L', '₹29L', '₹33L'],
      'luxury': ['₹33L – ₹1Cr', '₹42L', '₹50L', '₹67L', '₹1Cr', '₹1.65Cr']
    };

    const filtered = designs.filter(d => {
      if (q && !d.title.toLowerCase().includes(q) &&
          !d.category.toLowerCase().includes(q) &&
          !d.style.toLowerCase().includes(q) &&
          !d.description.toLowerCase().includes(q) &&
          !d.tags.some(t => t.toLowerCase().includes(q))) return false;
      if (f.category !== 'all' && d.category !== catMap[f.category]) return false;
      if (f.style !== 'all' && d.style !== styleMap[f.style]) return false;
      if (f.colour && f.colour !== 'all' && d.colour !== f.colour) return false;
      if (f.budget !== 'all') {
        const keywords = budgetKeywords[f.budget] || [];
        if (!keywords.some(k => d.budget.includes(k))) return false;
      }
      return true;
    });

    designsGrid.innerHTML = '';
    resultsCount.textContent = `${filtered.length} design${filtered.length !== 1 ? 's' : ''} found`;

    if (!filtered.length) {
      designsGrid.innerHTML = `
        <div class="no-results">
          <p class="no-results-title">No designs match your filters</p>
          <p class="no-results-desc">Try adjusting your search or clearing some filters.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((d, idx) => {
      const card = renderDesignCard(d);
      const delayClass = `delay-${Math.min(((idx % 6) + 1) * 100, 600)}`;
      card.classList.add('reveal-up', delayClass);
      card.setAttribute('role', 'listitem');
      designsGrid.appendChild(card);
    });

    initScrollReveal(el);
  }

  searchInput.addEventListener('input', () => {
    setFilter('search', searchInput.value.trim());
    applyFilters();
  });

  categorySelect.addEventListener('change', () => {
    setFilter('category', categorySelect.value);
    applyFilters();
  });

  styleSelect.addEventListener('change', () => {
    setFilter('style', styleSelect.value);
    applyFilters();
  });

  colourSelect.addEventListener('change', () => {
    setFilter('colour', colourSelect.value);
    applyFilters();
  });

  budgetSelect.addEventListener('change', () => {
    setFilter('budget', budgetSelect.value);
    applyFilters();
  });

  filtersBar.querySelector('#filter-reset').addEventListener('click', () => {
    resetFilters();
    searchInput.value = '';
    categorySelect.value = 'all';
    styleSelect.value = 'all';
    colourSelect.value = 'all';
    budgetSelect.value = 'all';
    applyFilters();
  });

  // Initial render
  applyFilters();

  return el;
}
