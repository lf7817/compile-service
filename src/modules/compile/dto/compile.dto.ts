import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GoVersion, JdkVersion } from '../constants/compile.constants';

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
  readonly target?: JdkVersion;

  /**
   * 编译版本
   */

  @IsOptional()
  @IsEnum(JdkVersion, { message: 'source仅支持jdk 7-11' })
  @Transform((params) => parseFloat(params.value))
  readonly source?: JdkVersion;

  /**
   * 指定源文件使用的字符编码
   */
  @IsString()
  @IsOptional()
  readonly encoding?: string;

  /**
   * 在生成的class文件中包含是否所有调试信息（行号、变量、源文件）
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly g?: string;

  /**
   * 是否输出有关编译器正在执行的操作的消息，包括：classpath、加载的类文件信息
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly verbose?: string;

  /**
   * 不生成任何警告
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly nowarn?: string;

  /**
   * 是否输出使用已过时的 API 的源位置
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly deprecation?: string;
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

/**
 * go文件编译参数
 */
export class GoCompileOptionsDto {
  /**
   * go版本号
   */
  @IsEnum(GoVersion, { message: '仅支持1.11、1.12' })
  @Transform((params) => parseFloat(params.value))
  @IsNotEmpty({ message: '请输入go版本' })
  readonly version: GoVersion;

  /**
   * 指定编译输出的名称，代替默认的包名。
   */
  @IsOptional()
  @IsString()
  readonly o?: string;

  /**
   * 安装作为目标的依赖关系的包(用于增量编译提速)
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly i?: string;

  /**
   * 编译时显示包名
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly v?: string;

  /**
   * 开启并发编译，默认情况下该值为 CPU 逻辑核数
   */
  @IsOptional()
  @IsNumber()
  @Transform((params) => parseInt(params.value, 10))
  readonly p?: number;

  /**
   * 强制重新构建
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly a?: string;

  /**
   * 打印编译时会用到的所有命令，但不真正执行
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly n?: string;

  /**
   * 	打印编译时会用到的所有命令
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly x?: string;

  /**
   * 开启竞态检测
   */
  @IsOptional()
  @IsBooleanString()
  @Transform(transformBoolean)
  readonly race?: string;
}
