/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';
import { CaptchasService } from '../captchas/captchas.service';
import { ConfirmUserEmailRequestDto } from './dto/confirmUserEmailRequest.dto';
import { UserInterface } from '../utils/interface/user.interface';
import { Role } from '../utils/enums/role.enum';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { PasswordRecoveryRequestDto } from './dto/passwordRecoveryRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';
import { DataMercadoPagoDto } from './dto/dataMercadoPago.dto';
import { UpdateProfileRequestDto } from './dto/updateProfileRequest.dto';
import { UpdateProfilePictureRequestDto } from './dto/updateProfilePictureRequest.dto';
import { ChangePasswordRequestDto } from './dto/changePasswordRequest.dto';

jest.mock('./users.service');
jest.mock('../captchas/captchas.service');
describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let captchasService: CaptchasService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        CaptchasService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some-config-value'),
          },
        },
      ],
    }).compile();
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    captchasService = module.get<CaptchasService>(CaptchasService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('function createUser', () => {
    it('should create a new user', async () => {
      const user: CreateUserRequestDto = {
        email: 'example70@correo.com',
        confirmMail: 'example70@correo.com',
        captchaToken: 'some-captcha-token',
      };
      jest.spyOn(captchasService, 'handleSend').mockResolvedValue(undefined);
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));
      const spyCreate = jest.spyOn(usersService, 'create');
      const spyCaptcha = jest.spyOn(captchasService, 'handleSend');
      await usersController.createUser(user);
      expect(spyCaptcha).toBeCalledWith(user.captchaToken);
      expect(spyCaptcha).toBeCalledTimes(1);
      expect(spyCreate).toBeCalledWith(user);
      expect(spyCreate).toBeCalledTimes(1);
    });
  });
  describe('function confirmUserEmail', () => {
    it('should confirm user', async () => {
      const user: ConfirmUserEmailRequestDto = {
        token: 'token-string',
      };
      const spy = jest.spyOn(usersService, 'confirmEmail');
      await usersController.confirmUserEmail(user);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('function completeData', () => {
    it('should update a user', async () => {
      const user: UserInterface = {
        _id: '6dssavadslkjdsa',
        email: 'example70@correo.com',
        roles: [Role.BASIC_USER],
      };

      const updateUser: UpdateUserRequestDto = {
        fullName: 'Jhon Doe',
        birthday: new Date(),
        phone: 5492612348972,
        identificationFull: 'Be435352fvsds3453',
        password: 'Password1234!',
        confirmPassword: 'Password1234!',
      };
      const spy = jest.spyOn(usersService, 'completeData');
      await usersController.completeData(updateUser, user);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('passwordRecovery', () => {
    it('should call password recovery', async () => {
      const data: PasswordRecoveryRequestDto = {
        email: 'test@example.com',
      };
      const spy = jest.spyOn(usersService, 'passwordRecovery');
      await usersController.passwordRecovery(data);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('resetPassword', () => {
    it('should call password reset', async () => {
      const data: ResetPasswordRequestDto = {
        password: 'Test1234.',
        confirmPassword: 'Test1234.',
        token: 'token-string',
      };
      const spy = jest.spyOn(usersService, 'passwordReset');
      await usersController.resetPassword(data);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('receiveEvent', () => {
    it('should call receiveEvent reset', async () => {
      const queryType = 'subscription_preapproval';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'created',
        application_id: 123456789,
        data: { id: '592a3e4970094e70ac608c6362bd3b61' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'subscription_preapproval',
        version: 2,
      };
      const spy = jest.spyOn(usersService, 'receiveEvent');
      await usersController.receiveEvent(queryType, dataMercadoPago);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('cancelSubscription', () => {
    it('should call cancelSubscription', async () => {
      const user: UserInterface = {
        _id: 'userid2yr249cerw',
        email: 'email@example.com',
        roles: [Role.FULL_USER],
      };
      const spy = jest.spyOn(usersService, 'cancelSubscription');
      await usersController.cancelSubscription(user);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('pauseSubscription', () => {
    it('should call pauseSubscription', async () => {
      const user: UserInterface = {
        _id: 'userid2yr249cerw',
        email: 'email@example.com',
        roles: [Role.FULL_USER],
      };
      const spy = jest.spyOn(usersService, 'pauseSubscription');
      await usersController.pauseSubscription(user);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('updateProfile', () => {
    it('should call updateProfile', async () => {
      const user: UserInterface = {
        _id: 'userid2yr249cerw',
        email: 'email@example.com',
        roles: [Role.FULL_USER],
      };
      const updateData: UpdateProfileRequestDto = {
        fullName: 'Updated Full Name',
        birthday: new Date('1990-01-01'),
        phone: 1234567890,
        identificationFull: 'Updated Identification',
      };
      const spy = jest.spyOn(usersService, 'updateProfile');
      await usersController.updateProfile(user, updateData);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('updateProfilePicture', () => {
    it('should call updateProfilePicture', async () => {
      const user: UserInterface = {
        _id: 'userid2yr249cerw',
        email: 'email@example.com',
        roles: [Role.FULL_USER],
      };
      const updateData: UpdateProfilePictureRequestDto = {
        profilePictureUrl: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6',
      };
      const spy = jest.spyOn(usersService, 'updateProfilePicture');
      await usersController.updateProfilePicture(user, updateData);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('changePassword', () => {
    it('should call changePassword', async () => {
      const user: UserInterface = {
        _id: 'userid2yr249cerw',
        email: 'email@example.com',
        roles: [Role.FULL_USER],
      };
      const passwordData: ChangePasswordRequestDto = {
        currentPassword: 'Auto1234.',
        newPassword: 'Moto4321.',
        confirmPassword: 'Moto4321.',
      };
      const spy = jest.spyOn(usersService, 'changePassword');
      await usersController.changePassword(user, passwordData);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('migrateUsers', () => {
    it('should call migrateUsers', async () => {
      const spy = jest.spyOn(usersService, 'migrateUsers');
      await usersController.migrateUsers();
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('migratePayments', () => {
    it('should call migratePayments', async () => {
      const spy = jest.spyOn(usersService, 'migratePayments');
      await usersController.migratePayments();
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
