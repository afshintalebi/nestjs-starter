import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { CreateAdminCommand } from '../impl/create-admin.command';

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async execute(command: CreateAdminCommand): Promise<User> {
    const {
      data: { email, name, password, isAdmin },
    } = command;

    const user = new this.model();
    user.email = email;
    user.name = name;
    user.password = password;
    user.isAdmin = isAdmin;

    return user.save();
  }
}
