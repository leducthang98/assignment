import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const createLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          isProduction
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                  return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${metaStr}`;
                }),
              ),
        ),
      }),
      // File transport for production
      ...(isProduction
        ? [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
              format: winston.format.json(),
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
              format: winston.format.json(),
            }),
          ]
        : []),
    ],
  });
};
