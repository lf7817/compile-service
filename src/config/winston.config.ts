import { registerAs } from '@nestjs/config';
import * as winston from 'winston';

import DailyRotateFile = require('winston-daily-rotate-file');
const format = winston.format;

export const WinstonConfig = registerAs(
  'winston',
  (): winston.LoggerOptions => ({
    exitOnError: false,
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'HH:mm:ss YY/MM/DD' }),
      format.label({ label: 'compile-service' }),
      format.splat(),
      format.printf((info) => {
        return `[${info.label}] ${info.timestamp} ${info.level}: ${info.message}`;
      }),
    ),
    transports: [
      new winston.transports.Console({ level: 'debug' }),
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  }),
);
