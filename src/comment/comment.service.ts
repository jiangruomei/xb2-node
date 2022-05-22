import { connection } from '../app/database/mysql';
import {
  GetPostsOptionsFilter,
  GetPostsOptionsPagination,
} from '../post/post.service';
import { CommentModel } from './comment.model';
import { sqlFragment } from './comment.provider';

/**
 * 保存评论
 */
export const createComment = async (comment: CommentModel) => {
  const statement = `
  INSERT INTO comment
  SET ?
  `;

  const [data] = await connection.promise().query(statement, comment);

  return data;
};

/**
 * 检查评论是否为回复评论
 */
export const isReplayComment = async (commentId: number) => {
  const statement = `
    SELECT parentId FROM comment
    WHERE id=?
  `;

  const [data] = await connection.promise().query(statement, commentId);

  return data[0].parentId ? true : false;
};

/**
 * 修改评论
 */
export const updateComment = async (comment: CommentModel) => {
  //准备数据
  const { content, id } = comment;
  const statement = `
    UPDATE comment
    SET content=?
    WHERE id=?
  `;
  const [data] = await connection.promise().query(statement, [content, id]);
  return data;
};

/**
 * 删除评论
 */
export const deleteComment = async (commentId: number) => {
  const statement = `
    DELETE FROM comment
    WHERE id=?
  `;

  const [data] = await connection.promise().query(statement, commentId);
  return data;
};

/**
 * 获取评论列表
 */

interface GetCommentsOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}
export const getComments = async (options: GetCommentsOptions) => {
  const {
    filter,
    pagination: { limit, offset },
  } = options;
  let params: Array<any> = [limit, offset];

  if (filter.param) {
    params = [filter.param, ...params];
  }
  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${filter.name == 'userReplied' ? `, ${sqlFragment.repliedComment}` : ''}
      ${filter.name !== 'userReplied' ? `, ${sqlFragment.totalReplies}` : ''}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
  WHERE
    ${filter.sql}
   GROUP BY
      comment.id
   ORDER BY
      comment.id DESC
   LIMIT ?
   OFFSET ?
  `;

  const [data] = await connection.promise().query(statement, params);
  return data;
};

/**
 * 统计评论数量
 */
export const getCommentsTotalCount = async (options: GetCommentsOptions) => {
  const { filter } = options;

  let params: Array<any> = [];

  if (filter.param) {
    params = [filter.param, ...params];
  }
  const statement = `
  SELECT
    COUNT(
      DISTINCT comment.id
    ) AS total
  FROM
    comment
  ${sqlFragment.leftJoinUser}
  ${sqlFragment.leftJoinPost}
WHERE
  ${filter.sql}
`;

  const [data] = await connection.promise().query(statement, params);
  return data[0].total;
};

/**
 * 评论回复列表
 */
interface getCommentRepliesOptions {
  commentId: number;
}

export const getCommentReplies = async (options: getCommentRepliesOptions) => {
  const { commentId } = options;
  const statement = `
    SELECT 
      comment.id,
      comment.content,
      ${sqlFragment.user}
    FROM 
      comment
    ${sqlFragment.leftJoinUser}
    WHERE
      comment.parentId = ?
    GROUP BY
      comment.id
  `;
  const [data] = await connection.promise().query(statement, commentId);
  return data;
};
