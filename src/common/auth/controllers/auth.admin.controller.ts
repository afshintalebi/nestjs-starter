import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ADMIN_CONTROLLER_KEY } from '../../../shared/configs/constants';
import { AuthGuard } from '@nestjs/passport';
import { RequestInterface } from '@/shared/types/request.interface';
import { UserEntity } from '@/shared/entities/user.entity';
import { JwtAdminRefreshTokenGuard } from '../guards/auth-admin-refresh-token.guard';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthAdminService } from '../services/auth.admin.service';
import { JwtAdminAuthenticationGuard } from '@/shared/guards/admin-auth.guard';
import { GeneralResponse } from '@/shared/entities/general-response';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('admin', 'auth')
@ApiResponse({
  status: 201,
  description: 'The record has been successfully created.',
})
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 401, description: 'UnAuthenticated or UnAuthorized' })
@ApiResponse({ status: 404, description: 'Not found' })
@Controller({
  path: `${ADMIN_CONTROLLER_KEY}/auth`,
  version: '',
})
export class AuthAdminController {
  constructor(private readonly service: AuthAdminService) {}

  @UseGuards(AuthGuard('admin-local'))
  @Post('sign-in')
  async signIn(@Req() req: RequestInterface): Promise<UserEntity> {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @GetUser() user: UserEntity,
    @Body() data: RefreshTokenDto,
  ): Promise<UserEntity> {
    return this.service.refreshToken(user, data);
  }

  @ApiBearerAuth()
  @Get('sign-out')
  @UseGuards(JwtAdminAuthenticationGuard)
  async signOut(@GetUser() user: UserEntity): Promise<GeneralResponse> {
    return this.service.signOut(user);
  }
}
