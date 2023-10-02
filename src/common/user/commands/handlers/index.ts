import { CreateAdminHandler } from './create-admin.handler';
import { SignUpUserHandler } from './signup-user.handler';
import { UpdateUserHandler } from './update-user.handler';

export const CommandHandlers = [
  SignUpUserHandler,
  UpdateUserHandler,
  CreateAdminHandler,
];
