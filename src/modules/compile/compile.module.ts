import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { CompileController } from './compile.controller';
import { CompileService } from './compile.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService) => configService.get('upload'),
    }),
  ],
  controllers: [CompileController],
  providers: [CompileService],
})
export class CompileModule {}
