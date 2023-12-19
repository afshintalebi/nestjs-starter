import { Test, TestingModule } from '@nestjs/testing';
import { getAuthModuleTestConfigs } from 'test/inc/test-utils';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { SignUpDto } from '@/shared/dto/signup.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ConfirmResetPasswordDto } from '../dto/confirm-reset-password.dto';
import { UtilsService } from '@/common/utils/utils.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      ...(await getAuthModuleTestConfigs()),
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
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

  describe('signUp method', () => {
    it('should be defined', () => {
      expect(controller.signUp).toBeDefined();
    });

    it('should sign up user', async () => {
      const returnResult = utilsService.getGeneralResponse(true);
      const bodyData: SignUpDto = {
        email: 'email@domain.com',
        name: 'Name',
        password: '123456',
      };

      const mockFn = jest
        .spyOn(service, 'createUser')
        .mockResolvedValue(returnResult);

      const data = await controller.signUp(bodyData);

      expect(data).toStrictEqual(returnResult);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('resetPassword method', () => {
    it('should be defined', () => {
      expect(controller.resetPassword).toBeDefined();
    });

    it('should register reset password request', async () => {
      const returnResult = utilsService.getGeneralResponse(true);
      const bodyData: ResetPasswordDto = {
        email: 'email@domain.com',
      };

      const mockFn = jest
        .spyOn(service, 'resetPassword')
        .mockResolvedValue(returnResult);

      const data = await controller.resetPassword(bodyData);

      expect(data).toStrictEqual(returnResult);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('confirmResetPassword method', () => {
    it('should be defined', () => {
      expect(controller.confirmResetPassword).toBeDefined();
    });

    it('should register reset password request', async () => {
      const returnResult = utilsService.getGeneralResponse(true);
      const bodyData: ConfirmResetPasswordDto = {
        email: 'email@domain.com',
        code: '1234',
        password: 'pass1234',
      };

      const mockFn = jest
        .spyOn(service, 'confirmResetPassword')
        .mockResolvedValue(returnResult);

      const data = await controller.confirmResetPassword(bodyData);

      expect(data).toStrictEqual(returnResult);
      expect(mockFn).toHaveBeenCalled();
    });
  });
});
