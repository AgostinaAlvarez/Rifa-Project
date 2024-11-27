/* eslint-disable no-underscore-dangle */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserInterface } from '../utils/interface/user.interface';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BCRYPT } from '../bcrypt/bcrypt.const';
import { Bcrypt } from '../bcrypt/bcrypt.provider';
import { UsersService } from '../users/users.service';
import { Role } from '../utils/enums/role.enum';
import { User } from '../users/users.model';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';

jest.mock('@nestjs/jwt');
jest.mock('../users/users.service');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let bcryptProvider: Bcrypt;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn().mockResolvedValue({
      user: {
        _id: '62279f1a1d280cd5fa047e59',
        email: 'test@test.com',
        roles: [Role.ADMIN],
      },
    }),
  };

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
            decode: jest.fn(() => 'token'),
          },
        },
        {
          provide: BCRYPT,
          useValue: {
            genSaltSync: jest.fn(),
            hashSync: jest.fn(() => 'hash'),
            compareSync: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
    usersService = authModule.get<UsersService>(UsersService);
    bcryptProvider = authModule.get<Bcrypt>(BCRYPT);
    jwtService = authModule.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(bcryptProvider).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    const email = 'test@test.com';
    const password = 'password';
    it('should return user if credentials are valid', async () => {
      const userId = new ObjectId();
      const user = {
        _id: userId,
        email: 'test@test.com',
        fullName: 'Test User',
        plan: {
          toObject: () => 'Basic Plan',
        },
        roles: [Role.FULL_USER],
        password: 'hashedPassword',
      };
      mockUserService.findByEmail.mockReturnValue(user);
      bcryptProvider.compareSync(password, user.password);
      const result = await authService.validateUser(email, password);
      expect(result).toEqual(user);
      expect(usersService.findByEmail).toHaveBeenCalledWith(email, true);
      expect(bcryptProvider.compareSync).toHaveBeenCalledWith(
        password,
        user.password,
      );
    });

    it('should throw conflict if user is a BASIC_USER', async () => {
      const user = {
        _id: new ObjectId(),
        email: 'test@test.com',
        roles: [Role.BASIC_USER],
        password: 'hashedPassword',
      };
      mockUserService.findByEmail.mockResolvedValueOnce(user);
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        new HttpException(
          'User exists but has not completed onboarding',
          HttpStatus.CONFLICT,
        ),
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(email, true);
      expect(bcryptProvider.compareSync).not.toHaveBeenCalled();
    });
    it('should return null if credentials are invalid', async () => {
      const user = {
        _id: new ObjectId(),
        email: 'test@test.com',
        roles: [Role.FULL_USER],
        password: 'hashedPassword_invalid',
      };
      mockUserService.findByEmail.mockResolvedValueOnce(user);
      jest.spyOn(bcryptProvider, 'compareSync').mockReturnValue(false);
      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith(email, true);
      expect(bcryptProvider.compareSync).toHaveBeenCalledWith(
        password,
        user.password,
      );
    });
    it('should return null if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValueOnce(null);
      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith(email, true);
      expect(bcryptProvider.compareSync).not.toHaveBeenCalled();
    });
  });

  describe('function login', () => {
    it('login user', async () => {
      const userId = new ObjectId();
      const user = {
        _id: userId,
        email: 'test@test.com',
        fullName: 'Test User',
        plan: {
          toObject: () => 'Basic Plan',
        },
        roles: [Role.ADMIN],
        password: 'Test',
      };

      const validatedUser: CreateUserResponseDto = {
        _id: userId,
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(validatedUser);

      const response = await authService.login((user as unknown) as User);
      expect(response).toBeDefined();
      expect(response.token).toBe('token');
      expect(response.fullName).toBe(user.fullName);
      expect(response.plan).toBe('Basic Plan');
    });
  });

  describe('logout', () => {
    it('Decode function', async () => {
      const userDecode: UserInterface = {
        _id: '62279f1a1d280cd5fa047e59',
        email: 'test@test.com',
        roles: [Role.ADMIN],
      };

      const response = await authService.logout(userDecode);

      expect(response).toBeUndefined();
    });
  });

  describe('validate-token', () => {
    it('Should return user', async () => {
      const user: UserInterface = {
        _id: '62279f1a1d280cd5fa047e59',
        email: 'test@test.com',
        roles: [Role.ADMIN],
      };

      const response = await authService.validateToken(user);

      expect(response._id).toEqual('62279f1a1d280cd5fa047e59');
      expect(response.email).toEqual('test@test.com');
      expect(response.roles).toEqual([Role.ADMIN]);
    });
    it('should throw an error if user does not exist', async () => {
      const user: UserInterface = {
        _id: '62279f1a1d280cd5fa047e59',
        email: 'nonexistent@test.com',
        roles: [Role.ADMIN],
      };
      mockUserService.findByEmail.mockResolvedValueOnce(null);
      await expect(authService.validateToken(user)).rejects.toThrow(
        new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
    });
  });
  describe('sign', () => {
    it('should sign the user and return a token', () => {
      const user: User = {
        _id: new ObjectId(),
        email: 'test@test.com',
        roles: [Role.ADMIN],
      };
      const token = authService.sign(user);
      expect(jwtService.sign).toHaveBeenCalledWith(user);
      expect(token).toBe('token');
    });
  });
});
