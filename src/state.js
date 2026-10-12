// Favourites store with localStorage persistence
const FAVOURITES_KEY = 'nest_favourites';

export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleFavourite(id) {
  const favs = getFavourites();
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavourite(id) {
  return getFavourites().includes(id);
}

// Router state
let currentRoute = { page: 'home', params: {} };
const listeners = [];

export function getRoute() {
  return currentRoute;
}

export function navigate(page, params = {}) {
  currentRoute = { page, params };
  listeners.forEach(fn => fn(currentRoute));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function onRouteChange(fn) {
  listeners.push(fn);
}

// Filter state
let filterState = {
  search: '',
  category: 'all',
  style: 'all',
  colour: 'all',
  budget: 'all'
};

export function getFilters() {
  return { ...filterState };
}

export function setFilter(key, value) {
  filterState[key] = value;
}

export function resetFilters() {
  filterState = { search: '', category: 'all', style: 'all', colour: 'all', budget: 'all' };
}
