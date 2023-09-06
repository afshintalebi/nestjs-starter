import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { GeneralResponse } from '@/shared/entities/general-response';
import { JwtAuthenticationGuard } from '@/shared/guards/auth.guard';
import { RequestInterface } from '@/shared/types/request.interface';
import { UserEntity } from '@/shared/entities/user.entity';

@ApiTags('client', 'user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Patch('change-password')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @Req() { user }: RequestInterface,
    @Body() data: ChangePasswordDto,
  ): Promise<GeneralResponse> {
    return this.service.updatePassword(user.id, data);
  }

  @Get('profile')
  @UseGuards(JwtAuthenticationGuard)
  async getProfile(@Req() { user }: RequestInterface): Promise<UserEntity> {
    return this.service.getProfile(user.id);
  }
}
