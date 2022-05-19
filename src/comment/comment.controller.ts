import { Request, Response, NextFunction } from 'express';
import {
  createComment,
  deleteComment,
  isReplayComment,
  updateComment,
} from './comment.service';

/**
 * 保存评论
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { content, postId } = request.body;
  const { id: userId } = request.user;

  const comment = {
    content,
    postId,
    userId,
  };

  try {
    const data = await createComment(comment);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论
 */
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id: userId } = request.user;
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);
  const { content, postId } = request.body;

  const comment = {
    content,
    postId,
    userId,
    parentId,
  };

  try {
    const reply = await isReplayComment(parentId);
    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    return next(error);
  }

  try {
    const data = await createComment(comment);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { content } = request.body;
  const { commentId } = request.params;

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  try {
    const data = await updateComment(comment);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;

  try {
    const data = await deleteComment(parseInt(commentId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};
