import express from 'express';
import * as postController from './post.controller';
// import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middleware';
import { sort, filter, paginate } from './post.middleware';
import { POSTS_PER_PAGE } from '../app/app.config';

const router = express.Router();

router.get(
  '/posts',
  sort,
  filter,
  paginate(POSTS_PER_PAGE),
  postController.index,
);

router.post('/posts', authGuard, postController.store);

router.patch(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.update,
);

router.delete(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.destroy,
);
//添加内容标签
router.post(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.storePostTag,
);

//移除内容标签
router.delete(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.destroyPostTag,
);

router.get('/posts/:postId', postController.show);

//导出路由
export default router;
