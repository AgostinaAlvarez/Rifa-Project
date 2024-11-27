import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from '../utils/interface/user.interface';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Role } from '../utils/enums/role.enum';

jest.mock('./payments.service');
describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        PaymentsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();
    paymentsController = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  describe('getPaymentsByUserId', () => {
    it('should call getPaymentsByUserId', async () => {
      const user: UserInterface = {
        _id: '669aca47584e0432cc18fc19',
        email: 'email@example.com',
        roles: [Role.FULL_USER],
      };
      const spy = jest.spyOn(paymentsService, 'getPaymentsByUserId');
      await paymentsController.getPaymentsByUserId(user);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
