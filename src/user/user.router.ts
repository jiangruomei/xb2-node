import express from 'express';
import * as userController from './user.controller';
import { hashPassword, validateUserData } from './user.middleware';

const router = express.Router();

router.post('/users', validateUserData, hashPassword, userController.store);

export default router;
