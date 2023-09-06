import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserResetPasswordDocument = HydratedDocument<UserResetPassword>;

@Schema({
  _id: false,
  versionKey: false,
})
export class UserResetPassword {
  @Prop({})
  code: string;

  @Prop({})
  expireAt: string;
}

export const UserResetPasswordSchema =
  SchemaFactory.createForClass(UserResetPassword);
