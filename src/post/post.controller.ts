import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';

export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await getPosts();
    response.send(data);
  } catch (error) {
    next(error);
  }
};
