import { EventBus } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/common/user/services/user.service';
import { UtilsService } from '@/common/utils/utils.service';
import {
  getAuthModuleTestConfigs,
  stopMongoDbServer,
} from '../../../../test/inc/test-utils';
import { AuthService } from './auth.service';
import { AuthCommonService } from './auth-common.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

describe('AuthService', () => {
  let service: AuthService;
  let commonService: AuthCommonService;
  let eventBus: EventBus;
  let userService: UserService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const moduleConfigs = await getAuthModuleTestConfigs();
    const module: TestingModule = await Test.createTestingModule(
      moduleConfigs,
    ).compile();

    service = module.get<AuthService>(AuthService);
    commonService = module.get<AuthCommonService>(AuthCommonService);
    eventBus = module.get<EventBus>(EventBus);
    userService = module.get<UserService>(UserService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  afterEach(async () => {
    await stopMongoDbServer();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser method', () => {
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
    };
    const token = 'user token';
    const refreshToken = 'user refresh token';
    const passwordSample = 'pass1234';
    const signInData = { email: userExample.email, password: passwordSample };

    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });

    it('validate user', async () => {
      const mockFn = jest
        .spyOn(commonService, 'checkUser')
        .mockResolvedValue(userExample);
      const mockFn2 = jest
        .spyOn(commonService, 'getJwtTokens')
        .mockResolvedValue({
          token,
          refreshToken,
        });
      const mockFn3 = jest.spyOn(eventBus, 'publish').mockImplementation();
      const mockFn4 = jest
        .spyOn(userService, 'serializeUserData')
        .mockImplementation();

      await service.validateUser(signInData);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
    });
  });

  describe('refreshToken method', () => {
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
    };
    const funcData: RefreshTokenDto = { refreshToken: 'refresh token data' };
    let mockFn, mockFn2;

    beforeEach(() => {
      mockFn = jest
        .spyOn(commonService, 'getUserIfRefreshTokenMatches')
        .mockResolvedValue(userExample);
      mockFn2 = jest
        .spyOn(commonService, 'getNewAccessAndRefreshToken')
        .mockResolvedValue(userExample);
    });

    it('should be defined', () => {
      expect(service.refreshToken).toBeDefined();
    });

    it('refresh token is invalid', async () => {
      mockFn = jest
        .spyOn(commonService, 'getUserIfRefreshTokenMatches')
        .mockResolvedValue(null);

      await expect(
        service.refreshToken(userExample, funcData),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
    });

    it('create new refresh an access tokens', async () => {
      await service.refreshToken(userExample, funcData);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });
  });

  describe('signOut method', () => {
    const userExample: any = {
      id: new ObjectId().toHexString(),
      email: 'sample@domain.com',
    };

    it('should be defined', () => {
      expect(service.signOut).toBeDefined();
    });

    it('should signout user', async () => {
      const mockFn = jest
        .spyOn(commonService, 'emptyRefreshToken')
        .mockImplementation();

      const data = await service.signOut(userExample);

      expect(data).toStrictEqual(utilsService.getGeneralResponse(true));
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toBe(userExample.id);
    });
  });

  describe('createUser method', () => {
    const userExample: any = {
      id: new ObjectId().toHexString(),
      email: 'sample@domain.com',
    };

    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });

    it('should signout user', async () => {
      const mockFn = jest.spyOn(userService, 'create').mockImplementation();

      const data = await service.createUser(userExample);

      expect(data).toStrictEqual(utilsService.getGeneralResponse(true));
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toStrictEqual(userExample);
    });
  });

  describe('resetPassword method', () => {
    const userExample: any = {
      id: new ObjectId().toHexString(),
      email: 'sample@domain.com',
    };
    const resetPassSample = { userId: userExample.id, code: '2351' };
    let mockFn, mockFn2, mockFn3, mockFn4;

    beforeEach(() => {
      mockFn = jest
        .spyOn(userService, 'resetPassword')
        .mockResolvedValue(resetPassSample);
      mockFn2 = jest.spyOn(eventBus, 'publish').mockImplementation();
      mockFn3 = jest
        .spyOn(utilsService, 'isProductionEnv')
        .mockReturnValue(false);
      mockFn4 = jest.spyOn(utilsService, 'isStagingEnv').mockReturnValue(false);
    });

    it('should be defined', () => {
      expect(service.resetPassword).toBeDefined();
    });

    it('submit reset password request and return code in the development mode', async () => {
      const data = await service.resetPassword(userExample.email);

      expect(data.result).toBeTruthy();
      expect(data.code).toBe(resetPassSample.code);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
    });

    it('submit reset password request and remove code in the production mode', async () => {
      mockFn3 = jest
        .spyOn(utilsService, 'isProductionEnv')
        .mockReturnValue(true);

      const data = await service.resetPassword(userExample.email);

      expect(data.result).toBeTruthy();
      expect(data.code).toBeUndefined();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
    });
  });

  describe('confirmResetPassword method', () => {
    const confirmResetParams = {
      email: 'sample@domain.com',
      code: '873135',
      password: '123456',
    };

    it('should be defined', () => {
      expect(service.confirmResetPassword).toBeDefined();
    });

    it('should confirm reset password request', async () => {
      const mockFn = jest
        .spyOn(userService, 'confirmResetPassword')
        .mockImplementation();

      const data = await service.confirmResetPassword(confirmResetParams);

      expect(data).toStrictEqual(utilsService.getGeneralResponse(true));
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toBe(confirmResetParams.email);
      expect(mockFn.mock.calls[0][1]).toBe(confirmResetParams.code);
      expect(mockFn.mock.calls[0][2]).toBe(confirmResetParams.password);
    });
  });
});
