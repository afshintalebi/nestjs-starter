import { UserService } from '@/common/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dto/signin.dto';
import { UserEntity } from '@/shared/entities/user.entity';
import { EventBus } from '@nestjs/cqrs';
import { AfterSignInEvent } from '../events/impl/after-signin.event';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthCommonService } from './auth-common.service';
import { UtilsService } from '@/common/utils/utils.service';
import { GeneralResponse } from '@/shared/entities/general-response';
import { SignUpDto } from '../../../shared/dto/signup.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetPasswordEntity } from '../entities/reset-password.entity';
import { AfterResetPasswordEvent } from '../events/impl/after-reset-password.event';
import { ConfirmResetPasswordDto } from '../dto/confirm-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
    private readonly commonService: AuthCommonService,
  ) {}

  async validateUser({ email, password }: SignInDto): Promise<UserEntity> {
    const user = await this.commonService.checkUser(email, password);

    // tokens
    const { token, refreshToken } = await this.commonService.getJwtTokens(user);

    // trigger event
    this.eventBus.publish(
      new AfterSignInEvent(user._id.toHexString(), refreshToken),
    );

    return this.userService.serializeUserData(user, token, refreshToken);
  }

  async refreshToken(
    user: UserEntity,
    { refreshToken }: RefreshTokenDto,
  ): Promise<UserEntity> {
    const userInfo = await this.commonService.getUserIfRefreshTokenMatches(
      refreshToken,
      user.email,
    );

    if (userInfo) {
      return this.commonService.getNewAccessAndRefreshToken(userInfo);
    } else {
      throw new UnauthorizedException();
    }
  }

  async signOut(user: UserEntity): Promise<GeneralResponse> {
    this.commonService.emptyRefreshToken(user.id);

    return this.utilsService.getGeneralResponse(true);
  }

  async createUser(data: SignUpDto) {
    await this.userService.create(data);

    return this.utilsService.getGeneralResponse(true);
  }

  async resetPassword({
    email,
  }: ResetPasswordDto): Promise<ResetPasswordEntity> {
    const { userId, code } = await this.userService.resetPassword(email);

    // trigger event
    this.eventBus.publish(new AfterResetPasswordEvent(userId, email, code));

    return {
      ...this.utilsService.getGeneralResponse(true),
      code:
        this.utilsService.isDevelopmentEnv() || this.utilsService.isStagingEnv()
          ? code
          : undefined,
    };
  }

  async confirmResetPassword({
    email,
    code,
    password,
  }: ConfirmResetPasswordDto): Promise<GeneralResponse> {
    await this.userService.confirmResetPassword(email, code, password);

    return this.utilsService.getGeneralResponse(true);
  }
}
