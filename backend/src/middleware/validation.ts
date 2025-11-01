import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

export const validatePromptInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, content, tags, author } = req.body;

  if (!title || !description || !content || !author) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required fields: title, description, content, and author are required'
    });
  }

  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Tags must be an array'
    });
  }

  return next();
};

export const validateCommentInput = (req: Request, res: Response, next: NextFunction) => {
  const { content, author } = req.body;

  if (!content || !author) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required fields: content and author are required'
    });
  }

  return next();
};

export const validateVersionInput = (req: Request, res: Response, next: NextFunction) => {
  const { changes, author } = req.body;

  if (!changes || !author) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required fields: changes and author are required'
    });
  }

  return next();
};