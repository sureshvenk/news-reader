import axios, { AxiosInstance } from 'axios';
import env from '../config/env';
import logger from '../config/logger';
import { NewsResponse } from '../types';

class NewsApiClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = env.newsApiKey;
    this.client = axios.create({
      baseURL: env.newsApiBaseUrl,
      timeout: 10000,
      headers: {
        'User-Agent': 'NewsReaderApp/1.0',
      },
    });

    // Add request/response interceptors
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('API Request', {
          method: config.method,
          url: config.url,
        });
        return config;
      },
      (error) => {
        logger.error('API Request Error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API Response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        logger.error('API Response Error', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async getTopHeadlines(
    country?: string,
    category?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<NewsResponse> {
    try {
      // TheNewsAPI expects these exact parameter names
      const params: any = {
        api_token: this.apiKey,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      // Add search/filter parameters
      if (country) {
        params.country = country;
      }
      if (category) {
        params.category = category;
      }

      logger.debug('Fetching from TheNewsAPI', {
        url: `${this.client.defaults.baseURL}/news/top`,
        params,
      });
      
      const response = await this.client.get<any>('/news/top', {
        params,
      });

      logger.debug('TheNewsAPI response received', {
        status: response.status,
        dataLength: response.data?.data?.length,
      });

      // Transform TheNewsAPI response to our format
      return this.transformResponse(response.data);
    } catch (error) {
      logger.error('TheNewsAPI error', {
        message: error instanceof Error ? error.message : String(error),
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText,
        url: (error as any)?.config?.url,
      });
      throw error;
    }
  }

  async searchNews(
    query: string,
    language?: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'relevancy'
  ): Promise<NewsResponse> {
    const params: any = {
      api_token: this.apiKey,
      q: query,
      limit: pageSize,
      page,
    };

    if (language) {
      params.language = language;
    }

    // Map sortBy to TheNewsAPI format
    const sortMap: any = {
      relevancy: 'relevancy',
      popularity: 'latest',
      publishedAt: 'latest',
    };

    params.sort = sortMap[sortBy] || 'latest';

    const response = await this.client.get<any>('/news', {
      params,
    });

    // Transform TheNewsAPI response to our format
    return this.transformResponse(response.data);
  }

  async getNewsByCategory(
    category: string,
    country: string = 'us',
    page: number = 1,
    pageSize: number = 20
  ): Promise<NewsResponse> {
    return this.getTopHeadlines(country, category, page, pageSize);
  }

  private transformResponse(data: any): NewsResponse {
    // TheNewsAPI returns articles directly in the data array
    const articles = data.data || [];
    const meta = data.meta || {};

    return {
      status: 'ok',
      totalResults: meta.found || articles.length,
      articles: articles.map((article: any) => ({
        source: {
          id: null,
          name: article.source || 'Unknown',
        },
        author: article.author || null,
        title: article.title || '',
        description: article.description || null,
        url: article.url || '',
        urlToImage: article.image_url || null,
        publishedAt: article.published_at || new Date().toISOString(),
        content: article.description || null,
      })),
    };
  }
}

export default new NewsApiClient();
