export const VALID_CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

export const VALID_COUNTRIES = [
  'us',
  'gb',
  'ca',
  'au',
  'de',
  'fr',
  'in',
  'it',
  'br',
  'ru',
  'ar',
  'at',
  'be',
  'bg',
  'ch',
  'cn',
  'co',
  'cu',
  'cz',
  'eg',
  'gr',
  'hk',
  'hu',
  'id',
  'ie',
  'il',
  'jp',
  'kr',
  'lt',
  'lv',
  'mx',
  'my',
  'nl',
  'no',
  'nz',
  'ph',
  'pl',
  'pt',
  'ro',
  'rs',
  'sa',
  'se',
  'sg',
  'sk',
  'th',
  'tr',
  'tw',
  'ua',
  've',
  'za',
];

export const CACHE_KEYS = {
  topHeadlines: (country: string, category?: string) =>
    `news:headlines:${country}${category ? `:${category}` : ''}`,
  search: (query: string) => `news:search:${query.toLowerCase()}`,
  category: (category: string) => `news:category:${category}`,
};

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
