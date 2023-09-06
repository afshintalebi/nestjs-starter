import { SignUpDto } from '../../../../shared/dto/signup.dto';

export class SignUpUserCommand {
  constructor(public readonly data: SignUpDto) {}
}
