import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { getDefaultImportsOfAppModule } from '@/../test/test-utils';
import { UserAdminService } from '../services/user.admin.service';
import { UserService } from '../services/user.service';
import { UtilsModule } from '@/common/utils/utils.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ChangePasswordDto } from '../dto/change-password.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...getDefaultImportsOfAppModule(), CqrsModule, UtilsModule],
      controllers: [UserController],
      providers: [UserService, UserAdminService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('changePassword method', () => {
    it('should be defined', () => {
      expect(controller.changePassword).toBeDefined();
    });

    it('should be run correctly', async () => {
      const reqData: any = {
        user: {
          id: 'id1',
        },
      };
      const bodyData: ChangePasswordDto = {
        currentPassword: '123456',
        newPassword: '987654321',
      };

      const mockFn = jest.spyOn(service, 'updatePassword').mockResolvedValue({
        result: true,
      });

      await controller.changePassword(reqData, bodyData);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfile method', () => {
    it('should be defined', () => {
      expect(controller.getProfile).toBeDefined();
    });

    it('should be run correctly', async () => {
      const reqData: any = {
        user: {
          id: 'id1',
        },
      };

      const mockFn = jest
        .spyOn(service, 'getProfile')
        .mockResolvedValue({} as any);

      await controller.getProfile(reqData);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
