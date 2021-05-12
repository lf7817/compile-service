import { registerAs } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as moment from 'moment';
import { diskStorage } from 'multer';
import { join } from 'path';

export const UploadConfig = registerAs(
  'upload',
  (): MulterOptions => ({
    dest: join(__dirname, '../uploads'),
    storage: diskStorage({
      destination: join(
        __dirname,
        `../uploads/${moment().format('YYYY-MM-DD')}`,
      ),
      filename: (req, file, cb) => {
        const [ofileName, ext] = file.originalname.split('.');
        const filename = `${ofileName}.${ext.toLowerCase()}`; // java文件名不能修改；拓展名要改成小写，否则javac编译报错

        return cb(null, filename);
      },
    }),
  }),
);
