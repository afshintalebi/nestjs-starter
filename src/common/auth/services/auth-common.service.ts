import { UserDocument } from '@/common/user/schemas/user.schema';
import { UserService } from '@/common/user/services/user.service';
import { UtilsService } from '@/common/utils/utils.service';
import { UserEntity } from '@/shared/entities/user.entity';
import {
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayloadInterface } from '../types/jwt-payload.interface';
import { SignInPayloadInterface } from '../types/signin.payload';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokensInterface } from '../types/jwt-tokens.interface';
import * as AdminData from '../json/admin.json';

@Injectable()
export class AuthCommonService implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  onApplicationBootstrap() {
    this.initialAdminUser();
  }

  // TODO add unit test
  async initialAdminUser() {
    const { email, name, password } = AdminData;

    const adminUser = await this.userService.getUserByEmail(email);

    if (!adminUser) {
      this.userService.createAdmin({
        email,
        name,
        password,
      });
    }
  }

  async checkUser(email: string, password: string): Promise<UserDocument> {
    const throwError = () => {
      throw new UnauthorizedException(
        this.utilsService.t('errors.INVALID_AUTHENTICATION'),
      );
    };

    // check email & password
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throwError();
    }

    // check password
    const isValidPassword = await this.utilsService.compareBcrypeHash(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throwError();
    }

    return user;
  }

  async getJwtTokens(
    user: UserDocument,
    isAdmin = false,
  ): Promise<JwtTokensInterface> {
    const jwtPayload = this.getJwtPayload({
      name: user.name,
      email: user.email,
      isAdmin,
    });

    const token = await this.getJwtToken(jwtPayload);

    const refreshToken = await this.getRefreshToken(jwtPayload, isAdmin);

    return {
      token,
      refreshToken,
    };
  }

  async emptyRefreshToken(userId: string, isAdmin = false) {
    const fieldName = isAdmin ? 'adminRefreshToken' : 'refreshToken';
    return this.userService.updateUser(userId, {
      [fieldName]: null,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    email: string,
    isAdmin = false,
  ) {
    const refreshTokenFieldName = isAdmin
      ? 'adminRefreshToken'
      : 'refreshToken';

    const user = await this.userService.getUserByEmail(email);
    if (!user[refreshTokenFieldName]) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenMatching = await this.utilsService.matchValue(
      refreshToken,
      user[refreshTokenFieldName],
    );

    if (isRefreshTokenMatching) {
      await this.emptyRefreshToken(user._id.toHexString(), isAdmin);
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  async getNewAccessAndRefreshToken(
    user: UserDocument,
    isAdmin = false,
  ): Promise<UserEntity> {
    const payload: JwtPayloadInterface = this.getJwtPayload({
      email: user.email,
      name: user.name,
      isAdmin,
    });
    const token = await this.getJwtToken(payload);

    const refreshToken = await this.getRefreshToken(payload, isAdmin);

    await this.updateRefreshToken(
      user._id.toHexString(),
      refreshToken,
      isAdmin,
    );

    return this.userService.serializeUserData(
      user,
      token,
      refreshToken,
      isAdmin,
    );
  }

  getJwtPayload({
    email,
    name,
    isAdmin = false,
  }: SignInPayloadInterface): SignInPayloadInterface {
    return {
      email,
      name,
      isAdmin: isAdmin || undefined,
    };
  }

  async getJwtToken(payload: JwtPayloadInterface) {
    return this.jwtService.signAsync(payload);
  }

  async getRefreshToken(payload: JwtPayloadInterface, isAdmin = false) {
    return this.jwtService.signAsync(
      payload,
      this.getRefreshTokenOptions(isAdmin),
    );
  }

  getRefreshTokenOptions(isAdmin = false): JwtSignOptions {
    const secretKey = isAdmin
      ? 'jwt.refreshTokenSecretKey'
      : 'jwt.refreshTokenSecretKey';
    const expireTime = isAdmin
      ? 'jwt.refreshTokenExpireTime'
      : 'jwt.refreshTokenExpireTime';
    const options: JwtSignOptions = {
      secret: this.configService.get(secretKey),
    };
    const expiration: string = this.configService.get(expireTime);

    if (expiration) {
      options.expiresIn = expiration;
    }

    return options;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    isAdmin = false,
  ) {
    const fieldName = isAdmin ? 'adminRefreshToken' : 'refreshToken';
    return this.userService.updateUser(userId, {
      [fieldName]: this.utilsService.hashValue(refreshToken),
    });
  }
}
