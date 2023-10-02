import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refreshToken: string;
}
