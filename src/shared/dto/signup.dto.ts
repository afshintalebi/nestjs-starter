import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

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
