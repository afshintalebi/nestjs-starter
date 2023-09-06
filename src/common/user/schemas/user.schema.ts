import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserResetPassword } from './reset-password.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({})
  email: string;

  @Prop({})
  name: string;

  @Prop({})
  password: string;

  @Prop({})
  refreshToken?: string;

  @Prop({})
  adminRefreshToken?: string;

  @Prop({
    type: UserResetPassword,
  })
  resetPassword?: UserResetPassword;

  @Prop({ default: false })
  isAdmin?: boolean;

  @Prop({})
  createdAt?: string;

  @Prop({})
  updatedAt?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
