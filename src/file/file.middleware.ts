import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import Jimp from 'jimp';
import { imageResizer } from './file.service';

// 文件过滤器
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    // 测试文件类型
    const allowed = fileTypes.some(type => type === file.mimetype);

    if (allowed) {
      // 允许上传
      callback(null, true);
    } else {
      // 拒绝上传
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

const fileUploadFilter = fileFilter(['image/png', 'image/jpeg', 'image/jpg']);
const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
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
