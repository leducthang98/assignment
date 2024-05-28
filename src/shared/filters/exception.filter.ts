import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { Response } from 'express';
import { ERROR } from 'src/constants/exception.constant';

export class BaseException extends HttpException {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(response: string | Record<string, any>, status?: number) {
    super(response, status || HttpStatus.BAD_REQUEST);
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    error: {
      response: {
        message: string;
        code: number;
      };
      status: number;
      message: string;
      name: string;
    },
    host: ArgumentsHost,
  ) {
    console.error(error);

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    const code: number = error?.response?.code;
    const message: string = error?.response?.message;

    const status: number =
      !error.status || code === -1
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : error.status;

    const responsePayload = {
      code: code || ERROR.UNKNOWN_ERROR.code,
      message: message || ERROR.UNKNOWN_ERROR.message,
      data: null,
    };

    response.status(status).json(responsePayload);
  }
}
