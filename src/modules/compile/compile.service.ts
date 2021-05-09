import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { tar } from 'compressing';
import { CommonException } from 'src/common/exceptions/common.exception';
import { ExceptionCode } from 'src/common/exceptions/constants/exception.constants';
import { JavaCompileOptionsDto } from './compile.dto';

@Injectable()
export class CompileService {
  /**
   * exec转化成promise
   * @param cmd 命令
   * @returns
   */
  private execAsync(cmd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }

        return resolve({ stdout, stderr });
      });
    });
  }

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
      // TODO: 处理编译参数
      await this.execAsync(`javac ${file.path}`);
      return file.path.replace(/java$/i, 'class');
    } catch (e) {
      console.log('------------\n', e);
    }
  }
}
