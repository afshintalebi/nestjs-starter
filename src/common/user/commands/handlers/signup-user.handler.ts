import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpUserCommand } from '../impl/signup-user.command';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';

@CommandHandler(SignUpUserCommand)
export class SignUpUserHandler implements ICommandHandler<SignUpUserCommand> {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async execute(command: SignUpUserCommand): Promise<User> {
    const {
      data: { email, name, password },
    } = command;

    const user = new this.model();
    user.email = email;
    user.name = name;
    user.password = password;

    return user.save();
  }
}
