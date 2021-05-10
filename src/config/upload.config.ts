import { registerAs } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';

export const UploadConfig = registerAs(
  'upload',
  (): MulterOptions => ({
    dest: join(__dirname, '../uploads'),
    storage: diskStorage({
      destination: (req, file, cb) => {
        const path = join(__dirname, `../uploads/${new Date().getTime()}`);

        /**
         * 如果uploads目录不存在则创建
         */
        if (!existsSync(join(__dirname, '../uploads'))) {
          mkdirSync(join(__dirname, '../uploads'), 0o777);
        }

        /**
         * 如果文件目录不存在则创建
         */
        if (!existsSync(path)) {
          mkdirSync(path, 0o777);
        }

        return cb(null, path);
      },
      filename: (req, file, cb) => {
        const [ofileName, ext] = file.originalname.split('.');
        // const filename = `${ofileName}_${new Date().getTime()}.${ext}`;
        const filename = `${ofileName}.${ext.toLowerCase()}`; // java文件名不能修改；拓展名要改成小写，否则javac编译报错

        return cb(null, filename);
      },
    }),
    // 文件过滤方法
    // fileFilter: (req, file, cb) => {
    //   if (/java$/.test(file.originalname) || /go$/.test(file.originalname)) {
    //     return cb(null, true);
    //   }
    //   return cb(new CommonException(ExceptionCode.FILE_EXT_ERROR), false);
    // },
  }),
);
