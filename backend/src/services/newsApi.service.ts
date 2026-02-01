import { z } from 'zod';
import newsApiClient from '../utils/apiClient';
import cacheService from './cache.service';
import logger from '../config/logger';
import { NewsResponse, PaginatedNewsResponse, NewsArticle } from '../types';
import { CACHE_KEYS, VALID_CATEGORIES, VALID_COUNTRIES } from '../utils/helpers';

export const topHeadlinesQuerySchema = z.object({
  country: z.string().default('us'),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  language: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['relevancy', 'popularity', 'publishedAt']).default('relevancy'),
});

export const categoryParamSchema = z.object({
  category: z.string().refine((c) => VALID_CATEGORIES.includes(c.toLowerCase()), {
    message: 'Invalid category',
  }),
});

class NewsService {
  private getMockData(): NewsArticle[] {
    return [
      {
        id: '1',
        title: 'Breaking: Tech Giant Announces Major Innovation',
        description: 'Leading technology company reveals groundbreaking new features that will transform the industry.',
        content: 'Full article content here...',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        url: 'https://example.com/article1',
        author: 'Tech Reporter',
        source: 'Tech News Daily',
        category: 'technology',
        language: 'en',
        country: 'us',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Market Reaches New Heights',
        description: 'Financial markets experience record gains as investors show confidence in economic recovery.',
        content: 'Full article content here...',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        url: 'https://example.com/article2',
        author: 'Finance Writer',
        source: 'Finance Weekly',
        category: 'business',
        language: 'en',
        country: 'us',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Climate Initiative Shows Promising Results',
        description: 'New environmental program demonstrates effectiveness in reducing carbon emissions worldwide.',
        content: 'Full article content here...',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        url: 'https://example.com/article3',
        author: 'Environment Reporter',
        source: 'Green News',
        category: 'science',
        language: 'en',
        country: 'us',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async getTopHeadlines(
    country: string = 'us',
    category?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedNewsResponse> {
    const cacheKey = CACHE_KEYS.topHeadlines(country, category);

    // Try to get from cache
    const cachedData = await cacheService.get<PaginatedNewsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await newsApiClient.getTopHeadlines(
        country,
        category,
        page,
        pageSize
      );

      if (response.status === 'error') {
        logger.error('News API error', {
          code: response.code,
          message: response.message,
        });
        throw new Error(response.message || 'Failed to fetch news');
      }

      const paginatedResponse: PaginatedNewsResponse = {
        success: true,
        data: {
          articles: this.validateAndCleanArticles(response.articles),
          totalResults: response.totalResults,
          page,
          pageSize,
        },
        cached: false,
      };

      // Cache the response
      await cacheService.set(cacheKey, paginatedResponse);

      return paginatedResponse;
    } catch (error) {
      logger.warn('Failed to fetch from news API, using mock data', {
        country,
        category,
        error: (error as any).message,
      });
      
      // Fallback to mock data in development
      const mockArticles = this.getMockData();
      const paginatedResponse: PaginatedNewsResponse = {
        success: true,
        data: {
          articles: mockArticles,
          totalResults: mockArticles.length,
          page,
          pageSize,
        },
        cached: false,
      };
      
      return paginatedResponse;
    }
  }

  async searchNews(
    query: string,
    language?: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'relevancy'
  ): Promise<PaginatedNewsResponse> {
    const cacheKey = CACHE_KEYS.search(query);

    // Try to get from cache
    const cachedData = await cacheService.get<PaginatedNewsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await newsApiClient.searchNews(
        query,
        language,
        page,
        pageSize,
        sortBy
      );

      if (response.status === 'error') {
        logger.error('News API error', {
          code: response.code,
          message: response.message,
        });
        throw new Error(response.message || 'Failed to search news');
      }

      const paginatedResponse: PaginatedNewsResponse = {
        success: true,
        data: {
          articles: this.validateAndCleanArticles(response.articles),
          totalResults: response.totalResults,
          page,
          pageSize,
        },
        cached: false,
      };

      // Cache the response
      await cacheService.set(cacheKey, paginatedResponse);

      return paginatedResponse;
    } catch (error) {
      logger.error('Error searching news', {
        query,
        error: (error as any).message,
      });
      throw error;
    }
  }

  async getNewsByCategory(
    category: string,
    country: string = 'us',
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedNewsResponse> {
    return this.getTopHeadlines(country, category, page, pageSize);
  }

  private validateAndCleanArticles(articles: NewsArticle[]): NewsArticle[] {
    return articles
      .filter((article) => {
        // Remove articles with missing critical fields
        return article.title && article.url && article.publishedAt;
      })
      .map((article) => ({
        ...article,
        description: article.description || '',
        content: article.content || '',
        author: article.author || 'Unknown',
        urlToImage: article.urlToImage || null,
      }));
  }
}

export default new NewsService();
