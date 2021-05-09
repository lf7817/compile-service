import {
  Body,
  Controller,
  Header,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonException } from 'src/common/exceptions/common.exception';
import { ExceptionCode } from 'src/common/exceptions/constants/exception.constants';
import { fileInterceptorUtil } from 'src/common/utils/file.interceptor.util';
import { JavaCompileOptionsDto } from './compile.dto';
import { CompileService } from './compile.service';

@Controller('compile')
export class CompileController {
  constructor(private readonly compileService: CompileService) {}

  /**
   * 上传并编译java
   * @param file
   * @param options
   * @returns
   */
  @Post('java')
  @Header('Content-Type', 'application/octet-stream')
  @UseInterceptors(fileInterceptorUtil('file', 'java')) // 拓展名不在这里校验了，太丑了
  async compileJava(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() options: JavaCompileOptionsDto,
  ) {
    if (file == null) {
      throw new CommonException(ExceptionCode.NOT_UPLOAD_FILE);
    }

    const path = await this.compileService.compileJava(file, options);
    res.status(200).download(path);
  }
}
