import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';

export const createUser = async (user: UserModel) => {
  const statement = `
    INSERT INTO user
    SET ?
  `;

  const [data] = await connection.promise().query(statement, user);
  return data;
};
interface GetUserOptions {
  password?: boolean;
}

export const getUserByName = async (
  name: string,
  options: GetUserOptions = {},
) => {
  const { password } = options;

  const statement = `
    SELECT 
      id, 
      name
      ${password ? ', password' : ''}
    FROM user
    WHERE user.name = ?
  `;
  const [data] = await connection.promise().query(statement, name);
  // console.log(typeof data, data, data[0], data[0].name);
  return data[0];
};
