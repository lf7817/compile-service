/*
 * @Author: 李凡
 * @Email: 535536456@qq.com
 * @Date: 2020-12-07 22:01:35
 * @LastEditors: 李凡
 * @LastEditTime: 2021-01-21 11:40:18
 * @Description:
 */
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
