import { HttpStatus, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { JavaCompileOptionsDto } from './dto/compile.dto';
import { CommonException } from 'src/common/exceptions/common.exception';
import { ExceptionCode } from 'src/common/exceptions/constants/exception.constants';
import { zip } from 'compressing';
import { classToPlain } from 'class-transformer';

@Injectable()
export class CompileService {
  /**
   * exec转化成promise
   */
  private execAsync = promisify(exec);

  /**
   * 编译多个java文件
   * @param files
   * @param options javac编译参数
   * @returns
   */
  public async compileJavas(
    files: Express.Multer.File[],
    options: JavaCompileOptionsDto,
  ) {
    try {
      // 处理编译参数
      const optionString = this.normalizeCompileOptions(options, 'java');
      // 编译并返回class路径
      const buildClassDirectory = await this.compile(files, optionString);

      const zipStream = new zip.Stream();
      zipStream.addEntry(buildClassDirectory);

      return {
        zipStream,
        filename: buildClassDirectory.split('/').pop() + '.zip',
      };
    } catch (e) {
      throw new CommonException(ExceptionCode.COMPILE_FAIL, HttpStatus.OK, e);
    }
  }

  /**
   * 序列化编译参数
   * @param options
   * @returns
   */
  private normalizeCompileOptions<T = any>(options: T, lang: 'java' | 'go') {
    return Object.keys(classToPlain(options)).reduce((op, key) => {
      if (
        lang === 'java' &&
        (key === 'target' || key === 'source' || key === 'encoding')
      ) {
        op += ` -${key} ${options[key]}`;
      } else if (lang === 'go') {
      } else {
        if (options[key] === 'true') {
          op += ` -${key}`;
        }
      }

      return op;
    }, '');
  }

  /**
   *
   * @param files
   * @param options
   * @returns
   */
  private async compile(files: Express.Multer.File[], options: string) {
    if (files.length === 0) {
      throw new CommonException(ExceptionCode.NOT_UPLOAD_FILE);
    }
    // 编译后的class路径
    const buildClassDirectory = `${
      files[0].destination
    }/${new Date().getTime()}`;

    try {
      const cmd = `javac -d ${buildClassDirectory} ${options} ${files
        .map((file) => file.path)
        .join(' ')}`;

      const { stderr } = await this.execAsync(cmd);
      // 生成编译信息
      await writeFile(
        `${buildClassDirectory}/compile-info.txt`,
        cmd + '\n' + stderr,
      );

      return buildClassDirectory;
    } catch (e) {
      throw new CommonException(ExceptionCode.COMPILE_FAIL, HttpStatus.OK, e);
    }
  }
}
