export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  success: boolean;
  data: {
    articles: NewsArticle[];
    totalResults: number;
    page: number;
    pageSize: number;
  };
  cached: boolean;
}

export interface HealthCheckResponse {
  success: boolean;
  timestamp: string;
  uptime: number;
  redis: {
    connected: boolean;
    error?: string;
  };
}

export type SortBy = 'relevancy' | 'popularity' | 'publishedAt';

export const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
  { id: 'sports', label: 'Sports' },
  { id: 'technology', label: 'Technology' },
];
