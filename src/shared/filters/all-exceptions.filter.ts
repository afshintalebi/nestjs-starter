import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import {
  DEVELOPMENT_ENV,
  PRODUCTION_ENV,
  STAGING_ENV,
} from '../configs/constants';
import { RequestInterface } from '../types/request.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  private getHttpMessage(exception): string {
    let httpMessage = 'Please check app logs';

    if (exception instanceof HttpException) {
      httpMessage = (exception as any).response.message;
    } else if (exception?.message) {
      httpMessage = exception.message;
    } else if (typeof exception === 'string') {
      httpMessage = exception;
    }

    return httpMessage;
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const isLive = [PRODUCTION_ENV, STAGING_ENV].includes(
      this.configService.get('env'),
    );
    const isDevelopment = [DEVELOPMENT_ENV].includes(
      this.configService.get('env'),
    );
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request: RequestInterface = ctx.getRequest();
    const httpMessage = this.getHttpMessage(exception);
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      method: request.method,
      message: httpMessage,
      ip: request.clientIP,
      traceId: request.traceId,
      trace: exception?.stack,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (isLive) {
      Sentry.captureException(exception);
    } else if (isDevelopment) {
      Logger.error(responseBody);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
