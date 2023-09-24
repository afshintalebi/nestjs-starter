import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { AuthCommonService } from './auth-common.service';
import { UserService } from '@/common/user/services/user.service';
import { UtilsService } from '@/common/utils/utils.service';
import {
  getAuthModuleTestConfigs,
  stopMongoDbServer,
} from '@/../test/test-utils';
import { JwtService } from '@nestjs/jwt';

describe('AuthCommonService', () => {
  let service: AuthCommonService;
  let userService: UserService;
  let utilsService: UtilsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleConfigs = await getAuthModuleTestConfigs();
    const module: TestingModule = await Test.createTestingModule(
      moduleConfigs,
    ).compile();

    service = module.get<AuthCommonService>(AuthCommonService);
    userService = module.get<UserService>(UserService);
    utilsService = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await stopMongoDbServer();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkUser method', () => {
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
    };
    const passwordSample = 'pass1234';
    let mockFn, mockFn2;

    beforeEach(() => {
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(userExample);
      mockFn2 = jest
        .spyOn(utilsService, 'compareBcrypeHash')
        .mockResolvedValue(true);
    });

    it('should be defined', async () => {
      expect(service.checkUser).toBeDefined();
    });

    it('email does not exist', async () => {
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(null);

      await expect(
        service.checkUser(userExample.email, passwordSample),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
    });

    it('password is wrong', async () => {
      mockFn2 = jest
        .spyOn(utilsService, 'compareBcrypeHash')
        .mockResolvedValue(false);

      await expect(
        service.checkUser(userExample.email, passwordSample),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });

    it('email and password is correct', async () => {
      await service.checkUser(userExample.email, passwordSample);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });
  });

  describe('getJwtTokens method', () => {
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
      isAdmin: false,
    };
    let mockFn, mockFn2, mockFn3;

    beforeEach(() => {
      mockFn = jest.spyOn(service, 'getJwtPayload').mockImplementation();
      mockFn2 = jest
        .spyOn(service, 'getJwtToken')
        .mockResolvedValue('user JWT token');
      mockFn3 = jest
        .spyOn(service, 'getRefreshToken')
        .mockResolvedValue('user refresh token');
    });

    it('should be defined', async () => {
      expect(service.getJwtTokens).toBeDefined();
    });

    it('get JWT tokens', async () => {
      const tokens = await service.getJwtTokens(
        userExample,
        userExample.isAdmin,
      );

      expect(tokens.token).toBeDefined();
      expect(tokens.token).toBeTruthy();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.refreshToken).toBeTruthy();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
    });
  });

  describe('emptyRefreshToken method', () => {
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
      isAdmin: false,
    };
    let mockFn;

    beforeEach(() => {
      mockFn = jest.spyOn(userService, 'updateUser').mockImplementation();
    });

    it('should be defined', async () => {
      expect(service.emptyRefreshToken).toBeDefined();
    });

    it('remove refresh token of none admin user', async () => {
      const userId = userExample._id.toHexString();
      await service.emptyRefreshToken(userId, userExample.isAdmin);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toBe(userId);
      expect(mockFn.mock.calls[0][1]).toStrictEqual({ refreshToken: null });
    });

    it('remove refresh token of admin user', async () => {
      const userId = userExample._id.toHexString();
      await service.emptyRefreshToken(userId, !userExample.isAdmin);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toBe(userId);
      expect(mockFn.mock.calls[0][1]).toStrictEqual({
        adminRefreshToken: null,
      });
    });
  });

  describe('getUserIfRefreshTokenMatches method', () => {
    const adminRefreshToken = '22323';
    const refreshToken = '22323';
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
      isAdmin: true,
      adminRefreshToken,
      refreshToken,
    };
    let mockFn, mockFn2, mockFn3;

    beforeEach(() => {
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(userExample);
      mockFn2 = jest.spyOn(utilsService, 'matchValue').mockReturnValue(true);
      mockFn3 = jest.spyOn(service, 'emptyRefreshToken').mockImplementation();
    });

    it('should be defined', async () => {
      expect(service.getUserIfRefreshTokenMatches).toBeDefined();
    });

    it('user does not exist', async () => {
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(null);

      await expect(
        service.getUserIfRefreshTokenMatches(
          refreshToken,
          userExample.email,
          userExample.isAdmin,
        ),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
    });

    it('admin refresh token does not exist', async () => {
      const copyOfUser = { ...userExample };
      delete copyOfUser.adminRefreshToken;
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(copyOfUser);

      await expect(
        service.getUserIfRefreshTokenMatches(
          refreshToken,
          copyOfUser.email,
          copyOfUser.isAdmin,
        ),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
    });

    it('user refresh token does not exist', async () => {
      const copyOfUser = { ...userExample };
      delete copyOfUser.refreshToken;
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(copyOfUser);

      await expect(
        service.getUserIfRefreshTokenMatches(
          refreshToken,
          copyOfUser.email,
          !copyOfUser.isAdmin,
        ),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
    });

    it('refresh token is wrong', async () => {
      mockFn2 = jest.spyOn(utilsService, 'matchValue').mockReturnValue(false);

      await expect(
        service.getUserIfRefreshTokenMatches(
          refreshToken,
          userExample.email,
          userExample.isAdmin,
        ),
      ).rejects.toThrow();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
    });

    it('get admin user details by refresh token', async () => {
      const copyOfUser = { ...userExample };
      delete copyOfUser.refreshToken;
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(copyOfUser);

      const user = await service.getUserIfRefreshTokenMatches(
        refreshToken,
        userExample.email,
        userExample.isAdmin,
      );

      expect(user).toStrictEqual(copyOfUser);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
    });

    it('get user details by refresh token', async () => {
      const copyOfUser = { ...userExample };
      delete copyOfUser.adminRefreshToken;
      mockFn = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(copyOfUser);

      const user = await service.getUserIfRefreshTokenMatches(
        refreshToken,
        userExample.email,
        !userExample.isAdmin,
      );

      expect(user).toStrictEqual(copyOfUser);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
    });
  });

  describe('getNewAccessAndRefreshToken method', () => {
    const userExample: any = {
      _id: new ObjectId(),
      email: 'sample@domain.com',
      isAdmin: false,
    };
    let mockFn, mockFn2, mockFn3, mockFn4;

    beforeEach(() => {
      mockFn = jest.spyOn(service, 'getJwtPayload').mockImplementation();
      mockFn2 = jest
        .spyOn(service, 'getJwtToken')
        .mockResolvedValue('user JWT token');
      mockFn3 = jest
        .spyOn(service, 'getRefreshToken')
        .mockResolvedValue('user refresh token');
      mockFn4 = jest.spyOn(service, 'updateRefreshToken').mockImplementation();
    });

    it('should be defined', async () => {
      expect(service.getNewAccessAndRefreshToken).toBeDefined();
    });

    it('get new JWT and refresh tokens', async () => {
      const data = await service.getNewAccessAndRefreshToken(
        userExample,
        userExample.isAdmin,
      );

      expect(data.id).toBe(userExample._id.toHexString());
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
    });
  });

  describe('getJwtPayload method', () => {
    const userExample: any = {
      name: 'Name',
      email: 'sample@domain.com',
      isAdmin: true,
    };

    it('should be defined', async () => {
      expect(service.getJwtPayload).toBeDefined();
    });

    it('should return JWT payload', async () => {
      const data = await service.getJwtPayload(userExample);

      expect(data).toStrictEqual(data);
    });
  });

  describe('getJwtToken method', () => {
    it('should be defined', async () => {
      expect(service.getJwtToken).toBeDefined();
    });

    it('should return JWT payload', async () => {
      const tokenSample = 'jwt token';
      const jwtPayload: any = {
        name: 'Name',
        email: 'sample@domain.com',
        isAdmin: true,
      };

      const mockFn = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(tokenSample);

      const token = await service.getJwtToken(jwtPayload);

      expect(token).toBe(tokenSample);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('getRefreshToken method', () => {
    it('should be defined', async () => {
      expect(service.getRefreshToken).toBeDefined();
    });

    it('should return JWT payload', async () => {
      const tokenSample = 'jwt token';
      const jwtPayload: any = {
        name: 'Name',
        email: 'sample@domain.com',
        isAdmin: true,
      };

      const mockFn = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(tokenSample);
      const mockFn2 = jest
        .spyOn(service, 'getRefreshTokenOptions')
        .mockImplementation();

      const token = await service.getRefreshToken(
        jwtPayload,
        jwtPayload.isAdmin,
      );

      expect(token).toBe(tokenSample);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn2.mock.calls[0][0]).toBe(jwtPayload.isAdmin);
    });
  });

  describe('getRefreshTokenOptions method', () => {
    it('should be defined', async () => {
      expect(service.getRefreshTokenOptions).toBeDefined();
    });

    it('should get options', async () => {
      const options = service.getRefreshTokenOptions(true);

      expect(options.secret).toBeTruthy();
      expect(options.expiresIn).toBeTruthy();
    });
  });

  describe('updateRefreshToken method', () => {
    it('should be defined', async () => {
      expect(service.updateRefreshToken).toBeDefined();
    });

    it('should update refresh token', async () => {
      const tokenSample = 'sample token';
      const userExample: any = {
        _id: new ObjectId(),
        email: 'sample@domain.com',
        isAdmin: false,
      };
      const fieldName = userExample.isAdmin
        ? 'adminRefreshToken'
        : 'refreshToken';
      const hashedValue = 'hasedValue';
      const userId = userExample._id.toHexString();
      const funcParamSample = {
        [fieldName]: hashedValue,
      };
      const mockFn = jest.spyOn(userService, 'updateUser').mockImplementation();
      const mockFn2 = jest
        .spyOn(utilsService, 'hashValue')
        .mockReturnValue(hashedValue);

      await service.updateRefreshToken(
        userId,
        tokenSample,
        userExample.isAdmin,
      );

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toBe(userId);
      expect(mockFn.mock.calls[0][1]).toStrictEqual(funcParamSample);
    });
  });
});
