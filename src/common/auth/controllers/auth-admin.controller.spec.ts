import { UtilsService } from '@/common/utils/utils.service';
import { AuthAdminService } from '../services/auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { getAuthModuleTestConfigs } from '../../../../test/inc/test-utils';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

describe('AuthAdminController', () => {
  let controller: AuthAdminController;
  let service: AuthAdminService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      ...(await getAuthModuleTestConfigs()),
      controllers: [AuthAdminController],
    }).compile();

    controller = module.get<AuthAdminController>(AuthAdminController);
    service = module.get<AuthAdminService>(AuthAdminService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('signIn method', () => {
    it('should be defined', () => {
      expect(controller.signIn).toBeDefined();
    });

    it('should sign in and return user', async () => {
      const reqData: any = {
        user: {
          id: 'id1',
        },
      };

      const user = await controller.signIn(reqData);

      expect(user).toStrictEqual(reqData.user);
    });
  });

  describe('refreshToken method', () => {
    it('should be defined', () => {
      expect(controller.refreshToken).toBeDefined();
    });

    it('should refresh user token', async () => {
      const user: any = {
        id: 'id1',
      };
      const bodyData: RefreshTokenDto = { refreshToken: 'refresh token' };

      const mockFn = jest
        .spyOn(service, 'refreshToken')
        .mockResolvedValue(user);

      const data = await controller.refreshToken(user, bodyData);

      expect(data).toStrictEqual(user);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('signOut method', () => {
    it('should be defined', () => {
      expect(controller.signOut).toBeDefined();
    });

    it('should sign out', async () => {
      const user: any = {
        id: 'id1',
      };
      const returnResult = utilsService.getGeneralResponse(true);

      const mockFn = jest
        .spyOn(service, 'signOut')
        .mockResolvedValue(returnResult);

      const data = await controller.signOut(user);

      expect(data).toStrictEqual(returnResult);
      expect(mockFn).toHaveBeenCalled();
    });
  });
});
