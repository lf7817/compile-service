import { HttpStatus } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CommonException } from '../exceptions/common.exception';
import { ExceptionCode } from '../exceptions/constants/exception.constants';

export function fileInterceptorUtil(fieldName: string, ext: string) {
  return FileInterceptor(fieldName, {
    fileFilter: (req, file, cb) => {
      const reg = new RegExp(`${ext}$`, 'i');
      if (reg.test(file.originalname)) {
        return cb(null, true);
      }
      return cb(new CommonException(ExceptionCode.FILE_EXT_ERROR), false);
    },
  });
}

export function filesInterceptorUtil(
  fieldName: string,
  ext: string,
  maxCount = 10,
) {
  return FilesInterceptor(fieldName, maxCount, {
    fileFilter: (req, file, cb) => {
      const reg = new RegExp(`${ext}$`, 'i');
      if (reg.test(file.originalname)) {
        return cb(null, true);
      }
      return cb(
        new CommonException(ExceptionCode.FILE_EXT_ERROR, HttpStatus.OK, [
          `'${file.originalname}'文件格式错误`,
        ]),
        false,
      );
    },
  });
}
