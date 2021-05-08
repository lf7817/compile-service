import { Module } from '@nestjs/common';
import { CompileController } from './compile.controller';
import { CompileService } from './compile.service';

@Module({
  imports: [],
  controllers: [CompileController],
  providers: [CompileService],
})
export class CompileModule {}
