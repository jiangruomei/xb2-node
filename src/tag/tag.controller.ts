import { Request, Response, NextFunction } from 'express';
import { createTag, getTagByName } from './tag.service';

/**
 *
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name } = request.body;

  try {
    const tag = await getTagByName(name);
    if (tag) throw new Error('TAG_ALREADY_EXISTS');

    const data = await createTag({ name });
    response.status(201).send(data);
  } catch (error) {
    return next(error);
  }
};
