import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthAdminService } from '../services/auth.admin.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(private authService: AuthAdminService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    return this.authService.validateUser({ email, password });
  }
}
