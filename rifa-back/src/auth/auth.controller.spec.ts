import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Role } from '../utils/enums/role.enum';

jest.mock('./auth.service');

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
    authController = authModule.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('function login', () => {
    it('login user', async () => {
      const req = {
        user: {
          email: 'test@test.com',
          password: 'string',
        },
      };

      const spy = jest.spyOn(authService, 'login');

      await authController.login(req);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function validateToken', () => {
    it('Should call the validateToken function in service', async () => {
      const userDecorator = {
        email: 'test@test.com',
        roles: [Role.ADMIN],
        _id: '222313213123',
      };
      const spy = jest.spyOn(authService, 'validateToken');

      await authController.validateToken(userDecorator);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function logout', () => {
    it('logout user', async () => {
      const userDecorator = {
        email: 'test@test.com',
        roles: [Role.ADMIN],
        _id: '222313213123',
      };
      const spy = jest.spyOn(authService, 'logout');

      await authController.logout(userDecorator);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
