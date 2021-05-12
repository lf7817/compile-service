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
   * 编译java
   * @param file java文件
   * @param options javac编译参数
   */
  public async compileJava(
    file: Express.Multer.File,
    options: JavaCompileOptionsDto,
  ) {
    try {
      // 处理编译参数
      const optionString = Object.keys(classToPlain(options)).reduce(
        (op, key) => {
          if (key === 'target' || key === 'source' || key === 'encoding') {
            op += ` -${key} ${options[key]}`;
          } else {
            op += ` -${key}`;
          }

          return op;
        },
        '',
      );

      // 编译
      const { stderr } = await this.execAsync(
        `javac ${optionString} ${file.path}`,
      );
      // 生成编译信息
      await writeFile(`${file.destination}/compile-info.txt`, stderr);

      const zipStream = new zip.Stream();
      zipStream.addEntry(file.destination);

      return {
        zipStream,
        filename: `${file.originalname}.zip`,
      };
    } catch (e) {
      throw new CommonException(ExceptionCode.COMPILE_FAIL, HttpStatus.OK, e);
    }
  }
}
