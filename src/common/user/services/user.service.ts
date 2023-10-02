import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../../shared/dto/signup.dto';
import { SignUpUserCommand } from '../commands/impl/signup-user.command';
import { UtilsService } from '@/common/utils/utils.service';
import { UserEntity } from '../../../shared/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';
import { GeneralObject } from '@/shared/types/general-object';
import { GetUserQuery } from '../queries/impl';
import { UpdateUserCommand } from '../commands/impl/update-user.command';
import { GeneralResponse } from '@/shared/entities/general-response';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ResetPasswordData } from '../types/reset-password-data';
import { ConfigService } from '@nestjs/config';
import { AdminUserData } from '../types/create-admin-data';
import { CreateAdminCommand } from '../commands/impl/create-admin.command';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly utilsService: UtilsService,
    private readonly configService: ConfigService,
  ) {}

  // TODO add unit test
  async createAdmin(data: AdminUserData): Promise<UserEntity> {
    const copyOfData = { ...data };

    copyOfData.password = await this.utilsService.bcrypeHash(
      copyOfData.password,
    );

    copyOfData.isAdmin = true;

    const user = await this.commandBus.execute(
      new CreateAdminCommand(copyOfData),
    );

    return this.serializeUserData(user);
  }

  async create(data: SignUpDto): Promise<UserEntity> {
    const copyOfData = { ...data };

    await this.checkEmailExist(copyOfData.email);

    copyOfData.password = await this.utilsService.bcrypeHash(
      copyOfData.password,
    );

    const user = await this.commandBus.execute(
      new SignUpUserCommand(copyOfData),
    );

    return this.serializeUserData(user);
  }

  async checkEmailExist(email: string, ignoreId = ''): Promise<void> {
    const conditions = {
      email,
    };

    if (ignoreId) {
      conditions['id'] = { $not: ignoreId };
    }

    const user = await this.getUser(conditions);
    if (user) {
      throw new BadRequestException(this.utilsService.t('errors.EMAIL_EXISTS'));
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.getUser({ email });
  }

  async getUserById(userId: string): Promise<UserDocument> {
    const conditions = {
      _id: userId,
    };

    const user = await this.getUser(conditions);
    if (!user) {
      throw new NotFoundException(this.getUserNotFoundMsg());
    }

    return user;
  }

  async getUser(conditions: GeneralObject): Promise<UserDocument> {
    return this.queryBus.execute(new GetUserQuery(conditions));
  }

  async updateUser(userId: string, data: GeneralObject): Promise<any> {
    return this.commandBus.execute(new UpdateUserCommand(userId, data));
  }

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.getUserById(userId);

    return this.serializeUserData(user);
  }

  async resetPassword(email: string): Promise<ResetPasswordData> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(this.getUserNotFoundMsg());
    }

    const code = this.utilsService.generateNumericalCode().toString();

    await this.saveResetPasswordData(user._id.toHexString(), code);

    return {
      userId: user._id.toHexString(),
      code,
    };
  }

  async confirmResetPassword(email: string, code: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user || !user?.resetPassword?.code) {
      throw new NotFoundException(this.getUserNotFoundMsg());
    }

    if (
      this.utilsService.isAfterDate({
        comparedDate: user.resetPassword.expireAt,
      }) ||
      !this.utilsService.matchValue(code, user.resetPassword.code)
    ) {
      throw new BadRequestException(
        this.utilsService.t('errors.CODE_IS_INVALID'),
      );
    }

    const data = {
      resetPassword: {
        code: null,
        expireAt: null,
      },
      password: await this.utilsService.bcrypeHash(password),
    };
    await this.updateUser(user._id.toHexString(), data);
  }

  async saveResetPasswordData(userId: string, code: string) {
    const hashedCode = this.utilsService.hashValue(code);
    const expireAt = this.utilsService.getTime({
      plusAmount: this.configService.get('user.resetPasswordExpire'),
    });

    const data = {
      resetPassword: {
        code: hashedCode,
        expireAt,
      },
    };

    return this.updateUser(userId, data);
  }

  async updatePassword(
    userId: string,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<GeneralResponse> {
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        this.utilsService.t('errors.INVALID_CURRENT_PASSWORD'),
      );
    }

    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException(this.getUserNotFoundMsg());
    }

    if (
      !(await this.utilsService.compareBcrypeHash(
        currentPassword,
        user.password,
      ))
    ) {
      throw new BadRequestException(
        this.utilsService.t('errors.WRONG_CURRENT_PASSWORD'),
      );
    }

    const data = {
      password: await this.utilsService.bcrypeHash(newPassword),
    };
    await this.updateUser(userId, data);

    return this.utilsService.getGeneralResponse(true);
  }

  serializeUserData(
    user: UserDocument,
    token: string = undefined,
    refreshToken: string = undefined,
    isAdminMode = false,
  ): UserEntity {
    const { _id, email, name, isAdmin } = user;

    return {
      id: _id.toHexString(),
      email,
      name,
      token,
      refreshToken,
      isAdmin: isAdminMode ? isAdmin : undefined,
    };
  }

  getUserEntityType() {
    return UserEntity;
  }

  getUserNotFoundMsg(): string {
    return this.utilsService.t('errors.USER_NOT_FOUND');
  }
}
