import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import generalConfig from '@/shared/configs/app.config';
import envValidationSchema from '@/shared/configs/env.validation.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { UtilsModule } from '@/common/utils/utils.module';
import { UserController } from '@/common/user/controllers/user.controller';
import { UserService } from '@/common/user/services/user.service';
import { UserAdminService } from '@/common/user/services/user-admin.service';
import { AuthService } from '@/common/auth/services/auth.service';
import { AuthAdminService } from '@/common/auth/services/auth-admin.service';
import { AuthCommonService } from '@/common/auth/services/auth-common.service';
import { LocalStrategy } from '@/common/auth/strategies/local.strategy';
import { JwtStrategy } from '@/common/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@/common/auth/strategies/jwt-refresh.strategy';
import { AdminLocalStrategy } from '@/common/auth/strategies/admin.local.strategy';
import { JwtAdminStrategy } from '@/common/auth/strategies/jwt-admin.strategy';
import { JwtAdminRefreshStrategy } from '@/common/auth/strategies/jwt-admin-refresh.strategy';
import { UserModule } from '@/common/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/common/user/schemas/user.schema';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@/core/health/health.controller';

let mongod;

async function getMongoDbConfig() {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  return [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri,
      }),
      inject: [ConfigService],
    }),
  ];
}

export async function stopMongoDbServer() {
  await mongod.stop();
}

export function getDefaultImportsOfAppModule() {
  return [
    ConfigModule.forRoot({
      load: [generalConfig],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('i18n.fallbackLanguage'),
        loaderOptions: {
          path: `src/${configService.get('i18n.srcDir')}/`,
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
  ];
}

export function getUserModuleTestConfigs() {
  return {
    imports: [...getDefaultImportsOfAppModule(), CqrsModule, UtilsModule],
    controllers: [UserController],
    providers: [UserService, UserAdminService],
  };
}

export async function getAuthModuleTestConfigs() {
  return {
    imports: [
      ...getDefaultImportsOfAppModule(),
      ...(await getMongoDbConfig()),
      UtilsModule,
      UserModule,
      CqrsModule,
      PassportModule,
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      JwtModule.registerAsync({
        useFactory: (config: ConfigService) => {
          return {
            global: true,
            secret: config.get<string>('jwt.secretKey') || 'seret key',
            signOptions: {
              expiresIn: config.get<string | number>('jwt.expireTime') || '15m',
            },
          };
        },
        inject: [ConfigService],
      }),
    ],
    providers: [
      AuthService,
      AuthAdminService,
      AuthCommonService,
      LocalStrategy,
      JwtStrategy,
      JwtRefreshStrategy,
      AdminLocalStrategy,
      JwtAdminStrategy,
      JwtAdminRefreshStrategy,
    ],
  };
}

export function getHealthModuleTestConfigs() {
  return {
    imports: [TerminusModule],
    controllers: [HealthController],
  };
}
