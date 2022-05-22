import express from 'express';
import { update } from 'lodash';
import { accessControl, authGuard } from '../auth/auth.middleware';
import * as commentController from './comment.controller';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENTS_PER_PAGE } from '../app/app.config';

const router = express.Router();

router.post('/comments', authGuard, commentController.store);

router.post('/comments/:commentId/reply', authGuard, commentController.reply);

router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentController.update,
);

router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentController.destroy,
);

router.get(
  '/comments',
  filter,
  paginate(COMMENTS_PER_PAGE),
  commentController.index,
);

router.get('/comments/:commentId/replies', commentController.indexReplies);

export default router;
