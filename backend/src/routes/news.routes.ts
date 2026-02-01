import { Router, Request, Response } from 'express';
import { validateQuery, validateParams } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';
import newsService, {
  topHeadlinesQuerySchema,
  searchQuerySchema,
  categoryParamSchema,
} from '../services/newsApi.service';
import logger from '../config/logger';

const router = Router();

/**
 * GET /api/news/top-headlines
 * Fetch top headlines with optional country and category filters
 */
router.get(
  '/top-headlines',
  validateQuery(topHeadlinesQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { country, category, page, pageSize } = req.query as any;

    const response = await newsService.getTopHeadlines(
      country,
      category,
      page,
      pageSize
    );

    res.json(response);
  })
);

/**
 * GET /api/news/search
 * Search for news articles by query
 */
router.get(
  '/search',
  validateQuery(searchQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { q, language, page, pageSize, sortBy } = req.query as any;

    const response = await newsService.searchNews(
      q,
      language,
      page,
      pageSize,
      sortBy
    );

    res.json(response);
  })
);

/**
 * GET /api/news/categories/:category
 * Fetch news by specific category
 */
router.get(
  '/categories/:category',
  validateParams(categoryParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const { country, page, pageSize } = req.query as any;

    const response = await newsService.getNewsByCategory(
      category,
      country || 'us',
      page || 1,
      pageSize || 20
    );

    res.json(response);
  })
);

export default router;
