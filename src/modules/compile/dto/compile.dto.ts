import { Transform, TransformFnParams } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { JdkVersion } from '../constants/compile.constants';

/**
 * javac编译参数
 */
export class JavaCompileOptionsDto {
  /**
   * 目标版本
   */
  @IsOptional()
  @IsEnum(JdkVersion, { message: 'target仅支持jdk 7-11 ' })
  @Transform((params) => parseFloat(params.value))
  target?: JdkVersion;

  /**
   * 编译版本
   */

  @IsOptional()
  @IsEnum(JdkVersion, { message: 'source仅支持jdk 7-11' })
  @Transform((params) => parseFloat(params.value))
  source?: JdkVersion;

  /**
   * 指定源文件使用的字符编码
   */
  @IsString()
  @IsOptional()
  encoding?: string;

  /**
   * 在生成的class文件中包含是否所有调试信息（行号、变量、源文件）
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  g?: string;

  /**
   * 是否输出有关编译器正在执行的操作的消息，包括：classpath、加载的类文件信息
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  verbose?: boolean;

  /**
   * 不生成任何警告
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  nowarn?: boolean;

  /**
   * 是否输出使用已过时的 API 的源位置
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  deprecation?: boolean;
}

/**
 * 转化BooleanString为字符串true或false
 * @param params
 * @returns
 */
function transformBoolean(params: TransformFnParams) {
  if (params.value === '1') {
    return 'true';
  }

  if (params.value === '0') {
    return 'false';
  }

  return params.value;
}
