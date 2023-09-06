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
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;

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
