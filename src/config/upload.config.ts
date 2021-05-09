import { registerAs } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';

export const UploadConfig = registerAs(
  'upload',
  (): MulterOptions => ({
    dest: join(__dirname, '../uploads'),
    storage: diskStorage({
      destination: join(
        __dirname,
        `../uploads/${new Date().toLocaleDateString()}`,
      ),
      filename: (req, file, cb) => {
        // const [ofileName, ext] = file.originalname.split('.');
        // const filename = `${ofileName}_${new Date().getTime()}.${ext}`;
        const filename = file.originalname; // java文件名不能修改。。。

        return cb(null, filename);
      },
    }),
  }),
);
