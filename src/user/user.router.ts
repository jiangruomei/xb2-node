import express from 'express';
import * as userController from './user.controller';
import {
  hashPassword,
  validateUserData,
  validateUpdateUserData,
} from './user.middleware';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

router.post('/users', validateUserData, hashPassword, userController.store);

router.get('/users/:userId', userController.show);

router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  userController.update,
);

export default router;
