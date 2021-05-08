import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from './modules/main.module';
import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.development', '.env'],
    }),
    MainModule,
  ],
})
export class AppModule {}
