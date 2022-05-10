import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
export const getPosts = async () => {
  const statement = `
    SELECT 
    post.id,
    post.title,
    post.content,
    JSON_OBJECT(
      'id', user.id,
      'name', user.name
    ) as user
    FROM post
    LEFT JOIN user
      ON user.id = post.userId
  `;

  const [data] = await connection.promise().query(statement);
  return data;
};

export const createPost = async (post: PostModel) => {
  const statement = `
    INSERT INTO post
    SET ?
  `;
  const [data] = await connection.promise().query(statement, post);
  return data;
};

export const updatePost = async (postId: number, post: PostModel) => {
  const statement = `
    UPDATE post
    SET ?
    WHERE id = ?
  `;
  const [data] = await connection.promise().query(statement, [post, postId]);
  return data;
};
