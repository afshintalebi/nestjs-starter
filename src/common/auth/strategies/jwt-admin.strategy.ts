import { UserService } from '@/common/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadInterface } from '../types/jwt-payload.interface';
import { UserEntity } from '@/shared/entities/user.entity';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const { email } = payload;
    const user = await this.userService.getUserByEmail(email);

    if (!user || !user.isAdmin || !user.adminRefreshToken) {
      throw new UnauthorizedException();
    }
    return this.userService.serializeUserData(user, undefined, undefined, true);
  }
}
