import { designs, categories, styles } from '../data.js';
import { navigate, setFilter, getFilters, resetFilters } from '../state.js';
import { renderDesignCard } from '../components/DesignCard.js';
import { initScrollReveal } from '../components/ScrollReveal.js';

export function renderHome() {
  const el = document.createElement('div');
  el.className = 'snap-scroll-wrapper';

  // Floating slide indicator dots
  const slideIndicators = document.createElement('nav');
  slideIndicators.className = 'slide-nav-indicators';
  slideIndicators.setAttribute('aria-label', 'Section navigation');

  const sectionsMeta = [
    { id: 'sec-hero', label: 'Welcome' },
    { id: 'sec-rooms', label: 'Rooms' },
    { id: 'sec-featured', label: 'Featured' },
    { id: 'sec-styles', label: 'Styles' },
    { id: 'sec-personalize', label: 'Personalize' },
    { id: 'sec-inspire', label: 'Inspiration' },
    { id: 'sec-footer', label: 'Footer' }
  ];

  sectionsMeta.forEach((sec, idx) => {
    const dot = document.createElement('button');
    dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to ${sec.label}`);
    dot.innerHTML = `<span class="dot-tooltip">${sec.label}</span>`;
    dot.addEventListener('click', () => {
      const target = el.querySelector(`#${sec.id}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    slideIndicators.appendChild(dot);
  });
  el.appendChild(slideIndicators);

  // IntersectionObserver to update active dot
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const activeIdx = sectionsMeta.findIndex(s => s.id === id);
        if (activeIdx !== -1) {
          const dots = slideIndicators.querySelectorAll('.slide-dot');
          dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
        }
      }
    });
  }, { root: el, threshold: 0.5 });

  // Hero
  const hero = document.createElement('section');
  hero.id = 'sec-hero';
  hero.className = 'hero snap-section';
  hero.setAttribute('aria-label', 'Hero banner');
  hero.innerHTML = `
    <img
      class="hero-image"
      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=85"
      alt="Beautifully designed modern living room interior"
      fetchpriority="high"
      onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80'"
    />
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="hero-content">
      <div class="hero-inner">
        <div class="hero-label reveal-fade" aria-hidden="true">
          <span class="hero-label-line"></span>
          <span>Interior Design Discovery</span>
        </div>
        <h1 class="hero-title reveal-up">Find the Space<br/>That Feels Like You.</h1>
        <p class="hero-desc reveal-up delay-100">NEST is your destination for discovering and personalizing beautiful interior designs — curated to help you create a home that is entirely, authentically yours.</p>
        <div class="hero-actions reveal-up delay-200">
          <button class="btn btn-primary btn-lg" id="hero-explore-btn">
            Explore Designs
          </button>
          <button class="btn btn-secondary btn-lg" id="hero-personalize-btn" style="color:white;border-color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.1);backdrop-filter:blur(4px);">
            Personalize Your Space
          </button>
        </div>
      </div>
    </div>
    <div class="hero-scroll" aria-hidden="true">
      <div class="hero-scroll-line"></div>
      <span>Scroll</span>
    </div>
  `;

  const heroImg = hero.querySelector('.hero-image');
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));

  hero.querySelector('#hero-explore-btn').addEventListener('click', () => navigate('browse'));
  hero.querySelector('#hero-personalize-btn').addEventListener('click', () => navigate('personalize'));

  el.appendChild(hero);

  // Categories
  const catSection = document.createElement('section');
  catSection.id = 'sec-rooms';
  catSection.className = 'section snap-section';
  catSection.setAttribute('aria-labelledby', 'cat-heading');
  catSection.innerHTML = `
    <div class="container">
      <div class="section-header reveal-up">
        <div class="section-header-left">
          <p class="section-eyebrow">Browse by Room</p>
          <h2 class="section-title" id="cat-heading">Every Room, Reimagined</h2>
        </div>
        <button class="btn btn-ghost" id="cat-view-all">
          View all rooms
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      <div class="categories-grid" role="list" id="categories-grid"></div>
    </div>
  `;

  catSection.querySelector('#cat-view-all').addEventListener('click', () => navigate('browse'));

  const grid = catSection.querySelector('#categories-grid');
  categories.forEach((cat, idx) => {
    const card = document.createElement('div');
    const delayClass = `delay-${Math.min((idx + 1) * 100, 600)}`;
    card.className = `category-card reveal-up ${delayClass}`;
    card.setAttribute('role', 'listitem button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Browse ${cat.name} designs`);
    card.innerHTML = `
      <img src="${cat.image}" alt="${cat.name} interior design" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'" />
      <div class="category-card-overlay">
        <p class="category-card-name">${cat.name}</p>
        <p class="category-card-count">${cat.count} designs</p>
      </div>
    `;
    card.addEventListener('click', () => {
      setFilter('category', cat.id);
      navigate('browse');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFilter('category', cat.id);
        navigate('browse');
      }
    });
    grid.appendChild(card);
  });

  el.appendChild(catSection);

  // Featured Designs
  const featuredSection = document.createElement('section');
  featuredSection.id = 'sec-featured';
  featuredSection.className = 'section snap-section';
  featuredSection.style.background = 'var(--cream)';
  featuredSection.setAttribute('aria-labelledby', 'featured-heading');
  featuredSection.innerHTML = `
    <div class="container">
      <div class="section-header reveal-up">
        <div class="section-header-left">
          <p class="section-eyebrow">Curated Collection</p>
          <h2 class="section-title" id="featured-heading">Featured Designs</h2>
          <p class="section-subtitle">Handpicked by our editorial team for exceptional quality, originality, and livability.</p>
        </div>
        <button class="btn btn-ghost" id="featured-view-all">
          View all designs
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      <div class="designs-grid" id="featured-grid" role="list"></div>
    </div>
  `;

  featuredSection.querySelector('#featured-view-all').addEventListener('click', () => navigate('browse'));
  const featuredGrid = featuredSection.querySelector('#featured-grid');
  designs.filter(d => d.featured).forEach((d, idx) => {
    const card = renderDesignCard(d);
    const delayClass = `delay-${Math.min((idx + 1) * 100, 600)}`;
    card.classList.add('reveal-up', delayClass);
    card.setAttribute('role', 'listitem');
    featuredGrid.appendChild(card);
  });

  el.appendChild(featuredSection);

  // Styles
  const stylesSection = document.createElement('section');
  stylesSection.id = 'sec-styles';
  stylesSection.className = 'section snap-section';
  stylesSection.setAttribute('aria-labelledby', 'styles-heading');
  stylesSection.innerHTML = `
    <div class="container">
      <div class="section-header reveal-up">
        <div class="section-header-left">
          <p class="section-eyebrow">Find Your Aesthetic</p>
          <h2 class="section-title" id="styles-heading">Explore by Style</h2>
          <p class="section-subtitle">From serene Scandinavian to opulent Luxury — discover the design language that speaks to you.</p>
        </div>
      </div>
      <div class="styles-grid" id="styles-grid" role="list"></div>
    </div>
  `;

  const stylesGrid = stylesSection.querySelector('#styles-grid');
  styles.forEach((style, idx) => {
    const card = document.createElement('div');
    const delayClass = `delay-${Math.min((idx + 1) * 100, 600)}`;
    card.className = `style-card reveal-up ${delayClass}`;
    card.setAttribute('role', 'listitem button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Explore ${style.name} designs`);
    card.innerHTML = `
      <img src="${style.image}" alt="${style.name} interior style" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'" />
      <div class="style-card-overlay">
        <p class="style-card-name">${style.name}</p>
        <p class="style-card-count">${style.count} designs</p>
        <p class="style-card-desc">${style.description}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      setFilter('style', style.id);
      navigate('browse');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFilter('style', style.id);
        navigate('browse');
      }
    });
    stylesGrid.appendChild(card);
  });

  el.appendChild(stylesSection);

  // Personalization Feature
  const personSection = document.createElement('section');
  personSection.id = 'sec-personalize';
  personSection.className = 'section personalize-section snap-section';
  personSection.setAttribute('aria-labelledby', 'personalize-heading');
  personSection.innerHTML = `
    <div class="container">
      <div class="personalize-inner">
        <div class="personalize-image reveal-left">
          <img
            src="https://images.unsplash.com/photo-1616137466211-f939a420be84?w=900&q=80"
            alt="Beautiful personalized interior design"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80'"
          />
          <div class="personalize-image-overlay" aria-hidden="true"></div>
          <div class="personalize-badge">Your Space, Your Way</div>
        </div>
        <div class="personalize-content reveal-right">
          <p class="personalize-eyebrow">Personalization Experience</p>
          <h2 class="personalize-title" id="personalize-heading">Design a Home That Is Entirely Yours</h2>
          <p class="personalize-desc">Found a design you love? Tell us about your space — the room, the dimensions, your colour preferences, and your budget. We'll help you adapt it to your home beautifully.</p>
          <div class="personalize-steps" role="list">
            <div class="personalize-step reveal-up delay-100" role="listitem">
              <div class="personalize-step-num" aria-hidden="true">1</div>
              <p class="personalize-step-text">Choose a design from our curated collection that you'd love in your home.</p>
            </div>
            <div class="personalize-step reveal-up delay-200" role="listitem">
              <div class="personalize-step-num" aria-hidden="true">2</div>
              <p class="personalize-step-text">Share your room details — dimensions, preferences, and style direction.</p>
            </div>
            <div class="personalize-step reveal-up delay-300" role="listitem">
              <div class="personalize-step-num" aria-hidden="true">3</div>
              <p class="personalize-step-text">Receive a personalized recommendation tailored to your specific space.</p>
            </div>
          </div>
          <button class="btn-personalize" id="home-personalize-cta">
            Start Personalizing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  personSection.querySelector('#home-personalize-cta').addEventListener('click', () => navigate('personalize'));
  el.appendChild(personSection);

  // Inspiration Grid
  const inspirationSection = document.createElement('section');
  inspirationSection.id = 'sec-inspire';
  inspirationSection.className = 'section snap-section';
  inspirationSection.setAttribute('aria-labelledby', 'inspiration-heading');
  const inspirationImages = [
    { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", label: "Modern Living Room" },
    { src: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=80", label: "Minimalist Bedroom" },
    { src: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80", label: "Monochrome Kitchen" },
    { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80", label: "Earthy Bedroom" },
    { src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&q=80", label: "Luxury Dining" },
    { src: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=700&q=80", label: "Scandinavian Study" }
  ];
  inspirationSection.innerHTML = `
    <div class="container">
      <div class="section-header reveal-up">
        <div class="section-header-left">
          <p class="section-eyebrow">Ideas & Inspiration</p>
          <h2 class="section-title" id="inspiration-heading">Homes Worth Admiring</h2>
          <p class="section-subtitle">A glimpse into beautifully designed spaces that spark possibility.</p>
        </div>
        <button class="btn btn-ghost" id="insp-view-all">
          Browse all designs
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      <div class="inspiration-grid" role="list">
        ${inspirationImages.map((img, i) => `
          <div class="insp-item reveal-up delay-${Math.min((i + 1) * 100, 600)}" role="listitem button" tabindex="0" aria-label="View ${img.label} inspiration">
            <img src="${img.src}" alt="${img.label}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80'" />
            <div class="insp-label">${img.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  inspirationSection.querySelector('#insp-view-all').addEventListener('click', () => navigate('browse'));
  inspirationSection.querySelectorAll('.insp-item').forEach((item, i) => {
    item.addEventListener('click', () => navigate('browse'));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') navigate('browse');
    });
  });

  el.appendChild(inspirationSection);

  // Footer
  const footerEl = renderFooter();
  footerEl.id = 'sec-footer';
  footerEl.classList.add('snap-section', 'footer-snap');
  el.appendChild(footerEl);

  // Observe all snap sections for indicators
  el.querySelectorAll('.snap-section').forEach(sec => observer.observe(sec));

  // Initialize smooth scroll reveal observer
  setTimeout(() => initScrollReveal(el), 40);

  return el;
}

function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <p class="footer-brand-name">NEST</p>
          <p class="footer-brand-desc">Your destination for discovering and personalizing beautiful interior designs. Create a home that is entirely, authentically yours.</p>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Discover</p>
          <ul class="footer-links" role="list">
            <li><span class="footer-link" tabindex="0" data-page="browse">Browse Designs</span></li>
            <li><span class="footer-link" tabindex="0">Living Room</span></li>
            <li><span class="footer-link" tabindex="0">Bedroom</span></li>
            <li><span class="footer-link" tabindex="0">Kitchen</span></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Styles</p>
          <ul class="footer-links" role="list">
            <li><span class="footer-link" tabindex="0">Modern</span></li>
            <li><span class="footer-link" tabindex="0">Scandinavian</span></li>
            <li><span class="footer-link" tabindex="0">Minimalist</span></li>
            <li><span class="footer-link" tabindex="0">Luxury</span></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Company</p>
          <ul class="footer-links" role="list">
            <li><span class="footer-link" tabindex="0">About NEST</span></li>
            <li><span class="footer-link" tabindex="0">Privacy Policy</span></li>
            <li><span class="footer-link" tabindex="0">Terms of Use</span></li>
            <li><span class="footer-link" tabindex="0">Contact</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">© 2026 NEST Interior Design. All rights reserved.</p>
        <p class="footer-tagline">Design the life you want to live.</p>
      </div>
    </div>
  `;

  footer.querySelectorAll('.footer-link[data-page]').forEach(link => {
    link.addEventListener('click', () => navigate(link.dataset.page));
  });

  return footer;
}
