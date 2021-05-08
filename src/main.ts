import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParamValidateException } from './common/exceptions/param.validate.exception';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 全局注册transform拦截器
   */
  app.useGlobalInterceptors(new TransformInterceptor());

  /**
   * 全局注册数据校验管道
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => new ParamValidateException(errors),
    }),
  );

  /**
   * 全局注册错误过滤器
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * 监听3000端口
   */
  await app.listen(3000);
}
bootstrap();