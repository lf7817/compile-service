import { Module } from '@nestjs/common';
import { CompileModule } from './compile/compile.module';

@Module({
  imports: [CompileModule],
})
export class MainModule {}
