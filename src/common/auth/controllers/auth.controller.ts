import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '@/shared/entities/user.entity';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { JwtRefreshTokenGuard } from '@/common/auth/guards/auth-refresh-token.guard';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthenticationGuard } from '@/shared/guards/auth.guard';
import { GeneralResponse } from '@/shared/entities/general-response';
import { AuthGuard } from '@nestjs/passport';
import { RequestInterface } from '@/shared/types/request.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from '../../../shared/dto/signup.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ConfirmResetPasswordDto } from '../dto/confirm-reset-password.dto';
import { SignInDto } from '../dto/signin.dto';

@ApiTags('client', 'auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiBody({ type: SignInDto })
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signIn(@Req() req: RequestInterface): Promise<UserEntity> {
    return req.user;
  }

  @Get('sign-out')
  @UseGuards(JwtAuthenticationGuard)
  async signOut(@GetUser() user: UserEntity): Promise<GeneralResponse> {
    return this.service.signOut(user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @GetUser() user: UserEntity,
    @Body() data: RefreshTokenDto,
  ): Promise<UserEntity> {
    return this.service.refreshToken(user, data);
  }

  @Post('sign-up')
  async signUp(@Body() data: SignUpDto): Promise<GeneralResponse> {
    return this.service.createUser(data);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() data: ResetPasswordDto,
  ): Promise<GeneralResponse> {
    return this.service.resetPassword(data);
  }

  @Patch('reset-password/confirm')
  async confirmResetPassword(
    @Body() data: ConfirmResetPasswordDto,
  ): Promise<GeneralResponse> {
    return this.service.confirmResetPassword(data);
  }
}
