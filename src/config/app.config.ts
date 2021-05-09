import { registerAs } from '@nestjs/config';

type Confg = {
  port: number;
};

export const AppConfig = registerAs(
  'app',
  (): Confg => ({
    port: Number(process.env.PORT) || 3000,
  }),
);
