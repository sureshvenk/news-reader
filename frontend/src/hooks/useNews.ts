import { useQuery, UseQueryResult } from '@tanstack/react-query';
import newsApiService from '../services/api';
import { NewsResponse } from '../types';
import { CACHE_TIME, PAGE_SIZE } from '../utils/constants';

export function useNews(
  category?: string,
  page: number = 1
): UseQueryResult<NewsResponse, Error> {
  const queryKey = ['news', 'headlines', category, page];

  return useQuery({
    queryKey,
    queryFn: async () => {
      return newsApiService.getTopHeadlines(
        'us',
        category,
        page,
        PAGE_SIZE
      );
    },
    staleTime: CACHE_TIME.articles,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useNewsSearch(
  query: string,
  page: number = 1
): UseQueryResult<NewsResponse, Error> {
  const queryKey = ['news', 'search', query, page];

  return useQuery({
    queryKey,
    queryFn: async () => {
      return newsApiService.searchNews(query, page, PAGE_SIZE);
    },
    enabled: query.length > 0,
    staleTime: CACHE_TIME.search,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useNewsByCategory(
  category: string,
  page: number = 1
): UseQueryResult<NewsResponse, Error> {
  const queryKey = ['news', 'category', category, page];

  return useQuery({
    queryKey,
    queryFn: async () => {
      return newsApiService.getNewsByCategory(category, 'us', page, PAGE_SIZE);
    },
    staleTime: CACHE_TIME.categories,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
