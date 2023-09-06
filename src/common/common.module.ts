import { Module } from '@nestjs/common';
import { HealthModule } from '../core/health/health.module';
import { UtilsModule } from './utils/utils.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HealthModule, UtilsModule, UserModule, AuthModule],
  exports: [UtilsModule],
})
export class CommonModule {}
