import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { userId, data } = command;

    return this.model.findByIdAndUpdate(userId, data, { new: true });
  }
}
