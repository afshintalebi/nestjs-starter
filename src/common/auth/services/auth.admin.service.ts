import { UserEntity } from '@/shared/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UserService } from '@/common/user/services/user.service';
import { SignInDto } from '../dto/signin.dto';
import { EventBus } from '@nestjs/cqrs';
import { AfterAdminSignInEvent } from '../events/impl/after-admin-signin.event';
import { AuthCommonService } from './auth-common.service';
import { GeneralResponse } from '@/shared/entities/general-response';
import { UtilsService } from '@/common/utils/utils.service';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commonService: AuthCommonService,
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
  ) {}

  async refreshToken(
    user: UserEntity,
    { refreshToken }: RefreshTokenDto,
  ): Promise<UserEntity> {
    const userInfo = await this.commonService.getUserIfRefreshTokenMatches(
      refreshToken,
      user.email,
      true,
    );

    if (userInfo) {
      return this.commonService.getNewAccessAndRefreshToken(userInfo, true);
    } else {
      throw new UnauthorizedException();
    }
  }

  async validateUser({ email, password }: SignInDto): Promise<UserEntity> {
    const user = await this.commonService.checkUser(email, password);

    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }

    // tokens
    const { token, refreshToken } = await this.commonService.getJwtTokens(
      user,
      true,
    );

    // trigger event
    this.eventBus.publish(
      new AfterAdminSignInEvent(user._id.toHexString(), refreshToken),
    );

    return this.userService.serializeUserData(user, token, refreshToken, true);
  }

  async signOut(user: UserEntity): Promise<GeneralResponse> {
    this.commonService.emptyRefreshToken(user.id, true);

    return this.utilsService.getGeneralResponse(true);
  }
}
