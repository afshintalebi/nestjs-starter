import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetUserQuery } from '../impl';
import { User, UserDocument } from '../../schemas/user.schema';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async execute({ conditions }: GetUserQuery): Promise<UserDocument> {
    return this.model.findOne(conditions);
  }
}
