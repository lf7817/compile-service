import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { exec } from 'child_process';

@Controller('compile')
export class CompileController {
  @Post('java')
  @UseInterceptors(FileInterceptor('file'))
  compileJava(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    exec(`javac -source 9 ${file.path}`, (err, stdout, stderr) => {
      console.log('---------------');
      console.log('err:', err);
      console.log('---------------');
      console.log('stdout:', stdout);
      console.log('---------------');
      console.log('stderr:', stderr);
    });
  }
}
