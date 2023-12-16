import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import generalConfig from './shared/configs/app.config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import envValidationSchema from './shared/configs/env.validation.schema';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { IpMiddleware } from './shared/middlewares/ip.middleware';
import { LanguageMiddleware } from './shared/middlewares/language.middleware';
import { CoreModule } from './core/core.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { UtilsService } from './common/utils/utils.service';
import { UtilsModule } from './common/utils/utils.module';

@Module({
  imports: [
    CommonModule,
    // TODO DEV tools doesn't work
    DevtoolsModule.registerAsync({
      imports: [UtilsModule],
      useFactory: async (utilsService: UtilsService) => ({
        http: !utilsService.isProductionEnv(),
        port: 9000,
      }),
      inject: [UtilsService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('i18n.fallbackLanguage'),
        loaderOptions: {
          path: join(__dirname, `/${configService.get('i18n.srcDir')}/`),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['accept-language']),
      ],
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [generalConfig],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('throttle.ttl'),
        limit: config.get('throttle.limit'),
      }),
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // IP middleeware
    consumer
      .apply(IpMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Language mmiddleware
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
