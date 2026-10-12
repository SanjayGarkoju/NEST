import './style.css';
import { renderNav } from './components/Nav.js';
import { renderSearch } from './components/Search.js';
import { renderHome } from './pages/Home.js';
import { renderBrowse } from './pages/Browse.js';
import { renderDetail } from './pages/Detail.js';
import { renderPersonalize } from './pages/Personalize.js';
import { renderFavourites } from './pages/Favourites.js';
import { navigate, onRouteChange, getRoute } from './state.js';
import { updateNavFavCount } from './components/DesignCard.js';

const app = document.getElementById('app');

// Mount persistent UI
const [nav, mobileNav] = renderNav();
const search = renderSearch();
app.appendChild(nav);
app.appendChild(mobileNav);
app.appendChild(search);

// Back to top button
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.title = 'Back to top';
backToTop.innerHTML = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
  </svg>
`;
backToTop.addEventListener('click', () => {
  const snapWrapper = document.querySelector('.snap-scroll-wrapper');
  if (snapWrapper) {
    snapWrapper.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
app.appendChild(backToTop);

function checkScrollTop() {
  const snapWrapper = document.querySelector('.snap-scroll-wrapper');
  const scrollPos = snapWrapper ? snapWrapper.scrollTop : window.scrollY;
  backToTop.classList.toggle('visible', scrollPos > 500);
}

window.addEventListener('scroll', checkScrollTop, { passive: true });
document.addEventListener('scroll', checkScrollTop, { capture: true, passive: true });

// Page container
const pageContainer = document.createElement('main');
pageContainer.id = 'page-content';
app.appendChild(pageContainer);

// Page renderer
function renderPage(route) {
  pageContainer.innerHTML = '';

  let pageEl;
  switch (route.page) {
    case 'home':
      pageEl = renderHome();
      break;
    case 'browse':
      pageEl = renderBrowse();
      break;
    case 'detail':
      pageEl = renderDetail(route.params);
      break;
    case 'personalize':
      pageEl = renderPersonalize();
      break;
    case 'favourites':
      pageEl = renderFavourites();
      break;
    default:
      pageEl = renderHome();
  }

  pageContainer.appendChild(pageEl);
  updateNavFavCount();
}

// Listen for route changes
onRouteChange((route) => {
  renderPage(route);
});

// Initial render
renderPage(getRoute());
updateNavFavCount();
