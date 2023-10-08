import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ConfirmResetPasswordDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;

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
        'password should be at least 6 characters and a combination of numbers, lowercase letters, uppercase letters, and a symbol',
    },
  )
  password: string;
}
