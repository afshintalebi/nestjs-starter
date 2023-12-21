import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminService } from './auth-admin.service';
import {
  getAuthModuleTestConfigs,
  stopMongoDbServer,
} from '../../../../test/inc/test-utils';
import { ObjectId } from 'mongodb';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthCommonService } from './auth-common.service';
import { EventBus } from '@nestjs/cqrs';
import { UserService } from '@/common/user/services/user.service';
import { SignInDto } from '../dto/signin.dto';
import { UtilsService } from '@/common/utils/utils.service';

describe('AuthAdminService', () => {
  let service: AuthAdminService;
  let commonService: AuthCommonService;
  let eventBus: EventBus;
  let userService: UserService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const moduleConfigs = await getAuthModuleTestConfigs();
    const module: TestingModule = await Test.createTestingModule(
      moduleConfigs,
    ).compile();

    service = module.get<AuthAdminService>(AuthAdminService);
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

  describe('refreshToken method', () => {
    let mockFn, mockFn2;
    const userExample = { _id: new ObjectId(), isAdmin: true } as any;
    const tokenData: RefreshTokenDto = {
      refreshToken: 'klsdjf2342oi34jkldfjlkj23l4j23l4j23l4j',
    };
    const responseSample: any = { id: 'g23123', name: 'Name' };

    beforeEach(() => {
      mockFn = jest
        .spyOn(commonService, 'getUserIfRefreshTokenMatches')
        .mockResolvedValue(userExample);
      mockFn2 = jest
        .spyOn(commonService, 'getNewAccessAndRefreshToken')
        .mockResolvedValue(responseSample);
    });

    it('should be defined', () => {
      expect(service.refreshToken).toBeDefined();
    });

    it('generate refresh tokens', async () => {
      const data = await service.refreshToken(userExample, tokenData);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(data).toStrictEqual(responseSample);
    });

    it('user does not exist', async () => {
      mockFn = jest
        .spyOn(commonService, 'getUserIfRefreshTokenMatches')
        .mockResolvedValue(null);

      await expect(
        service.refreshToken(userExample, tokenData),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
    });
  });

  describe('validateUser method', () => {
    let mockFn, mockFn2, mockFn3, mockFn4;
    const userExample = { _id: new ObjectId(), isAdmin: true } as any;
    const signInData: SignInDto = {
      email: 'email@domain.com',
      password: 'a123456m',
    };

    beforeEach(() => {
      mockFn = jest
        .spyOn(commonService, 'checkUser')
        .mockResolvedValue(userExample);
      mockFn2 = jest.spyOn(commonService, 'getJwtTokens').mockResolvedValue({
        token: 'gsdfkjh3423n23kj2j3k4',
        refreshToken: 'mkj238skjdfskjrh342834',
      });
      mockFn3 = jest.spyOn(eventBus, 'publish').mockImplementation();
      mockFn4 = jest
        .spyOn(userService, 'serializeUserData')
        .mockImplementation();
    });

    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });

    it('user does not have admin access', async () => {
      const copyUserExample = { ...userExample, ...{ isAdmin: false } };

      mockFn = jest
        .spyOn(commonService, 'checkUser')
        .mockResolvedValue(copyUserExample);

      await expect(service.validateUser(signInData)).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
    });

    it('should be defined', async () => {
      await service.validateUser(signInData);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
    });
  });

  describe('signOut method', () => {
    it('should be defined', () => {
      expect(service.signOut).toBeDefined();
    });

    it('sign out user', async () => {
      const userExample = { _id: new ObjectId(), isAdmin: true } as any;

      const mockFn = jest
        .spyOn(commonService, 'emptyRefreshToken')
        .mockImplementation();
      const mockFn2 = jest
        .spyOn(utilsService, 'getGeneralResponse')
        .mockImplementation();

      await service.signOut(userExample);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });
  });
});
