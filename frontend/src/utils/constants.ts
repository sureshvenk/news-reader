export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CACHE_TIME = {
  articles: 1000 * 60 * 5, // 5 minutes
  search: 1000 * 60 * 10, // 10 minutes
  categories: 1000 * 60 * 15, // 15 minutes
};

export const DEBOUNCE_DELAY = 300; // milliseconds

export const PAGE_SIZE = 20;

export const ITEMS_PER_PAGE = {
  mobile: 10,
  tablet: 15,
  desktop: 20,
};
