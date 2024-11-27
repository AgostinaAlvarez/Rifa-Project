import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { LoggerModule } from 'nestjs-pino';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  PreconditionFailedException,
} from '@nestjs/common';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import dayjs from 'dayjs';
import { Emails } from '../emails/interfaces/emails.interface';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';
import { Role } from '../utils/enums/role.enum';
import { BCRYPT } from '../bcrypt/bcrypt.const';
import { AuthService } from '../auth/auth.service';
import { DateHandlerProvider } from '../utils/providers/dayjs/dateHandler.provider';
import { UserInterface } from '../utils/interface/user.interface';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { PaymentStatus } from '../utils/enums/paymentStatus.enum';
import {
  MERCADO_PAGO_PAYMENTS_PROVIDER,
  MERCADO_PAGO_PREAPPROVAL_PROVIDER,
} from '../mercado-pago/mercado-pago.constants';
import { DataMercadoPagoDto } from './dto/dataMercadoPago.dto';
import { PasswordRecoveryRequestDto } from './dto/passwordRecoveryRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';
import { Plans } from '../plans/plans.model';
import { Frecuency } from '../utils/enums/planFrecuency.enum';
import { UpdateUserResponseDto } from './dto/updateUserResponse.dto';
import { UpdateProfileRequestDto } from './dto/updateProfileRequest.dto';
import { UpdateProfilePictureRequestDto } from './dto/updateProfilePictureRequest.dto';
import { ChangePasswordRequestDto } from './dto/changePasswordRequest.dto';
import { PaymentsService } from '../payments/payments.service';
import { PlanService } from '../plans/plans.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let paymentsService: PaymentsService;
  let dateHandler: DateHandlerProvider;
  const userModel = getModelForClass(User, {
    schemaOptions: {
      collection: `users-${Math.random().toString(36).substring(7)}`,
    },
  });
  const planModel = getModelForClass(Plans, {
    schemaOptions: {
      collection: `plans-${Math.random().toString(36).substring(7)}`,
    },
  });
  const mockBcryptProvider = {
    genSaltSync: jest.fn().mockReturnValue('testSalt'),
    hashSync: jest.fn().mockReturnValue('hashedPassword'),
    compareSync: jest.fn(),
  };

  const mockAuthService = {
    sign: jest.fn().mockReturnValue('testJwtToken'),
  };

  const mockPaymentsService = {
    createPayment: jest.fn().mockResolvedValue({
      externallId: '592a3e4970094e70ac608c6362bd3b61',
      paymentDate: new Date(),
      subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
      amount: 9900,
      user: '6695e2e11563509cbce2149e',
      plan: '6697d36d3d750b1e60cebf54',
    }),
    findPaymentByMercadoPagoId: jest.fn().mockResolvedValue(null),
  };

  const mockMercadoPagoPaymentProvider = {
    get: jest.fn().mockResolvedValue({
      status: 'approved',
      point_of_interaction: {
        transaction_data: {
          subscription_id: '592a3e4970094e70ac608c6362bd3b61',
        },
      },
      transaction_amount: 9900,
    }),
    search: jest.fn().mockResolvedValue({
      results: [
        {
          payer: { email: 'user@example.com' },
          point_of_interaction: {
            transaction_data: {
              subscription_id: '592a3e4970094e70ac608c6362bd3b61',
            },
          },
          transaction_amount: 9900,
        },
      ],
    }),
  };

  const mockPlanService = {
    findPlanBymercadoPagoPlanId: jest.fn(),
  };

  const mockMercadoPagoProvider = {
    create: jest.fn().mockResolvedValue({ init_point: 'https://testurl.com' }),
    get: jest.fn().mockResolvedValue({ status: 'authorized' }),
    update: jest.fn().mockResolvedValue({
      id: '592a3e4970094e70ac608c6362bd3b61',
      payer_id: 1856605887,
      payer_email: '',
      back_url: 'https://www.yoursite.com',
      collector_id: 1853466315,
      application_id: 8208263867724936,
      status: 'cancelled',
      reason: 'SUSCRIPCION RIFACLUB MENSUAL',
      external_reference: '6695e2e11563509cbce2149e',
      date_created: '2024-07-30T16:11:30.290-04:00',
      last_modified: '2024-08-02T14:44:11.399-04:00',
      preapproval_plan_id: '2c93808490c3cfb60190e64a147f0a00',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 9900.0,
        currency_id: 'CLP',
        start_date: '2024-07-30T16:11:30.290-04:00',
        billing_day: 10,
        billing_day_proportional: false,
        has_billing_day: true,
        free_trial: null,
      },
      summarized: {
        quotas: null,
        charged_quantity: null,
        pending_charge_quantity: null,
        charged_amount: null,
        pending_charge_amount: null,
        semaphore: null,
        last_charged_date: null,
        last_charged_amount: null,
      },
      next_payment_date: '2024-08-10T16:11:30.000-04:00',
      payment_method_id: 'account_money',
      payment_method_id_secondary: null,
      first_invoice_offset: null,
      subscription_id: '592a3e4970094e70ac608c6362bd3b61',
    }),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'FROM_EMAIL':
          return 'noreply@example.com';
        case 'TEMPLATE_ID_PRE_SIGN_UP':
          return 'template-id';
        case 'JWT_SECRET_PRE_SIGN_UP':
          return 'secret';
        case 'SOCIAL_MEDIA_INSTAGRAM':
          return 'https://www.instagram.com/example';
        case 'TOKEN_EXPIRATION_HOURS':
          return 24;
        default:
          return '';
      }
    }),
  };

  const mockDateHandler = {
    diff: jest.fn(),
  };

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({ pinoHttp: { level: 'silent' } })],
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: userModel,
        },
        {
          provide: getModelToken('Plans'),
          useValue: planModel,
        },
        {
          provide: 'EMAIL_PROVIDER',
          useValue: {
            send: async () => {},
          } as Emails,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: BCRYPT, useValue: mockBcryptProvider },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: DateHandlerProvider,
          useValue: mockDateHandler,
        },
        {
          provide: MERCADO_PAGO_PREAPPROVAL_PROVIDER,
          useValue: mockMercadoPagoProvider,
        },
        {
          provide: MERCADO_PAGO_PAYMENTS_PROVIDER,
          useValue: mockMercadoPagoPaymentProvider,
        },
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
        {
          provide: PlanService,
          useValue: mockPlanService,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    dateHandler = module.get<DateHandlerProvider>(DateHandlerProvider);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findByEmail', () => {
    beforeEach(async () => {
      const userTest = {
        email: 'newuser@example.com',
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      };
      await userModel.create(userTest);
    });

    it('should return a user by email', async () => {
      const user = await usersService.findByEmail('newuser@example.com');
      expect(user.email).toBe('newuser@example.com');
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserRequestDto = {
      email: 'test@example.com',
      confirmMail: 'test@example.com',
      captchaToken: 'captcha-token',
    };

    let findByEmailSpy: jest.SpyInstance;
    let handleExistingBasicUserSpy: jest.SpyInstance;
    let handleNewUserSpy: jest.SpyInstance;

    beforeEach(() => {
      findByEmailSpy = jest.spyOn(usersService, 'findByEmail');
      handleExistingBasicUserSpy = jest.spyOn(
        usersService,
        'handleExistingBasicUser',
      );
      handleNewUserSpy = jest.spyOn(usersService, 'handleNewUser');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call handleExistingBasicUser if user with BASIC_USER role exists', async () => {
      const existUser = new userModel({
        email: 'test@example.com',
        roles: [Role.BASIC_USER],
        isActive: true,
      });

      findByEmailSpy.mockResolvedValue(existUser);
      handleExistingBasicUserSpy.mockResolvedValue({
        token: 'jwtToken',
        email: existUser.email,
        createdAt: '2024-07-19T20:17:01.103Z',
      });

      const result = await usersService.create(createUserDto);
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersService.handleExistingBasicUser).toHaveBeenCalledWith(
        existUser,
      );
      expect(result.token).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });

    it('should throw ConflictException if user exists and does not have BASIC_USER role', async () => {
      const existUser = new userModel({
        email: 'test@example.com',
        roles: [Role.ADMIN],
        isActive: true,
      });

      findByEmailSpy.mockResolvedValue(existUser);

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should call handleNewUser if user does not exist', async () => {
      findByEmailSpy.mockResolvedValue(null);
      handleNewUserSpy.mockResolvedValue({
        token: 'jwtToken',
        email: 'test@correo.com',
        createdAt: '2024-07-19T20:17:01.103Z',
        _id: '669ac9bd6897420a80af9d93',
      });

      const result = await usersService.create(createUserDto);
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersService.handleNewUser).toHaveBeenCalledWith(createUserDto);
      expect(result.token).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result._id).toBeDefined();
    });
  });

  describe('findByConfirmationToken', () => {
    beforeEach(async () => {
      const userTest = {
        email: 'tokenuser@example.com',
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
        tokenEmailVerification: 'testToken',
        tokenEmailVerificationCreatedAt: new Date(),
      };
      await userModel.create(userTest);
    });

    it('should return a user by token', async () => {
      const user = await usersService.findByConfirmationToken('testToken');
      expect(user.tokenEmailVerification).toBe('testToken');
    });

    it('should return undefined if no user with the token', async () => {
      const user = await usersService.findByConfirmationToken(
        'nonExistingToken',
      );
      expect(user).toBeNull();
    });
  });

  describe('confirmEmailUserData', () => {
    let user;
    beforeEach(async () => {
      user = await userModel.create({
        email: 'confirmuser@example.com',
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      });
    });

    it('should update user data and return user data', async () => {
      const result = await usersService.confirmEmailUserData(
        user._id.toString(),
      );
      expect(result.isActive).toBe(true);
      expect(result.emailVerificationAt).toBeDefined();
    });
  });

  describe('confirmEmail', () => {
    beforeEach(async () => {
      await userModel.create({
        email: 'testuser@example.com',
        tokenEmailVerification: 'testToken',
        tokenEmailVerificationCreatedAt: dayjs().subtract(1, 'hour').toDate(),
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      });
    });

    it('should confirm email if token is valid and not expired', async () => {
      dateHandler.diff = jest.fn().mockReturnValue(1);

      const result = await usersService.confirmEmail('testToken');
      const updatedUser = await userModel.findOne({
        tokenEmailVerification: 'testToken',
      });
      expect(updatedUser.isActive).toEqual(result.isActive);
      expect(updatedUser._id.toHexString()).toEqual(result._id.toString());
      expect(updatedUser.email).toEqual(result.email);
      expect(updatedUser.emailVerificationAt).toEqual(
        result.emailVerificationAt,
      );
    });

    it('should throw HttpException if token is invalid or expired', async () => {
      dateHandler.diff = jest.fn().mockReturnValue(25);

      await expect(usersService.confirmEmail('testToken')).rejects.toThrow(
        new HttpException(
          'Invalid or expired confirmation token',
          HttpStatus.PRECONDITION_FAILED,
        ),
      );

      const expiredUser = await userModel.findOne({
        tokenEmailVerification: 'testToken',
      });
      expiredUser.tokenEmailVerificationCreatedAt = dayjs()
        .subtract(25, 'hour')
        .toDate();
      await expiredUser.save();

      await expect(usersService.confirmEmail('testToken')).rejects.toThrow(
        new HttpException(
          'Invalid or expired confirmation token',
          HttpStatus.PRECONDITION_FAILED,
        ),
      );
    });

    it('should throw HttpException if user is already active', async () => {
      const user = await userModel.findOne({
        tokenEmailVerification: 'testToken',
      });
      user.isActive = true;
      await user.save();

      await expect(usersService.confirmEmail('testToken')).rejects.toThrow(
        new HttpException('User already confirmed', HttpStatus.CONFLICT),
      );
    });
  });

  describe('completeData', () => {
    it('should update a user and return token', async () => {
      const userId = new ObjectId();
      const planId = new ObjectId();
      await userModel.create({
        _id: userId,
        email: 'example70@correo.com',
        roles: [Role.BASIC_USER],
        plan: planId.toHexString(),
        isFinishedSuscription: true,
      });
      await planModel.create({
        _id: planId,
        name: 'Plan Mensual',
        price: 9900,
        frecuency: Frecuency.MONTHLY,
        mercadoPagoPlanId: '2c93808490edce74019104362f4a05f3',
      });
      const userIdStr = userId.toHexString();
      const user: UserInterface = {
        _id: userIdStr,
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
      const response: UpdateUserResponseDto = await usersService.completeData(
        user,
        updateUser,
      );
      expect(response.token).toBeDefined();
      expect(response.fullName).toBe(updateUser.fullName);
      expect(response.plan).toBeDefined();
      expect(response.plan.name).toBe('Plan Mensual');
      expect(response.plan.price).toBe(9900);
      expect(response.plan.frecuency).toBe(Frecuency.MONTHLY);
      expect(response._id).toBe(userIdStr);
      expect(response.email).toBe(user.email);
      expect(response.isFinishedSuscription).toEqual(true);
    });
  });

  describe('handleExistingBasicUser', () => {
    let generateVerificationTokenSpy: jest.SpyInstance;
    let updateTokenConfirmationUserSpy: jest.SpyInstance;
    let sendVerificationEmailSpy: jest.SpyInstance;
    let generateResponseJwtSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();
      generateVerificationTokenSpy = jest.spyOn(
        usersService,
        'generateVerificationToken',
      );
      updateTokenConfirmationUserSpy = jest.spyOn(
        usersService,
        'updateTokenConfirmationUser',
      );
      sendVerificationEmailSpy = jest.spyOn(
        usersService,
        'sendVerificationEmail',
      );
      generateResponseJwtSpy = jest.spyOn(usersService, 'generateResponseJwt');
    });

    it('should generate a token and send verification email if user is not active', async () => {
      const user = new userModel({
        email: 'test@example.com',
        roles: [Role.BASIC_USER],
        isActive: false,
      });
      const result = await usersService.handleExistingBasicUser(user);
      expect(generateVerificationTokenSpy).toHaveBeenCalled();
      expect(updateTokenConfirmationUserSpy).toHaveBeenCalledWith(
        user._id.toString(),
        expect.any(String),
      );
      expect(sendVerificationEmailSpy).toHaveBeenCalledWith(
        user,
        expect.any(String),
      );
      expect(generateResponseJwtSpy).toHaveBeenCalledWith(user);
      expect(result.email).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result._id).toBeDefined();
    });

    it('should generate a JWT if user is active', async () => {
      const user = new userModel({
        email: 'test@example.com',
        roles: [Role.BASIC_USER],
        isActive: true,
      });
      const result = await usersService.handleExistingBasicUser(user);
      expect(generateResponseJwtSpy).toHaveBeenCalledWith(user);
      expect(result.email).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result._id).toBeDefined();
      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(updateTokenConfirmationUserSpy).not.toHaveBeenCalled();
      expect(sendVerificationEmailSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleNewUser', () => {
    let generateVerificationTokenSpy: jest.SpyInstance;
    let sendVerificationEmailSpy: jest.SpyInstance;
    let generateResponseJwtSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();
      generateVerificationTokenSpy = jest.spyOn(
        usersService,
        'generateVerificationToken',
      );
      sendVerificationEmailSpy = jest.spyOn(
        usersService,
        'sendVerificationEmail',
      );
      generateResponseJwtSpy = jest.spyOn(usersService, 'generateResponseJwt');
    });

    it('should create a new user, send verification email, and generate a JWT', async () => {
      const createUserDto: CreateUserRequestDto = {
        email: 'newuser@example.com',
        confirmMail: 'newuser@example.com',
        captchaToken: 'some-captcha',
      };

      generateResponseJwtSpy.mockReturnValue('jwtToken');

      const result = await usersService.handleNewUser(createUserDto);
      expect(generateVerificationTokenSpy).toHaveBeenCalled();

      expect(sendVerificationEmailSpy).toHaveBeenCalled();
      expect(generateResponseJwtSpy).toHaveBeenCalled();
      expect(result.token).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result._id).toBeDefined();
    });
  });

  describe('generateVerificationToken', () => {
    it('should generate a verification token with the correct prefix and salt', () => {
      const result = usersService.generateVerificationToken();
      expect(result).toBe('RC.testSalt');
    });
  });

  describe('updateTokenConfirmationUser', () => {
    it('should update the token confirmation and return true', async () => {
      const createdUser = await userModel.create({
        email: 'test@example.com',
        tokenEmailVerification: 'oldToken',
        tokenEmailVerificationCreatedAt: new Date(),
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      });

      const userId = createdUser._id.toString();
      const newToken = 'newTokenValue';
      const result = await usersService.updateTokenConfirmationUser(
        userId,
        newToken,
      );
      const updatedUser = await userModel.findById(userId).exec();
      expect(updatedUser.tokenEmailVerification).toBe(newToken);
      expect(updatedUser.tokenEmailVerificationCreatedAt).toEqual(
        expect.any(Date),
      );
      expect(result).toBe(true);
    });
  });

  describe('mapMercadoPagoStatusToPaymentStatus', () => {
    it('should generate a enum of paymentStatus from a string', () => {
      const testStatus = 'authorized';
      const result = usersService.mapMercadoPagoStatusToPaymentStatus(
        testStatus,
      );
      expect(result).toBe(PaymentStatus.AUTHORIZED);
    });

    it('should return paused', () => {
      const testStatus = 'paused';
      const result = usersService.mapMercadoPagoStatusToPaymentStatus(
        testStatus,
      );
      expect(result).toBe(PaymentStatus.PAUSED);
    });

    it('should return cancelled', () => {
      const testStatus = 'cancelled';
      const result = usersService.mapMercadoPagoStatusToPaymentStatus(
        testStatus,
      );
      expect(result).toBe(PaymentStatus.CANCELLED);
    });

    it('should return pending', () => {
      const testStatus = 'pending';
      const result = usersService.mapMercadoPagoStatusToPaymentStatus(
        testStatus,
      );
      expect(result).toBe(PaymentStatus.PENDING);
    });

    it('should throw unknown payment status with other strings', () => {
      const testStatus = 'blabla1';

      expect(() => {
        usersService.mapMercadoPagoStatusToPaymentStatus(testStatus);
      }).toThrow(Error);

      expect(() => {
        usersService.mapMercadoPagoStatusToPaymentStatus(testStatus);
      }).toThrowError(`Unknown payment status: ${testStatus}`);
    });
  });

  describe('receiveEvent', () => {
    beforeEach(async () => {
      const userId = new ObjectId('6695e2e11563509cbce2149e');

      const userMock = {
        _id: userId,
        email: 'test_user_1878754830@testuser.com',
        roles: [Role.FULL_USER],
        paymentStatus: PaymentStatus.PENDING,
        subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
        updatedStatusSubscriptionAt: new Date(),
        plan: '6697d36d3d750b1e60cebf54',
      };
      await userModel.create(userMock);
    });

    it('should return true and not call findUserBySubscriptionId', async () => {
      const queryType = 'not payment or subscription_preapproval';
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

      const spy = jest.spyOn(usersService, 'findUserBySubscriptionId');

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalledTimes(0);
    });

    it('should return true and not call findUserBySubscriptionId', async () => {
      const queryType = 'subscription_preapproval';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'not creater or updated',
        application_id: 123456789,
        data: { id: '592a3e4970094e70ac608c6362bd3b61' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'subscription_preapproval',
        version: 2,
      };

      const spy = jest.spyOn(usersService, 'findUserBySubscriptionId');

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalledTimes(0);
    });

    it('should return true and call findUserBySubscriptionId', async () => {
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

      const spy = jest.spyOn(usersService, 'findUserBySubscriptionId');

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalledTimes(1);
    });

    it('should return true and call findUserBySubscriptionId', async () => {
      const queryType = 'subscription_preapproval';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'updated',
        application_id: 123456789,
        data: { id: '592a3e4970094e70ac608c6362bd3b61' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'subscription_preapproval',
        version: 2,
      };

      const spy = jest.spyOn(usersService, 'findUserBySubscriptionId');

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalledTimes(1);
    });

    it('should return true and not call mapMercadoPagoStatusToPaymentStatus', async () => {
      const queryType = 'subscription_preapproval';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'updated',
        application_id: 123456789,
        data: { id: 'not valid suscription id' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'subscription_preapproval',
        version: 2,
      };

      const spy = jest.spyOn(
        usersService,
        'mapMercadoPagoStatusToPaymentStatus',
      );

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalledTimes(0);
    });

    it('should return true and call findUserBySubscriptionId and mapMercadoPagoStatusToPaymentStatus ', async () => {
      const queryType = 'subscription_preapproval';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'updated',
        application_id: 123456789,
        data: { id: '592a3e4970094e70ac608c6362bd3b61' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'subscription_preapproval',
        version: 2,
      };

      const spy = jest.spyOn(usersService, 'findUserBySubscriptionId');

      const spyMap = jest.spyOn(
        usersService,
        'mapMercadoPagoStatusToPaymentStatus',
      );

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalledTimes(1);

      expect(spyMap).toBeCalledTimes(1);
    });

    it('should return true and call findUserBySubscriptionId, mercadoPayment and createPayment ', async () => {
      const queryType = 'payment';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'updated',
        application_id: 123456789,
        data: { id: '592a3e4970094e70ac608c6362bd3b61' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'payment',
        version: 2,
      };

      const spy = jest.spyOn(usersService, 'findUserBySubscriptionId');

      const spyPayment = jest.spyOn(paymentsService, 'createPayment');
      const spyMercadoPayment = jest.spyOn(
        mockMercadoPagoPaymentProvider,
        'get',
      );

      await usersService.receiveEvent(dataMercadoPago, queryType);

      expect(spy).toBeCalled();

      expect(spyPayment).toBeCalled();
      expect(spyMercadoPayment).toBeCalled();
    });

    it('should return true and not call findUserBySubscriptionId or createPayment ', async () => {
      mockMercadoPagoPaymentProvider.get.mockResolvedValue({
        status: 'blabla',
        point_of_interaction: {
          transaction_data: {
            subscription_id: '592a3e4970094e70ac608c6362bd3b61',
          },
        },
        transaction_amount: 9900,
      });

      const queryType = 'payment';
      const dataMercadoPago: DataMercadoPagoDto = {
        action: 'updated',
        application_id: 123456789,
        data: { id: '592a3e4970094e70ac608c6362bd3b61' },
        date: '2024-07-29T14:01:49Z',
        entity: 'preapproval',
        id: 114957027380,
        type: 'payment',
        version: 2,
      };

      const spyFindUser = jest.spyOn(usersService, 'findUserBySubscriptionId');
      const spyCreatePayment = jest.spyOn(paymentsService, 'createPayment');
      const spyMercadoPayment = jest.spyOn(
        mockMercadoPagoPaymentProvider,
        'get',
      );

      const result = await usersService.receiveEvent(
        dataMercadoPago,
        queryType,
      );

      expect(result).toBe(true);
      expect(spyFindUser).toBeCalledTimes(0);
      expect(spyCreatePayment).toBeCalledTimes(0);
      expect(spyMercadoPayment).toBeCalledTimes(1);
    });
  });

  describe('passwordRecovery', () => {
    let findByEmailSpy: jest.SpyInstance;
    let generateVerificationTokenSpy: jest.SpyInstance;
    let createTokenEmailUserSpy: jest.SpyInstance;
    let sendRecoveryPasswordEmailSpy: jest.SpyInstance;
    beforeEach(async () => {
      findByEmailSpy = jest.spyOn(usersService, 'findByEmail');
      generateVerificationTokenSpy = jest.spyOn(
        usersService,
        'generateVerificationToken',
      );
      createTokenEmailUserSpy = jest.spyOn(
        usersService,
        'createTokenEmailUser',
      );
      sendRecoveryPasswordEmailSpy = jest.spyOn(
        usersService,
        'sendRecoveryPasswordEmail',
      );
    });
    it('should call the appropriate methods when user is found', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
      };
      const data: PasswordRecoveryRequestDto = { email: 'test@example.com' };

      findByEmailSpy.mockResolvedValue(mockUser);

      await usersService.passwordRecovery(data);
      expect(findByEmailSpy).toHaveBeenCalledWith(data.email);
      expect(generateVerificationTokenSpy).toHaveBeenCalled();
      expect(createTokenEmailUserSpy).toHaveBeenCalledWith(
        mockUser._id.toString(),
        expect.any(String),
      );
      expect(sendRecoveryPasswordEmailSpy).toHaveBeenCalledWith(
        mockUser,
        expect.any(String),
      );
    });
    it('should not call generateVerificationToken and related methods when user is not found', async () => {
      const data: PasswordRecoveryRequestDto = { email: 'test@example.com' };
      findByEmailSpy.mockResolvedValue(null);
      await usersService.passwordRecovery(data);
      expect(findByEmailSpy).toHaveBeenCalledWith(data.email);
      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(createTokenEmailUserSpy).not.toHaveBeenCalled();
      expect(sendRecoveryPasswordEmailSpy).not.toHaveBeenCalled();
    });
  });

  describe('passwordReset', () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      await userModel.create({
        _id: new ObjectId('66b26a2ef103e25a74a8b889'),
        email: 'testuser@example.com',
        tokenEmailRecovery: 'testToken',
        tokenEmailRecoveryCreatedAt: dayjs().subtract(1, 'hour').toDate(),
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      });
    });

    afterEach(async () => {
      await userModel.deleteMany({});
    });

    it('should reset password if token is valid and not expired', async () => {
      mockDateHandler.diff.mockReturnValue(1);
      mockConfigService.get.mockReturnValue(24);

      const mockUser = await userModel.findOne({
        tokenEmailRecovery: 'testToken',
      });

      const data: ResetPasswordRequestDto = {
        token: 'testToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      const updatedUser = await usersService.updateUserPassword(
        mockUser._id.toString(),
        data.password,
      );
      const result = await usersService.passwordReset(data);

      expect(result.email).toBe('testuser@example.com');
      expect(result._id).toBe('66b26a2ef103e25a74a8b889');
      expect(updatedUser).toBe(true);
    });

    it('should throw HttpException when user is not found', async () => {
      const data: ResetPasswordRequestDto = {
        token: 'invalidToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      await expect(usersService.passwordReset(data)).rejects.toThrow(
        HttpException,
      );
      await expect(usersService.passwordReset(data)).rejects.toThrowError(
        'Token not found',
      );
    });

    it('should throw HttpException when token is expired', async () => {
      await userModel.create({
        email: 'testuser3@example.com',
        tokenEmailRecovery: 'testToken',
        tokenEmailRecoveryCreatedAt: dayjs().subtract(25, 'hour').toDate(),
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      });

      mockConfigService.get.mockReturnValue(24);
      mockDateHandler.diff.mockReturnValue(25);

      const data: ResetPasswordRequestDto = {
        token: 'testToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      await expect(usersService.passwordReset(data)).rejects.toThrow(
        HttpException,
      );
      await expect(usersService.passwordReset(data)).rejects.toThrowError(
        'Invalid or expired token',
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel a subscription from the user', async () => {
      const id = new ObjectId('6695e2e11563509cbce2249e');
      await userModel.create({
        _id: id,
        email: 'testusercancel1@example.com',
        roles: [Role.FULL_USER],
        subscriptionId: '435ggfdg4t4fn42fop2wfwf',
      });

      const spy = jest.spyOn(userModel, 'findById');

      const user: UserInterface = {
        _id: '6695e2e11563509cbce2249e',
        email: 'testusercancel1@example.com',
        roles: [Role.FULL_USER],
      };

      await usersService.cancelSubscription(user);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
      expect(mockMercadoPagoProvider.update).toBeCalled();
    });
  });

  it('should throw a PreconditionFailedException', async () => {
    const id = new ObjectId('6695e2e11563509cbce2249e');
    await userModel.create({
      _id: id,
      email: 'testusercancel1@example.com',
      roles: [Role.FULL_USER],
      subscriptionId: '435ggfdg4t4fn42fop2wfwf',
    });

    mockMercadoPagoProvider.update.mockRejectedValue('Error');

    const user: UserInterface = {
      _id: '6695e2e11563509cbce2249e',
      email: 'testusercancel1@example.com',
      roles: [Role.FULL_USER],
    };

    await expect(usersService.cancelSubscription(user)).rejects.toThrow(
      PreconditionFailedException,
    );
    await expect(usersService.cancelSubscription(user)).rejects.toThrowError(
      'Payment creation failed: Error',
    );
  });

  describe('pauseSubscription', () => {
    it('should pause a subscription from the user', async () => {
      const id = new ObjectId('6685e2e11563509cbce2249e');
      await userModel.create({
        _id: id,
        email: 'testusercancel1@example.com',
        roles: [Role.FULL_USER],
        subscriptionId: '435ggfdg4t4fn42fop2wfwfv',
      });

      const spy = jest.spyOn(userModel, 'findById');

      const user: UserInterface = {
        _id: '6685e2e11563509cbce2249e',
        email: 'testusercancel1@example.com',
        roles: [Role.FULL_USER],
      };

      mockMercadoPagoProvider.update.mockResolvedValue({
        id: '592a3e4970094e70ac608c6362bd3b61',
        payer_id: 1856605887,
        payer_email: '',
        back_url: 'https://www.yoursite.com',
        collector_id: 1853466315,
        application_id: 8208263867724936,
        status: 'cancelled',
        reason: 'SUSCRIPCION RIFACLUB MENSUAL',
        external_reference: '6695e2e11563509cbce2149e',
        date_created: '2024-07-30T16:11:30.290-04:00',
        last_modified: '2024-08-02T14:44:11.399-04:00',
        preapproval_plan_id: '2c93808490c3cfb60190e64a147f0a00',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 9900.0,
          currency_id: 'CLP',
          start_date: '2024-07-30T16:11:30.290-04:00',
          billing_day: 10,
          billing_day_proportional: false,
          has_billing_day: true,
          free_trial: null,
        },
        summarized: {
          quotas: null,
          charged_quantity: null,
          pending_charge_quantity: null,
          charged_amount: null,
          pending_charge_amount: null,
          semaphore: null,
          last_charged_date: null,
          last_charged_amount: null,
        },
        next_payment_date: '2024-08-10T16:11:30.000-04:00',
        payment_method_id: 'account_money',
        payment_method_id_secondary: null,
        first_invoice_offset: null,
        subscription_id: '592a3e4970094e70ac608c6362bd3b61',
      });

      await usersService.pauseSubscription(user);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
      expect(mockMercadoPagoProvider.update).toBeCalled();
    });
  });

  it('should throw a PreconditionFailedException and not update', async () => {
    const id = new ObjectId('6685e2e11563509cbce2249e');
    await userModel.create({
      _id: id,
      email: 'testusercancel1@example.com',
      roles: [Role.FULL_USER],
      subscriptionId: '435ggfdg4t4fn42fop2wfwfh',
    });

    mockMercadoPagoProvider.update.mockRejectedValue('Error');

    const user: UserInterface = {
      _id: '6685e2e11563509cbce2249e',
      email: 'testusercancel1@example.com',
      roles: [Role.FULL_USER],
    };

    await expect(usersService.pauseSubscription(user)).rejects.toThrow(
      PreconditionFailedException,
    );
    await expect(usersService.pauseSubscription(user)).rejects.toThrowError(
      'Payment creation failed: Error',
    );
  });

  describe('update function', () => {
    it('should update the user and return the updated profile with token', async () => {
      const userTest = {
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const user = await userModel.create(userTest);
      const userId = user._id.toHexString();
      const userInterface: UserInterface = {
        _id: userId,
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const updateData: UpdateProfileRequestDto = {
        fullName: 'Updated Full Name',
        birthday: new Date('1990-01-01'),
        phone: 1234567890,
        identificationFull: 'Updated Identification',
      };
      const result = await usersService.updateProfile(
        userInterface,
        updateData,
      );
      expect(updateData.fullName).toEqual(result.fullName);
      expect(updateData.birthday).toEqual(result.birthday);
      expect(updateData.phone).toEqual(result.phone);
      expect(updateData.identificationFull).toEqual(result.identificationFull);
    });
  });

  describe('updateProfilePicture', () => {
    it('should return the profile picture entered', async () => {
      const userTest = {
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const user = await userModel.create(userTest);
      const userId = user._id.toHexString();
      const userInterface: UserInterface = {
        _id: userId,
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const updateData: UpdateProfilePictureRequestDto = {
        profilePictureUrl: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6',
      };

      const response = await usersService.updateProfilePicture(
        userInterface,
        updateData,
      );
      expect(response).toEqual({
        profilePictureUrl: 'https://images.app.goo.gl/vVwJJJUcnoe9ZV5q6',
      });
    });
  });
  describe('changePassword function', () => {
    it('should update the password and return true', async () => {
      const userTest = {
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const user = await userModel.create(userTest);
      const userId = user._id.toHexString();
      const userInterface: UserInterface = {
        _id: userId,
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const data: ChangePasswordRequestDto = {
        currentPassword: 'Auto1234.',
        newPassword: 'Moto1234.',
        confirmPassword: 'Moto1234.',
      };
      mockBcryptProvider.compareSync.mockReturnValue(true);
      mockBcryptProvider.hashSync(data.newPassword);
      const result = await usersService.changePassword(userInterface, data);
      expect(result).toEqual(true);
    });
    it('should throw httpException and return bad request', async () => {
      const userTest = {
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const user = await userModel.create(userTest);
      const userId = user._id.toHexString();
      const userInterface: UserInterface = {
        _id: userId,
        email: 'usertest@example.com',
        roles: [Role.FULL_USER],
      };
      const data: ChangePasswordRequestDto = {
        currentPassword: 'Auto1234.',
        newPassword: 'Moto1234.',
        confirmPassword: 'Moto1234.',
      };
      mockBcryptProvider.compareSync.mockReturnValue(false);
      await expect(
        usersService.changePassword(userInterface, data),
      ).rejects.toThrow(
        new HttpException(
          'Current password is wrong',
          HttpStatus.PRECONDITION_FAILED,
        ),
      );
    });
  });

  describe('getPaymentsMigrateUsers', () => {
    it('should return users from payments', async () => {
      const expectedUsers = [
        {
          email: 'user@example.com',
          subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
        },
      ];

      const result = await usersService.getPaymentsMigrateUsers();

      expect(result).toEqual(expectedUsers);
      expect(mockMercadoPagoPaymentProvider.search).toHaveBeenCalled();
    });
  });

  describe('getSubscriptionMigrateUsers', () => {
    it('should return valid users with subscription details', async () => {
      const expectedUsers = [
        {
          email: 'user1@example.com',
          subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
        },
        {
          email: 'user2@example.com',
          subscriptionId: '512a3e4970094e70ac608c6362bd3b61',
        },
        {
          email: 'user3@example.com',
          subscriptionId: '522a3e4970094e70ac608c6362bd3b61',
        },
      ];
      const validUserResponses = expectedUsers.map(() => ({
        preapproval_plan_id: '522a3e4970094e70ac608c6662bd3b61',
        status: 'authorized',
      }));

      jest
        .spyOn(usersService, 'getPaymentsMigrateUsers')
        .mockResolvedValue(expectedUsers);
      validUserResponses.forEach((response) => {
        jest
          .spyOn(mockMercadoPagoProvider, 'get')
          .mockResolvedValueOnce(response);
      });
      const result = await usersService.getSubscriptionMigrateUsers();
      expect(result).toEqual(
        expectedUsers.map((user, index) => ({
          email: user.email,
          subscriptionId: user.subscriptionId,
          plan: validUserResponses[index].preapproval_plan_id,
          paymentStatus: validUserResponses[index].status,
        })),
      );
      expectedUsers.forEach((user) => {
        expect(mockMercadoPagoProvider.get).toHaveBeenCalledWith({
          id: user.subscriptionId,
        });
      });
    });

    it('should skip users without email or subscriptionId', async () => {
      const mixedUsers = [
        {
          email: null,
          subscriptionId: '123456',
        },
        {
          email: 'user2@example.com',
          subscriptionId: null,
        },
        {
          email: 'user3@example.com',
          subscriptionId: '522a3e4970094e70ac608c6362bd3b61',
        },
      ];
      jest
        .spyOn(usersService, 'getPaymentsMigrateUsers')
        .mockResolvedValue(mixedUsers);
      jest.spyOn(mockMercadoPagoProvider, 'get').mockResolvedValue({
        preapproval_plan_id: '522a3e4970094e70ac608c6662bd3b61',
        status: 'authorized',
      });
      const result = await usersService.getSubscriptionMigrateUsers();
      expect(result).toEqual([
        {
          email: 'user3@example.com',
          subscriptionId: '522a3e4970094e70ac608c6362bd3b61',
          plan: '522a3e4970094e70ac608c6662bd3b61',
          paymentStatus: 'authorized',
        },
      ]);
      expect(mockMercadoPagoProvider.get).toHaveBeenCalledTimes(1);
      expect(mockMercadoPagoProvider.get).toHaveBeenCalledWith({
        id: '522a3e4970094e70ac608c6362bd3b61',
      });
    });
  });

  describe('migrateUsers', () => {
    let user;
    beforeEach(async () => {
      const userTest = {
        email: 'newuser@example.com',
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
      };
      user = await userModel.create(userTest);
    });
    it('should successfully migrate valid users', async () => {
      const usersToMigrate = [
        {
          email: 'user1@example.com',
          subscriptionId: 'valid_subscription_id_1',
          plan: 'valid_plan_id',
          paymentStatus: 'authorized',
        },
      ];

      jest
        .spyOn(usersService, 'getSubscriptionMigrateUsers')
        .mockResolvedValue(usersToMigrate);

      jest
        .spyOn(usersService, 'findUserBySubscriptionId')
        .mockResolvedValue(null);
      await userModel.findOne({ email: 'user1@example.com' });
      const validObjectId = new mongoose.Types.ObjectId();
      jest
        .spyOn(mockPlanService, 'findPlanBymercadoPagoPlanId')
        .mockResolvedValue({
          _id: validObjectId,
        });
      const result = await usersService.migrateUsers();
      expect(result.success).toEqual([{ email: 'user1@example.com' }]);
      expect(result.failed).toEqual([]);
    });

    it('should fail to migrate users with existing email or subscriptionId', async () => {
      const usersToMigrate = [
        {
          email: 'user2@example.com',
          subscriptionId: 'existing_subscription_id',
          plan: 'valid_plan_id',
          paymentStatus: 'authorized',
        },
      ];
      const existingUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'user2@example.com',
        subscriptionId: 'existing_subscription_id',
        roles: [Role.BASIC_USER],
      };
      jest
        .spyOn(usersService, 'findUserBySubscriptionId')
        .mockResolvedValue(existingUser);
      await userModel.findOne({ email: user.email });
      jest
        .spyOn(usersService, 'getSubscriptionMigrateUsers')
        .mockResolvedValue(usersToMigrate);
      const result = await usersService.migrateUsers();
      expect(result.success).toEqual([]);
      expect(result.failed).toEqual([
        {
          email: 'user2@example.com',
          subscriptionId: 'existing_subscription_id',
          plan: 'valid_plan_id',
          reason: 'user email or subscriptionId already exist',
        },
      ]);
    });

    it('should fail to migrate users when the plan does not exist', async () => {
      const usersToMigrate = [
        {
          email: 'user3@example.com',
          subscriptionId: 'valid_subscription_id_2',
          plan: 'non_existent_plan_id',
          paymentStatus: 'authorized',
        },
      ];

      jest
        .spyOn(usersService, 'getSubscriptionMigrateUsers')
        .mockResolvedValue(usersToMigrate);
      jest
        .spyOn(usersService, 'findUserBySubscriptionId')
        .mockResolvedValue(null);
      await userModel.findOne({ email: user.email });
      jest
        .spyOn(mockPlanService, 'findPlanBymercadoPagoPlanId')
        .mockResolvedValue(null);

      const result = await usersService.migrateUsers();

      expect(result.success).toEqual([]);
      expect(result.failed).toEqual([
        {
          email: 'user3@example.com',
          subscriptionId: 'valid_subscription_id_2',
          plan: 'non_existent_plan_id',
          reason: 'doesnt exist a plan with that planId',
        },
      ]);
    });
  });

  describe('migratePayments', () => {
    beforeEach(async () => {
      const userTest = {
        _id: new ObjectId('6695e2e11563509cbce2149e'),
        email: 'newuser@example.com',
        roles: [Role.BASIC_USER],
        isActive: false,
        isBlocked: false,
        plan: '6697d36d3d750b1e60cebf54',
        subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
      };
      await userModel.create(userTest);

      mockMercadoPagoPaymentProvider.search.mockResolvedValue({
        results: [
          {
            id: 1010101010,
          },
        ],
      });

      mockMercadoPagoPaymentProvider.get.mockResolvedValue({
        id: 1010101010,
        point_of_interaction: {
          transaction_data: {
            subscription_id: '592a3e4970094e70ac608c6362bd3b61',
          },
        },
        status: 'approved',
        date_approved: new Date(),
        transaction_amount: 1000,
      });

      jest
        .spyOn(usersService, 'findUserBySubscriptionId')
        .mockResolvedValue(userTest);
      jest
        .spyOn(paymentsService, 'findPaymentByMercadoPagoId')
        .mockResolvedValue(null);
    });

    it('should successfully migrate payments', async () => {
      const result = await usersService.migratePayments();

      expect(result.success[0].user).toBe('newuser@example.com');
    });

    it('should not migrate because the payment already exist', async () => {
      mockPaymentsService.findPaymentByMercadoPagoId.mockResolvedValue({
        externallId: '592a3e4970094e70ac608c6362bd3b61',
        paymentDate: new Date(),
        subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
        amount: 9900,
        user: '6695e2e11563509cbce2149e',
        plan: '6697d36d3d750b1e60cebf54',
      });
      const result = await usersService.migratePayments();

      expect(result.success).toEqual([]);
    });

    it('should not migrate because the payment has not subscription_id', async () => {
      mockMercadoPagoPaymentProvider.get.mockResolvedValue({
        status: 'approved',
        point_of_interaction: {
          transaction_data: {},
        },
        transaction_amount: 9900,
      });

      const result = await usersService.migratePayments();

      expect(result.success).toEqual([]);
    });

    it('should not migrate because the payment has subscription_id but not status approved', async () => {
      mockMercadoPagoPaymentProvider.get.mockResolvedValue({
        status: 'refunded',
        point_of_interaction: {
          transaction_data: {
            subscription_id: '592a3e4970094e70ac608c6362bd3b61',
          },
        },
        transaction_amount: 9900,
      });

      const result = await usersService.migratePayments();

      expect(result.success).toEqual([]);
    });

    it('should not migrate because the subscription_id has no user linked', async () => {
      jest
        .spyOn(usersService, 'findUserBySubscriptionId')
        .mockResolvedValue(null);

      const result = await usersService.migratePayments();

      expect(result.success).toEqual([]);
    });
  });
});
