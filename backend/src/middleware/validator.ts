import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../config/logger';

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Query validation failed', {
          path: req.path,
          errors: error.errors,
        });
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Body validation failed', {
          path: req.path,
          errors: error.errors,
        });
        return res.status(400).json({
          success: false,
          message: 'Invalid request body',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Params validation failed', {
          path: req.path,
          errors: error.errors,
        });
        return res.status(400).json({
          success: false,
          message: 'Invalid route parameters',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
