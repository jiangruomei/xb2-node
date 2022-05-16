import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';
import { connection } from '../app/database/mysql';

interface SignTokenOptions {
  payload?: any;
}

export const signToken = (options: SignTokenOptions) => {
  const { payload } = options;

  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });

  return token;
};

interface PoccessOptions {
  resourceType?: string;
  resourceId?: number;
  userId?: number;
}

export const poccess = async (options: PoccessOptions) => {
  const { resourceType, resourceId, userId } = options;
  const statement = `
    SELECT COUNT(${resourceType}.id) as count
    FROM ${resourceType}
    WHERE ${resourceType}.id = ? AND userId = ?
  `;
  const [data] = await connection
    .promise()
    .query(statement, [resourceId, userId]);
  // console.log('data', data, data[0], data[0].count);
  return data[0].count ? true : false;
};
