import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserAdminService } from './services/user.admin.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UtilsModule } from '../utils/utils.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [
    CqrsModule,
    UtilsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    UserAdminService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
