import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userService from '../user/user.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { poccess } from './auth.service';

export const validateLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log('验证用户登陆数据');

  const { name, password } = request.body;

  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name, { password: true });
  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  request.body.user = user;

  next();
};

export const authGuard = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authorization = request.header('Authorization');
    if (!authorization) throw new Error();

    const token = authorization.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    request.user = decoded as TokenPayload;
    next();
  } catch (error) {
    next(new Error('UNAUTHORIZED'));
  }
};

interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    console.log('访问控制');
    const { possession } = options;
    const { id: userId } = request.user;

    if (userId == 1) return next();
    // console.log('resource:', request.params, Object.keys(request.params));
    const resourceIdParam = Object.keys(request.params)[0];
    const resourceType = resourceIdParam.replace('Id', '');
    const resourceId = parseInt(request.params[resourceIdParam], 10);
    if (possession) {
      try {
        const ownResource = await poccess({ resourceId, resourceType, userId });
        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
        }
      } catch (error) {
        next(error);
      }
    }
    next();
  };
};
