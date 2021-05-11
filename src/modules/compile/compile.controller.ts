import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonException } from 'src/common/exceptions/common.exception';
import { ExceptionCode } from 'src/common/exceptions/constants/exception.constants';
import { fileInterceptorUtil } from 'src/common/utils/file.interceptor.util';
import { JavaCompileOptionsDto } from './dto/compile.dto';
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
  @UseInterceptors(fileInterceptorUtil('file', 'java'))
  async compileJava(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() options: JavaCompileOptionsDto,
  ) {
    /**
     * 如果file不存在抛出异常
     */
    if (file == null) {
      throw new CommonException(ExceptionCode.NOT_UPLOAD_FILE);
    }

    /**
     * 编译java
     */
    const { zipStream, filename } = await this.compileService.compileJava(
      file,
      options,
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    zipStream.pipe(res);
  }
}
