import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { JavaCompileOptionsDto, GoCompileOptionsDto } from './dto/compile.dto';
import { CommonException } from 'src/common/exceptions/common.exception';
import { ExceptionCode } from 'src/common/exceptions/constants/exception.constants';
import { zip } from 'compressing';
import { classToPlain } from 'class-transformer';
import { dirname } from 'path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class CompileService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  /**
   * exec转化成promise
   */
  private execAsync = promisify(exec);

  /**
   * 编译
   * @param files
   * @param options 编译参数
   * @returns
   */
  public async compile(
    files: Express.Multer.File[],
    options: JavaCompileOptionsDto | GoCompileOptionsDto,
  ) {
    try {
      // 编译
      const { targetDir } = await this.doCompile(files, options);
      // 创建zip流
      const zipStream = new zip.Stream();
      zipStream.addEntry(targetDir);

      return {
        zipStream,
        filename: targetDir.split('/').pop() + '.zip',
      };
    } catch (e) {
      throw new CommonException(
        ExceptionCode.COMPILE_FAIL,
        HttpStatus.OK,
        e.errors,
      );
    }
  }

  /**
   * 执行编译并返回目标目录
   * @param files
   * @param options
   * @returns
   */
  private async doCompile(
    files: Express.Multer.File[],
    options: JavaCompileOptionsDto | GoCompileOptionsDto,
  ) {
    if (files.length === 0) {
      throw new CommonException(ExceptionCode.NOT_UPLOAD_FILE);
    }
    // 编译后的class路径
    const targetDir = `${dirname(files[0].path)}/${new Date().getTime()}`;
    // 创建目录
    await mkdir(targetDir);
    // 生成命令
    const cmd = this.generateExecCmd(files, options, targetDir);
    this.logger.debug(cmd);

    try {
      // 指定工作目录，并执行命令
      const { stderr, stdout } = await this.execAsync(cmd, { cwd: targetDir });
      // 生成编译信息
      await writeFile(`${targetDir}/compile-info.txt`, cmd + '\n' + stderr);

      return {
        stderr,
        stdout,
        targetDir,
      };
    } catch (e) {
      throw new CommonException(ExceptionCode.COMPILE_FAIL, HttpStatus.OK, e);
    }
  }

  /**
   * 生成cmd命令
   */
  private generateExecCmd(
    files: Express.Multer.File[],
    options: JavaCompileOptionsDto | GoCompileOptionsDto,
    targetDir: string,
  ): string {
    if (files.length === 0) {
      throw new CommonException(ExceptionCode.NOT_UPLOAD_FILE);
    }

    let cmd = '';

    if (options instanceof JavaCompileOptionsDto) {
      // 处理java参数
      const opt = Object.keys(classToPlain(options)).reduce((str, key) => {
        if (key === 'target' || key === 'source' || key === 'encoding') {
          str += ` -${key} ${options[key]}`;
        } else {
          if (options[key] === 'true') {
            str += ` -${key}`;
          }
        }
        return str;
      }, '');

      cmd = `javac -d ${targetDir} ${opt} ${files
        .map((file) => file.path)
        .join(' ')}`;
    } else if (options instanceof GoCompileOptionsDto) {
      const opt = Object.keys(classToPlain(options)).reduce((str, key) => {
        if (key === 'o' || key === 'p') {
          str += ` -${key} ${options[key]}`;
        } else {
          if (options[key] === 'true') {
            str += ` -${key}`;
          }
        }
        return str;
      }, '');

      // 处理go参数
      cmd = `/usr/local/go/${
        options.version
      }/go/bin/go build ${opt} ${files.map((file) => file.path).join(' ')}`;
    }

    return cmd;
  }
}
