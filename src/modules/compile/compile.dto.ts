import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { JdkVersion } from './compile.constants';

/**
 * javac编译参数
 */
export class JavaCompileOptionsDto {
  @IsOptional()
  @IsEnum(JdkVersion)
  @Transform((params) => parseFloat(params.value))
  target?: number;

  @IsEnum(JdkVersion)
  @IsOptional()
  @Transform((params) => parseFloat(params.value))
  source?: number;
}
