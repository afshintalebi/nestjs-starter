import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminAuthenticationGuard extends AuthGuard('jwt-admin') {}
