import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PlansController } from './plans.controller';
import { PlanService } from './plans.service';
import { CreatePlanRequestDto } from './dto/createPlans.dto';
import { Frecuency } from '../utils/enums/planFrecuency.enum';
import { CreateSuscriptionRequestDto } from './dto/createSuscription.dto';
import { Role } from '../utils/enums/role.enum';
import { MercadoPagoPreApprovalProvider } from '../mercado-pago/mercado-pago.provider';
import { UserInterface } from '../utils/interface/user.interface';

jest.mock('./plans.service');

describe('PlansController', () => {
  let plansController: PlansController;
  let plansService: PlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [
        PlanService,
        MercadoPagoPreApprovalProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(), // Mockear el método `get`
          },
        },
      ],
    }).compile();

    plansController = module.get<PlansController>(PlansController);
    plansService = module.get<PlanService>(PlanService);
  });

  describe('function createPlan', () => {
    it('should create a new plan', async () => {
      const plan: CreatePlanRequestDto = {
        name: 'Test Plan',
        description: 'Test description',
        mercadoPagoPlanId: 'Test-plan-id',
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
        price: 1,
      };

      const spy = jest.spyOn(plansService, 'create');

      await plansController.createPlan(plan);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function getAllPlans', () => {
    it('should list plans', async () => {
      const spy = jest.spyOn(plansService, 'findAllPlans');

      await plansController.getAllPlans();

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function createSuscription', () => {
    it('should create a new suscription', async () => {
      const card: CreateSuscriptionRequestDto = {
        cardTokenId: 'Test Plan',
        payerEmail: 'example@email.com',
      };

      const user: UserInterface = {
        email: 'test_user@testuser.com',
        _id: '6695e2e11563509cbce2149e',
        roles: [Role.BASIC_USER],
      };

      const planId = '66993567bac1b6432ca24812';

      const spy = jest.spyOn(plansService, 'createSuscription');

      await plansController.createSuscription(card, user, planId);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function getPlan', () => {
    it('should list a plan', async () => {
      const id = '60f8a9b9b75a2c0f88d504b5';
      const spy = jest.spyOn(plansService, 'findPlan');

      await plansController.getPlan(id);

      expect(spy).toBeCalledWith(id);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
