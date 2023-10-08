import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import helmet from '@fastify/helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fastifyCsrf from '@fastify/csrf-protection';
import {
  PRODUCTION_ENV,
  STAGING_ENV,
  TEST_ENV,
} from './shared/configs/constants';

process.on('unhandledRejection', (e: Error) => {
  Logger.error('unhandledRejection: ' + e.message, e.stack);
  Sentry.captureException(e);
});

process.on('uncaughtException', (e: Error) => {
  Logger.error('uncaughtException: ' + e.message, e.stack);
  Sentry.captureException(e);
});

/**
 * set Sentry configs
 * @param configService
 * @param app
 */
function setupSentry(configService: ConfigService) {
  // configs for staging and production environment
  if (
    [STAGING_ENV, PRODUCTION_ENV].includes(configService.get<string>('env'))
  ) {
    // sentry
    Sentry.init({
      dsn: configService.get('sentry.dsn'),
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    });
  }
}

const applySwagger = async (app, configService) => {
  if ([PRODUCTION_ENV, TEST_ENV].includes(configService.get('env'))) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('APIs list')
    .setDescription('APIs list')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(configService.get('apiDocRoute'), app, document);
};

const applyMiddlewares = async (app) => {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  await app.register(fastifyCsrf);
};

const applyConfigs = async (app) => {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'],
      snapshot: true,
    },
  );

  // services
  const configService = app.get(ConfigService);

  applyConfigs(app);
  setupSentry(configService);
  await applyMiddlewares(app);
  applySwagger(app, configService);

  await app.listen(
    configService.get('port'),
    configService.get('netAddress'),
    () => {
      Logger.verbose(
        `App started on the port ${configService.get(
          'port',
        )} and IP range ${configService.get('netAddress')}`,
      );
    },
  );
}
bootstrap();
