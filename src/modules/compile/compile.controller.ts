import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonException } from 'src/common/exceptions/common.exception';
import { ExceptionCode } from 'src/common/exceptions/constants/exception.constants';
import { filesInterceptorUtil } from 'src/common/utils/file.interceptor.util';
import { JavaCompileOptionsDto } from './dto/compile.dto';
import { CompileService } from './compile.service';

@Controller('compile')
export class CompileController {
  constructor(private readonly compileService: CompileService) {}

  /**
   * 上传并编译java数组
   * @param files
   * @param options
   * @returns
   */
  @Post('java')
  @UseInterceptors(filesInterceptorUtil('files', 'java'))
  async up(
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() options: JavaCompileOptionsDto,
  ) {
    /**
     * 如果未上传文件抛出异常
     */
    if (files.length === 0) {
      throw new CommonException(ExceptionCode.NOT_UPLOAD_FILE);
    }

    /**
     * 编译java
     */
    const { zipStream, filename } = await this.compileService.compileJavas(
      files,
      options,
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    zipStream.pipe(res);
  }
}
