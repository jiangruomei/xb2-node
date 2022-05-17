import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { imageResizer } from './file.service';

const fileUpload = multer({
  dest: 'uploads/',
});

export const fileInterceptor = fileUpload.single('file');

/**
 * 文件处理器
 */
export const fileProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { path } = request.file;
  let image: Jimp;

  try {
    image = await Jimp.read(path);
  } catch (error) {
    next(error);
  }

  //准备文件数据
  const { imageSize, tags } = image['_exif'];

  //在请求中添加文件数据
  request.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };

  //调整图像尺寸
  imageResizer(image, request.file);

  next();
};
