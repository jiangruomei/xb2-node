import express from 'express';
import * as likeController from './like.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

router.post('/posts/:postId/like', authGuard, likeController.storeUserLikePost);

router.delete(
  '/posts/:postId/like',
  authGuard,
  likeController.destroyUserLikePost,
);

export default router;
