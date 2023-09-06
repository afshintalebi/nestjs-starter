import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminRefreshTokenGuard extends AuthGuard(
  'jwt-admin-refresh-token',
) {}
