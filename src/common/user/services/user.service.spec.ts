import { ObjectId } from 'mongodb';
import { Test, TestingModule } from '@nestjs/testing';
import { getUserModuleTestConfigs } from 'test/inc/test-utils';
import { UserService } from '../services/user.service';
import { SignUpDto } from '@/shared/dto/signup.dto';
import { UtilsService } from '@/common/utils/utils.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from '../dto/change-password.dto';

describe('UserService', () => {
  let service: UserService;
  let configService: ConfigService;
  let utilsService: UtilsService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      getUserModuleTestConfigs(),
    ).compile();

    service = module.get<UserService>(UserService);
    utilsService = module.get<UtilsService>(UtilsService);
    configService = module.get<ConfigService>(ConfigService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create method', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should be run correctly', async () => {
      const bodyData: SignUpDto = {
        email: 'sample@domain.com',
        name: 'Sample',
        password: 'password123456',
      };

      const mockFn = jest
        .spyOn(service, 'checkEmailExist')
        .mockImplementation();
      const mockFn2 = jest
        .spyOn(utilsService, 'bcrypeHash')
        .mockImplementation();
      const mockFn3 = jest.spyOn(commandBus, 'execute').mockImplementation();
      const mockFn4 = jest
        .spyOn(service, 'serializeUserData')
        .mockImplementation();

      await service.create(bodyData);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
    });
  });

  describe('checkEmailExist method', () => {
    it('should be defined', () => {
      expect(service.checkEmailExist).toBeDefined();
    });

    it("email doesn't exist", async () => {
      const mockFn = jest.spyOn(service, 'getUser').mockResolvedValue(null);
      const mockFn2 = jest.spyOn(utilsService, 't').mockImplementation();

      await service.checkEmailExist('sample@domain.com');

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
    });

    it('email exist and should throw bad request exception', async () => {
      const mockFn = jest
        .spyOn(service, 'getUser')
        .mockResolvedValue({ id: 'asdasd' } as any);
      const mockFn2 = jest.spyOn(utilsService, 't').mockImplementation();

      await expect(
        service.checkEmailExist('sample@domain.com'),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });
  });

  describe('getUserByEmail method', () => {
    it('should be defined', () => {
      expect(service.getUserByEmail).toBeDefined();
    });

    it('return user', async () => {
      const userExample = { id: 'id34' } as any;

      const mockFn = jest
        .spyOn(service, 'getUser')
        .mockResolvedValue(userExample);

      const user = await service.getUserByEmail('sample@domain.com');

      expect(user).toStrictEqual(userExample);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('getUserById method', () => {
    it('should be defined', () => {
      expect(service.getUserById).toBeDefined();
    });

    it('return user', async () => {
      const userExample = { id: 'id34' } as any;
      const expectedFuncArg = { _id: userExample.id };

      const mockFn = jest
        .spyOn(service, 'getUser')
        .mockResolvedValue(userExample);

      const user = await service.getUserById(userExample.id);

      expect(user).toStrictEqual(userExample);
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn.mock.calls[0][0]).toStrictEqual(expectedFuncArg);
    });
  });

  describe('getUser method', () => {
    it('should be defined', () => {
      expect(service.getUser).toBeDefined();
    });

    it('return user', async () => {
      const userExample = { id: new ObjectId() } as any;
      const conditions = { _id: userExample.id };

      const mockFn = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userExample);

      const user = await service.getUser(conditions);

      expect(user).toStrictEqual(userExample);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('updateUser method', () => {
    it('should be defined', () => {
      expect(service.updateUser).toBeDefined();
    });

    it('update user', async () => {
      const userExample = { id: 'id34' } as any;
      const dataExample = { nme: 'name' };

      const mockFn = jest.spyOn(commandBus, 'execute').mockImplementation();

      await service.updateUser(userExample.id, dataExample);

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('getProfile method', () => {
    it('should be defined', () => {
      expect(service.getProfile).toBeDefined();
    });

    it('get user profile', async () => {
      const userExample = { id: 'id34' } as any;

      const mockFn = jest
        .spyOn(service, 'getUserById')
        .mockResolvedValue(userExample);
      const mockFn2 = jest
        .spyOn(service, 'serializeUserData')
        .mockImplementation();

      await service.getProfile(userExample.id);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });
  });

  describe('resetPassword method', () => {
    const userExample = { _id: new ObjectId() } as any;
    const emailExample = 'email@example.com';
    const codeExample = 372842;
    let mockFn, mockFn2, mockFn3, mockFn4;
    beforeEach(() => {
      mockFn2 = jest
        .spyOn(utilsService, 'generateNumericalCode')
        .mockReturnValue(codeExample);
      mockFn3 = jest.spyOn(utilsService, 't').mockImplementation();
      mockFn4 = jest
        .spyOn(service, 'saveResetPasswordData')
        .mockImplementation();
    });

    it('should be defined', () => {
      expect(service.resetPassword).toBeDefined();
    });

    it('reset user passsword', async () => {
      mockFn = jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValue(userExample);

      const response = await service.resetPassword(emailExample);

      expect(response).toStrictEqual({
        userId: userExample._id.toHexString(),
        code: codeExample.toString(),
      });
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
    });

    it("user doesn't exist", async () => {
      mockFn = jest.spyOn(service, 'getUserByEmail').mockResolvedValue(null);

      await expect(service.resetPassword(emailExample)).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
    });
  });

  describe('confirmResetPassword method', () => {
    const userExample = {
      _id: new ObjectId(),
      resetPassword: { code: '12423' },
    } as any;
    const emailExample = 'email@example.com';
    const codeExample = '372842';
    const passwordExample = '12345678';
    let mockFn, mockFn2, mockFn3, mockFn4, mockFn5, mockFn6, mockFn7;
    beforeEach(() => {
      mockFn = jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValue(userExample);
      mockFn2 = jest.spyOn(utilsService, 'isAfterDate').mockReturnValue(false);
      mockFn3 = jest.spyOn(utilsService, 'matchValue').mockReturnValue(true);
      mockFn4 = jest
        .spyOn(utilsService, 'bcrypeHash')
        .mockResolvedValue('sdfj234jl23');
      mockFn5 = jest.spyOn(utilsService, 't').mockImplementation();
      mockFn6 = jest.spyOn(service, 'getUserNotFoundMsg').mockImplementation();
      mockFn7 = jest.spyOn(service, 'updateUser').mockImplementation();
    });

    it('should be defined', () => {
      expect(service.confirmResetPassword).toBeDefined();
    });

    it("user doesn't exist and throw error", async () => {
      mockFn = jest.spyOn(service, 'getUserByEmail').mockResolvedValue(null);

      await expect(
        service.confirmResetPassword(
          emailExample,
          codeExample,
          passwordExample,
        ),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
      expect(mockFn5).not.toHaveBeenCalled();
      expect(mockFn6).toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('there is no confirm code to set new password', async () => {
      const newUserExample = { ...userExample };
      delete newUserExample.resetPassword;

      mockFn = jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValue(newUserExample);

      await expect(
        service.confirmResetPassword(
          emailExample,
          codeExample,
          passwordExample,
        ),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
      expect(mockFn5).not.toHaveBeenCalled();
      expect(mockFn6).toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('code is expired', async () => {
      const newUserExample = { ...userExample };
      delete newUserExample.resetPassword;

      mockFn2 = jest.spyOn(utilsService, 'isAfterDate').mockReturnValue(true);

      await expect(
        service.confirmResetPassword(
          emailExample,
          codeExample,
          passwordExample,
        ),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
      expect(mockFn5).toHaveBeenCalled();
      expect(mockFn6).not.toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('code did not match', async () => {
      const newUserExample = { ...userExample };
      delete newUserExample.resetPassword;

      mockFn2 = jest.spyOn(utilsService, 'matchValue').mockReturnValue(false);

      await expect(
        service.confirmResetPassword(
          emailExample,
          codeExample,
          passwordExample,
        ),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
      expect(mockFn5).toHaveBeenCalled();
      expect(mockFn6).not.toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('reset password and set new one', async () => {
      await service.confirmResetPassword(
        emailExample,
        codeExample,
        passwordExample,
      );

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
      expect(mockFn5).not.toHaveBeenCalled();
      expect(mockFn6).not.toHaveBeenCalled();
      expect(mockFn7).toHaveBeenCalled();
    });
  });

  describe('saveResetPasswordData method', () => {
    const userExample = { _id: new ObjectId() } as any;
    const codeExample = '372842';

    it('should be defined', () => {
      expect(service.saveResetPasswordData).toBeDefined();
    });

    it('save reset password code', async () => {
      const mockFn = jest.spyOn(utilsService, 'hashValue').mockImplementation();
      const mockFn2 = jest.spyOn(utilsService, 'getTime').mockImplementation();
      const mockFn3 = jest.spyOn(configService, 'get').mockImplementation();
      const mockFn4 = jest.spyOn(service, 'updateUser').mockImplementation();

      await service.saveResetPasswordData(
        userExample._id.toHexString(),
        codeExample,
      );

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
    });
  });

  describe('updatePassword method', () => {
    const userExample = { _id: new ObjectId() } as any;
    const passwords: ChangePasswordDto = {
      currentPassword: '654321',
      newPassword: '123456',
    };
    let mockFn, mockFn2, mockFn3, mockFn4, mockFn5, mockFn6, mockFn7;

    beforeEach(() => {
      mockFn = jest
        .spyOn(service, 'getUserById')
        .mockResolvedValue(userExample);
      mockFn2 = jest.spyOn(utilsService, 't').mockImplementation();
      mockFn3 = jest.spyOn(service, 'getUserNotFoundMsg').mockImplementation();
      mockFn4 = jest
        .spyOn(utilsService, 'compareBcrypeHash')
        .mockResolvedValue(true);
      mockFn5 = jest.spyOn(utilsService, 'bcrypeHash').mockImplementation();
      mockFn6 = jest.spyOn(service, 'updateUser').mockImplementation();
      mockFn7 = jest
        .spyOn(utilsService, 'getGeneralResponse')
        .mockImplementation();
    });

    it('should be defined', () => {
      expect(service.updatePassword).toBeDefined();
    });

    it('current passowrd must not be same with new password', async () => {
      const newPasswords = { ...passwords };
      newPasswords.currentPassword = '123456';

      await expect(
        service.updatePassword(userExample._id.toHexString(), newPasswords),
      ).rejects.toThrow();

      expect(mockFn).not.toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
      expect(mockFn5).not.toHaveBeenCalled();
      expect(mockFn6).not.toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('user did not exist', async () => {
      mockFn = jest.spyOn(service, 'getUserById').mockResolvedValue(null);

      await expect(
        service.updatePassword(userExample._id.toHexString(), passwords),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).toHaveBeenCalled();
      expect(mockFn4).not.toHaveBeenCalled();
      expect(mockFn5).not.toHaveBeenCalled();
      expect(mockFn6).not.toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('current password of user is wrong', async () => {
      mockFn4 = jest
        .spyOn(utilsService, 'compareBcrypeHash')
        .mockResolvedValue(false);

      await expect(
        service.updatePassword(userExample._id.toHexString(), passwords),
      ).rejects.toThrow();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
      expect(mockFn5).not.toHaveBeenCalled();
      expect(mockFn6).not.toHaveBeenCalled();
      expect(mockFn7).not.toHaveBeenCalled();
    });

    it('set new password', async () => {
      await service.updatePassword(userExample._id.toHexString(), passwords);

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
      expect(mockFn4).toHaveBeenCalled();
      expect(mockFn5).toHaveBeenCalled();
      expect(mockFn6).toHaveBeenCalled();
      expect(mockFn7).toHaveBeenCalled();
    });
  });

  describe('serializeUserData method', () => {
    const userExample = {
      _id: new ObjectId(),
      email: 'emailaddress@domain.com',
      name: 'Sample Name',
      isAdmin: false,
    } as any;

    it('should be defined', () => {
      expect(service.serializeUserData).toBeDefined();
    });

    it('return formatted object of the user', () => {
      const { id, email, name, isAdmin, refreshToken, token } =
        service.serializeUserData(userExample as any);

      expect(id).toBe(userExample._id.toHexString());
      expect(email).toBe(userExample.email);
      expect(name).toBe(userExample.name);
      expect(isAdmin).toBeUndefined(); // it is not in the amin mode so it's undefined
      expect(refreshToken).toBeUndefined();
      expect(token).toBeUndefined();
    });

    it('return formatted object of the admin user', () => {
      const { id, email, name, isAdmin, refreshToken, token } =
        service.serializeUserData(userExample as any, '', '', true);

      expect(id).toBe(userExample._id.toHexString());
      expect(email).toBe(userExample.email);
      expect(name).toBe(userExample.name);
      expect(isAdmin).toBe(userExample.isAdmin);
      expect(refreshToken).toBeFalsy();
      expect(token).toBeFalsy();
    });

    it('return formatted object of the admin user with the tokens', () => {
      const tokenExample = 'user JWT token';
      const refreshTokenExample = 'user refresh token';
      const { id, email, name, isAdmin, refreshToken, token } =
        service.serializeUserData(
          userExample as any,
          tokenExample,
          refreshTokenExample,
          true,
        );

      expect(id).toBe(userExample._id.toHexString());
      expect(email).toBe(userExample.email);
      expect(name).toBe(userExample.name);
      expect(isAdmin).toBe(userExample.isAdmin);
      expect(refreshToken).toBe(refreshTokenExample);
      expect(token).toBe(tokenExample);
    });
  });

  describe('getUserEntityType method', () => {
    it('should be defined', () => {
      expect(service.getUserEntityType).toBeDefined();
    });
  });

  describe('getUserNotFoundMsg method', () => {
    it('should be defined', () => {
      expect(service.getUserNotFoundMsg).toBeDefined();
    });

    it('should return message', () => {
      const mockFn = jest.spyOn(utilsService, 't').mockImplementation();

      service.getUserNotFoundMsg();

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
