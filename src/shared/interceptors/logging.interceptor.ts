import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RequestInterface } from '../types/request.interface';
import * as Sentry from '@sentry/node';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { PRODUCTION_ENV, STAGING_ENV } from '../configs/constants';
import { LANGUAGES } from '../types/languages.enum';
/**
 * Mainly responsible to log request responses and their latency using nest Logger
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  /**
   * will be called on each HTTP request
   * @param context ExecutionContext
   * @param next CallHandler
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const statusMessage = '';
    let transaction;
    const now = Date.now();
    const { statusCode }: FastifyReply = ctx.getResponse<FastifyReply>();
    // const { statusCode, statusMessage }: FastifyReply = ctx.getResponse<FastifyReply>(); // for express adapter
    const {
      raw,
      user,
      method,
      url,
      traceId,
      routerPath,
      query,
      params,
      body,
      headers,
    }: RequestInterface = ctx.getRequest();

    const { clientIP = '0.0.0.1', language = LANGUAGES.EN } = raw || {};

    ctx.getRequest().traceId = new ObjectId();

    return next
      .handle()
      .pipe(
        tap(() => {
          ctx.getRequest().start = now;

          if (
            [PRODUCTION_ENV, STAGING_ENV].includes(
              this.configService.get('app.env'),
            )
          ) {
            transaction = Sentry.startTransaction({
              op: 'API-CALL',
              name: `[${method.toUpperCase()}] ${routerPath}`,
              data: {
                traceId,
                clientIP,
                url,
                user: {
                  email: user?.email,
                },
                query,
                params,
                body,
                headers,
              },
            });
          }
        }),
      )
      .pipe(
        tap(() => {
          const responseTime = Date.now() - now;

          if (transaction) transaction.finish();

          const logMessage = `${
            clientIP || 'localhost'
          } | [${method}] ${url} | language:${language} | ${
            statusCode || ''
          } ${responseTime}ms ${statusMessage || ''}`;

          Logger.verbose(logMessage, 'LoggingInterceptor');
        }),
      );
  }
}
