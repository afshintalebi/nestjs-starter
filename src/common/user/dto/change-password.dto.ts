import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  currentPassword: string;
  
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsStrongPassword(
    {},
    {
      message:
        'new password should be at least 6 characters and a combination of numbers, lowercase letters, uppercase letters, and a symbol',
    },
  )
  newPassword: string;
}
