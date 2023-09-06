import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UtilsModule } from '../utils/utils.module';
import { AuthAdminService } from './services/auth.admin.service';
import { AuthAdminController } from './controllers/auth.admin.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { EventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AdminLocalStrategy } from './strategies/admin.local.strategy';
import { JwtAdminRefreshStrategy } from './strategies/jwt-admin-refresh.strategy';
import { AuthCommonService } from './services/auth-common.service';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';

@Module({
  imports: [
    UtilsModule,
    UserModule,
    CqrsModule,
    PassportModule,
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
    ...EventHandlers,
  ],
  controllers: [AuthController, AuthAdminController],
})
export class AuthModule {}
