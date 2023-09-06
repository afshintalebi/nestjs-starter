import { IsDefined, IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refreshToken: string;
}
