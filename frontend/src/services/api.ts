import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { NewsResponse, SortBy } from '../types';

class NewsApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getTopHeadlines(
    country: string = 'us',
    category?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<NewsResponse> {
    const params: any = {
      country,
      page,
      pageSize,
    };

    if (category) {
      params.category = category;
    }

    const response = await this.client.get<NewsResponse>('/api/news/top-headlines', {
      params,
    });

    return response.data;
  }

  async searchNews(
    query: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: SortBy = 'relevancy'
  ): Promise<NewsResponse> {
    const response = await this.client.get<NewsResponse>('/api/news/search', {
      params: {
        q: query,
        page,
        pageSize,
        sortBy,
      },
    });

    return response.data;
  }

  async getNewsByCategory(
    category: string,
    country: string = 'us',
    page: number = 1,
    pageSize: number = 20
  ): Promise<NewsResponse> {
    const response = await this.client.get<NewsResponse>(`/api/news/categories/${category}`, {
      params: {
        country,
        page,
        pageSize,
      },
    });

    return response.data;
  }
}

export default new NewsApiService();
