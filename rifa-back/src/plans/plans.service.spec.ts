import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { LoggerModule, Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from 'nestjs-typegoose';
import { ObjectId } from 'mongodb';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { PlanService } from './plans.service';
import { Plans } from './plans.model';
import { Frecuency } from '../utils/enums/planFrecuency.enum';
import { Role } from '../utils/enums/role.enum';
import { CreateSuscriptionRequestDto } from './dto/createSuscription.dto';
import { MERCADO_PAGO_PREAPPROVAL_PROVIDER } from '../mercado-pago/mercado-pago.constants';
import { UsersService } from '../users/users.service';
import { PaymentStatus } from '../utils/enums/paymentStatus.enum';

describe('PlansService', () => {
  let planService: PlanService;

  const plansModel = getModelForClass(Plans, {
    schemaOptions: {
      collection: `plans-${Math.random().toString(36).substring(7)}`,
    },
  });

  const mockMercadoPagoProvider = {
    create: jest.fn().mockResolvedValue({
      init_point: 'https://testurl.com',
      id: '592a3e4970094e70ac608c6362bd3b61',
      status: 'authorized',
    }),
  };

  const mockUsersService = {
    updateUserSubscription: jest.fn(),
    mapMercadoPagoStatusToPaymentStatus: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  const mockPlan = {
    name: 'Test Plan',
    description: 'Test description',
    image: 'https://www.imageurl.com',
    price: 9900,
    benefits: [
      {
        description: 'This is a description',
        differential: false,
      },
      {
        description: 'This is another description but differential',
        differential: true,
      },
    ],
    frecuency: Frecuency.MONTHLY,
    mercadoPagoPlanId: 'Test-plan-id',
  };

  const mockPlanAnual = {
    name: 'Test Plan',
    description: 'Test description',
    image: 'https://www.imageurl.com',
    price: 9900,
    benefits: [
      {
        description: 'This is a description',
        differential: false,
      },
      {
        description: 'This is another description but differential',
        differential: true,
      },
    ],
    frecuency: Frecuency.ANUAL,
    mercadoPagoPlanId: 'Test-plan-id',
  };

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({ pinoHttp: { level: 'silent' } })],
      providers: [
        PlanService,
        {
          provide: getModelToken('Plans'),
          useValue: plansModel,
        },
        {
          provide: MERCADO_PAGO_PREAPPROVAL_PROVIDER,
          useValue: mockMercadoPagoProvider,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    planService = module.get<PlanService>(PlanService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(planService).toBeDefined();
  });

  describe('findAllPlans', () => {
    beforeEach(async () => {
      const planOne = {
        name: 'Test Plan 1',
        description: 'Test 1 description',
        image: 'https://www.imageurl.com',
        price: 9900,
        benefits: [
          {
            description: 'This is a description',
            differential: false,
          },
          {
            description: 'This is another description but differential',
            differential: true,
          },
        ],
        frecuency: Frecuency.MONTHLY,
        mercadoPagoPlanId: 'Test-plan-id',
      };
      await plansModel.create(planOne);

      const planTwo = {
        name: 'Test Plan 2',
        description: 'Test 2 description',
        image: 'https://www.imageurl.com',
        price: 9900,
        benefits: [
          {
            description: 'This is a description',
            differential: false,
          },
          {
            description: 'This is another description but differential',
            differential: true,
          },
        ],
        frecuency: Frecuency.MONTHLY,
        mercadoPagoPlanId: 'Test-plan-id',
      };

      await plansModel.create(planTwo);

      const planThree = {
        name: 'Test Plan 3',
        description: 'Test 3 description',
        image: 'https://www.imageurl.com',
        price: 9900,
        benefits: [
          {
            description: 'This is a description',
            differential: false,
          },
          {
            description: 'This is another description but differential',
            differential: true,
          },
        ],
        frecuency: Frecuency.MONTHLY,
        mercadoPagoPlanId: 'Test-plan-id',
      };
      await plansModel.create(planThree);
    });

    it('should return an array of plans', async () => {
      const response = await planService.findAllPlans();
      expect(response.length).toEqual(3);
      expect(response[0].name).toBe('Test Plan 1');
    });
  });

  describe('create', () => {
    it('should create a new plan', async () => {
      const response = await planService.create(mockPlan);

      expect(response.name).toEqual('Test Plan');
      expect(response.description).toEqual('Test description');
      expect(response.mercadoPagoPlanId).toEqual('Test-plan-id');
      expect(response.image).toEqual('https://www.imageurl.com');
      expect(response.benefits.length).toEqual(2);
      expect(response.frecuency).toEqual('monthly');
      expect(response.price).toEqual(9900);
    });
  });

  describe('createSuscription', () => {
    beforeEach(() => {
      mockUsersService.updateUserSubscription.mockResolvedValue({
        _id: new ObjectId(),
        email: 'test_user_1878754830@testuser.com',
        roles: [Role.FULL_USER],
        paymentStatus: PaymentStatus.PENDING,
        subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
        updatedStatusSubscriptionAt: new Date(),
      });

      mockUsersService.mapMercadoPagoStatusToPaymentStatus.mockResolvedValue(
        PaymentStatus.AUTHORIZED,
      );
    });

    it('should create a new suscription returning an init point', async () => {
      const card: CreateSuscriptionRequestDto = {
        cardTokenId: 'Test Plan',
        payerEmail: 'test_user@test.com',
      };

      const user = {
        email: 'test_user@testuser.com',
        _id: '6696d5de3ea2c840500064aa',
        roles: [Role.BASIC_USER],
      };

      const planId = '66993567bac1b6432ca24812';

      jest
        .spyOn(planService, 'findPlan')
        .mockImplementation(async (id: string) => {
          return {
            ...mockPlan,
            _id: new ObjectId(id),
          };
        });

      const result = await planService.createSuscription(card, user, planId);
      expect(result.initPoint).toEqual('https://testurl.com');
      expect(result.subscriptionId).toEqual('592a3e4970094e70ac608c6362bd3b61');
      expect(mockMercadoPagoProvider.create).toBeCalled();
    });

    it('should create a new suscription anual returning an init point', async () => {
      const card: CreateSuscriptionRequestDto = {
        cardTokenId: 'Test Plan',
        payerEmail: 'test_user@test.com',
      };

      const user = {
        email: 'test_user@testuser.com',
        _id: '6696d5de3ea2c840500064aa',
        roles: [Role.BASIC_USER],
      };

      const planId = '66993567bac1b6432ca24812';

      jest
        .spyOn(planService, 'findPlan')
        .mockImplementation(async (id: string) => {
          return {
            ...mockPlanAnual,
            _id: new ObjectId(id),
          };
        });

      const result = await planService.createSuscription(card, user, planId);
      expect(result.initPoint).toEqual('https://testurl.com');
      expect(result.subscriptionId).toEqual('592a3e4970094e70ac608c6362bd3b61');
      expect(mockMercadoPagoProvider.create).toBeCalled();
    });

    it('should throw PreconditionFailedException and not return an init point', async () => {
      mockUsersService.updateUserSubscription.mockResolvedValue(false);
      const card: CreateSuscriptionRequestDto = {
        cardTokenId: 'Test Plan',
        payerEmail: 'test_user@test.com',
      };

      const user = {
        email: 'test_user@testuser.com',
        _id: '6696d5de3ea2c840500064aa',
        roles: [Role.BASIC_USER],
      };

      const planId = '66993567bac1b6432ca24812';

      jest
        .spyOn(planService, 'findPlan')
        .mockImplementation(async (id: string) => {
          return {
            ...mockPlan,
            _id: new ObjectId(id),
          };
        });

      await expect(
        planService.createSuscription(card, user, planId),
      ).rejects.toThrow(PreconditionFailedException);
      await expect(
        planService.createSuscription(card, user, planId),
      ).rejects.toThrowError(
        'Payment creation failed: Failed to update subscription',
      );
    });

    it('should throw PreconditionFailedException and not return an init point because MercadoPago', async () => {
      mockUsersService.updateUserSubscription.mockResolvedValue({
        _id: new ObjectId(),
        email: 'test_user_1878754830@testuser.com',
        roles: [Role.FULL_USER],
        paymentStatus: PaymentStatus.PENDING,
        subscriptionId: '592a3e4970094e70ac608c6362bd3b61',
        updatedStatusSubscriptionAt: new Date(),
      });

      mockMercadoPagoProvider.create.mockRejectedValue('Error');
      const card: CreateSuscriptionRequestDto = {
        cardTokenId: 'Test Plan',
        payerEmail: 'test_user@test.com',
      };

      const user = {
        email: 'test_user@testuser.com',
        _id: '6696d5de3ea2c840500064aa',
        roles: [Role.BASIC_USER],
      };

      const planId = '66993567bac1b6432ca24812';

      jest
        .spyOn(planService, 'findPlan')
        .mockImplementation(async (id: string) => {
          return {
            ...mockPlan,
            _id: new ObjectId(id),
          };
        });

      await expect(
        planService.createSuscription(card, user, planId),
      ).rejects.toThrow(PreconditionFailedException);
      await expect(
        planService.createSuscription(card, user, planId),
      ).rejects.toThrowError('Payment creation failed: Error');
    });
  });

  describe('findPlan', () => {
    beforeEach(async () => {
      const id = new ObjectId('60f8a9b9b75a2c0f88d504b5');
      const planMock = {
        name: 'Test Plan 10',
        description: 'Test 1 description',
        image: 'https://www.imageurl.com',
        price: 9900,
        benefits: [
          {
            description: 'This is a description',
            differential: false,
          },
          {
            description: 'This is another description but differential',
            differential: true,
          },
        ],
        frecuency: Frecuency.MONTHLY,
        mercadoPagoPlanId: 'Test-plan-id',
      };
      await plansModel.create({ ...planMock, _id: id });
    });

    afterEach(async () => {
      await plansModel.deleteMany({});
    });

    it('should return a plan', async () => {
      const planId = '60f8a9b9b75a2c0f88d504b5';
      const response = await planService.findPlan(planId);

      expect(response.name).toEqual('Test Plan 10');
      expect(response.description).toEqual('Test 1 description');
      expect(response.mercadoPagoPlanId).toEqual('Test-plan-id');
      expect(response.image).toEqual('https://www.imageurl.com');
      expect(response.benefits.length).toEqual(2);
      expect(response.frecuency).toEqual('monthly');
      expect(response.price).toEqual(9900);
    });

    it('should trow a NotFoundException if there is not a plan', async () => {
      const planId = '60f8a9b9b75a3c0f88d504b5';

      await expect(planService.findPlan(planId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(planService.findPlan(planId)).rejects.toThrowError(
        'Plan not found',
      );
    });
  });
});
